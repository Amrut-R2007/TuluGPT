import { ChatMode, VocabularyItem } from '../types';
import { VERIFIED_VOCABULARY } from '../data/verified_vocabulary';
import { ENV } from '../config/env';

export interface StreamChatOptions {
  messages: { role: string; content: string }[];
  mode: ChatMode;
  userLevel?: string;
  onChunk: (chunk: string) => void;
  onError: (error: string) => void;
  onDone: () => void;
}

export const AIService = {
  async streamChat({
    messages,
    mode,
    userLevel = 'beginner',
    onChunk,
    onError,
    onDone,
  }: StreamChatOptions): Promise<void> {
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Context retrieval: extract relevant verified vocabulary matching the user's prompt
    const contextVocabulary = VERIFIED_VOCABULARY.filter(v => {
      const q = lastUserMessage.toLowerCase();
      return (
        v.meaning.toLowerCase().includes(q) ||
        v.transliteration.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        q.includes(v.meaning.toLowerCase()) ||
        q.includes(v.transliteration.toLowerCase())
      );
    }).slice(0, 5);

    const apiBase = ENV.apiBaseUrl ? ENV.apiBaseUrl.replace(/\/$/, '') : '';
    const endpoint = `${apiBase}/api/chat`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          mode,
          userLevel,
          contextVocabulary: contextVocabulary.length > 0 ? contextVocabulary : VERIFIED_VOCABULARY.slice(0, 4)
        }),
      });

      if (!res.ok) {
        let errorMsg = `Server error (HTTP ${res.status})`;
        try {
          const errJson = await res.json();
          errorMsg = errJson.error || errorMsg;
        } catch (e) {
          // ignore json parse error
        }
        onError(errorMsg);
        return;
      }

      if (!res.body) {
        onError('No response stream received from server.');
        return;
      }

      const reader = res.body.getReader();
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
            onDone();
            return;
          }

          if (trimmed.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              if (parsed.error) {
                onError(parsed.error);
                return;
              }
              if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (err) {
              // Ignore non-json lines
            }
          }
        }
      }

      onDone();
    } catch (err: any) {
      console.error('AIService streamChat error:', err);
      onError(err.message || 'Network error connecting to TuluGPT backend.');
    }
  }
};
