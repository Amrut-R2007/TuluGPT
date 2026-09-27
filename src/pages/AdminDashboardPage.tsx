import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Filter,
  Check,
  Award
} from 'lucide-react';
import { TuluErrorReport, ErrorReportStatus, LeaderboardEntry } from '../types';
import { LocalStore } from '../services/storage';
import { VERIFIED_VOCABULARY } from '../data/verified_vocabulary';

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

interface AdminDashboardPageProps {
  reports: TuluErrorReport[];
  onUpdateReportStatus: (id: string, status: ErrorReportStatus, adminNotes?: string) => void;
  leaderboard: LeaderboardEntry[];
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  reports,
  onUpdateReportStatus,
  leaderboard
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [copiedCaption, setCopiedCaption] = useState<string | null>(null);
  const [selectedTopPerformer, setSelectedTopPerformer] = useState<LeaderboardEntry>(leaderboard[0] || null);

  const filteredReports = reports.filter(r => 
    selectedStatusFilter === 'all' ? true : r.status === selectedStatusFilter
  );

  // Filter top performers who specifically opted in for social recognition
  const eligibleShoutouts = leaderboard.filter(u => u.opted_in);

  // Social caption generator for Weekly Tulu Champion
  const generateInstagramCaption = (performer: LeaderboardEntry) => {
    return `🌟 Tulunadu Weekly Learner Champion! 🌾✨\n\nHuge Solmelu to @${performer.username} for leading this week's Tulu learning journey on TuluGPT! 🚀\n\n📊 Weekly Stats:\n🔥 Streak: ${performer.current_streak} uninterrupted days\n⚡ XP Earned: ${performer.weekly_xp} XP\n🏆 Badge: ${performer.top_badge || 'Active Tuluva'}\n\nTulu is one of India's richest oral Dravidian languages. Every word learned keeps our coastal heritage alive. Join us today and start your journey from your first word to confident conversation!\n\n👉 Learn Tulu free at tulugpt.org\n\n#TuluGPT #LearnTulu #TuluLanguage #Mangalore #Udupi #Kudla #CoastalKarnataka #Tulunadu #DravidianLanguages #IndianHeritage`;
  };

