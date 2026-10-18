import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowLeft,
  Server,
  Database,
  Key,
  ShieldCheck
} from 'lucide-react';
import { ENV, validateEnv } from '../config/env';

interface CheckItem {
  id: string;
  name: string;
  category: 'client_env' | 'supabase' | 'backend' | 'oauth';
  status: 'pending' | 'pass' | 'fail';
  details: string;
  value?: string;
  help?: string;
}

export const SetupCheckPage: React.FC = () => {
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const envResult = validateEnv();

    // 1. Client Env Checks
    const urlValid = Boolean(ENV.supabaseUrl && !ENV.supabaseUrl.includes('placeholder') && ENV.supabaseUrl.startsWith('http'));
    const keyValid = Boolean(ENV.supabaseAnonKey && !ENV.supabaseAnonKey.includes('placeholder') && ENV.supabaseAnonKey.length > 20);

    const initial: CheckItem[] = [
      {
        id: 'env_supabase_url',
        name: 'VITE_SUPABASE_URL',
        category: 'client_env',
        status: urlValid ? 'pass' : 'fail',
        value: ENV.supabaseUrl || '(not set)',
        details: urlValid 
          ? 'Valid HTTPS URL provided.' 
          : 'Missing or placeholder. Add your Supabase Project URL in .env',
        help: 'Found under Supabase Dashboard > Project Settings > API > Project URL'
      },
      {
        id: 'env_supabase_key',
        name: 'VITE_SUPABASE_PUBLISHABLE_KEY',
        category: 'client_env',
        status: keyValid ? 'pass' : 'fail',
        value: ENV.supabaseAnonKey ? `${ENV.supabaseAnonKey.substring(0, 16)}...` : '(not set)',
        details: keyValid 
          ? 'Anon public key format is valid.' 
          : 'Missing or placeholder. Add your Supabase anon public key in .env',
        help: 'Found under Supabase Dashboard > Project Settings > API > Project API Keys (anon/public)'
      },
      {
        id: 'supabase_ping',
        name: 'Supabase Server Connectivity',
        category: 'supabase',
        status: 'pending',
        details: 'Testing live HTTP connection to Supabase Auth endpoint...',
      },
      {
        id: 'backend_health',
        name: 'Backend Express Proxy & Groq',
        category: 'backend',
        status: 'pending',
        details: 'Testing connection to /api/health...',
      },
      {
        id: 'oauth_redirect_google',
        name: 'Google Cloud Console Redirect URI',
        category: 'oauth',
        status: 'pass',
        value: ENV.supabaseUrl ? `${ENV.supabaseUrl}/auth/v1/callback` : 'https://<your-project-ref>.supabase.co/auth/v1/callback',
        details: 'Paste this exact URL into Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client ID > Authorized redirect URIs',
      },
      {
        id: 'oauth_redirect_supabase',
        name: 'Supabase Auth Redirect URLs',
        category: 'oauth',
        status: 'pass',
        value: `${window.location.origin}/auth/callback`,
        details: 'Add this exact URL into Supabase Dashboard > Authentication > URL Configuration > Redirect URLs',
      }
    ];

    setChecks(initial);

    // 2. Test Supabase live connectivity
    if (urlValid) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(`${ENV.supabaseUrl}/auth/v1/health`, {
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (res.ok || res.status === 200 || res.status === 401) {
          updateCheck('supabase_ping', 'pass', `Supabase host responded with HTTP ${res.status} (Live & Healthy).`);
        } else {
          updateCheck('supabase_ping', 'fail', `Supabase host returned unexpected HTTP ${res.status}.`);
        }
      } catch (err: any) {
        const msg = err.name === 'AbortError' 
          ? 'Connection timed out after 6 seconds.' 
          : err.message || 'DNS resolution failed or network unreachable.';
        updateCheck('supabase_ping', 'fail', `Failed to connect: ${msg}. Check if your Supabase project is paused or deleted.`);
      }
    } else {
      updateCheck('supabase_ping', 'fail', 'Cannot test Supabase connection until VITE_SUPABASE_URL is configured.');
    }

    // 3. Test Backend Express Proxy & Groq Model
    try {
      const apiEndpoint = ENV.apiBaseUrl ? `${ENV.apiBaseUrl}/api/health` : '/api/health';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(apiEndpoint, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data.groqConfigured && data.modelVerified) {
          updateCheck('backend_health', 'pass', `Backend online. Groq model '${data.model}' verified and active.`);
        } else if (data.groqConfigured && !data.modelVerified) {
          updateCheck('backend_health', 'fail', `Backend online, but Groq model verification failed: ${data.modelError || 'Model not found'}`);
        } else {
          updateCheck('backend_health', 'fail', 'Backend online, but GROQ_API_KEY is missing in server .env.');
        }
      } else {
        updateCheck('backend_health', 'fail', `Backend returned HTTP ${res.status}. Ensure 'npm run dev' is running.`);
      }
    } catch (err: any) {
      updateCheck('backend_health', 'fail', 'Backend proxy is unreachable at /api/health. Make sure Express server is running on port 3001.');
    }

    setIsRunning(false);
  };

  const updateCheck = (id: string, status: 'pass' | 'fail', details: string) => {
    setChecks(prev => prev.map(c => c.id === id ? { ...c, status, details } : c));
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const passCount = checks.filter(c => c.status === 'pass').length;
  const failCount = checks.filter(c => c.status === 'fail').length;

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#241e1a] selection:bg-[#c05c3c]/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#544942] hover:text-[#c05c3c] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Application</span>
          </a>

          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-[#241e1a] hover:bg-stone-50 transition shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>Re-run Diagnostics</span>
          </button>
        </div>

        <div className="rounded-3xl bg-white border border-amber-900/10 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f4e38]/10 text-[#1f4e38] text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Simulation Diagnostic Suite</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#241e1a]">
                TuluGPT System Health & Setup Check
              </h1>
              <p className="text-xs sm:text-sm text-[#776a61] mt-1">
                Verifies environment configuration, Supabase database connectivity, Groq LLM model status, and OAuth redirect URIs.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {passCount} Passing
              </span>
              {failCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                  {failCount} Failing
                </span>
              )}
            </div>
          </div>

          {/* Checks List */}
          <div className="space-y-4 pt-2">
            {checks.map((check) => {
              const isPass = check.status === 'pass';
              const isFail = check.status === 'fail';

              return (
                <div
                  key={check.id}
                  className={`p-4 rounded-2xl border transition ${
                    isPass 
                      ? 'bg-emerald-50/40 border-emerald-200/70' 
                      : isFail 
                      ? 'bg-rose-50/50 border-rose-200' 
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        {isPass ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isFail ? (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                        )}
                        <h3 className="font-bold text-xs sm:text-sm text-[#241e1a]">
                          {check.name}
                        </h3>
                      </div>

                      <p className="text-xs text-[#544942] pl-6 leading-relaxed">
                        {check.details}
                      </p>

                      {check.value && (
                        <div className="pl-6 pt-1 flex items-center gap-2">
                          <code className="px-2 py-1 rounded-md bg-black/5 font-mono text-[11px] text-[#241e1a] break-all border border-black/5">
                            {check.value}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(check.value!, check.id)}
                            className="p-1.5 rounded-md hover:bg-stone-200/60 text-stone-600 transition"
                            title="Copy to clipboard"
                          >
                            {copiedId === check.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {check.help && (
                        <p className="text-[11px] text-[#776a61] pl-6 pt-0.5 italic">
                          💡 {check.help}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setup Guide Summary Card */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5 space-y-2 text-xs text-[#42332a]">
          <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
            <span>📋</span> Exact OAuth Setup Steps
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed text-[#544942]">
            <li>In <strong>Google Cloud Console</strong> &gt; <em>APIs &amp; Services</em> &gt; <em>Credentials</em> &gt; your OAuth 2.0 Client ID: add <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">{ENV.supabaseUrl ? `${ENV.supabaseUrl}/auth/v1/callback` : 'https://<project-ref>.supabase.co/auth/v1/callback'}</code> under <strong>Authorized redirect URIs</strong>.</li>
            <li>In <strong>Supabase Dashboard</strong> &gt; <em>Authentication</em> &gt; <em>URL Configuration</em>: set <strong>Site URL</strong> to <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">{window.location.origin}</code> and add <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">{window.location.origin}/auth/callback</code> to <strong>Redirect URLs</strong>.</li>
            <li>Enable Google Provider under <strong>Supabase</strong> &gt; <em>Authentication</em> &gt; <em>Providers</em> &gt; <em>Google</em> using your Google Client ID &amp; Secret.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
