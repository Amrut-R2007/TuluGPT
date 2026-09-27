// Supabase Edge Function: tulu-chat
// Secure server-side Groq API invocation with curated Tulu knowledge base context

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are TuluGPT, an AI tutor for the Tulu language (ತುಳು ಭಾಷೆ).

Your highest priority is linguistic accuracy.
Never invent Tulu vocabulary or grammar.
If uncertain, explicitly say: "I am not sufficiently confident about this Tulu form."
Prefer verified knowledge from the supplied Tulu knowledge base over general model knowledge.
Clearly identify dialectal variation (e.g. Common / Coastal vs Shivalli Brahmin vs South Sulya).
Do not silently substitute Kannada for Tulu. While Tulu uses the Kannada script in modern writing, its grammar, verb conjugations, and core vocabulary are distinct Dravidian roots.
When using transliteration, preserve consistency (e.g. "Solmelu", "Encha ullar", "Andh", "Ijji", "Kudla").

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, mode, userLevel, contextVocabulary } = await req.json();

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({
          error: "GROQ_API_KEY is not configured on the server. Please add it to your environment variables.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let contextualKnowledge = "";
    if (contextVocabulary && contextVocabulary.length > 0) {
      contextualKnowledge = `\n\nVERIFIED TULU KNOWLEDGE BASE FOR THIS SESSION:\n` +
        contextVocabulary.map((v: any) => 
          `- Word: ${v.word} (${v.transliteration}) | Meaning: ${v.meaning} | Category: ${v.category} | Example: ${v.example_tulu} (${v.example_english})`
        ).join("\n");
    }

    const modePrompt = `\nCurrent Mode: ${mode || "learn"}. User Level: ${userLevel || "beginner"}.`;

    const fullSystemPrompt = `${SYSTEM_PROMPT}${contextualKnowledge}${modePrompt}`;

    const apiMessages = [
      { role: "system", content: fullSystemPrompt },
      ...messages.slice(-8) // Send recent relevant context to avoid token bloat
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: apiMessages,
        temperature: 0.2, // Low temperature for high accuracy & consistency
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(
        JSON.stringify({ error: `Groq API error: ${err}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "TuluGPT service encountered an unexpected error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
