import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, SupabaseService } from '../services/supabase';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuthCallback() {
      if (!supabase) {
        navigate('/login?error=Supabase%20not%20configured');
        return;
      }

      try {
        // Supabase client auto-handles PKCE code or hash access_token when detectSessionInUrl is true.
        // We query getSession() to wait until the session is settled.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          // If code exchange is still finalizing, poll once after 800ms
          await new Promise(r => setTimeout(r, 800));
          const { data: { session: retrySession }, error: retryErr } = await supabase.auth.getSession();
          if (retryErr || !retrySession?.user) {
            throw new Error(retryErr?.message || 'Could not retrieve user session after OAuth callback.');
          }
          const profile = await SupabaseService.fetchOrCreateProfile(retrySession.user);
          routeUser(profile);
          return;
        }

        const profile = await SupabaseService.fetchOrCreateProfile(session.user);
        routeUser(profile);
      } catch (err: any) {
        console.error('OAuth callback exchange error:', err);
        setErrorMsg(err.message || 'Authentication failed during callback.');
        setTimeout(() => {
          navigate(`/login?error=${encodeURIComponent(err.message || 'Authentication error')}`);
        }, 3000);
      }
    }

    function routeUser(profile: any) {
      const next = searchParams.get('next') || '/app';

      // Decide onboarding from DB field: profiles.onboarding_completed
      if (!profile.onboarding_completed) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate(next, { replace: true });
      }
    }

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[#fbf8f2] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-amber-900/10 p-8 shadow-md space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#c05c3c] text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
          ತು
        </div>

        {errorMsg ? (
          <div className="space-y-2">
            <h2 className="font-serif text-lg font-bold text-rose-700">Authentication Error</h2>
            <p className="text-xs text-stone-600 leading-relaxed">{errorMsg}</p>
            <p className="text-[11px] text-stone-400">Redirecting to login...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="inline-block w-6 h-6 border-2 border-[#c05c3c] border-t-transparent rounded-full animate-spin my-1" />
            <h2 className="font-serif text-lg font-bold text-[#241e1a]">Completing Authentication</h2>
            <p className="text-xs text-[#776a61]">Securing your Tulu learning workspace...</p>
          </div>
        )}
      </div>
    </div>
  );
};
