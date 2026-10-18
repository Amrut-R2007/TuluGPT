import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Shield, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithOtp } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get('error') || null);

  const nextUrl = searchParams.get('next') || '/app';

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    setError(null);
    const res = await signInWithGoogle();
    if (res.error) {
      setError(res.error);
      setIsLoadingGoogle(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoadingOtp(true);
    setError(null);
    const res = await signInWithOtp(email);
    setIsLoadingOtp(false);

    if (res.error) {
      setError(res.error);
    } else {
      setOtpSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#241e1a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#c05c3c]/20">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 px-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c05c3c] to-[#943d24] text-white flex items-center justify-center font-bold text-2xl shadow-md border border-[#e3b86a]/40">
          ತು
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#241e1a]">
          Sign in to TuluGPT
        </h1>
        <p className="text-xs text-[#776a61] max-w-sm mx-auto">
          "Learn Tulu. Speak Tulu. Keep Tulu alive."<br />
          Access your personal AI tutor, curriculum progress, and streaks.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-amber-900/10 rounded-3xl sm:px-10 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {otpSent ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-sm font-bold text-emerald-950">Magic Link Sent!</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                We sent a secure login link to <strong>{email}</strong>.<br />
                Click the link in your inbox to sign in automatically.
              </p>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="mt-2 text-xs font-semibold text-emerald-700 underline"
              >
                Use another email or Google
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoadingGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-stone-300 text-[#241e1a] font-semibold text-sm shadow-xs hover:bg-stone-50 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
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
                <span>{isLoadingGoogle ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative py-2 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                  or email magic link
                </span>
              </div>

              {/* Email Magic Link Form */}
              <form onSubmit={handleMagicLinkSignIn} className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#544942] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#241e1a] focus:ring-2 focus:ring-[#c05c3c] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoadingOtp || !email.trim()}
                  className="w-full py-3 rounded-xl bg-[#c05c3c] text-white font-semibold text-xs sm:text-sm hover:bg-[#a74728] shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isLoadingOtp ? 'Sending Magic Link...' : 'Send Magic Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-[11px] text-[#776a61]">
            <Shield className="w-4 h-4 text-[#1f4e38] shrink-0" />
            <span>Strict privacy. Passwordless security managed through Supabase Auth.</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/setup-check"
            className="text-[11px] text-stone-500 hover:text-[#c05c3c] underline"
          >
            Trouble signing in? Run /setup-check
          </a>
        </div>
      </div>
    </div>
  );
};
