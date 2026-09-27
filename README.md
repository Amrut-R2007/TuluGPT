# TuluGPT (ತುಳು ಭಾಷೆ)

> **"Learn Tulu. Speak Tulu. Keep Tulu alive."**  
> An AI-powered Tulu learning companion designed to take learners from their first word to confident conversation.

---

## 1. Product Overview

**TuluGPT** is a comprehensive language-learning web platform combining:
- **ChatGPT-style AI Tutor** across 7 dedicated teaching modes (Learn, Conversation, Translate, Grammar, Correct Me, Vocabulary, Quiz)
- **Duolingo-style Structured Progression** across 5 progressive levels (Absolute Beginner to Advanced)
- **Coastal Karnataka Cultural Identity** inspired by Mangaluru, Udupi, and Canara heritage (laterite terracotta, coastal palm greens, rice-husk creams, and restrained temple gold)
- **High Linguistic Accuracy**: Driven by the authentic *Rashtrakavi Govinda Pai Samshodhana Kendra* Tulu Lexicon corpus with clear dialect annotations (Coastal/Common, Shivalli Brahmin, Southern Sulya) and anti-hallucination guardrails
- **Community Gamification**: Streaks, XP audit logging, milestone badges, privacy-first weekly leaderboard, and weekly top-performer social shoutouts.

---

## 2. File & Directory Structure

```
tulugpt/
├── .env.example                     # Environment variables template
├── .env                             # Local environment configuration
├── index.html                       # HTML entry point with Tulu branding & typography
├── package.json                     # Scripts & dependencies
├── tsconfig.json                    # TypeScript compiler configuration
├── tsconfig.app.json                # Frontend TypeScript options
├── vite.config.ts                   # Vite configuration with Tailwind CSS v4 & proxy
│
├── server/
│   └── index.js                     # Secure Node/Express backend API proxy for Groq
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql   # PostgreSQL database schema & RLS policies
│   └── functions/
│       └── tulu-chat/
│           └── index.ts             # Supabase Edge Function for serverless Groq AI
│
└── src/
    ├── main.tsx                     # React application root mount
    ├── App.tsx                      # Root component with routing and modal state
    ├── index.css                    # Tailwind CSS v4 theme design tokens
    │
    ├── types/
    │   └── index.ts                 # Full TypeScript domain models
    │
    ├── data/
    │   ├── verified_vocabulary.ts   # Curated verified Tulu vocabulary dataset
    │   ├── curriculum_data.ts       # 5 levels of pedagogical curriculum & quizzes
    │   ├── badges_data.ts           # Milestone achievement badges
    │   └── assessment_data.ts       # Weekly 6-part assessment questions
    │
    ├── services/
    │   ├── supabase.ts              # Supabase client & fallback abstraction
    │   ├── storage.ts               # Local persistence & offline/demo store
    │   └── aiService.ts             # AI chat service with Groq proxy & linguistic engine
    │
    ├── components/
    │   ├── Navigation.tsx           # Desktop sidebar & mobile bottom navigation
    │   ├── AuthModal.tsx            # Google OAuth & instant demo login
    │   ├── OnboardingModal.tsx      # 5-question onboarding questionnaire
    │   └── ErrorReportModal.tsx     # Tulu error reporting modal
    │
    └── pages/
        ├── LandingPage.tsx          # Culturally inspired modern landing page
        ├── DashboardPage.tsx        # Main dashboard with progress, streak, and XP
        ├── ChatPage.tsx             # Central AI chat interface (7 teaching modes)
        ├── CurriculumPage.tsx       # Duolingo-style unit roadmap
        ├── LessonPlayerPage.tsx     # Step-by-step interactive lesson & quiz player
        ├── AssessmentPage.tsx       # Weekly 6-skill assessment & weak-area diagnosis
        ├── LeaderboardPage.tsx      # Weekly & All-Time privacy-first leaderboard
        ├── BadgesPage.tsx           # Cultural achievement showcase
        ├── SettingsPage.tsx         # Account, timezone, and privacy settings
        ├── AboutPage.tsx            # "About TuluGPT" honoring Amrut & Anurag
        └── AdminDashboardPage.tsx   # QA error moderation & Social Shoutout Studio
```

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env`:

```env
# Frontend Accessible (Vite)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