  const generateLinkedInCaption = (performer: LeaderboardEntry) => {
    return `Preserving regional linguistic heritage with modern AI: Celebrating our TuluGPT Weekly Champion! 🌾\n\nWe are proud to recognize ${performer.display_name} (@${performer.username}) for outstanding dedication on TuluGPT, racking up ${performer.weekly_xp} XP and a ${performer.current_streak}-day learning streak this week.\n\nTuluGPT combines large language model technology with verified linguistic corpora to help anyone learn Tulu from scratch. Congratulations to our learners for keeping this language vibrant and alive.\n\nExplore the platform: tulugpt.org\n\n#LanguageLearning #AIforGood #TuluGPT #CulturalPreservation #EdTech #Karnataka`;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(type);
    setTimeout(() => setCopiedCaption(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f4e38]/10 text-[#1f4e38] text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator & Linguistic Studio</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241e1a]">
            Admin Moderation & Shoutouts
          </h1>
          <p className="text-xs sm:text-sm text-[#776a61]">
            Review reported AI inaccuracies, manage verified vocabulary, and approve weekly community shoutouts.
          </p>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#776a61]">Verified Vocab</span>
          <div className="text-2xl font-bold text-[#241e1a]">{VERIFIED_VOCABULARY.length}</div>
          <p className="text-[11px] text-[#1f4e38]">Rashtrakavi Pai corpus</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#776a61]">Error Reports</span>
          <div className="text-2xl font-bold text-[#c05c3c]">{reports.length}</div>
          <p className="text-[11px] text-[#c05c3c]">{reports.filter(r => r.status === 'reported').length} pending review</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#776a61]">Eligible Shoutouts</span>
          <div className="text-2xl font-bold text-amber-700">{eligibleShoutouts.length}</div>
          <p className="text-[11px] text-amber-800">Consented learners</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#776a61]">Average Score</span>
          <div className="text-2xl font-bold text-[#1f4e38]">87%</div>
          <p className="text-[11px] text-[#776a61]">Weekly assessment avg</p>
        </div>
      </div>

      {/* SECTION 1: WEEKLY TOP PERFORMER SOCIAL SHOUTOUT STUDIO */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#c05c3c]">
              Community Recognition
            </span>
            <h2 className="font-serif text-xl font-bold text-[#241e1a]">
              Weekly Tulu Champion Social Shoutout Studio
            </h2>
          </div>
          <span className="text-xs text-[#776a61] bg-stone-100 px-3 py-1 rounded-full">
            Strict Privacy: Only users with explicit consent are eligible
          </span>
        </div>

        {eligibleShoutouts.length > 0 && selectedTopPerformer && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Candidate selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase text-[#776a61]">
                Select Eligible Top Performer:
              </label>
              <div className="space-y-2">
                {eligibleShoutouts.map((cand) => (
                  <button
                    key={cand.user_id}
                    onClick={() => setSelectedTopPerformer(cand)}
                    className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                      selectedTopPerformer.user_id === cand.user_id
                        ? 'border-[#c05c3c] bg-[#c05c3c]/10 text-[#c05c3c] font-bold'
                        : 'border-stone-200 hover:bg-stone-50 text-[#544942]'
                    }`}
                  >
                    <div>
                      <p className="text-xs">{cand.display_name} (@{cand.username})</p>
                      <p className="text-[11px] text-[#776a61] font-normal">{cand.weekly_xp} Weekly XP • 🔥 {cand.current_streak}d streak</p>
                    </div>
                    {selectedTopPerformer.user_id === cand.user_id && (
                      <Check className="w-4 h-4 text-[#c05c3c]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Social Captions */}
            <div className="lg:col-span-2 space-y-4">
              {/* Instagram Caption */}
              <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-700">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram Caption Ready</span>
                  </div>
                  <button
                    onClick={() => handleCopy(generateInstagramCaption(selectedTopPerformer), 'instagram')}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 transition"
                  >
                    {copiedCaption === 'instagram' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCaption === 'instagram' ? 'Copied!' : 'Copy Caption'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-white border border-stone-200 text-[11px] text-[#544942] whitespace-pre-wrap font-sans max-h-36 overflow-y-auto">
                  {generateInstagramCaption(selectedTopPerformer)}
                </pre>
              </div>

              {/* LinkedIn Caption */}
              <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn Post Ready</span>
                  </div>
                  <button
                    onClick={() => handleCopy(generateLinkedInCaption(selectedTopPerformer), 'linkedin')}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 transition"
                  >
                    {copiedCaption === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCaption === 'linkedin' ? 'Copied!' : 'Copy Post'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-white border border-stone-200 text-[11px] text-[#544942] whitespace-pre-wrap font-sans max-h-36 overflow-y-auto">
                  {generateLinkedInCaption(selectedTopPerformer)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: REPORTED AI ERRORS MODERATION QUEUE */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1f4e38]">Quality Assurance</span>
            <h2 className="font-serif text-xl font-bold text-[#241e1a]">
              Reported AI Linguistic Errors ({filteredReports.length})
            </h2>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#776a61] mr-1">Status:</span>
            {['all', 'reported', 'under_review', 'verified', 'fixed'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  selectedStatusFilter === st
                    ? 'bg-[#c05c3c] text-white font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#776a61]">
            No error reports matching this status filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-2xl bg-[#fbf8f2] border border-stone-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-[#c05c3c]/10 text-[#c05c3c]">
                      {report.reason.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#776a61]">by @{report.username || 'Learner'}</span>
                  </div>

                  {/* Status update buttons */}
                  <div className="flex items-center gap-1">
                    {(['reported', 'under_review', 'verified', 'fixed', 'rejected'] as ErrorReportStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateReportStatus(report.id, st)}
                        className={`text-[10px] px-2 py-1 rounded-md capitalize transition ${
                          report.status === st
                            ? 'bg-[#1f4e38] text-white font-bold'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#241e1a] font-medium leading-relaxed">
                  <strong>User Feedback:</strong> {report.description}
                </p>

                {report.ai_response && (
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-[11px] text-[#776a61]">
                    <span className="font-semibold text-[#241e1a]">Reported AI Snippet: </span>
                    {report.ai_response}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
