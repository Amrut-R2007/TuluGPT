import React from 'react';
import { AlertCircle, Terminal, RefreshCw, ExternalLink } from 'lucide-react';

interface ConfigErrorScreenProps {
  missing: string[];
}

export const ConfigErrorScreen: React.FC<ConfigErrorScreenProps> = ({ missing }) => {
  return (
    <div className="min-h-screen bg-[#1c1815] text-[#fbf8f2] flex items-center justify-center p-6 selection:bg-[#c05c3c]/30">
      <div className="w-full max-w-xl rounded-3xl bg-[#28221d] border border-amber-900/30 p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
              Configuration Required
            </h1>
            <p className="text-xs text-amber-200/70">
              TuluGPT runs in strict production mode with zero simulation fallbacks.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-stone-300">
            Missing or invalid environment configuration:
          </p>

          <div className="rounded-xl bg-black/40 border border-stone-800 p-4 font-mono text-xs text-red-300 space-y-1">
            {missing.map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-red-500 font-bold">✗</span>
                <span>{key}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-xs text-stone-400">
          <p className="font-semibold text-stone-200 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-[#c05c3c]" />
            <span>How to fix:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
            <li>Open the <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300">.env</code> file in your project root.</li>
            <li>Paste your active Supabase project URL and anon publishable key:</li>
          </ol>
          <pre className="mt-2 p-3 rounded-lg bg-black/60 border border-stone-800 text-[11px] font-mono text-amber-100 overflow-x-auto">
{`VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...`}
          </pre>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c05c3c] hover:bg-[#a74728] text-white text-xs font-semibold transition active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
          <a
            href="/setup-check"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-medium border border-white/10 transition"
          >
            <span>Run /setup-check</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
