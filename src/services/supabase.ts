import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, Conversation, Message, LessonProgress, LeaderboardEntry, UserBadge } from '../types';
import { ENV } from '../config/env';

export const isSupabaseConfigured = Boolean(
  ENV.supabaseUrl &&
  ENV.supabaseAnonKey &&
  !ENV.supabaseUrl.includes('placeholder') &&
  !ENV.supabaseAnonKey.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    })
  : null;

export const SupabaseService = {
  isConfigured(): boolean {
    return Boolean(supabase);
  },

  async getSession() {
    if (!supabase) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }
    return session;
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    if (!supabase) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return null;
      }
      return await this.fetchOrCreateProfile(session.user);
    } catch (err) {
      console.error('Supabase getCurrentUser error:', err);
      return null;
    }
  },

  async fetchOrCreateProfile(authUser: any): Promise<UserProfile> {
    if (!supabase) throw new Error('Supabase client is not configured.');

    // 1. Try to fetch existing profile
    const { data: existing, error: fetchErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (existing && !fetchErr) {
      return existing as UserProfile;
    }

    // 2. If profile doesn't exist, create initial row
    const displayName = authUser.user_metadata?.full_name || 
                        authUser.user_metadata?.name || 
                        authUser.email?.split('@')[0] || 
                        'Tulu Learner';
    
    const cleanUsername = (authUser.user_metadata?.full_name?.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'learner') + 
                          '_' + Math.floor(1000 + Math.random() * 9000);

    const newProfile: Partial<UserProfile> = {
      id: authUser.id,
      email: authUser.email || '',
      display_name: displayName,
      username: cleanUsername,
      avatar_url: authUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      learning_level: 'zero',
      native_language: 'English',
      target_level: 'intermediate',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      streak_count: 0,
      longest_streak: 0,
      total_xp: 0,
      leaderboard_opt_in: false,
      social_shoutout_opt_in: false,
      onboarding_completed: false,
    };

    const { data: created, error: insertErr } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single();

    if (insertErr) {
      console.error('Profile creation error:', insertErr);
      throw new Error(`Failed to create user profile: ${insertErr.message}`);
    }

    return created as UserProfile;
  },

  async signInWithGoogle(): Promise<{ url?: string; error?: string }> {
    if (!supabase) {
      return { error: 'Supabase client is not configured. Add credentials in .env.' };
    }

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
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
      return { url: data.url };
    } catch (e: any) {
      console.error('Google OAuth error:', e);
      return { error: e.message || 'Google OAuth failed to start.' };
    }
  },

  async signInWithOtp(email: string): Promise<{ error?: string }> {
    if (!supabase) {
      return { error: 'Supabase client is not configured. Add credentials in .env.' };
    }

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
        }
      });

      if (error) throw error;
      return {};
    } catch (e: any) {
      console.error('Magic link sign-in error:', e);
      return { error: e.message || 'Failed to send magic link.' };
    }
  },

  async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    if (!supabase) throw new Error('Supabase client is not configured.');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const updates = {
      ...profile,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Profile update failed: ${error.message}`);
    }

    return data as UserProfile;
  },

  async getConversations(): Promise<Conversation[]> {
    if (!supabase) throw new Error('Supabase client is not configured.');

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw new Error(`Failed to load conversations: ${error.message}`);
    }

    return (data || []) as Conversation[];
  },

  async createConversation(title: string, mode: Conversation['mode']): Promise<Conversation> {
    if (!supabase) throw new Error('Supabase client is not configured.');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to create a conversation');

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title,
        mode,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      throw new Error(`Failed to create conversation: ${error.message}`);
    }

    return data as Conversation;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (!supabase) throw new Error('Supabase client is not configured.');

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error(`Failed to load messages: ${error.message}`);
    }

    return (data || []) as Message[];
  },

  async saveMessage(msg: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    if (!supabase) throw new Error('Supabase client is not configured.');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: msg.conversation_id,
        role: msg.role,
        content: msg.content,
        mode: msg.mode,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      throw new Error(`Failed to save message: ${error.message}`);
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({
        updated_at: new Date().toISOString(),
        last_message: msg.content.substring(0, 60),
      })
      .eq('id', msg.conversation_id);

    return data as Message;
  },

  async getLessonProgress(): Promise<Record<string, LessonProgress>> {
    if (!supabase) return {};

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*');

    if (error) {
      console.error('Error fetching lesson progress:', error);
      return {};
    }

    const map: Record<string, LessonProgress> = {};
    (data || []).forEach((row: any) => {
      map[row.lesson_id] = row;
    });
    return map;
  },

  async saveLessonProgress(lessonId: string, score: number): Promise<void> {
    if (!supabase) throw new Error('Supabase client is not configured.');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        status: 'completed',
        score,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' });

    if (error) {
      console.error('Error saving lesson progress:', error);
      throw new Error(`Failed to save lesson progress: ${error.message}`);
    }

    // Award +20 XP
    await this.addXP(20, 'lesson', `Completed lesson: ${lessonId}`);
  },

  async addXP(amount: number, sourceType: string, description: string): Promise<number> {
    if (!supabase) return 0;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    // 1. Insert XP transaction
    await supabase
      .from('xp_transactions')
      .insert({
        user_id: user.id,
        amount,
        source_type: sourceType,
        description,
      });

    // 2. Fetch current total_xp and update
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', user.id)
      .single();

    const currentXP = profile?.total_xp || 0;
    const newXP = currentXP + amount;

    await supabase
      .from('profiles')
      .update({ total_xp: newXP, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    return newXP;
  },

  async getUserBadges(): Promise<UserBadge[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badge:badges(*)');

    if (error) {
      console.error('Error loading badges:', error);
      return [];
    }

    return (data || []) as UserBadge[];
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('public_leaderboard')
      .select('*')
      .limit(25);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return (data || []).map((row: any, idx: number) => ({
      rank: idx + 1,
      user_id: row.user_id,
      username: row.username,
      display_name: row.display_name,
      avatar_url: row.avatar_url,
      weekly_xp: row.total_xp,
      total_xp: row.total_xp,
      current_streak: row.current_streak,
      opted_in: true,
    }));
  }
};
