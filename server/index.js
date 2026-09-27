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

// In-memory store for error reports when in local dev mode
const errorReportsStore = [];

app.get('/api/health', (req, res) => {
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here');
  res.json({
    status: 'ok',
    service: 'TuluGPT Backend Proxy',
    groqConfigured: hasGroqKey,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, mode, userLevel, contextVocabulary } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      return res.status(503).json({
        error: 'GROQ_API_KEY is not configured on the server. Please add your GROQ_API_KEY in the .env file.',
        fallback_available: true
      });
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

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: apiMessages,
        temperature: 0.2,
        max_tokens: 1024,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API Error:', errorText);
      return res.status(groqResponse.status).json({
        error: 'TuluGPT is temporarily unavailable. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      });
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content || "Solmelu! I am processing your Tulu query.";

    return res.json({
      content: reply,
      model: data.model,
      usage: data.usage
    });
  } catch (err) {
    console.error('Server error in /api/chat:', err);
    return res.status(500).json({
      error: 'TuluGPT encountered an internal service error. Please try again later.'
    });
  }
});

app.post('/api/report-error', (req, res) => {
  const { messageId, userId, username, reason, description, userInput, aiResponse } = req.body;
  const newReport = {
    id: `err-${Date.now()}`,
    message_id: messageId,
    user_id: userId || 'anonymous',
    username: username || 'Learner',
    reason: reason || 'other',
    description: description || '',
    user_input: userInput,
    ai_response: aiResponse,
    status: 'reported',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  errorReportsStore.unshift(newReport);
  console.log('[Tulu Error Reported]:', newReport);

  res.json({ success: true, report: newReport });
});

app.get('/api/reports', (req, res) => {
  res.json({ reports: errorReportsStore });
});

app.patch('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const report = errorReportsStore.find(r => r.id === id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  if (status) report.status = status;
  if (adminNotes !== undefined) report.admin_notes = adminNotes;
  report.updated_at = new Date().toISOString();
  res.json({ success: true, report });
});

app.listen(PORT, () => {
  console.log(`[TuluGPT Backend Server] Running on http://localhost:${PORT}`);
});
