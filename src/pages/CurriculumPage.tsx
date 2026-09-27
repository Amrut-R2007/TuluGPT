import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';
import { Lesson, LessonProgress } from '../types';
import { CURRICULUM_LESSONS } from '../data/curriculum_data';

interface CurriculumPageProps {
  lessonProgress: Record<string, LessonProgress>;
  onSelectLesson: (lessonId: string) => void;
}

export const CurriculumPage: React.FC<CurriculumPageProps> = ({
  lessonProgress,
  onSelectLesson
}) => {
  const levels = [
    {
      level: 0,
      title: 'Level 0: Absolute Beginner',
      desc: 'Greetings, introducing yourself, yes/no nuances, numbers, family, and food.',
      badge: 'Unlocked',
    },
    {
      level: 1,
      title: 'Level 1: Sentence Formation',
      desc: 'Pronouns, basic tenses, negation (-iji / -ath), location, and polite requests.',
      badge: 'Core Track',
    },
    {
      level: 2,
      title: 'Level 2: Everyday Conversation',
      desc: 'Market dialogues, fish harbor negotiation, directions, restaurant, and time.',
      badge: 'Conversational',
    },
    {
      level: 3,
      title: 'Level 3: Intermediate Mastery',
      desc: 'Conditionals, descriptions, opinions, storytelling, and colloquial idioms.',
      badge: 'Intermediate',
    },
    {
      level: 4,
      title: 'Level 4: Advanced & Literary Tulu',
      desc: 'Proverbs (Gaadhe), formal registers, cultural expressions, and oral history.',
      badge: 'Advanced',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f4e38]/10 text-[#1f4e38] text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Duolingo-Style Structured Progression</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241e1a]">
          Tulu Learning Curriculum
        </h1>
        <p className="text-xs sm:text-sm text-[#776a61] max-w-2xl">
          Follow a pedagogical roadmap grounded in genuine Coastal Karnataka speech. Complete lessons to earn XP, maintain your streak, and unlock conversational fluency.
        </p>
      </div>

      {/* Levels list */}
      <div className="space-y-8">
        {levels.map((lvl) => {
          const lessonsInLevel = CURRICULUM_LESSONS.filter(l => l.level === lvl.level);

          return (
            <div key={lvl.level} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-amber-900/10 gap-1">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#241e1a]">{lvl.title}</h2>
                  <p className="text-xs text-[#776a61]">{lvl.desc}</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#c05c3c]/10 text-[#c05c3c] w-fit">
                  {lvl.badge}
                </span>
              </div>

              {/* Lesson Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {lessonsInLevel.length > 0 ? (
                  lessonsInLevel.map((lesson) => {
                    const isCompleted = lessonProgress[lesson.id]?.status === 'completed';
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between group ${
                          isCompleted
                            ? 'bg-[#f2f7f4] border-[#c5dbcf] hover:border-[#1f4e38]'
                            : 'bg-white border-stone-200 hover:border-[#c05c3c] hover:shadow-xs'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c05c3c]">
                              Lesson {lesson.order_index}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-[#776a61]">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.estimated_minutes} min</span>
                              {isCompleted && (
                                <CheckCircle2 className="w-4 h-4 text-[#1f4e38] fill-[#1f4e38]/10 ml-1" />
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-[#241e1a] group-hover:text-[#c05c3c] transition">
                              {lesson.title}
                            </h3>
                            {lesson.title_tulu && (
                              <p className="text-xs text-[#776a61] font-serif">{lesson.title_tulu}</p>
                            )}
                          </div>

                          <p className="text-xs text-[#544942] line-clamp-2 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#c05c3c]">
                          <span>{isCompleted ? 'Review Lesson' : 'Start Lesson (+20 XP)'}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="sm:col-span-2 p-6 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-1">
                    <p className="text-xs font-semibold text-[#776a61]">
                      Units in development with Rashtrakavi Govinda Pai Samshodhana Kendra corpus
                    </p>
                    <p className="text-[11px] text-stone-400">Complete Level 0 and 1 to unlock advanced units.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
