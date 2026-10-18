import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Flame, Sparkles } from 'lucide-react';
import { CurriculumPage } from './CurriculumPage';
import { LessonPlayerPage } from './LessonPlayerPage';
import { useAuth } from '../context/AuthContext';
import { SupabaseService } from '../services/supabase';
import { LessonProgress } from '../types';
import { CURRICULUM_LESSONS } from '../data/curriculum_data';

export const CurriculumRoutePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const p = await SupabaseService.getLessonProgress();
        setProgress(p);
      } catch (err) {
        console.error('Error loading lesson progress:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProgress();
  }, []);

  const handleCompleteLesson = async (lessonId: string, score: number) => {
    try {
      await SupabaseService.saveLessonProgress(lessonId, score);
      const updated = await SupabaseService.getLessonProgress();
      setProgress(updated);
      await refreshUser();
    } catch (err) {
      console.error('Failed to save completed lesson:', err);
    }
  };

  const selectedLesson = selectedLessonId 
    ? CURRICULUM_LESSONS.find(l => l.id === selectedLessonId) 
    : null;

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#241e1a] flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 shrink-0 border-b border-amber-900/10 bg-white/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            to="/app"
            className="flex items-center gap-2 text-xs font-semibold text-[#544942] hover:text-[#c05c3c] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>AI Tutor Chat</span>
          </Link>
          <span className="text-stone-300">|</span>
          <span className="font-serif font-bold text-sm sm:text-base text-[#241e1a]">
            Curriculum
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div 
              title="Daily streak"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-semibold"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
              <span>{user.streak_count || 0}d</span>
            </div>

            <div 
              title="Total XP"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1f4e38]/10 border border-[#1f4e38]/20 text-[#1f4e38] text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1f4e38]" />
              <span>{user.total_xp || 0} XP</span>
            </div>

            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#c05c3c] text-white text-xs font-semibold hover:bg-[#a74728] shadow-xs transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Practice in Chat</span>
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {selectedLesson ? (
          <LessonPlayerPage
            lesson={selectedLesson}
            onBack={() => setSelectedLessonId(null)}
            onCompleteLesson={handleCompleteLesson}
          />
        ) : (
          <CurriculumPage
            lessonProgress={progress}
            onSelectLesson={(id) => setSelectedLessonId(id)}
          />
        )}
      </main>
    </div>
  );
};