# Server-Side Only (NEVER prefix with VITE_)
GROQ_API_KEY=your_groq_api_key_here

# Backend Port
PORT=3001
```

> [!CAUTION]
> **Security Rule**: `GROQ_API_KEY` must **NEVER** be prefixed with `VITE_` or exposed to client-side code. The browser communicates strictly with the local Express proxy (`/api/chat`) or the Supabase Edge Function (`/functions/v1/tulu-chat`), which securely injects the key on the server.

---

## 4. Local Development Instructions

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24)
- npm `v9+` or `v11+`

### Step 1: Install Dependencies
```bash
cd tulugpt
npm install
```

### Step 2: Run Development Environment
Run both the Vite frontend and the secure Express backend simultaneously:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend AI Proxy**: `http://localhost:3001`
- **Health Check**: `http://localhost:3001/api/health`

*Note: If you do not have a Groq API key or Supabase project immediately available, TuluGPT automatically runs in **Offline/Demo Mode**, allowing you to test all 7 AI chat modes, lessons, quizzes, weekly assessments, and admin moderation out-of-the-box!*

---

## 5. Supabase Database & Auth Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the Supabase Dashboard, navigate to **SQL Editor**.
3. Open `supabase/migrations/001_initial_schema.sql` from this repository, copy its entire contents, and run it in the SQL Editor.
4. This creates all tables (`profiles`, `conversations`, `messages`, `lessons`, `vocabulary`, `xp_transactions`, `streaks`, `badges`, `tulu_error_reports`) and enables strict Row Level Security (RLS).

### Step 2: Configure Google OAuth
1. Go to the [Google Cloud Console](https://console.cloud.google.com).
2. Create an **OAuth 2.0 Client ID** (Web Application).
3. In Authorized Redirect URIs, add your Supabase project callback URL:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret**.
5. In Supabase Dashboard, navigate to **Authentication** > **Providers** > **Google**.
6. Paste the Client ID and Secret, and toggle **Enable Provider**.

### Step 3: Configure Frontend Keys
In your `.env` file, set:
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-publishable-key>
```

---

## 6. Groq API Setup & Edge Function Deployment

### Option A: Local Express Server Backend (Default for dev)
1. Sign up at [console.groq.com](https://console.groq.com) and create a free API key.
2. Add your key to `.env`:
   ```env
   GROQ_API_KEY=gsk_...
   ```
3. Run `npm run dev`. The backend proxy will automatically route all `/api/chat` calls to `llama-3.3-70b-versatile` on Groq with low temperature (0.2) and the strict TuluGPT system prompt.

### Option B: Supabase Edge Function Deployment (Cloud)
To run the AI proxy entirely inside Supabase without a custom Node server:
1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref <your-project-ref>`
3. Set your secret: `supabase secrets set GROQ_API_KEY=gsk_...`
4. Deploy the function:
   ```bash
   supabase functions deploy tulu-chat
   ```

---

## 7. Security & Privacy Checklist

- [x] **No Leaked Secrets**: `GROQ_API_KEY` is strictly server-side and omitted from all client-side code and git bundles.
- [x] **Row Level Security (RLS)**: Enabled across all 15 database tables. Users can only select and update their own messages, conversations, and progress.
- [x] **Privacy-First Leaderboard**: Participation is strictly opt-in (`leaderboard_opt_in = true`). Users who opt out do not appear. Email addresses are never exposed in public views or API responses.
- [x] **Social Shoutout Consent**: The Admin Social Shoutout Studio only displays learners who explicitly consented (`social_shoutout_opt_in = true`).
- [x] **Anti-XP Farming**: XP transactions are event-based (`xp_transactions` audit log) and tied to validated learning activities (lessons, assessments, quizzes), preventing chat spam exploits.
- [x] **Responsible AI Guardrails**: Strict system prompt prohibiting hallucinations, dialect misrepresentation, and silent Kannada substitution.

---

## 8. Co-Founders & Credits

- **Amrut** — *Developer & Co-CEO* (Full-Stack Architecture & AI Product Engineering)
- **Anurag** — *Ideator & Co-CEO* (Vision, Cultural Curation & Product Concept)

*TuluGPT is dedicated to making Tulu accessible to anyone who grew up hearing the language but never learned to speak it, as well as newcomers eager to explore Coastal Karnataka's timeless heritage.*
