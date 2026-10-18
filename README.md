# TuluGPT (ತುಳು ಭಾಷೆ)

> **"Learn Tulu. Speak Tulu. Keep Tulu alive."**  
> An AI-powered Tulu language learning companion designed to take learners from their first word to confident conversation.

---

## 1. Technical Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend Framework** | **React 19 + TypeScript** | Built with Vite & React Router v7 |
| **Styling** | **Tailwind CSS v4** | Coastal terracotta, palm green, and rice-husk cream palette |
| **Authentication** | **Supabase GoTrue Auth** | Google OAuth + Email Magic Link backup |
| **Database & Security** | **Supabase PostgreSQL** | Strict Row-Level Security (RLS) policies per user |
| **AI LLM Engine** | **Groq API (`qwen/qwen3.8-27b`)** | Real-time Server-Sent Events (SSE) token streaming |
| **Backend API Proxy** | **Express.js (`server/index.js`)** | Secure server proxy safeguarding keys and streaming SSE |

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env`:

```env
# Groq LLM API Key (Used strictly by Express backend server; NEVER exposed to browser)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Groq Model Selection (defaults to qwen/qwen3.8-27b; verified active on Groq)
GROQ_MODEL=qwen/qwen3.8-27b

# Supabase Cloud Configuration (PostgreSQL, GoTrue Auth, Row Level Security)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_anon_key_here

# Backend Proxy Port (Local development)
PORT=3001

# Production Backend Base URL (leave empty in local dev to use Vite proxy /api)
# In production pointing to Render/Railway:
# VITE_API_BASE_URL=https://tulugpt-backend.onrender.com
VITE_API_BASE_URL=
```

### Environment Variables Reference Table

| Variable | Where Used | Client / Server | Where to Get It |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Frontend (`src/config/env.ts`, `src/services/supabase.ts`) | **Client** | Supabase Project Settings > API > Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Frontend (`src/config/env.ts`, `src/services/supabase.ts`) | **Client** | Supabase Project Settings > API > `anon` / `publishable` key |
| `GROQ_API_KEY` | Backend (`server/index.js`) | **Server Only** | [Groq Console](https://console.groq.com/keys) > API Keys |
| `GROQ_MODEL` | Backend (`server/index.js`) | **Server Only** | Optional override (defaults to `qwen/qwen3.8-27b`) |
| `PORT` | Backend (`server/index.js`) | **Server Only** | Express port (default: `3001`) |
| `VITE_API_BASE_URL` | Frontend (`src/services/aiService.ts`) | **Client** | Optional. Set in production on Vercel/Netlify |

---

## 3. Step-by-Step Configuration Guide

### Step 1: Supabase Database Setup
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project, click **SQL Editor** from the left navigation.
3. Click **New Query**, paste the entire contents of [`supabase/schema.sql`](file:///C:/Users/Amrut/.gemini/antigravity/scratch/tulugpt/supabase/schema.sql), and click **Run**.
4. This creates all tables (`profiles`, `conversations`, `messages`, `lesson_progress`), triggers, and RLS policies idempotently.

---

### Step 2: Google Cloud Console Setup (OAuth 2.0)
1. Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Click **Create Credentials** -> **OAuth client ID**.
3. Select Application type: **Web application**. Name it `TuluGPT`.
4. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173`
   - `https://<your-production-domain>.vercel.app`
5. Under **Authorized redirect URIs**, add your exact Supabase Auth callback URI:
   - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
   *(Replace `<your-supabase-project-ref>` with your Supabase reference ID found in your Supabase URL)*.
6. Click **Save** and copy the **Client ID** and **Client Secret**.

---

### Step 3: Supabase Auth Configuration
1. In your Supabase Dashboard, go to **Authentication** -> **Providers** -> **Google**.
2. Toggle Google to **Enabled**.
3. Paste the **Client ID** and **Client Secret** obtained from Google Cloud Console.
4. Click **Save**.
5. In Supabase Dashboard, go to **Authentication** -> **URL Configuration**:
   - **Site URL**: `http://localhost:5173` (or production URL)
   - **Redirect URLs** (add both):
     - `http://localhost:5173/auth/callback`
     - `https://<your-production-domain>.vercel.app/auth/callback`
