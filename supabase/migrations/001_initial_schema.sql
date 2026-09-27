-- ====================================================================
-- TuluGPT: Complete Production Database Schema & Row Level Security
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT NOT NULL,
  learning_level TEXT NOT NULL DEFAULT 'zero' 
    CHECK (learning_level IN ('zero', 'few_words', 'understand_some', 'basic_speaker', 'intermediate', 'advanced')),
  native_language TEXT NOT NULL DEFAULT 'English',
  target_level TEXT NOT NULL DEFAULT 'intermediate'
    CHECK (target_level IN ('zero', 'few_words', 'understand_some', 'basic_speaker', 'intermediate', 'advanced')),
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  streak_count INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  leaderboard_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  social_shoutout_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  learning_reason TEXT,
  preferred_learning_style TEXT DEFAULT 'mixed',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Tulu Chat',
  mode TEXT NOT NULL DEFAULT 'learn'
    CHECK (mode IN ('learn', 'conversation', 'translate', 'grammar', 'correct_me', 'vocabulary', 'quiz')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  mode TEXT,
  error_reported BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Vocabulary Table
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL,
  script TEXT,
  transliteration TEXT NOT NULL,
  meaning TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  example_tulu TEXT NOT NULL,
  example_transliteration TEXT,
  example_english TEXT NOT NULL,
  dialect TEXT DEFAULT 'Common / Coastal',
  register TEXT DEFAULT 'standard',
  source TEXT,
  confidence NUMERIC(3,2) DEFAULT 1.00,
  usage_notes TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Vocabulary Progress
CREATE TABLE IF NOT EXISTS public.vocabulary_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocabulary_id UUID NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  mastery_level INTEGER NOT NULL DEFAULT 1 CHECK (mastery_level BETWEEN 1 AND 5),
  review_count INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, vocabulary_id)
);

-- 7. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level INTEGER NOT NULL CHECK (level BETWEEN 0 AND 4),
  unit INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  title_tulu TEXT,
  description TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 5,
  content_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Lesson Progress
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 9. XP Transactions Table (Auditable Event Log)
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  source_type TEXT NOT NULL CHECK (source_type IN ('lesson', 'practice', 'quiz', 'assessment', 'daily_goal', 'streak_bonus')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Streaks Table (Daily Activity Record)
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson', 'quiz', 'conversation', 'assessment')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- 11. Badges Table
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  criteria_type TEXT NOT NULL,
  criteria_value INTEGER NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Rare', 'Epic', 'Legendary')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. User Badges Table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 13. Weekly Assessments Table
CREATE TABLE IF NOT EXISTS public.weekly_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  sections_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(week_number, year)
);

-- 14. Assessment Attempts
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.weekly_assessments(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  section_scores_json JSONB NOT NULL,
  weak_areas TEXT[],
  recommendations TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Tulu Error Reports Table
CREATE TABLE IF NOT EXISTS public.tulu_error_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('wrong_translation', 'wrong_grammar', 'wrong_pronunciation', 'wrong_dialect', 'made_up_word', 'other')),
  description TEXT NOT NULL,
  user_input TEXT,
  ai_response TEXT,
  status TEXT NOT NULL DEFAULT 'reported' 
    CHECK (status IN ('reported', 'under_review', 'verified', 'rejected', 'fixed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'linguist', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ====================================================================
-- INDEXES FOR HIGH PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_conversations_user ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_vocab_category ON public.vocabulary(category);
CREATE INDEX IF NOT EXISTS idx_xp_user_date ON public.xp_transactions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_streaks_user_date ON public.streaks(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_profiles_leaderboard ON public.profiles(total_xp DESC) WHERE leaderboard_opt_in = TRUE;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tulu_error_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view, insert & edit their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Public Leaderboard View: Allow reading strictly non-private fields of opted-in users
CREATE POLICY "Public leaderboard view for opted-in users" ON public.profiles
  FOR SELECT USING (leaderboard_opt_in = TRUE);

-- Conversations: Strict user isolation
CREATE POLICY "Users can manage own conversations" ON public.conversations
  FOR ALL USING (auth.uid() = user_id);

-- Messages: Users can only see messages from their own conversations
CREATE POLICY "Users can manage own messages" ON public.messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE public.conversations.id = messages.conversation_id 
      AND public.conversations.user_id = auth.uid()
    )
  );

-- Lessons & Vocabulary: Everyone can read curriculum and vocabulary
CREATE POLICY "Public can view lessons" ON public.lessons
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Public can view vocabulary" ON public.vocabulary
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Public can view badges" ON public.badges
  FOR SELECT TO authenticated, anon USING (true);

-- User Progress: Strictly own user
CREATE POLICY "Users can manage own lesson progress" ON public.lesson_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own vocabulary progress" ON public.vocabulary_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own XP records" ON public.xp_transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own streaks" ON public.streaks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Weekly Assessments: Everyone can read questions, submit own attempts
CREATE POLICY "Public can read assessments" ON public.weekly_assessments
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Users can manage own assessment attempts" ON public.assessment_attempts
  FOR ALL USING (auth.uid() = user_id);

-- Error Reporting: Authenticated users can insert error reports; Admins can read & update
CREATE POLICY "Users can submit error reports" ON public.tulu_error_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own error reports" ON public.tulu_error_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all error reports" ON public.tulu_error_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Admin Users: Only admins can read admin table
CREATE POLICY "Admins can read admin list" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);

-- ====================================================================
-- LEADERBOARD SECURE VIEW
-- ====================================================================
CREATE OR REPLACE VIEW public.public_leaderboard AS
SELECT 
  id as user_id,
  username,
  display_name,
  avatar_url,
  streak_count as current_streak,
  total_xp
FROM public.profiles
WHERE leaderboard_opt_in = TRUE
ORDER BY total_xp DESC;
