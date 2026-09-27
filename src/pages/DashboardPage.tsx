import React from 'react';
import { 
  Flame, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  Trophy, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw,
  BookMarked
} from 'lucide-react';
import { UserProfile, LessonProgress } from '../types';
import { CURRICULUM_LESSONS } from '../data/curriculum_data';

interface DashboardPageProps {
  user: UserProfile;
  lessonProgress: Record<string, LessonProgress>;
  onNavigate: (tab: string, param?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  lessonProgress,
  onNavigate
}) => {
  // Compute lessons completed count
  const completedLessons = Object.values(lessonProgress).filter(p => p.status === 'completed').length;
  const totalLessons = CURRICULUM_LESSONS.length;
  const journeyPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

  // Find next in-progress or uncompleted lesson
  const currentLesson = CURRICULUM_LESSONS.find(l => !lessonProgress[l.id] || lessonProgress[l.id].status !== 'completed') || CURRICULUM_LESSONS[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Greeting Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#c05c3c] to-[#943d24] text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative background motif */}
        <div className="absolute right-0 -bottom-10 opacity-10 text-9xl font-serif select-none pointer-events-none">
          ತುಳು
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#f6e4c2] text-xs font-semibold backdrop-blur-xs">
            <span>🌾</span> <span>ನಮಸ್ಕಾರ (Namaskara)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            Namaskara, {user.display_name || user.username}!
          </h1>
          <p className="text-white/80 text-xs sm:text-sm">
            Ready to continue your Tulu journey today? Consistent daily practice keeps the language flowing naturally.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Current Streak */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-semibold text-[#776a61]">Current Streak</span>
            <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#241e1a]">
            {user.streak_count} <span className="text-xs font-normal text-[#776a61]">Days</span>
          </div>
          <p className="text-[11px] text-amber-700">Longest: {user.longest_streak || user.streak_count} days</p>
        </div>

        {/* Total XP */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#1f4e38]">
            <span className="text-xs font-semibold text-[#776a61]">Total XP</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-[#241e1a]">
            {user.total_xp} <span className="text-xs font-normal text-[#776a61]">XP</span>
          </div>
          <p className="text-[11px] text-[#1f4e38] font-medium">+20 XP per completed lesson</p>
        </div>

        {/* Lessons Completed */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#c05c3c]">
            <span className="text-xs font-semibold text-[#776a61]">Lessons Done</span>
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-[#241e1a]">
            {completedLessons} / {totalLessons}
          </div>
          <p className="text-[11px] text-[#c05c3c] font-medium">{journeyPercent}% of curriculum</p>
        </div>

        {/* Badges Earned */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#d4a359]">
            <span className="text-xs font-semibold text-[#776a61]">Badges Earned</span>
            <Award className="w-5 h-5 text-[#93681f]" />
          </div>
          <div className="text-2xl font-bold text-[#241e1a]">
            2 <span className="text-xs font-normal text-[#776a61]">Unlocked</span>
          </div>
          <button 
            onClick={() => onNavigate('badges')}
            className="text-[11px] text-[#93681f] font-medium hover:underline text-left"
          >
            View all badges →
          </button>
        </div>
      </div>

      {/* Main Tulu Journey Progress Card */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#c05c3c]">Your Progress</span>
            <h2 className="font-serif text-xl font-bold text-[#241e1a] mt-0.5">Tulu Journey</h2>
          </div>
          <div className="text-xs font-bold px-3 py-1 rounded-full bg-stone-100 text-[#544942] w-fit">
            Level 0: Absolute Beginner
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-[#544942] mb-1.5">
            <span>Overall Completion</span>
            <span>{journeyPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#c05c3c] to-[#1f4e38] transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(journeyPercent, 10)}%` }}
            />
          </div>
        </div>

        {/* Current Lesson Spotlight */}
        <div className="p-4 rounded-2xl bg-[#fdf5f2] border border-[#f5d4c8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#c05c3c]">
              Next Up: Lesson {currentLesson.order_index}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#241e1a]">{currentLesson.title}</h3>
            <p className="text-xs text-[#544942] max-w-lg">{currentLesson.description}</p>
          </div>
          <button
            onClick={() => onNavigate('learn', currentLesson.id)}
            className="px-6 py-3 rounded-xl bg-[#c05c3c] text-white font-semibold text-xs sm:text-sm hover:bg-[#a74728] shadow-sm transition flex items-center justify-center gap-2 shrink-0"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#776a61]">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('learn')}
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#c05c3c] hover:shadow-xs transition text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#c05c3c]/10 text-[#c05c3c] flex items-center justify-center group-hover:scale-105 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#241e1a]">Curriculum</p>
            <p className="text-[11px] text-[#776a61]">Explore all structured lessons</p>
          </button>

          <button
            onClick={() => onNavigate('chat')}
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#1f4e38] hover:shadow-xs transition text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1f4e38]/10 text-[#1f4e38] flex items-center justify-center group-hover:scale-105 transition">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#241e1a]">Practice Tulu</p>
            <p className="text-[11px] text-[#776a61]">Chat with AI tutor (7 modes)</p>
          </button>

          <button
            onClick={() => onNavigate('assessment')}
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-600 hover:shadow-xs transition text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#241e1a]">Weekly Assessment</p>
            <p className="text-[11px] text-[#776a61]">Evaluate your 6 language skills</p>
          </button>

          <button
            onClick={() => onNavigate('leaderboard')}
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-xs transition text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:scale-105 transition">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-[#241e1a]">Leaderboard</p>
            <p className="text-[11px] text-[#776a61]">Weekly XP and community ranks</p>
          </button>
        </div>
      </div>
    </div>
  );
};