6. Click **Save**.

---

### Step 4: Verify Health with Setup Check
Run the development environment:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/setup-check
```
The `/setup-check` page executes live diagnostics on:
- Client environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)
- Supabase connection & DNS ping
- Backend Express proxy health (`/api/health`)
- Groq model verification (confirms `qwen/qwen3.8-27b` is loaded and active)
- Displays 1-click copy buttons for your exact Google Cloud & Supabase redirect URIs.

---

## 4. Production Deployment Guide

### Option A: Recommended (Render / Railway for Backend + Vercel for Frontend)
1. **Deploy Backend (`server/index.js`)**:
   - Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app).
   - Set Build Command: `npm install`
   - Set Start Command: `npm run server`
   - Add Environment Variables:
     - `GROQ_API_KEY=gsk_...`
     - `GROQ_MODEL=qwen/qwen3.8-27b`
     - `PORT=10000`
   - Note the assigned backend URL (e.g. `https://tulugpt-backend.onrender.com`).
2. **Deploy Frontend on Vercel**:
   - Import your GitHub repo into [Vercel](https://vercel.com).
   - Add Environment Variables in Vercel project settings:
     - `VITE_SUPABASE_URL=https://<your-id>.supabase.co`
     - `VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...`
     - `VITE_API_BASE_URL=https://tulugpt-backend.onrender.com`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Option B: Monorepo with Vercel Serverless
Convert `server/index.js` to a Vercel Serverless Function under `api/chat.js` if deploying as a single unified Vercel project.

---

## 5. Phase C: 5-Minute Manual Verification Checklist

Run through these quick steps to verify the entire system:

1. **Logged-Out Navigation Guard**:
   - Open an incognito browser window and visit `http://localhost:5173/`.
   - Click **"Start Learning Now"** or **"Curriculum"**.
   - *Expected Result*: Immediately redirected to `http://localhost:5173/login?next=%2Fapp` (or `%2Fcurriculum`). No mock or simulation mode opens.
2. **Authentication Flow**:
   - Click **"Continue with Google"** (or enter email for magic link).
   - *Expected Result*: Redirects to Google authentication, returns through `/auth/callback`, and smoothly transitions to:
     - `/onboarding` for first-time users.
     - `/app` for returning users with completed onboarding.
3. **Session Persistence**:
   - Refresh the page (`F5`) while in `/app`.
   - *Expected Result*: User remains logged in. Top user avatar, name, and XP are loaded from the database without flickering back to logged-out state.
4. **Curriculum Route**:
   - Click **"Curriculum"** in the sidebar or navigate to `/curriculum`.
   - *Expected Result*: Loads units and lessons directly with real user progress saved in Supabase. Completing a lesson increments XP in the database.
5. **Real AI Tutor Chat**:
   - In `/app`, select **"Conversation"** or **"Translate"** and type: `Encha ullar?` (How are you?).
   - Press Enter.
   - *Expected Result*: Tokens stream smoothly in real time via SSE from Groq's `qwen/qwen3.8-27b` model with Tulu Kannada script, Roman transliteration, and English explanation. If network or keys fail, a visible error banner appears with a **Retry** button (never silent fallback).
6. **Sign Out Guard**:
   - Click **"Sign Out"** in the left sidebar.
   - *Expected Result*: Session is cleared, and navigating back to `/app` or `/curriculum` redirects to `/login`.

---

## 6. Automated Smoke Tests

Run the automated Playwright smoke tests:

```bash
npm run test:e2e
```

Smoke test suite covers:
- Route guards for logged-out visitors.
- Verification that all simulation/demo bypass buttons have been removed.
- `/setup-check` diagnostics rendering.
