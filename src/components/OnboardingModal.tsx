import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { UserProfile, LearningLevel, LearningReason, LearningStyle } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  user: UserProfile;
  onComplete: (updated: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('zero');
  const [learningReason, setLearningReason] = useState<LearningReason>('Family');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('mixed');
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true);
  const [socialShoutoutOptIn, setSocialShoutoutOptIn] = useState(true);

  if (!isOpen) return null;

  const levelOptions: { key: LearningLevel; label: string; desc: string }[] = [
    { key: 'zero', label: 'I know nothing', desc: 'Absolute beginner starting from scratch' },
    { key: 'few_words', label: 'I know a few words', desc: 'Can identify a few everyday words but cannot form sentences' },
    { key: 'understand_some', label: 'I understand some Tulu', desc: 'Can follow conversations but struggle to speak' },
    { key: 'basic_speaker', label: 'I can speak basic Tulu', desc: 'Can manage simple phrases and needs' },
    { key: 'intermediate', label: 'I am intermediate', desc: 'Can hold everyday conversations with some gaps' },
    { key: 'advanced', label: 'I am advanced', desc: 'Fluent speaker seeking literary & formal refinement' },
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

  const styleOptions: { key: LearningStyle; label: string; desc: string }[] = [
    { key: 'conversation', label: 'Conversation First', desc: 'Focus on natural spoken dialogues and speaking practice' },
    { key: 'grammar', label: 'Grammar & Rules', desc: 'Deep dive into sentence structure, noun cases & verb forms' },
    { key: 'vocabulary', label: 'Vocabulary Themes', desc: 'Learn themed word sets (market, food, home, relations)' },
    { key: 'mixed', label: 'Balanced / Mixed', desc: 'A holistic combination of conversation, grammar, and vocab' },
  ];

  const handleFinish = () => {
    onComplete({
      learning_level: learningLevel,
      learning_reason: learningReason,
      preferred_learning_style: learningStyle,
      leaderboard_opt_in: leaderboardOptIn,
      social_shoutout_opt_in: socialShoutoutOptIn,
      onboarding_completed: true,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-[#fbf8f2] p-6 sm:p-8 shadow-2xl border border-amber-900/10 max-h-[90vh] overflow-y-auto">
        {/* Progress Bar & Skip */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#c05c3c]">Welcome to TuluGPT</span>
            <span className="text-xs text-[#776a61]">• Step {step} of 3</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    s === step ? 'bg-[#c05c3c] w-8' : s < step ? 'bg-[#1f4e38]' : 'bg-stone-300'
                  }`} 
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs text-[#776a61] hover:text-[#c05c3c] font-medium underline transition"
            >
              Skip
            </button>
          </div>
        </div>

        {/* STEP 1: Current Knowledge & Motive */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#241e1a]">1. How much Tulu do you currently know?</h3>
              <p className="text-xs text-[#776a61] mt-1">We will adapt the curriculum and AI conversation to your baseline.</p>
              <div className="mt-3 space-y-2">
                {levelOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setLearningLevel(opt.key)}
                    className={`w-full p-3 rounded-xl text-left border transition flex items-start justify-between ${
                      learningLevel === opt.key 
                        ? 'border-[#c05c3c] bg-[#c05c3c]/10 text-[#241e1a]' 
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-[#544942]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs text-[#776a61] mt-0.5">{opt.desc}</p>
                    </div>
                    {learningLevel === opt.key && <CheckCircle2 className="w-5 h-5 text-[#c05c3c] shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#241e1a]">2. Why are you learning Tulu?</h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {reasonOptions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setLearningReason(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      learningReason === r 
                        ? 'bg-[#1f4e38] text-white border-[#1f4e38]' 
                        : 'bg-white text-[#544942] border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#c05c3c] text-white font-medium hover:bg-[#a74728] transition"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Learning Style */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#241e1a]">3. What is your preferred learning style?</h3>
              <p className="text-xs text-[#776a61] mt-1">You can change this or switch chat modes anytime.</p>
              <div className="mt-4 space-y-2.5">
                {styleOptions.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setLearningStyle(s.key)}
                    className={`w-full p-3.5 rounded-xl text-left border transition flex items-start justify-between ${
                      learningStyle === s.key 
                        ? 'border-[#c05c3c] bg-[#c05c3c]/10 text-[#241e1a]' 
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-[#544942]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm">{s.label}</p>
                      <p className="text-xs text-[#776a61] mt-0.5">{s.desc}</p>
                    </div>
                    {learningStyle === s.key && <CheckCircle2 className="w-5 h-5 text-[#c05c3c] shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl border border-stone-300 bg-white text-[#544942] font-medium text-sm hover:bg-stone-50 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#c05c3c] text-white font-medium hover:bg-[#a74728] transition"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Privacy & Leaderboard Consent */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#241e1a]">4. Leaderboard & Community Participation</h3>
              <p className="text-xs text-[#776a61] mt-1">
                TuluGPT values your privacy. Community features are strictly opt-in and never mandatory.
              </p>
            </div>

            <div className="space-y-4">
              {/* Question 4: Leaderboard Opt-in */}
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-[#241e1a]">4. Do you want to participate in the weekly leaderboard?</h4>
                    <p className="text-xs text-[#776a61] mt-1">
                      Shows your username, XP, and streak on the public learner board. Email is never exposed.
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setLeaderboardOptIn(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        leaderboardOptIn 
                          ? 'bg-[#1f4e38] text-white border-[#1f4e38]' 
                          : 'bg-stone-100 text-stone-600 border-transparent'
                      }`}
                    >
                      YES
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeaderboardOptIn(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        !leaderboardOptIn 
                          ? 'bg-amber-800 text-white border-amber-800' 
                          : 'bg-stone-100 text-stone-600 border-transparent'
                      }`}
                    >
                      NO
                    </button>
                  </div>
                </div>
              </div>

              {/* Question 5: Social shoutout consent */}
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-[#241e1a]">5. Consent to weekly community shoutouts?</h4>
                    <p className="text-xs text-[#776a61] mt-1">
                      If you rank as a Top Performer, do you consent to having your public username featured in the weekly "Tulu Champion" community card?
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSocialShoutoutOptIn(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        socialShoutoutOptIn 
                          ? 'bg-[#1f4e38] text-white border-[#1f4e38]' 
                          : 'bg-stone-100 text-stone-600 border-transparent'
                      }`}
                    >
                      YES
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialShoutoutOptIn(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        !socialShoutoutOptIn 
                          ? 'bg-amber-800 text-white border-amber-800' 
                          : 'bg-stone-100 text-stone-600 border-transparent'
                      }`}
                    >
                      NO
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl border border-stone-300 bg-white text-[#544942] font-medium text-sm hover:bg-stone-50 transition"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#c05c3c] to-[#943d24] text-white font-medium hover:opacity-95 shadow-sm transition"
              >
                <Sparkles className="w-4 h-4 text-[#e3b86a]" />
                <span>Begin My Tulu Journey</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
