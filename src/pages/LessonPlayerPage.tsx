import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  Award,
  RotateCcw
} from 'lucide-react';
import { Lesson, VocabularyItem } from '../types';
import { VERIFIED_VOCABULARY } from '../data/verified_vocabulary';
import { LocalStore } from '../services/storage';

interface LessonPlayerPageProps {
  lesson: Lesson;
  onBack: () => void;
  onCompleteLesson: (lessonId: string, score: number) => void;
}

export const LessonPlayerPage: React.FC<LessonPlayerPageProps> = ({
  lesson,
  onBack,
  onCompleteLesson
}) => {
  const [currentStep, setCurrentStep] = useState<'concept' | 'vocab' | 'quiz' | 'completed'>('concept');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);

  // Retrieve vocabulary items attached to this lesson
  const vocabItems = VERIFIED_VOCABULARY.filter(v => lesson.vocabulary_ids.includes(v.id));
  const currentQuestion = lesson.practice_questions[currentQuestionIndex];

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;
    const userAnswer = (selectedOption || textAnswer).trim().toLowerCase();
    const isCorrect = userAnswer === currentQuestion.correct_answer.toLowerCase();

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({
        isCorrect: true,
        message: `Correct! ${currentQuestion.explanation}`
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: `Not quite. Correct answer: "${currentQuestion.correct_answer}". ${currentQuestion.explanation}`
      });
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setSelectedOption(null);
    setTextAnswer('');

    if (currentQuestionIndex + 1 < lesson.practice_questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed all questions
      setCurrentStep('completed');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      const finalScorePct = Math.round(((score + (feedback?.isCorrect ? 1 : 0)) / lesson.practice_questions.length) * 100);
      onCompleteLesson(lesson.id, finalScorePct);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#776a61] hover:text-[#241e1a] p-2 rounded-lg hover:bg-stone-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Curriculum</span>
        </button>

        <div className="flex items-center gap-2">
          {['concept', 'vocab', 'quiz'].map((st, i) => (
            <div
              key={st}
              className={`h-2 rounded-full transition-all ${
                currentStep === st 
                  ? 'w-8 bg-[#c05c3c]' 
                  : (currentStep === 'completed' || (currentStep === 'quiz' && i < 2) || (currentStep === 'vocab' && i === 0))
                    ? 'w-5 bg-[#1f4e38]' 
                    : 'w-4 bg-stone-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: CONCEPT & OBJECTIVES */}
      {currentStep === 'concept' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#c05c3c]">
              Lesson {lesson.order_index} • Objective
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241e1a] mt-1">
              {lesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#544942] mt-2 leading-relaxed">
              {lesson.objective}
            </p>
          </div>

          {lesson.grammar_concept && (
            <div className="p-5 rounded-2xl bg-[#fdf5f2] border border-[#f5d4c8] space-y-3">
              <h3 className="font-serif text-base font-bold text-[#c05c3c] flex items-center gap-2">
                <span>📖</span> {lesson.grammar_concept.name}
              </h3>
              <p className="text-xs text-[#544942] leading-relaxed whitespace-pre-wrap">
                {lesson.grammar_concept.explanation}
              </p>

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#776a61]">Key Rules:</span>
                <ul className="list-disc list-inside text-xs text-[#241e1a] space-y-1">
                  {lesson.grammar_concept.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              {lesson.grammar_concept.examples.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#776a61]">Examples:</span>
                  {lesson.grammar_concept.examples.map((ex, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-[#f5d4c8] text-xs space-y-0.5">
                      <p className="font-bold text-[#241e1a]">{ex.tulu} <span className="font-normal italic text-[#776a61]">({ex.transliteration})</span></p>
                      <p className="text-[#544942]">{ex.english}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setCurrentStep('vocab')}
            className="w-full py-3.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-sm hover:bg-[#a74728] shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>Learn Core Vocabulary</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: VOCABULARY FLASHCARDS */}
      {currentStep === 'vocab' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1f4e38]">
              Step 2 • Core Vocabulary
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#241e1a]">
              Key Words for this Lesson
            </h2>
            <p className="text-xs text-[#776a61]">
              Review each verified Tulu word, its coastal transliteration, and authentic usage context.
            </p>

            <div className="space-y-3 pt-2">
              {vocabItems.map((v) => (
                <div key={v.id} className="p-4 rounded-2xl bg-[#fbf8f2] border border-stone-200 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-[#241e1a]">{v.word}</h4>
                      <p className="text-xs font-medium text-[#c05c3c]">{v.transliteration}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1f4e38]/10 text-[#1f4e38]">
                      {v.part_of_speech}
                    </span>
                  </div>
                  <p className="text-xs text-[#544942]"><strong>Meaning:</strong> {v.meaning}</p>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-[#241e1a]">
                    <span className="text-[#776a61]">Example: </span>
                    <span className="font-semibold">{v.example_tulu}</span>
                    <span className="italic text-[#776a61]"> ({v.example_transliteration})</span>
                    <p className="text-[#544942] text-[11px] mt-0.5">"{v.example_english}"</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentStep('quiz')}
              className="w-full mt-4 py-3.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-sm hover:bg-[#a74728] shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Practice & Recall Quiz ({lesson.practice_questions.length} Questions)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INTERACTIVE PRACTICE QUIZ */}
      {currentStep === 'quiz' && currentQuestion && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c05c3c]">
              Question {currentQuestionIndex + 1} of {lesson.practice_questions.length}
            </span>
            <span className="text-xs font-bold text-[#1f4e38]">
              Score: {score}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#241e1a]">
              {currentQuestion.prompt}
            </h3>
            {currentQuestion.prompt_tulu && (
              <p className="text-sm font-serif text-[#776a61]">{currentQuestion.prompt_tulu}</p>
            )}
          </div>

          {/* Question inputs: Options or Text */}
          {currentQuestion.options && currentQuestion.options.length > 0 ? (
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={feedback !== null}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full p-3.5 rounded-xl text-left text-xs sm:text-sm font-medium border transition ${
                    selectedOption === opt
                      ? 'border-[#c05c3c] bg-[#c05c3c]/10 text-[#c05c3c]'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-[#241e1a]'
                  } disabled:opacity-80`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={textAnswer}
                disabled={feedback !== null}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your Tulu answer here..."
                className="w-full p-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c05c3c]"
              />
            </div>
          )}

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm space-y-1 ${
                feedback.isCorrect 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                  : 'bg-amber-50 border border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <HelpCircle className="w-4 h-4 text-amber-700" />}
                <span>{feedback.isCorrect ? 'Nicely done!' : 'Linguistic Insight'}</span>
              </div>
              <p>{feedback.message}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2">
            {!feedback ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedOption && !textAnswer.trim()}
                className="w-full py-3.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-sm hover:bg-[#a74728] shadow-sm transition disabled:opacity-40"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 rounded-xl bg-[#1f4e38] text-white font-semibold text-sm hover:bg-[#143525] shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>{currentQuestionIndex + 1 < lesson.practice_questions.length ? 'Next Question' : 'Complete Lesson'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: COMPLETED SCREEN */}
      {currentStep === 'completed' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#c05c3c] to-[#943d24] text-white flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8 text-[#e3b86a]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1f4e38]">
              Lesson Finished!
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#241e1a]">
              Solmelu! You completed {lesson.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#776a61] max-w-md mx-auto">
              Your dedication keeps Tulu alive. You gained real sentence comprehension and active vocabulary.
            </p>
          </div>

          {/* Rewards pill */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-[#c05c3c]" />
              <span>+20 XP Added</span>
            </div>
            <div className="w-px h-4 bg-amber-900/20" />
            <div className="flex items-center gap-1.5 font-bold text-[#1f4e38]">
              <span>🔥 Streak Maintained</span>
            </div>
          </div>

          <div>
            <button
              onClick={onBack}
              className="px-8 py-3.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-sm hover:bg-[#a74728] shadow-sm transition"
            >
              Back to Curriculum
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
