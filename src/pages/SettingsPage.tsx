import React, { useState } from 'react';
import { 
  User, 
  BookOpen, 
  Shield, 
  Trophy, 
  Moon, 
  Sun, 
  LogOut, 
  CheckCircle2, 
  HeartHandshake, 
  Clock, 
  Mail,
  Info
} from 'lucide-react';
import { UserProfile, LearningLevel } from '../types';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigateAbout: () => void;
  onSignOut: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateUser,
  onNavigateAbout,
  onSignOut
}) => {
  const [displayName, setDisplayName] = useState(user.display_name || '');
  const [username, setUsername] = useState(user.username || '');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>(user.learning_level);
  const [timezone, setTimezone] = useState(user.timezone || 'Asia/Kolkata');
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(user.leaderboard_opt_in);
  const [socialShoutoutOptIn, setSocialShoutoutOptIn] = useState(user.social_shoutout_opt_in);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      display_name: displayName,
      username: username,
      learning_level: learningLevel,
      timezone: timezone,
      leaderboard_opt_in: leaderboardOptIn,
      social_shoutout_opt_in: socialShoutoutOptIn,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const levelOptions: { key: LearningLevel; label: string }[] = [
    { key: 'zero', label: 'Level 0: Absolute Beginner (Zero Tulu)' },
    { key: 'few_words', label: 'Level 0: Know a few words' },
    { key: 'understand_some', label: 'Level 1: Understand some spoken Tulu' },
    { key: 'basic_speaker', label: 'Level 1: Speak basic Tulu' },
    { key: 'intermediate', label: 'Level 2/3: Intermediate speaker' },
    { key: 'advanced', label: 'Level 4: Advanced / Formal' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241e1a]">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#776a61] mt-1">
            Manage your account, learning pacing, privacy options, and regional configuration.
          </p>
        </div>

        {/* Know More About Us CTA Button */}
        <button
          onClick={onNavigateAbout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#8c381f] text-xs font-bold hover:bg-amber-500/20 transition shrink-0"
        >
          <HeartHandshake className="w-4 h-4 text-[#c05c3c]" />
          <span>Know More About Us</span>
        </button>
      </div>

      {savedNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Account & Profile */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <User className="w-4 h-4 text-[#c05c3c]" />
            <h2 className="font-bold text-base text-[#241e1a]">Account & Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#544942] mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#241e1a] focus:ring-2 focus:ring-[#c05c3c] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#544942] mb-1">Public Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#241e1a] focus:ring-2 focus:ring-[#c05c3c] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#544942] mb-1">Email (Private)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-100 text-xs text-stone-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-[#776a61] mt-1">Never shared or shown on public boards.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#544942] mb-1">Learning Timezone</label>
              <div className="relative">
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="Asia/Kolkata"
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#241e1a] focus:ring-2 focus:ring-[#c05c3c] focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-[#776a61] mt-1">Used to calculate daily streaks at local midnight.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Learning Preferences */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <BookOpen className="w-4 h-4 text-[#1f4e38]" />
            <h2 className="font-bold text-base text-[#241e1a]">Learning Level</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#544942] mb-1.5">Current Tulu Skill Level</label>
            <select
              value={learningLevel}
              onChange={(e) => setLearningLevel(e.target.value as LearningLevel)}
              className="w-full p-3 rounded-xl border border-stone-200 text-xs text-[#241e1a] bg-white focus:ring-2 focus:ring-[#c05c3c] focus:outline-none"
            >
              {levelOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#776a61] mt-1">
              Adjusts the vocabulary complexity and English support provided by the AI tutor.
            </p>
          </div>
        </div>

        {/* Section 3: Privacy & Community Leaderboard */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Shield className="w-4 h-4 text-[#c05c3c]" />
            <h2 className="font-bold text-base text-[#241e1a]">Privacy & Leaderboard</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-xs text-[#241e1a]">Include in Public Leaderboard</p>
                <p className="text-[11px] text-[#776a61] mt-0.5">
                  Allows your username, avatar, and XP to display on weekly community leaderboards.
                </p>
              </div>
              <input
                type="checkbox"
                checked={leaderboardOptIn}
                onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                className="w-4 h-4 text-[#c05c3c] rounded border-stone-300 focus:ring-[#c05c3c] mt-1"
              />
            </div>

            <div className="flex items-start justify-between gap-4 pt-3 border-t border-stone-100">
              <div>
                <p className="font-semibold text-xs text-[#241e1a]">Social Shoutout Consent</p>
                <p className="text-[11px] text-[#776a61] mt-0.5">
                  Consent to having your public username included if selected as a Weekly Top Performer.
                </p>
              </div>
              <input
                type="checkbox"
                checked={socialShoutoutOptIn}
                onChange={(e) => setSocialShoutoutOptIn(e.target.checked)}
                className="w-4 h-4 text-[#c05c3c] rounded border-stone-300 focus:ring-[#c05c3c] mt-1"
              />
            </div>
          </div>
        </div>

        {/* Submit & Sign out */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-xs sm:text-sm hover:bg-[#a74728] shadow-sm transition"
          >
            Save Preferences
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of TuluGPT</span>
          </button>
        </div>
      </form>
    </div>
  );
};
