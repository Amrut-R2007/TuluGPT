import React, { useState } from 'react';
import { Trophy, Flame, Sparkles, Shield, Award, AlertCircle } from 'lucide-react';
import { LeaderboardEntry, UserProfile } from '../types';

interface LeaderboardPageProps {
  user: UserProfile;
  leaderboardData: LeaderboardEntry[];
  onToggleOptIn: (optedIn: boolean) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  user,
  leaderboardData,
  onToggleOptIn
}) => {
  const [tab, setTab] = useState<'weekly' | 'all_time'>('weekly');

  // Filter only opted-in users
  const visibleUsers = leaderboardData.filter(u => u.opted_in);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1f4e38] to-[#143525] text-white p-6 sm:p-8 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-[#e3b86a]" />
          <span>Tulunadu Learner Board</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">
          Weekly Tulu Leaderboard
        </h1>
        <p className="text-white/80 text-xs sm:text-sm max-w-xl">
          Celebrating consistent learners keeping Tulu alive through deliberate daily practice.
        </p>
      </div>

      {/* Privacy Opt-in Status Card */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#1f4e38] shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-[#241e1a]">Privacy & Public Presence</h4>
            <p className="text-[11px] text-[#776a61]">
              {user.leaderboard_opt_in 
                ? 'You are currently visible on the public leaderboard. Your email is never shown.'
                : 'You are currently hidden from the public leaderboard. Your learning remains completely private.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onToggleOptIn(!user.leaderboard_opt_in)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            user.leaderboard_opt_in
              ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              : 'bg-[#1f4e38] text-white hover:bg-[#143525]'
          }`}
        >
          {user.leaderboard_opt_in ? 'Opt Out (Hide Me)' : 'Opt In to Leaderboard'}
        </button>
      </div>

      {/* Timeframe Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setTab('weekly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'weekly' 
              ? 'bg-[#c05c3c] text-white shadow-2xs' 
              : 'text-[#544942] hover:bg-stone-100'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setTab('all_time')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === 'all_time' 
              ? 'bg-[#c05c3c] text-white shadow-2xs' 
              : 'text-[#544942] hover:bg-stone-100'
          }`}
        >
          All Time
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="rounded-3xl bg-white border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {visibleUsers.map((entry, idx) => {
            const isCurrentUser = entry.user_id === user.id;
            const rank = idx + 1;

            return (
              <div
                key={entry.user_id}
                className={`p-4 flex items-center justify-between gap-4 transition ${
                  isCurrentUser ? 'bg-amber-500/10' : 'hover:bg-stone-50'
                }`}
              >
                {/* Rank & User details */}
                <div className="flex items-center gap-3.5">
                  <div className="w-7 text-center font-bold text-sm text-[#776a61]">
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                  </div>

                  <img
                    src={entry.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={entry.display_name}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#241e1a]">
                        {entry.display_name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-[#c05c3c] text-white">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#776a61]">
                      <span>@{entry.username}</span>
                      {entry.top_badge && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#93681f] font-medium">
                            <Award className="w-3 h-3" />
                            {entry.top_badge}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score & Streak */}
                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:flex items-center gap-1 text-xs text-amber-700 font-semibold">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{entry.current_streak}d</span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-[#1f4e38]">
                      {tab === 'weekly' ? entry.weekly_xp : entry.total_xp} XP
                    </div>
                    <span className="text-[10px] text-[#776a61]">earned</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fairness & Anti-farming Policy */}
      <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-amber-900/10 flex items-start gap-3 text-xs text-[#544942]">
        <AlertCircle className="w-4 h-4 text-[#c05c3c] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#241e1a]">Fairness & Learning Integrity: </span>
          XP is awarded for genuine learning activities (lessons, validated quizzes, and comprehensive assessments). Spamming chat messages does not produce artificial XP.
        </div>
      </div>
    </div>
  );
};
