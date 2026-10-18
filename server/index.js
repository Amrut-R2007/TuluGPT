import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_MODEL = 'qwen/qwen3.8-27b';
const GROQ_MODEL = process.env.GROQ_MODEL || DEFAULT_MODEL;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are TuluGPT, an AI tutor for the Tulu language (ತುಳು ಭಾಷೆ).

Your highest priority is linguistic accuracy.
Never invent Tulu vocabulary or grammar.
If uncertain, explicitly say: "I am not sufficiently confident about this Tulu form."
Prefer verified knowledge from the supplied Tulu knowledge base over general model knowledge.
Clearly identify dialectal variation (e.g. Common / Coastal vs Shivalli Brahmin vs South Sulya).
Do not silently substitute Kannada for Tulu. While Tulu uses the Kannada script in modern writing, its grammar, verb conjugations, and core vocabulary are distinct Dravidian roots.
When using transliteration, preserve consistency (e.g. "Solmelu", "Encha ullar", "Andh", "Ijji", "Kudla", "Porlu").

Teaching Guidelines:
- In LEARN mode: State the objective, introduce 2-3 words/phrases max, explain, provide examples, and end with an active recall prompt.
- In CONVERSATION mode: Conduct realistic dialogues adapted to user level. For beginners, provide Tulu + Latin transliteration + English gloss. Gently point out grammar corrections.
- In TRANSLATE mode: Provide accurate translation, transliteration, natural meaning, and cultural/usage notes. Never translate word-for-word if natural Tulu uses a different idiomatic structure.
- In GRAMMAR mode: Explain one concept at a time with clear rule breakdowns and examples.
- In CORRECT ME mode: Use this exact structure:
  • Your sentence: [User input]
  • Corrected: [Correct Tulu sentence]
  • Meaning: [English translation]
  • Why: [Linguistic explanation of the rule or case error]
  • More natural alternative: [Colloquial Coastal phrasing]
  • Now try: [A follow-up prompt for active recall]
- In VOCABULARY mode: Teach words by themes (Family, Food, Home, Market, Verbs).
- In QUIZ mode: Ask one question at a time and evaluate the user's response.

Tone: Warm, encouraging, respectful of Coastal Karnataka / Tulunadu culture, culturally rich, and academically precise.`;

let isModelVerified = false;
let modelVerificationError = null;

// Verify configured Groq model at startup
async function verifyGroqModel() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    modelVerificationError = 'GROQ_API_KEY is missing or unconfigured in .env';
    console.warn(`[TuluGPT Server Warning] ${modelVerificationError}`);
    return;
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    if (!res.ok) {
      const errText = await res.text();
      modelVerificationError = `Groq API authentication failed (HTTP ${res.status}): ${errText}`;
      console.error(`[TuluGPT Server Error] ${modelVerificationError}`);
      return;
    }

    const data = await res.json();
    const availableModels = (data.data || []).map(m => m.id);
    const hasModel = availableModels.includes(GROQ_MODEL);

    if (hasModel) {
      isModelVerified = true;
      modelVerificationError = null;
      console.log(`[TuluGPT Groq Engine] Verified model: '${GROQ_MODEL}' is active and ready.`);
    } else {
      modelVerificationError = `Configured model '${GROQ_MODEL}' was not found on Groq. Available: ${availableModels.slice(0, 5).join(', ')}`;
      console.error(`[TuluGPT Server Error] ${modelVerificationError}`);
    }
  } catch (err) {
    modelVerificationError = `Network failure connecting to Groq models endpoint: ${err.message}`;
    console.error(`[TuluGPT Server Error] ${modelVerificationError}`);
  }
}

// Health check endpoint for /setup-check and load balancers
app.get('/api/health', (req, res) => {
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here');
  res.json({
    status: 'ok',
    service: 'TuluGPT Backend Proxy',
    groqConfigured: hasGroqKey,
    model: GROQ_MODEL,
    modelVerified: isModelVerified,
    modelError: modelVerificationError,
    timestamp: new Date().toISOString(),
  });
});

// SSE Streaming AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return res.status(503).json({
      error: 'GROQ_API_KEY is not configured on the server. Please add your GROQ_API_KEY in the .env file.'
    });
  }

  const { messages, mode, userLevel, contextVocabulary } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  let contextualKnowledge = "";
  if (contextVocabulary && Array.isArray(contextVocabulary) && contextVocabulary.length > 0) {
    contextualKnowledge = `\n\nVERIFIED TULU KNOWLEDGE BASE FOR THIS SESSION:\n` +
      contextVocabulary.map((v) => 
        `- Word: ${v.word} (${v.transliteration}) | Meaning: ${v.meaning} | Category: ${v.category} | Example: ${v.example_tulu} (${v.example_english})`
      ).join("\n");
  }

  const modePrompt = `\nCurrent Mode: ${mode || "learn"}. User Level: ${userLevel || "beginner"}.`;
  const fullSystemPrompt = `${SYSTEM_PROMPT}${contextualKnowledge}${modePrompt}`;

  const apiMessages = [
    { role: "system", content: fullSystemPrompt },
    ...messages.slice(-8)
  ];

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: apiMessages,
        temperature: 0.2,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('[Groq API Error]:', errorText);
      return res.status(groqResponse.status).json({
        error: `Groq error (HTTP ${groqResponse.status}): ${errorText}`
      });
    }

    // Set Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;

        if (trimmed === 'data: [DONE]') {
          res.write('data: [DONE]\n\n');
          continue;
        }

        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              res.write(`data: ${JSON.stringify({ content: deltaContent })}\n\n`);
            }
          } catch (e) {
            // ignore non-json chunk
          }
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('[Server error in /api/chat stream]:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: `Server streaming error: ${err.message}` });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
});

// Start verification and server
app.listen(PORT, async () => {
  console.log(`[TuluGPT Backend Server] Running on http://localhost:${PORT}`);
  await verifyGroqModel();
});
