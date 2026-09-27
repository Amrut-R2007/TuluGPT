import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { CURRENT_WEEKLY_ASSESSMENT } from '../data/assessment_data';
import { AssessmentAttempt } from '../types';
import { LocalStore } from '../services/storage';

interface AssessmentPageProps {
  userId: string;
  onNavigateLesson: (lessonId: string) => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ userId, onNavigateLesson }) => {
  const assessment = CURRENT_WEEKLY_ASSESSMENT;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedAttempt, setSubmittedAttempt] = useState<AssessmentAttempt | null>(null);

  // Flatten questions from all 6 sections
  const allQuestions = assessment.sections.flatMap(sec => 
    sec.questions.map(q => ({ ...q, sectionName: sec.name, weight: sec.weight }))
  );

  const handleSelectOption = (questionId: string, option: string) => {
    if (submittedAttempt) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    let totalQuestions = allQuestions.length;
    let correctCount = 0;
    const sectionCorrect: Record<string, { correct: number; total: number }> = {};

    assessment.sections.forEach(sec => {
      sectionCorrect[sec.name] = { correct: 0, total: sec.questions.length };
    });

    const weakAreas: string[] = [];
    const recommendations: string[] = [];

    allQuestions.forEach(q => {
      const isCorrect = (answers[q.id] || '').trim().toLowerCase() === q.correct_answer.toLowerCase();
      if (isCorrect) {
        correctCount++;
        sectionCorrect[q.sectionName].correct++;
      } else {
        if (!weakAreas.includes(q.sectionName)) {
          weakAreas.push(q.sectionName);
        }
      }
    });

    const overallScore = Math.round((correctCount / totalQuestions) * 100);
    const sectionScores: Record<string, number> = {};

    Object.keys(sectionCorrect).forEach(secName => {
      const stats = sectionCorrect[secName];
      const pct = Math.round((stats.correct / stats.total) * 100);
      sectionScores[secName] = pct;
      if (pct < 80) {
        if (secName === 'Grammar') recommendations.push('Review Lesson 1-1: Dative case and existential vs equational negation (Ath vs Ijji)');
        if (secName === 'Vocabulary') recommendations.push('Practice Flashcards in the Vocabulary Theme tab');
        if (secName === 'Conversation') recommendations.push('Try Conversation mode with TuluGPT focusing on daily restaurant and fish market etiquette');
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Superb performance across all sections! Continue to Level 2 conversational mastery.');
    }

    const attempt: AssessmentAttempt = {
      id: `att-${Date.now()}`,
      user_id: userId,
      assessment_id: assessment.id,
      overall_score: overallScore,
      section_scores: sectionScores,
      weak_areas: weakAreas,
      recommendations: recommendations,
      created_at: new Date().toISOString()
    };

    LocalStore.saveAssessmentAttempt(attempt);
    LocalStore.addXP(50, 'assessment', `Completed Weekly Assessment (${overallScore}%)`);
    setSubmittedAttempt(attempt);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmittedAttempt(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-[#c05c3c]" />
          <span>Week {assessment.week_number} • Year {assessment.year}</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241e1a]">
          {assessment.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#776a61]">
          Evaluates your 6 core competencies: Vocabulary, Grammar, Translation, Sentence formation, Comprehension, and Conversation.
        </p>
      </div>

      {/* RESULTS DISPLAY IF SUBMITTED */}
      {submittedAttempt ? (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1f4e38]/10 text-[#1f4e38] font-bold text-3xl mx-auto">
              {submittedAttempt.overall_score}%
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#241e1a]">
                Assessment Complete!
              </h2>
              <p className="text-xs text-[#776a61] mt-1">
                +50 XP added to your learning journey.
              </p>
            </div>

            {/* Section Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left pt-2">
              {Object.entries(submittedAttempt.section_scores).map(([sec, pct]) => (
                <div key={sec} className="p-3.5 rounded-2xl bg-[#fbf8f2] border border-stone-200 space-y-1">
                  <span className="text-[11px] font-semibold text-[#776a61]">{sec}</span>
                  <div className="text-lg font-bold text-[#241e1a]">{pct}%</div>
                  <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${pct >= 80 ? 'bg-[#1f4e38]' : 'bg-[#c05c3c]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Weak Areas & Recommendations */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left space-y-2">
              <h3 className="font-serif text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#c05c3c]" />
                <span>Linguistic Diagnosis & Recommendations</span>
              </h3>
              <ul className="list-disc list-inside text-xs text-amber-900/90 space-y-1">
                {submittedAttempt.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleRetake}
              className="px-6 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      ) : (
        /* ASSESSMENT QUESTIONS */
        <div className="space-y-6">
          {assessment.sections.map((sec, secIdx) => (
            <div key={sec.id} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif text-lg font-bold text-[#241e1a]">
                  Section {secIdx + 1}: {sec.name}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-[#776a61]">
                  Weight: {sec.weight}%
                </span>
              </div>

              <div className="space-y-6">
                {sec.questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-3">
                    <p className="text-sm font-semibold text-[#241e1a]">
                      {qIdx + 1}. {q.prompt}
                    </p>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt)}
                            className={`p-3 rounded-xl text-left text-xs font-medium border transition ${
                              answers[q.id] === opt 
                                ? 'border-[#c05c3c] bg-[#c05c3c]/10 text-[#c05c3c] font-semibold' 
                                : 'border-stone-200 bg-white hover:bg-stone-50 text-[#544942]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < allQuestions.length}
              className="w-full py-4 rounded-xl bg-[#c05c3c] text-white font-semibold text-sm hover:bg-[#a74728] shadow-sm transition disabled:opacity-40"
            >
              Submit Assessment ({Object.keys(answers).length} / {allQuestions.length} Answered)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
