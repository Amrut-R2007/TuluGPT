import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Send, 
  Sparkles, 
  Plus, 
  RotateCcw, 
  AlertTriangle, 
  BookOpen, 
  MessageSquare, 
  Languages, 
  HelpCircle, 
  CheckCheck, 
  Library, 
  FileQuestion,
  Flame,
  LogOut,
  Menu,
  X,
  Settings,
  Trophy,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { ChatMode, Message, Conversation } from '../types';
import { useAuth } from '../context/AuthContext';
import { SupabaseService } from '../services/supabase';
import { AIService } from '../services/aiService';

export const AppWorkspacePage: React.FC = () => {
  const { user, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<ChatMode>('conversation');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [chatError, setChatError] = useState<string | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
    loadConversations();
  }, []);

  const loadConversations = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const list = await SupabaseService.getConversations();
      setConversations(list);
      if (list.length > 0) {
        setActiveConversationId(list[0].id);
        setMode(list[0].mode || 'conversation');
        loadMessages(list[0].id);
      } else {
        await handleNewConversation('conversation');
      }
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const msgs = await SupabaseService.getMessages(convId);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversationId(conv.id);
    setMode(conv.mode || 'conversation');
    loadMessages(conv.id);
    setMobileSidebarOpen(false);
    setChatError(null);
  };

  const handleNewConversation = async (newMode: ChatMode = mode) => {
    try {
      const title = `Tulu Chat (${newMode.replace('_', ' ')})`;
      const created = await SupabaseService.createConversation(title, newMode);
      setConversations(prev => [created, ...prev]);
      setActiveConversationId(created.id);
      setMessages([]);
      setStreamedText('');
      setChatError(null);
      setMobileSidebarOpen(false);
      textareaRef.current?.focus();
    } catch (err) {
      console.error('Error starting new conversation:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText, isStreaming]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || input).trim();
    if (!text || isStreaming) return;

    let convId = activeConversationId;
    if (!convId) {
      try {
        const created = await SupabaseService.createConversation('New Tulu Session', mode);
        convId = created.id;
        setActiveConversationId(created.id);
        setConversations(prev => [created, ...prev]);
      } catch (err: any) {
        setChatError(`Could not initialize chat session: ${err.message}`);
        return;
      }
    }

    setInput('');
    setChatError(null);
    setLastUserPrompt(text);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // 1. Optimistic UI update & DB Save
    const userMsgObj = {
      conversation_id: convId,
      role: 'user' as const,
      content: text,
      mode,
    };

    try {
      const savedUserMsg = await SupabaseService.saveMessage(userMsgObj);
      setMessages(prev => [...prev, savedUserMsg]);
    } catch (err: any) {
      console.warn('DB message save warning:', err);
      // Fallback local display if DB write fails
      setMessages(prev => [...prev, { ...userMsgObj, id: `local-${Date.now()}`, created_at: new Date().toISOString() }]);
    }

    // 2. Stream from Real AI Engine
    setIsStreaming(true);
    setStreamedText('');

    const chatHistory = [...messages, userMsgObj].map(m => ({ role: m.role, content: m.content }));
    let accumulated = '';

    await AIService.streamChat({
      messages: chatHistory,
      mode,
      userLevel: user?.learning_level || 'beginner',
      onChunk: (chunk: string) => {
        accumulated += chunk;
        setStreamedText(accumulated);
      },
      onError: (errMsg: string) => {
        setIsStreaming(false);
        setChatError(errMsg);
      },
      onDone: async () => {
        setIsStreaming(false);
        if (accumulated.trim()) {
          const assistantMsgObj = {
            conversation_id: convId,
            role: 'assistant' as const,
            content: accumulated,
            mode,
          };

          try {
            const savedAssistant = await SupabaseService.saveMessage(assistantMsgObj);
            setMessages(prev => [...prev, savedAssistant]);
          } catch (e) {
            setMessages(prev => [...prev, { ...assistantMsgObj, id: `local-ai-${Date.now()}`, created_at: new Date().toISOString() }]);
          }
          setStreamedText('');
        }
      }
    });
  };

  const handleRetry = () => {
    if (lastUserPrompt) {
      handleSendMessage(lastUserPrompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const modesConfig: { id: ChatMode; label: string; icon: any; hint: string }[] = [
    { id: 'conversation', label: 'Conversation', icon: MessageSquare, hint: 'Realistic dialogues with Latin transliteration & natural corrections' },
    { id: 'learn', label: 'Learn', icon: BookOpen, hint: 'Step-by-step introduction: concepts, vocabulary & active recall' },
    { id: 'translate', label: 'Translate', icon: Languages, hint: 'English <-> Tulu with cultural usage and idiom notes' },
    { id: 'grammar', label: 'Grammar', icon: HelpCircle, hint: 'Dative subject ("Enk bodu"), equational vs existential negation' },
    { id: 'correct_me', label: 'Correct Me', icon: CheckCheck, hint: 'Linguistic feedback on your Tulu sentence structure' },
    { id: 'vocabulary', label: 'Vocabulary', icon: Library, hint: 'Learn verified coastal words grouped by themes' },
    { id: 'quiz', label: 'Quiz', icon: FileQuestion, hint: 'Adaptive quick questions based on your skill level' },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#fbf8f2] text-[#241e1a] overflow-hidden">
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-amber-900/10 bg-[#f5ece1]/40 p-3 justify-between shrink-0">
        <div className="space-y-3">
          {/* Brand header */}
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#c05c3c] to-[#943d24] text-white flex items-center justify-center font-bold text-sm shadow-xs border border-[#e3b86a]/40">
              ತು
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight text-[#241e1a]">TuluGPT</span>
              <span className="block text-[9px] uppercase font-bold tracking-wider text-[#1f4e38]">Coastal AI Tutor</span>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => handleNewConversation(mode)}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#c05c3c] hover:bg-[#a74728] text-white font-semibold text-xs shadow-xs transition active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-0.5 pt-1">
            <Link
              to="/app"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-[#c05c3c] shadow-2xs border border-amber-900/10"
            >
              <MessageSquare className="w-4 h-4 text-[#c05c3c]" />
              <span>AI Tutor Chat</span>
            </Link>

            <Link
              to="/curriculum"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#544942] hover:bg-stone-200/50 hover:text-[#241e1a] transition"
            >
              <BookOpen className="w-4 h-4 text-[#776a61]" />
              <span>Curriculum & Lessons</span>
            </Link>

            <Link
              to="/setup-check"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#544942] hover:bg-stone-200/50 hover:text-[#241e1a] transition"
            >
              <ShieldCheck className="w-4 h-4 text-[#776a61]" />
              <span>System & Health</span>
            </Link>
          </nav>

          {/* Conversation History */}
          <div className="pt-2 border-t border-amber-900/10">
            <div className="px-2 pb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#776a61]">
              <span>Recent Chats</span>
              {loadingHistory && <RefreshCw className="w-3 h-3 animate-spin" />}
            </div>

            <div className="max-h-[calc(100vh-22rem)] overflow-y-auto space-y-1 pr-1">
              {conversations.length === 0 ? (
                <p className="px-2 py-3 text-[11px] text-stone-400 italic">No previous chats yet.</p>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectConversation(c)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition truncate flex items-center justify-between cursor-pointer ${
                      c.id === activeConversationId 
                        ? 'bg-white font-semibold text-[#c05c3c] shadow-2xs border border-amber-900/10' 
                        : 'text-[#544942] hover:bg-stone-200/50'
                    }`}
                  >
                    <span className="truncate">{c.title || 'Tulu Session'}</span>
                    <span className="text-[10px] text-[#776a61] shrink-0 uppercase ml-1">{c.mode}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="pt-3 border-t border-amber-900/10 space-y-2">
          {user && (
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.display_name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-stone-300"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-[#241e1a] truncate">{user.display_name || user.username}</p>
                  <p className="text-[10px] text-[#776a61] uppercase">{user.learning_level} Level</p>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header - Always Visible on Desktop & Mobile */}
        <header className="h-14 shrink-0 border-b border-amber-900/10 bg-white/80 backdrop-blur-md px-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-1.5 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-[#241e1a]">
                TuluGPT Language Tutor
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1f4e38]/10 text-[#1f4e38] uppercase">
                Active
              </span>
            </div>
          </div>

          {/* Gamification Stats */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div 
                title="Daily streak"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-semibold"
              >
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
                <span>{user.streak_count || 0}d</span>
              </div>

              <div 
                title="Total XP"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1f4e38]/10 border border-[#1f4e38]/20 text-[#1f4e38] text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1f4e38]" />
                <span>{user.total_xp || 0} XP</span>
              </div>

              <Link
                to="/curriculum"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#544942] transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curriculum</span>
              </Link>
            </div>
          )}
        </header>

        {/* Mode Selector Strip */}
        <div className="p-2.5 border-b border-amber-900/10 bg-[#fbf8f2]/90 backdrop-blur-xs flex items-center gap-1.5 overflow-x-auto shrink-0 px-4">
          <span className="text-[11px] font-bold text-[#776a61] uppercase shrink-0 pl-1">Mode:</span>
          {modesConfig.map((m) => {
            const Icon = m.icon;
            const isCurrent = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition cursor-pointer ${
                  isCurrent 
                    ? 'bg-[#c05c3c] text-white shadow-2xs font-semibold' 
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

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && !streamedText && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#c05c3c]/10 text-[#c05c3c] flex items-center justify-center font-serif text-2xl font-bold">
                ತು
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#241e1a]">
                Welcome, {user?.display_name || user?.username}!
              </h2>
              <p className="text-xs sm:text-sm text-[#776a61] max-w-md">
                Your AI Tulu tutor is ready. Type anything below or pick a prompt to begin in <strong>{mode}</strong> mode.
              </p>

              <div className="flex flex-wrap justify-center gap-2 max-w-lg pt-3">
                {[
                  'How do I say "How are you?" respectfully to an elder in Tulu?',
                  'What is the difference between "Ath" and "Ijji"?',
                  'Correct my sentence: "Yaan kaapi bodu"',
                  'Teach me how to order fish curry in Mangaluru (Kudla)'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-[#544942] hover:border-[#c05c3c] hover:text-[#c05c3c] text-left transition shadow-2xs cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render Saved Messages */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser 
                      ? 'bg-[#1f4e38] text-white' 
                      : 'bg-[#c05c3c] text-white shadow-2xs'
                  }`}
                >
                  {isUser ? 'You' : 'ತು'}
                </div>

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
                </div>
              </div>
            );
          })}

          {/* Live Streamed Token Response */}
          {isStreaming && (
            <div className="flex gap-3 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-[#c05c3c] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                ತು
              </div>
              <div className="space-y-1.5 max-w-[85%]">
                <div className="p-4 rounded-2xl bg-white border border-amber-900/10 text-[#241e1a] rounded-tl-xs shadow-2xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {streamedText || (
                    <span className="inline-flex items-center gap-1.5 text-stone-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c05c3c] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c05c3c] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c05c3c] animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-1 text-[11px]">TuluGPT is consulting coastal linguistic knowledge...</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message with Retry Button */}
          {chatError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">AI Chat Service Notice</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">{chatError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Message</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer Area */}
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

            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isStreaming}
              className="p-2 rounded-xl bg-[#c05c3c] text-white hover:bg-[#a74728] transition disabled:opacity-40 disabled:hover:bg-[#c05c3c] cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-center text-[#776a61] mt-1.5">
            Real LLM streaming active. TuluGPT prioritizes authentic Coastal Karnataka grammar and vocabulary.
          </p>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/50 flex">
          <div className="w-72 bg-[#fbf8f2] h-full p-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-900/10">
                <span className="font-serif font-bold text-base text-[#241e1a]">TuluGPT Navigation</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-stone-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => handleNewConversation(mode)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-xs shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>

              <div className="space-y-1">
                <Link
                  to="/app"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-[#c05c3c] bg-white border border-amber-900/10"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Tutor Chat</span>
                </Link>
                <Link
                  to="/curriculum"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-[#544942]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Curriculum</span>
                </Link>
                <Link
                  to="/setup-check"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-[#544942]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Setup & Diagnostics</span>
                </Link>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 p-2 rounded-lg text-xs text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
