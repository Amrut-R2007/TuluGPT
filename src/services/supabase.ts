import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, Conversation, Message, LessonProgress, TuluErrorReport, LeaderboardEntry } from '../types';
import { LocalStore } from './storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Detect if Supabase is properly configured with realistic project credentials
const isConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseKey.includes('placeholder')
);

export const supabase: SupabaseClient | null = isConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const SupabaseService = {
  isLive(): boolean {
    return Boolean(supabase);
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          return await this.fetchOrCreateProfile(session.user);
        }
      } catch (e) {
        console.warn('Supabase getSession error:', e);
      }
    }

    // Check if there is a saved local session/user
    const saved = LocalStore.getSavedUser();
    if (saved) {
      return saved;
    }

    return null;
  },

  async fetchOrCreateProfile(user: any): Promise<UserProfile> {
    const saved = LocalStore.getSavedUser();
    if (saved && saved.id === user.id) {
      return saved;
    }

    if (!supabase) {
      return LocalStore.getUser();
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data && !error) {
        LocalStore.saveUser(data as UserProfile);
        return data as UserProfile;
      }
    } catch (e) {
      console.warn('Profile fetch warning:', e);
    }

    // Profile does not exist yet -> create it
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Tulu Learner';
    const cleanUsername = (user.user_metadata?.full_name?.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'learner') + '_' + Math.floor(1000 + Math.random() * 9000);
    const newProfile: UserProfile = {
      id: user.id,
      email: user.email || '',
      display_name: displayName,
      username: cleanUsername,
      avatar_url: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      learning_level: 'zero',
      native_language: 'English',
      target_level: 'intermediate',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      streak_count: 1,
      longest_streak: 1,
      total_xp: 0,
      leaderboard_opt_in: true,
      social_shoutout_opt_in: true,
      onboarding_completed: false, // Ensure 5 onboarding questions are shown!
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { data: created } = await supabase
        .from('profiles')
        .upsert(newProfile, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (created) {
        LocalStore.saveUser(created as UserProfile);
        return created as UserProfile;
      }
    } catch (insertError) {
      console.warn('Upsert profile error:', insertError);
    }

    LocalStore.saveUser(newProfile);
    return newProfile;
  },

  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    if (!supabase) return () => {};
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const profile = await this.fetchOrCreateProfile(session.user);
          // If returning from OAuth redirect with code or access_token in URL, clean it up gracefully
          if (typeof window !== 'undefined' && (window.location.search.includes('code=') || window.location.hash.includes('access_token='))) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          callback(profile);
        }
      } else if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          const profile = await this.fetchOrCreateProfile(session.user);
          callback(profile);
        } else {
          // If no supabase session, but local user exists, keep local user
          const saved = LocalStore.getSavedUser();
          if (saved) {
            callback(saved);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        LocalStore.clearUser();
        callback(null);
      }
    });
    return () => subscription.unsubscribe();
  },

  async signInWithGoogle(): Promise<{ error?: string }> {
    if (!supabase) {
      return { error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        }
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
      return {};
    } catch (e: any) {
      console.error('Google OAuth error:', e);
      return { error: e.message || 'Google OAuth failed' };
    }
  },

  async signInWithEmail(email: string, password: string): Promise<{ user?: UserProfile; error?: string }> {
    if (!supabase) {
      return { error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data?.user) {
        const profile = await this.fetchOrCreateProfile(data.user);
        return { user: profile };
      }
      return { error: 'No user session returned.' };
    } catch (e: any) {
      return { error: e.message || 'Failed to sign in.' };
    }
  },

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<{ user?: UserProfile; error?: string }> {
    if (!supabase) {
      return { error: 'Supabase client is not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          }
        }
      });
      if (error) throw error;
      if (data?.user) {
        const profile = await this.fetchOrCreateProfile(data.user);
        return { user: profile };
      }
      return { error: 'Signup succeeded. Please check your email to confirm your account.' };
    } catch (e: any) {
      return { error: e.message || 'Failed to sign up.' };
    }
  },

  async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = LocalStore.getUser();
    const updated = { ...current, ...profile, updated_at: new Date().toISOString() };
    LocalStore.saveUser(updated);

    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .update(profile)
          .eq('id', updated.id);
      } catch (e) {
        console.warn('Supabase profile update warning:', e);
      }
    }

    return updated;
  },

  async getConversations(): Promise<Conversation[]> {
    if (!supabase) {
      return LocalStore.getConversations();
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error || !data) return LocalStore.getConversations();
      return data as Conversation[];
    } catch (e) {
      return LocalStore.getConversations();
    }
  },

  async createConversation(title: string, mode: Conversation['mode']): Promise<Conversation> {
    const user = await this.getCurrentUser();
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      user_id: user?.id || 'usr-demo-001',
      title,
      mode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const convs = LocalStore.getConversations();
    convs.unshift(newConv);
    LocalStore.saveConversations(convs);

    if (supabase) {
      try {
        const { data } = await supabase
          .from('conversations')
          .insert({
            user_id: newConv.user_id,
            title: newConv.title,
            mode: newConv.mode,
          })
          .select()
          .single();
        if (data) return data as Conversation;
      } catch (e) {
        console.warn('Supabase conversation insert fallback:', e);
      }
    }

    return newConv;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (!supabase) {
      return LocalStore.getMessages(conversationId);
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error || !data) return LocalStore.getMessages(conversationId);
      return data as Message[];
    } catch (e) {
      return LocalStore.getMessages(conversationId);
    }
  },

  async saveMessage(msg: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    const currentMessages = LocalStore.getMessages(msg.conversation_id);
    currentMessages.push(newMsg);
    LocalStore.saveMessages(msg.conversation_id, currentMessages);

    // Update conversation last_message
    const convs = LocalStore.getConversations();
    const c = convs.find(item => item.id === msg.conversation_id);
    if (c) {
      c.last_message = newMsg.content.substring(0, 60);
      c.updated_at = newMsg.created_at;
      LocalStore.saveConversations(convs);
    }

    if (supabase) {
      try {
        await supabase.from('messages').insert({
          conversation_id: newMsg.conversation_id,
          role: newMsg.role,
          content: newMsg.content,
          mode: newMsg.mode,
        });
      } catch (e) {
        console.warn('Supabase save message fallback:', e);
      }
    }

    return newMsg;
  },

  async submitErrorReport(report: Omit<TuluErrorReport, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>): Promise<TuluErrorReport> {
    const user = await this.getCurrentUser();
    const fullReport: TuluErrorReport = {
      ...report,
      id: `err-${Date.now()}`,
      user_id: user?.id || 'usr-demo-001',
      username: user?.username || 'Learner',
      status: 'reported',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    LocalStore.saveErrorReport(fullReport);

    // Also send to backend server if running
    try {
      await fetch('/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: report.message_id,
          userId: fullReport.user_id,
          username: fullReport.username,
          reason: report.reason,
          description: report.description,
          userInput: report.user_input,
          aiResponse: report.ai_response,
        }),
      });
    } catch (e) {
      // local fallback handled
    }

    return fullReport;
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (!supabase) {
      return LocalStore.getLeaderboard();
    }

    try {
      const { data, error } = await supabase
        .from('public_leaderboard')
        .select('*')
        .limit(20);

      if (error || !data) return LocalStore.getLeaderboard();
      return data.map((item, idx) => ({
        rank: idx + 1,
        user_id: item.user_id,
        username: item.username,
        display_name: item.display_name,
        avatar_url: item.avatar_url,
        weekly_xp: item.total_xp, // fallback to total_xp if weekly view not materialized
        total_xp: item.total_xp,
        current_streak: item.current_streak,
        opted_in: true,
      }));
    } catch (e) {
      return LocalStore.getLeaderboard();
    }
  }
};
