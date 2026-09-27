import { UserProfile, Conversation, Message, LessonProgress, XPTransaction, StreakRecord, UserBadge, AssessmentAttempt, TuluErrorReport, LeaderboardEntry } from '../types';
import { BADGES_DATA } from '../data/badges_data';

const STORAGE_KEYS = {
  USER: 'tulugpt_user',
  CONVERSATIONS: 'tulugpt_conversations',
  MESSAGES: 'tulugpt_messages',
  LESSON_PROGRESS: 'tulugpt_lesson_progress',
  XP_TRANSACTIONS: 'tulugpt_xp_transactions',
  STREAKS: 'tulugpt_streaks',
  USER_BADGES: 'tulugpt_user_badges',
  ASSESSMENT_ATTEMPTS: 'tulugpt_assessment_attempts',
  ERROR_REPORTS: 'tulugpt_error_reports',
};

// Default Demo User (e.g. Amrut or learner)
export const DEFAULT_USER: UserProfile = {
  id: 'usr-demo-001',
  username: 'tululearner',
  display_name: 'Amrut & Friends',
  email: 'learner@tulugpt.org',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  learning_level: 'zero',
  native_language: 'English',
  target_level: 'intermediate',
  timezone: 'Asia/Kolkata',
  streak_count: 7,
  longest_streak: 14,
  total_xp: 320,
  leaderboard_opt_in: true,
  social_shoutout_opt_in: true,
  learning_reason: 'Heritage',
  preferred_learning_style: 'conversation',
  onboarding_completed: false,
  is_admin: true,
  created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const LocalStore = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return DEFAULT_USER;
  },

  getSavedUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return null;
  },

  clearUser() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
  },

  saveUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'conv-init-1',
        user_id: DEFAULT_USER.id,
        title: 'Greetings & Introduction Practice',
        mode: 'conversation',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        last_message: 'Solmelu! How are you doing today?'
      }
    ];
  },

  saveConversations(convs: Conversation[]) {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
  },

  getMessages(conversationId: string): Message[] {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.MESSAGES}_${conversationId}`);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'msg-init-1',
        conversation_id: conversationId,
        role: 'assistant',
        content: `Solmelu! Welcome to TuluGPT (ತುಳು ಭಾಷೆ).\n\nI am your dedicated Tulu language companion. I am here to help you learn real, natural Tulu spoken in Coastal Karnataka (Kudla, Udupi, Kasaragod, Puttur).\n\nTo begin, how would you like to start? You can try asking:\n- "How do I greet an elder respectfully in Tulu?"\n- "What is the difference between 'Andh' and 'Undu'?"\n- "Teach me how to order fish or coffee in Kudla!"`,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        mode: 'conversation'
      }
    ];
  },

  saveMessages(conversationId: string, messages: Message[]) {
    localStorage.setItem(`${STORAGE_KEYS.MESSAGES}_${conversationId}`, JSON.stringify(messages));
  },

  getLessonProgress(): Record<string, LessonProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return {
      'lesson-0-1': {
        id: 'lp-1',
        user_id: DEFAULT_USER.id,
        lesson_id: 'lesson-0-1',
        status: 'completed',
        score: 100,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
  },

  saveLessonProgress(progress: Record<string, LessonProgress>) {
    localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(progress));
  },

  getXPTransactions(): XPTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.XP_TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'xp-1',
        user_id: DEFAULT_USER.id,
        amount: 20,
        source_type: 'lesson',
        description: 'Completed Lesson 1: Greetings & Respects',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'xp-2',
        user_id: DEFAULT_USER.id,
        amount: 50,
        source_type: 'streak_bonus',
        description: '7 Day Streak Milestone bonus',
        created_at: new Date().toISOString()
      }
    ];
  },

  addXP(amount: number, sourceType: XPTransaction['source_type'], description: string): number {
    const list = this.getXPTransactions();
    const user = this.getUser();
    const newTx: XPTransaction = {
      id: `xp-${Date.now()}`,
      user_id: user.id,
      amount,
      source_type: sourceType,
      description,
      created_at: new Date().toISOString()
    };
    list.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.XP_TRANSACTIONS, JSON.stringify(list));

    user.total_xp = (user.total_xp || 0) + amount;
    this.saveUser(user);
    return user.total_xp;
  },

  getUserBadges(): UserBadge[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_BADGES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    // Default unlocked badges
    return [
      {
        id: 'ub-1',
        user_id: DEFAULT_USER.id,
        badge_id: 'badge-1',
        badge: BADGES_DATA[0],
        awarded_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'ub-2',
        user_id: DEFAULT_USER.id,
        badge_id: 'badge-4',
        badge: BADGES_DATA[3],
        awarded_at: new Date().toISOString()
      }
    ];
  },

  awardBadge(badgeId: string): boolean {
    const badges = this.getUserBadges();
    if (badges.some(b => b.badge_id === badgeId)) return false;
    const badgeDef = BADGES_DATA.find(b => b.id === badgeId);
    if (!badgeDef) return false;

    badges.push({
      id: `ub-${Date.now()}`,
      user_id: this.getUser().id,
      badge_id: badgeId,
      badge: badgeDef,
      awarded_at: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.USER_BADGES, JSON.stringify(badges));
    return true;
  },

  getAssessmentAttempts(): AssessmentAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return [];
  },

  saveAssessmentAttempt(attempt: AssessmentAttempt) {
    const list = this.getAssessmentAttempts();
    list.unshift(attempt);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, JSON.stringify(list));
  },

  getErrorReports(): TuluErrorReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ERROR_REPORTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'err-sample-1',
        user_id: 'usr-demo-001',
        username: 'tululearner',
        user_input: 'How to say goodbye in Tulu?',
        ai_response: 'You can say "Pope" to say goodbye.',
        reason: 'wrong_dialect',
        description: 'Culturally in coastal Tulu, saying "Pope" (I go) is inauspicious. One should always say "Barpe" (I will come/return).',
        status: 'under_review',
        admin_notes: 'Valid linguistic nuance noted. Updated knowledge base guidelines.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  },

  saveErrorReport(report: TuluErrorReport) {
    const list = this.getErrorReports();
    list.unshift(report);
    localStorage.setItem(STORAGE_KEYS.ERROR_REPORTS, JSON.stringify(list));
  },

  updateErrorReport(id: string, status: TuluErrorReport['status'], adminNotes?: string) {
    const list = this.getErrorReports();
    const item = list.find(r => r.id === id);
    if (item) {
      item.status = status;
      if (adminNotes !== undefined) item.admin_notes = adminNotes;
      item.updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ERROR_REPORTS, JSON.stringify(list));
    }
  },

  getLeaderboard(): LeaderboardEntry[] {
    return [
      {
        rank: 1,
        user_id: 'usr-leader-1',
        username: 'kudla_kiran',
        display_name: 'Kiran Rai',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        weekly_xp: 380,
        total_xp: 1240,
        current_streak: 18,
        top_badge: '100 Day Centurion',
        opted_in: true,
      },
      {
        rank: 2,
        user_id: 'usr-demo-001',
        username: this.getUser().username,
        display_name: this.getUser().display_name,
        avatar_url: this.getUser().avatar_url,
        weekly_xp: 320,
        total_xp: this.getUser().total_xp,
        current_streak: this.getUser().streak_count,
        top_badge: '7 Day Streak',
        opted_in: this.getUser().leaderboard_opt_in,
      },
      {
        rank: 3,
        user_id: 'usr-leader-3',
        username: 'udupi_soumya',
        display_name: 'Soumya Shenoy',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        weekly_xp: 290,
        total_xp: 890,
        current_streak: 12,
        top_badge: 'Weekly Scholar',
        opted_in: true,
      },
      {
        rank: 4,
        user_id: 'usr-leader-4',
        username: 'swastik_m',
        display_name: 'Swastik Shetty',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        weekly_xp: 240,
        total_xp: 610,
        current_streak: 6,
        top_badge: 'Vocabulary Builder',
        opted_in: true,
      },
      {
        rank: 5,
        user_id: 'usr-leader-5',
        username: 'ananya_tulunad',
        display_name: 'Ananya Kotian',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
        weekly_xp: 180,
        total_xp: 450,
        current_streak: 5,
        top_badge: 'First Lesson Master',
        opted_in: true,
      }
    ];
  }
};
