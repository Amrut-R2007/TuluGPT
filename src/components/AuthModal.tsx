import React, { useState } from 'react';
import { X, Sparkles, Shield, Compass, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { SupabaseService } from '../services/supabase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'options' | 'email_signin' | 'email_signup'>('options');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email form state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SupabaseService.signInWithGoogle();
      if (res.error) {
        setError(res.error);
        setLoading(false);
      }
      // If no error, browser is redirecting to accounts.google.com
    } catch (e: any) {
      setError(e.message || 'Authentication error');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authMode === 'email_signup') {
        const res = await SupabaseService.signUpWithEmail(email, password, displayName || 'Tulu Learner');
        if (res.error) {
          setError(res.error);
        } else if (res.user) {
          onSuccess(res.user);
          onClose();
        }
      } else {
        const res = await SupabaseService.signInWithEmail(email, password);
        if (res.error) {
          setError(res.error);
        } else if (res.user) {
          onSuccess(res.user);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStart = () => {
    const freshUser: UserProfile = {
      id: `usr-${Date.now()}`,
      username: (displayName ? displayName.toLowerCase().replace(/\s+/g, '_') : 'tululearner') + '_' + Math.floor(1000 + Math.random() * 9000),
      display_name: displayName.trim() || 'Learner',
      email: email.trim() || 'learner@tulugpt.org',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      learning_level: 'zero',
      native_language: 'English',
      target_level: 'intermediate',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      streak_count: 1,
      longest_streak: 1,
      total_xp: 0,
      leaderboard_opt_in: true,
      social_shoutout_opt_in: true,
      onboarding_completed: false, // Triggers the 5 onboarding questions!
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSuccess(freshUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-3xl bg-[#fbf8f2] p-6 sm:p-8 shadow-2xl border border-amber-900/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c05c3c] to-[#943d24] text-white flex items-center justify-center font-bold text-xl shadow-md border border-[#e3b86a]/40">
            ತು
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#241e1a]">
            {authMode === 'email_signup' ? 'Create Your Account' : authMode === 'email_signin' ? 'Sign In to TuluGPT' : 'Welcome to TuluGPT'}
          </h2>
          <p className="text-xs text-[#776a61] max-w-xs mx-auto">
            "Learn Tulu. Speak Tulu. Keep Tulu alive."<br />
            Sign in to personalize your learning journey, maintain streaks, and chat with AI.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed">
            {error}
          </div>
        )}

        {authMode === 'options' ? (
          <div className="space-y-3">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-stone-200 text-[#241e1a] font-semibold text-sm shadow-xs hover:bg-stone-50 transition active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Email & Password Option */}
            <button
              onClick={() => setAuthMode('email_signin')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-stone-200 text-[#241e1a] font-medium text-xs hover:bg-stone-50 transition shadow-2xs"
            >
              <Mail className="w-4 h-4 text-[#c05c3c]" />
              <span>Continue with Email & Password</span>
            </button>

            <div className="relative py-2 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div>
              <span className="relative bg-[#fbf8f2] px-3 text-[11px] text-stone-500 uppercase tracking-wider font-semibold">or</span>
            </div>

            {/* Instant Learner Quick Start */}
            <button
              onClick={handleQuickStart}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1f4e38]/10 text-[#1f4e38] font-semibold text-xs hover:bg-[#1f4e38]/20 transition"
            >
              <Sparkles className="w-4 h-4 text-[#1f4e38]" />
              <span>Instant Quick Start (Jump Straight In)</span>
            </button>
          </div>
        ) : (
          /* Email Form */
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {authMode === 'email_signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#544942] mb-1">Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Amrut"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-[#241e1a] focus:ring-2 focus:ring-[#c05c3c] focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#544942] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="learner@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-[#241e1a] focus:ring-2 focus:ring-[#c05c3c] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#544942] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs text-[#241e1a] focus:ring-2 focus:ring-[#c05c3c] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#c05c3c] text-white font-semibold text-xs sm:text-sm hover:bg-[#a74728] shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : authMode === 'email_signup' ? 'Sign Up' : 'Sign In'}
            </button>

            <div className="flex items-center justify-between text-[11px] pt-1 text-[#776a61]">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'email_signup' ? 'email_signin' : 'email_signup')}
                className="hover:underline font-semibold text-[#c05c3c]"
              >
                {authMode === 'email_signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('options')}
                className="hover:underline text-stone-500"
              >
                ← Back
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-amber-900/10 flex items-center gap-2 text-[11px] text-[#776a61]">
          <Shield className="w-4 h-4 text-[#1f4e38] shrink-0" />
          <span>Strict privacy. We never share your email or post to social media without permission.</span>
        </div>
      </div>
    </div>
  );
};
