import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ChevronRight, Clock, BookOpen, Compass, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SupabaseService } from '../services/supabase';
import { LearningLevel, LearningReason } from '../types';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser, loading } = useAuth();

  const [step, setStep] = useState(1);
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('zero');
  const [learningReason, setLearningReason] = useState<LearningReason>('Family');
  const [dailyMinutes, setDailyMinutes] = useState<number>(10);
  const [nativeLanguage, setNativeLanguage] = useState<string>('English');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf8f2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c05c3c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.onboarding_completed) {
    return <Navigate to="/app" replace />;
  }

  const levelOptions: { key: LearningLevel; label: string; desc: string }[] = [
    { key: 'zero', label: 'Absolute Beginner', desc: 'I know zero Tulu and want to start from the ground up.' },
    { key: 'few_words', label: 'A Few Words', desc: 'I know some greetings and numbers, but cannot form sentences.' },
    { key: 'understand_some', label: 'Heritage Listener', desc: 'I understand spoken Tulu when family speaks, but cannot speak confidently.' },
    { key: 'basic_speaker', label: 'Basic Speaker', desc: 'I can manage simple daily interactions with some hesitations.' },
    { key: 'intermediate', label: 'Intermediate', desc: 'I hold everyday conversations and want to improve fluency and grammar.' },
    { key: 'advanced', label: 'Advanced', desc: 'Fluent speaker seeking formal, literary, and cultural refinement.' },
  ];

  const reasonOptions: LearningReason[] = [
    'Family',
    'Culture',
    'Friends',
    'Travel',
    'Heritage',
    'Personal interest',
    'Academic',
    'Other'
  ];

  const minuteOptions = [
    { mins: 5, label: '5 minutes / day', desc: 'Casual: 1 quick bite-sized lesson' },
    { mins: 10, label: '10 minutes / day', desc: 'Steady: Recommended for natural recall' },
    { mins: 15, label: '15 minutes / day', desc: 'Serious: Faster conversational fluency' },
    { mins: 30, label: '30 minutes / day', desc: 'Intense: Complete language immersion' },
  ];

  const languageOptions = ['English', 'Kannada', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Other'];

  const handleFinish = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await SupabaseService.updateUserProfile({
        learning_level: learningLevel,
        learning_reason: learningReason,
        native_language: nativeLanguage,
        onboarding_completed: true,
      });

      await refreshUser();
      navigate('/app', { replace: true });
    } catch (err: any) {
      console.error('Failed to save onboarding settings:', err);
      setSaveError(err.message || 'Failed to save preferences to database. Please retry.');
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#241e1a] selection:bg-[#c05c3c]/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Progress Header */}
        <div className="flex items-center justify-between pb-2 border-b border-amber-900/10">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#c05c3c]">Welcome to TuluGPT</span>
            <span className="text-xs text-[#776a61]">• Step {step} of 4</span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'bg-[#c05c3c] w-8' : s < step ? 'bg-[#1f4e38] w-4' : 'bg-stone-300 w-4'
                }`} 
              />
            ))}
          </div>
        </div>

        {saveError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {saveError}
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-900/10 shadow-xs space-y-6">
          {/* STEP 1: Current Level */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#241e1a]">
                  1. How much Tulu do you currently know?
                </h2>
                <p className="text-xs text-[#776a61] mt-1">
                  We'll adapt the AI tutor's vocabulary and grammar explanations to your baseline.
                </p>
              </div>

              <div className="space-y-2.5">
                {levelOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setLearningLevel(opt.key)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition flex items-start justify-between cursor-pointer ${
                      learningLevel === opt.key 
                        ? 'border-[#c05c3c] bg-[#c05c3c]/10 text-[#241e1a]' 
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-[#544942]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs sm:text-sm">{opt.label}</p>
                      <p className="text-[11px] text-[#776a61] mt-0.5">{opt.desc}</p>
                    </div>
                    {learningLevel === opt.key && (
                      <CheckCircle2 className="w-4 h-4 text-[#c05c3c] shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-xs sm:text-sm hover:bg-[#a74728] shadow-xs transition cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Goal / Motive */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#241e1a]">
                  2. What is your primary motivation?
                </h2>
                <p className="text-xs text-[#776a61] mt-1">
                  Helps our AI suggest relevant contextual dialogues (family, home, travel, markets).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {reasonOptions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setLearningReason(r)}
                    className={`p-3 rounded-2xl text-xs font-semibold border transition text-center cursor-pointer ${
                      learningReason === r 
                        ? 'bg-[#1f4e38] text-white border-[#1f4e38]' 
                        : 'bg-white text-[#544942] border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl border border-stone-300 text-[#544942] font-semibold text-xs hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-xs sm:text-sm hover:bg-[#a74728] shadow-xs transition cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Daily Minutes */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#241e1a]">
                  3. What is your daily learning goal?
                </h2>
                <p className="text-xs text-[#776a61] mt-1">
                  Consistency builds natural Dravidian language intuition.
                </p>
              </div>

              <div className="space-y-2.5">
                {minuteOptions.map((m) => (
                  <button
                    key={m.mins}
                    type="button"
                    onClick={() => setDailyMinutes(m.mins)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition flex items-center justify-between cursor-pointer ${
                      dailyMinutes === m.mins 
                        ? 'border-[#c05c3c] bg-[#c05c3c]/10 text-[#241e1a]' 
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-[#544942]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#c05c3c]" />
                      <div>
                        <p className="font-semibold text-xs sm:text-sm">{m.label}</p>
                        <p className="text-[11px] text-[#776a61]">{m.desc}</p>
                      </div>
                    </div>
                    {dailyMinutes === m.mins && (
                      <CheckCircle2 className="w-4 h-4 text-[#c05c3c] shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 rounded-xl border border-stone-300 text-[#544942] font-semibold text-xs hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-2/3 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-xs sm:text-sm hover:bg-[#a74728] shadow-xs transition cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Native Language */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#241e1a]">
                  4. What is your native or primary language?
                </h2>
                <p className="text-xs text-[#776a61] mt-1">
                  The AI tutor will provide translations and explanations tailored to this language.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {languageOptions.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setNativeLanguage(lang)}
                    className={`p-3 rounded-2xl text-xs font-semibold border transition text-center cursor-pointer ${
                      nativeLanguage === lang 
                        ? 'bg-[#1f4e38] text-white border-[#1f4e38]' 
                        : 'bg-white text-[#544942] border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={isSaving}
                  className="w-1/3 py-3 rounded-xl border border-stone-300 text-[#544942] font-semibold text-xs hover:bg-stone-50 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isSaving}
                  className="w-2/3 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#c05c3c] to-[#943d24] text-white font-semibold text-xs sm:text-sm hover:opacity-95 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#e3b86a]" />
                  <span>{isSaving ? 'Saving to Database...' : 'Launch Tulu Workspace'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
