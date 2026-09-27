export type LearningLevel = 
  | 'zero' 
  | 'few_words' 
  | 'understand_some' 
  | 'basic_speaker' 
  | 'intermediate' 
  | 'advanced';

export type LearningStyle = 'conversation' | 'grammar' | 'vocabulary' | 'mixed';

export type LearningReason = 
  | 'Family' 
  | 'Culture' 
  | 'Friends' 
  | 'Travel' 
  | 'Heritage' 
  | 'Personal interest' 
  | 'Academic' 
  | 'Other';

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  email: string;
  learning_level: LearningLevel;
  native_language: string;
  target_level: LearningLevel;
  timezone: string;
  streak_count: number;
  longest_streak: number;
  total_xp: number;
  leaderboard_opt_in: boolean;
  social_shoutout_opt_in: boolean;
  learning_reason?: LearningReason;
  preferred_learning_style?: LearningStyle;
  onboarding_completed: boolean;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
}

export type ChatMode = 
  | 'learn' 
  | 'conversation' 
  | 'translate' 
  | 'grammar' 
  | 'correct_me' 
  | 'vocabulary' 
  | 'quiz';

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  mode?: ChatMode;
  error_reported?: boolean;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  mode: ChatMode;
  created_at: string;
  updated_at: string;
  last_message?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  script?: string; // Kannada script representation
  transliteration: string;
  meaning: string;
  part_of_speech: 'noun' | 'verb' | 'adjective' | 'pronoun' | 'adverb' | 'greeting' | 'particle' | 'phrase';
  example_tulu: string;
  example_transliteration?: string;
  example_english: string;
  dialect?: 'Common / Coastal' | 'Shivalli / Brahmin' | 'Common South / Sulya' | 'Common North / Udupi';
  register?: 'colloquial' | 'formal' | 'respectful' | 'standard';
  source?: string;
  confidence: number; // 0.0 to 1.0
  usage_notes?: string;
  category: 'greetings' | 'family' | 'food' | 'verbs' | 'numbers' | 'home' | 'places' | 'emotions' | 'nature' | 'travel' | 'directions' | 'time' | 'body' | 'college' | 'slang';
}

export interface Lesson {
  id: string;
  level: number; // 0, 1, 2, 3, 4
  level_name: string;
  unit: number;
  order_index: number;
  title: string;
  title_tulu?: string;
  description: string;
  estimated_minutes: number;
  objective: string;
  vocabulary_ids: string[];
  grammar_concept?: {
    name: string;
    explanation: string;
    rules: string[];
    examples: { tulu: string; transliteration: string; english: string; explanation?: string }[];
  };
  practice_questions: {
    id: string;
    type: 'multiple_choice' | 'fill_in_the_blank' | 'translation' | 'recall';
    prompt: string;
    prompt_tulu?: string;
    options?: string[];
    correct_answer: string;
    explanation: string;
    audio_hint?: string;
  }[];
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  completed_at?: string;
  updated_at: string;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  source_type: 'lesson' | 'practice' | 'quiz' | 'assessment' | 'daily_goal' | 'streak_bonus';
  description: string;
  created_at: string;
}

export interface StreakRecord {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD in user's timezone
  activity_type: 'lesson' | 'quiz' | 'conversation' | 'assessment';
  created_at: string;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  criteria_type: 'streak' | 'lessons' | 'xp' | 'quiz_score' | 'assessment' | 'vocabulary' | 'conversation';
  criteria_value: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  created_at?: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  badge?: Badge;
  awarded_at: string;
}

export interface WeeklyAssessment {
  id: string;
  week_number: number;
  year: number;
  title: string;
  sections: {
    id: string;
    name: 'Vocabulary' | 'Grammar' | 'Translation' | 'Sentence formation' | 'Comprehension' | 'Conversation';
    weight: number;
    questions: {
      id: string;
      prompt: string;
      options?: string[];
      correct_answer: string;
      explanation: string;
      tulu_context?: string;
    }[];
  }[];
}

export interface AssessmentAttempt {
  id: string;
  user_id: string;
  assessment_id: string;
  overall_score: number;
  section_scores: Record<string, number>;
  weak_areas: string[];
  recommendations: string[];
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  weekly_xp: number;
  total_xp: number;
  current_streak: number;
  top_badge?: string;
  opted_in: boolean;
}

export type ErrorReportStatus = 'reported' | 'under_review' | 'verified' | 'rejected' | 'fixed';

export interface TuluErrorReport {
  id: string;
  message_id?: string;
  user_id: string;
  username?: string;
  user_input?: string;
  ai_response?: string;
  reason: 'wrong_translation' | 'wrong_grammar' | 'wrong_pronunciation' | 'wrong_dialect' | 'made_up_word' | 'other';
  description: string;
  status: ErrorReportStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
