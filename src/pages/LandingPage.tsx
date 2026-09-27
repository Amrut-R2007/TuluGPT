import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Flame, 
  Volume2, 
  Heart,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onStartLearning: () => void;
  onExploreCurriculum: () => void;
  onQuickStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartLearning, 
  onExploreCurriculum,
  onQuickStart
}) => {
  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#241e1a] selection:bg-[#c05c3c]/20">
      {/* Top Banner Navigation */}
      <nav className="border-b border-amber-900/10 px-4 sm:px-8 py-4 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c05c3c] to-[#943d24] flex items-center justify-center text-white font-bold text-xl shadow-xs border border-[#e3b86a]/40">
            ತು
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#241e1a]">TuluGPT</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1f4e38]/10 text-[#1f4e38]">
                Canara Heritage AI
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreCurriculum}
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-medium text-[#544942] hover:text-[#241e1a] hover:bg-amber-100/50 transition cursor-pointer"
          >
            Explore Curriculum
          </button>
          <button
            onClick={onStartLearning}
            className="px-5 py-2.5 rounded-xl bg-[#c05c3c] text-white text-sm font-semibold hover:bg-[#a74728] shadow-sm transition active:scale-[0.98] cursor-pointer"
          >
            Start Learning
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 max-w-5xl mx-auto text-center">
        {/* Subtle Cultural Motif Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#8c381f] text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-[#c05c3c] animate-ping" />
          <span>Coastal Karnataka • Mangaluru • Udupi • Kasaragod</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#241e1a] leading-[1.15]">
          Learn Tulu. Speak Tulu.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c05c3c] via-[#b88728] to-[#1f4e38]">
            Keep Tulu alive.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-[#544942] max-w-2xl mx-auto font-normal leading-relaxed">
          An AI-powered Tulu learning companion designed to take you from your first word to confident conversation.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStartLearning}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#c05c3c] text-white font-semibold text-base shadow-md hover:bg-[#a74728] transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={onExploreCurriculum}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-stone-300 text-[#241e1a] font-semibold text-base hover:bg-stone-50 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#c05c3c]" />
            <span>Explore Curriculum</span>
          </button>
          <button
            onClick={onQuickStart}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1f4e38]/10 text-[#1f4e38] border border-[#1f4e38]/20 font-semibold text-base hover:bg-[#1f4e38]/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Instant Quick Start</span>
          </button>
        </div>

        {/* Visual Showcase Card with Authentic Coastal Karnataka Aesthetics */}
        <div className="mt-14 p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#e3b86a]/30 to-[#c05c3c]/10 border border-amber-900/10 shadow-xl max-w-4xl mx-auto">
          <div className="rounded-2xl bg-white p-6 sm:p-8 text-left border border-amber-900/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c05c3c]">Interactive Language Tutor</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#241e1a] mt-1">
                  More than just translation: Complete language immersion
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs bg-[#1f4e38]/10 text-[#1f4e38] font-bold px-3 py-1.5 rounded-full w-fit">
                <span>7 AI Teaching Modes</span>
              </div>
            </div>

            {/* Showcase Chat snippet */}
            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 shrink-0">
                  You
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-xs bg-stone-100 text-xs sm:text-sm text-[#241e1a]">
                  "How do I say 'I want coffee' in Tulu? Is it 'Yaan kaapi bodu'?"
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#c05c3c] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ತು
                </div>
                <div className="p-4 rounded-2xl rounded-tl-xs bg-[#fdf5f2] border border-[#f5d4c8] text-xs sm:text-sm text-[#241e1a] space-y-2">
                  <p className="font-bold text-[#c05c3c] flex items-center gap-1.5">
                    <span>✨</span> TuluGPT Tutor (Correct Me Mode)
                  </p>
                  <p>
                    • <strong>Your sentence:</strong> <em>Yaan kaapi bodu</em><br />
                    • <strong>Corrected:</strong> ಎಂಕ್ ಕಾಪಿ ಬೋಡು (<em>Enk kaapi bodu</em>)<br />
                    • <strong>Why:</strong> In Tulu, expressions of desire or necessity ("bodu") require the <strong>dative subject</strong> (<em>Enk</em> = "to me") rather than the nominative (<em>Yaan</em> = "I").
                  </p>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-[#f5d4c8] text-xs text-[#544942]">
                    👉 <strong>Now try:</strong> How would you say "I want tender coconut (bonda)"?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Learning */}
      <section className="py-16 bg-white border-y border-amber-900/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1f4e38]">Comprehensive Pedagogy</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#241e1a] mt-2">
              Designed for real fluency, not rote memorization
            </h2>
            <p className="text-sm sm:text-base text-[#776a61] mt-2">
              From absolute beginners who know zero Tulu to heritage speakers wanting to speak with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#fbf8f2] border border-amber-900/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#c05c3c]/10 text-[#c05c3c] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#241e1a]">Curated Tulu Curriculum</h3>
              <p className="text-xs text-[#544942] leading-relaxed">
                Step-by-step units across 5 progressive levels. Master essential greetings, market dialogues, numbers, noun cases, and natural sentence structures.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fbf8f2] border border-amber-900/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1f4e38]/10 text-[#1f4e38] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#241e1a]">Linguistic Accuracy First</h3>
              <p className="text-xs text-[#544942] leading-relaxed">
                TuluGPT never fabricates words. Guided by the verified Tulu Lexicon corpus with clear distinction between Coastal, Shivalli, and regional dialects.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fbf8f2] border border-amber-900/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4a359]/20 text-[#93681f] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#241e1a]">Weekly Assessments & XP</h3>
              <p className="text-xs text-[#544942] leading-relaxed">
                Track your active streaks, earn cultural milestone badges, identify weak grammatical areas, and participate in an opt-in privacy-respecting leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center text-[#241e1a] mb-8">
          Who is TuluGPT for?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Zero Knowledge Beginners', desc: 'Starting your very first journey into Dravidian languages and coastal culture.' },
            { title: 'Heritage Listeners', desc: 'Grew up hearing grandparents speak Tulu, understand everything, but want the confidence to speak.' },
            { title: 'Travelers & Residents', desc: 'Living, studying, or working in Mangaluru, Udupi, or Manipal wishing to connect with locals.' },
            { title: 'Intermediate Speakers', desc: 'Looking to expand vocabulary, master idioms, and eliminate Kannada-influenced grammar habits.' },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-white border border-stone-200 flex items-start gap-3">
              <ChevronRight className="w-5 h-5 text-[#c05c3c] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#241e1a]">{item.title}</h4>
                <p className="text-xs text-[#776a61] mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-900/10 py-10 bg-[#f5ece1] text-xs text-[#776a61] px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-serif font-bold text-base text-[#241e1a]">TuluGPT (ತುಳು ಭಾಷೆ)</p>
          <p>
            Developed with dedication by <strong>Amrut</strong> (Developer & Co-CEO) & <strong>Anurag</strong> (Ideator & Co-CEO).
          </p>
          <p className="text-[11px] text-[#776a61]">
            Dedicated to the preservation, documentation, and digital revitalization of the Tulu language.
          </p>
        </div>
      </footer>
    </div>
  );
};
