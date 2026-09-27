import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Mic, 
  AlertTriangle, 
  BookOpen, 
  MessageSquare, 
  Languages, 
  HelpCircle, 
  CheckCheck, 
  Library, 
  FileQuestion,
  CornerDownLeft
} from 'lucide-react';
import { ChatMode, Message, Conversation, UserProfile } from '../types';
import { AIService } from '../services/aiService';
import { SupabaseService } from '../services/supabase';
import { LocalStore } from '../services/storage';
import { ErrorReportModal } from '../components/ErrorReportModal';

interface ChatPageProps {
  user: UserProfile;
  initialMode?: ChatMode;
}

export const ChatPage: React.FC<ChatPageProps> = ({ user, initialMode = 'conversation' }) => {
  const [mode, setMode] = useState<ChatMode>(initialMode);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [reportModalData, setReportModalData] = useState<{ isOpen: boolean; messageId?: string; aiText?: string; userText?: string }>({
    isOpen: false
  });
  const [micTooltip, setMicTooltip] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const list = await SupabaseService.getConversations();
    setConversations(list);
    if (list.length > 0) {
      setActiveConversationId(list[0].id);
      loadMessages(list[0].id);
    } else {
      handleNewConversation();
    }
  };

  const loadMessages = async (convId: string) => {
    const msgs = await SupabaseService.getMessages(convId);
    setMessages(msgs);
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversationId(conv.id);
    setMode(conv.mode);
    loadMessages(conv.id);
  };

  const handleNewConversation = async () => {
    const newConv = await SupabaseService.createConversation('New Tulu Session', mode);
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newConv.id);
    setMessages([]);
  };

  const handleClearConversation = () => {
    if (!activeConversationId) return;
    setMessages([]);
    LocalStore.saveMessages(activeConversationId, []);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    const clean = input.trim();
    if (!clean || isTyping || !activeConversationId) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // 1. Save and display user message
    const userMsg = await SupabaseService.saveMessage({
      conversation_id: activeConversationId,
      role: 'user',
      content: clean,
      mode: mode,
    });
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // 2. Call AI Service (Server Groq endpoint with fallback)
      const chatHistory = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const aiResponse = await AIService.sendMessage(chatHistory, mode, user.learning_level);

      const assistantMsg = await SupabaseService.saveMessage({
        conversation_id: activeConversationId,
        role: 'assistant',
        content: aiResponse.content,
        mode: mode,
      });

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = await SupabaseService.saveMessage({
        conversation_id: activeConversationId,
        role: 'assistant',
        content: 'TuluGPT is temporarily unavailable. Please try again.',
        mode: mode,
      });
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const modesConfig: { id: ChatMode; label: string; icon: any; hint: string }[] = [
    { id: 'learn', label: 'Learn', icon: BookOpen, hint: 'Step-by-step concept, vocabulary, examples & recall' },
    { id: 'conversation', label: 'Conversation', icon: MessageSquare, hint: 'Realistic dialogue with transliteration & corrections' },
    { id: 'translate', label: 'Translate', icon: Languages, hint: 'English <-> Tulu with nuances & cultural usage notes' },
    { id: 'grammar', label: 'Grammar', icon: HelpCircle, hint: 'Noun cases, existential vs equational negation, tense' },
    { id: 'correct_me', label: 'Correct Me', icon: CheckCheck, hint: 'Paste your Tulu sentence for detailed linguistic feedback' },
    { id: 'vocabulary', label: 'Vocabulary', icon: Library, hint: 'Learn Tulu vocabulary grouped by thematic categories' },
    { id: 'quiz', label: 'Quiz', icon: FileQuestion, hint: 'Adaptive quick questions based on your level' },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto overflow-hidden">
      {/* Chat Sidebar: History & New Conversation */}
      <div className="hidden lg:flex flex-col w-64 border-r border-amber-900/10 bg-[#f5ece1]/40 p-3 justify-between">
        <div className="space-y-3">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#c05c3c] text-white font-medium text-xs hover:bg-[#a74728] shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#776a61] px-2">History</span>
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto space-y-1 pr-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectConversation(c)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition truncate flex items-center justify-between ${
                    c.id === activeConversationId 
                      ? 'bg-white font-semibold text-[#c05c3c] shadow-2xs border border-amber-900/10' 
                      : 'text-[#544942] hover:bg-stone-200/50'
                  }`}
                >
                  <span className="truncate">{c.title || 'Tulu Session'}</span>
                  <span className="text-[10px] text-[#776a61] shrink-0 uppercase">{c.mode}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleClearConversation}
          className="flex items-center gap-2 p-2 rounded-xl text-xs text-[#776a61] hover:text-red-700 hover:bg-red-50 transition w-full"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear messages</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full bg-[#fbf8f2] relative">
        {/* Mode Selector Strip */}
        <div className="p-3 border-b border-amber-900/10 bg-white/60 backdrop-blur-xs flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-[#776a61] uppercase shrink-0 pl-1">Mode:</span>
          {modesConfig.map((m) => {
            const Icon = m.icon;
            const isCurrent = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition ${
                  isCurrent 
                    ? 'bg-[#c05c3c] text-white shadow-2xs' 
                    : 'bg-white border border-stone-200 text-[#544942] hover:bg-stone-50'
                }`}
                title={m.hint}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#c05c3c]/10 text-[#c05c3c] flex items-center justify-center font-serif text-2xl font-bold">
                ತು
              </div>
              <h3 className="font-serif text-xl font-bold text-[#241e1a]">Your Tulu journey starts here.</h3>
              <p className="text-xs text-[#776a61] max-w-sm">
                Ask a question, practice a sentence, or try one of the suggestions below in <strong>{mode}</strong> mode.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md pt-2">
                {[
                  'How do I say "How are you?" to an elder in Tulu?',
                  'What is the difference between "Ath" and "Ijji"?',
                  'Correct my sentence: "Yaan kaapi bodu"',
                  'Teach me 5 essential fish and food words'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(prompt);
                    }}
                    className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-[#544942] hover:border-[#c05c3c] hover:text-[#c05c3c] text-left transition"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isUser 
                        ? 'bg-[#1f4e38] text-white' 
                        : 'bg-[#c05c3c] text-white shadow-2xs'
                    }`}
                  >
                    {isUser ? 'You' : 'ತು'}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1.5 max-w-[85%]">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-[#1f4e38] text-white rounded-tr-xs'
                          : 'bg-white border border-amber-900/10 text-[#241e1a] rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* AI Message Footer: Report Error & Transliteration Helper */}
                    {!isUser && (
                      <div className="flex items-center gap-2 text-[11px] text-[#776a61] px-1">
                        <button
                          onClick={() => setReportModalData({
                            isOpen: true,
                            messageId: msg.id,
                            aiText: msg.content,
                          })}
                          className="flex items-center gap-1 hover:text-[#c05c3c] transition"
                        >
                          <AlertTriangle className="w-3 h-3 text-stone-400 hover:text-[#c05c3c]" />
                          <span>Report Tulu error</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-full bg-[#c05c3c] text-white flex items-center justify-center text-xs font-bold shrink-0">
                ತು
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 text-xs text-[#776a61] flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#c05c3c] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#c05c3c] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#c05c3c] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">TuluGPT is consulting verified coastal knowledge...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <div className="p-3 sm:p-4 border-t border-amber-900/10 bg-white/80 backdrop-blur-xs">
          <div className="max-w-3xl mx-auto relative flex items-end gap-2 p-2 rounded-2xl bg-white border border-stone-300 focus-within:border-[#c05c3c] focus-within:ring-2 focus-within:ring-[#c05c3c]/20 shadow-xs transition">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message TuluGPT in ${mode} mode... (Enter to send, Shift+Enter for new line)`}
              className="flex-1 max-h-32 min-h-[2.25rem] p-1.5 text-xs sm:text-sm text-[#241e1a] placeholder:text-stone-400 bg-transparent resize-none focus:outline-none"
            />

            {/* Coming Soon Microphone button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMicTooltip(true)}
                onBlur={() => setTimeout(() => setMicTooltip(false), 2000)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition"
                title="Voice pronunciation (Coming Soon)"
              >
                <Mic className="w-4 h-4" />
              </button>
              {micTooltip && (
                <div className="absolute bottom-10 -right-4 px-2.5 py-1 rounded-md bg-stone-900 text-white text-[10px] whitespace-nowrap shadow-md">
                  Voice input & audio playback coming soon!
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="p-2 rounded-xl bg-[#c05c3c] text-white hover:bg-[#a74728] transition disabled:opacity-40 disabled:hover:bg-[#c05c3c]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-center text-[#776a61] mt-1.5">
            TuluGPT prioritizes linguistic accuracy. If unsure of regional variations, it verifies against the Tulu Lexicon.
          </p>
        </div>
      </div>

      {/* Error Report Modal */}
      <ErrorReportModal
        isOpen={reportModalData.isOpen}
        messageId={reportModalData.messageId}
        aiResponse={reportModalData.aiText}
        onClose={() => setReportModalData({ isOpen: false })}
        onSubmit={async (report) => {
          await SupabaseService.submitErrorReport({
            message_id: report.message_id,
            reason: report.reason,
            description: report.description,
            user_input: report.user_input,
            ai_response: report.ai_response,
          });
        }}
      />
    </div>
  );
};
