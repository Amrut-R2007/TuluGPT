import React from 'react';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Compass, 
  Mail, 
  ExternalLink,
  Code,
  Lightbulb,
  CheckCircle2,
  Users
} from 'lucide-react';

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export const AboutPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#8c381f] text-xs font-semibold">
          <span>🌿</span> <span>Coastal Karnataka Heritage & Technology</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#241e1a]">
          About TuluGPT
        </h1>
        <p className="text-sm sm:text-base text-[#544942] leading-relaxed">
          "We wanted to make learning Tulu easier for people who may have grown up hearing the language but never learned to speak it, as well as people with no prior knowledge of Tulu."
        </p>
      </div>

      {/* Leadership & Co-Founders Section */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c05c3c]">Leadership</span>
          <h2 className="font-serif text-2xl font-bold text-[#241e1a]">Meet the Founders</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Amrut (Developer & Co-CEO) */}
          <div className="p-6 rounded-3xl bg-white border border-amber-900/15 shadow-sm space-y-5">
            {/* Photo Placeholder */}
            <div className="relative aspect-4/3 w-full rounded-2xl bg-gradient-to-br from-[#c05c3c]/15 to-[#e3b86a]/20 border border-amber-900/10 overflow-hidden flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#c05c3c] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                A
              </div>
              <span className="mt-2 text-xs font-mono font-bold text-[#8c381f]">[AMRUT_PHOTO]</span>
              <p className="text-[11px] text-[#776a61] mt-1 max-w-xs">
                Insert photograph of Amrut (Developer & Co-CEO)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#241e1a]">Amrut</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#c05c3c]/10 text-[#c05c3c]">
                  Developer & Co-CEO
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#1f4e38] font-medium">
                <Code className="w-3.5 h-3.5" />
                <span>Full-Stack Architecture & AI Product Engineering</span>
              </div>
            </div>

            {/* Editable Details Placeholder */}
            <div className="p-3.5 rounded-xl bg-[#fbf8f2] border border-stone-200 text-xs text-[#544942] space-y-2">
              <p>
                <strong>College / Institution:</strong> [Editable placeholder: e.g. Engineering / Tech Background]
              </p>
              <p>
                <strong>Background:</strong> [Editable placeholder: Passionate software engineer dedicated to building high-performance AI applications and preserving regional linguistic heritage through modern software.]
              </p>
            </div>

            {/* Social & Contact Links */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a 
                href="mailto:amrut@tulugpt.org" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>[amrut@tulugpt.org]</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>[LinkedIn Profile]</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 transition"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>[Instagram Profile]</span>
              </a>
            </div>
          </div>

          {/* Card 2: Anurag (Ideator & Co-CEO) */}
          <div className="p-6 rounded-3xl bg-white border border-amber-900/15 shadow-sm space-y-5">
            {/* Photo Placeholder */}
            <div className="relative aspect-4/3 w-full rounded-2xl bg-gradient-to-br from-[#1f4e38]/15 to-[#e3b86a]/20 border border-amber-900/10 overflow-hidden flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-[#1f4e38] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                A
              </div>
              <span className="mt-2 text-xs font-mono font-bold text-[#1f4e38]">[ANURAG_PHOTO]</span>
              <p className="text-[11px] text-[#776a61] mt-1 max-w-xs">
                Insert photograph of Anurag (Ideator & Co-CEO)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#241e1a]">Anurag</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1f4e38]/10 text-[#1f4e38]">
                  Ideator & Co-CEO
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#c05c3c] font-medium">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Vision, Cultural Curation & Product Concept</span>
              </div>
            </div>

            {/* Editable Details Placeholder */}
            <div className="p-3.5 rounded-xl bg-[#fbf8f2] border border-stone-200 text-xs text-[#544942] space-y-2">
              <p>
                <strong>College / Institution:</strong> [Editable placeholder: e.g. Academic / Management Background]
              </p>
              <p>
                <strong>Background:</strong> [Editable placeholder: Cultural visionary who conceived the necessity for a modern, accurate AI companion to bridge the generational divide in Tulu language learning.]
              </p>
            </div>

            {/* Social & Contact Links */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a 
                href="mailto:anurag@tulugpt.org" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>[anurag@tulugpt.org]</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>[LinkedIn Profile]</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 transition"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>[Instagram Profile]</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Story, Mission & Architecture Narrative */}
      <div className="space-y-8">
        {/* Our Story & Why We Created TuluGPT */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c05c3c]">Genesis</span>
          <h2 className="font-serif text-2xl font-bold text-[#241e1a]">Our Story & Why We Created TuluGPT</h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#544942] leading-relaxed">
            <p>
              Tulu (ತುಳು ಭಾಷೆ) is an ancient, expressive Dravidian language spoken predominantly in Coastal Karnataka (Dakshina Kannada and Udupi districts) and Northern Kerala (Kasaragod). Despite its rich oral literature, legendary folk epics like the <em>Siri Paaddanas</em>, and vibrant traditions like Bhoota Kola and Yakshagana, formal digital learning tools have remained virtually nonexistent.
            </p>
            <p>
              Millions of young people today grow up in metropolitan cities across India and the globe hearing Tulu spoken at home by parents and grandparents. They understand the jokes, the affection, and the emotions, but often lack the confidence to formulate sentences of their own.
            </p>
            <p className="font-medium text-[#241e1a] italic bg-[#fdf5f2] p-4 rounded-xl border border-[#f5d4c8]">
              "We realized that without an accessible, patient, 24/7 interactive tutor, a profound linguistic tradition risks becoming a passive listening language for upcoming generations. TuluGPT was built to turn passive understanding into confident, fluent speech."
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#c05c3c]/10 text-[#c05c3c] flex items-center justify-center font-bold">
              🎯
            </div>
            <h3 className="font-serif text-xl font-bold text-[#241e1a]">Our Mission</h3>
            <p className="text-xs text-[#544942] leading-relaxed">
              To provide a free, reliable, culturally grounded AI language-learning platform that empowers anyone—from an absolute beginner to an advanced speaker—to understand, speak, and write authentic Tulu with confidence.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1f4e38]/10 text-[#1f4e38] flex items-center justify-center font-bold">
              🌅
            </div>
            <h3 className="font-serif text-xl font-bold text-[#241e1a]">Our Vision</h3>
            <p className="text-xs text-[#544942] leading-relaxed">
              A vibrant, intergenerational community where regional languages thrive alongside modern artificial intelligence, fostering cultural pride and preserving native linguistic diversity for generations to come.
            </p>
          </div>
        </section>

        {/* Learning Method & How It Works */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1f4e38]">Pedagogy</span>
          <h2 className="font-serif text-2xl font-bold text-[#241e1a]">How TuluGPT Works & Our Learning Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-stone-200 space-y-2">
              <h4 className="font-bold text-sm text-[#241e1a]">1. Active Recall</h4>
              <p className="text-xs text-[#544942]">
                Rather than merely translating, the AI prompts you to produce Tulu sentences and provides constructive grammatical correction.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-stone-200 space-y-2">
              <h4 className="font-bold text-sm text-[#241e1a]">2. Dialect Awareness</h4>
              <p className="text-xs text-[#544942]">
                Respectfully distinguishes between Coastal/Common Tulu, Shivalli Brahmin, and Southern variations without claiming one is universally superior.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#fbf8f2] border border-stone-200 space-y-2">
              <h4 className="font-bold text-sm text-[#241e1a]">3. Cultural Context</h4>
              <p className="text-xs text-[#544942]">
                Learn everyday conversational etiquette: greeting with "Solmelu", asking "Vanas aanda?", and taking leave with "Barpe" instead of "Pope".
              </p>
            </div>
          </div>
        </section>

        {/* Accuracy & Responsible AI */}
        <section className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-[#c05c3c]" />
            <span>Accuracy & Responsible AI Principles</span>
          </div>
          <p className="text-xs text-[#544942] leading-relaxed">
            AI language models frequently hallucinate or substitute dominant neighbouring languages (like Kannada) for Tulu. TuluGPT addresses this through a strict server-side constraint system:
          </p>
          <ul className="list-disc list-inside text-xs text-[#544942] space-y-1">
            <li>Never manufactures confidence when uncertain.</li>
            <li>Prioritizes the curated Rashtrakavi Govinda Pai Samshodhana Kendra Tulu Lexicon.</li>
            <li>Incorporates an active user error-reporting loop with administrative review.</li>
            <li>Refuses to silently replace Tulu roots with Kannada terms.</li>
          </ul>
        </section>

        {/* Contact Us */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#241e1a]">Connect With Us</h2>
          <p className="text-xs sm:text-sm text-[#776a61] max-w-md mx-auto">
            Have verified Tulu linguistic resources, feedback, or ideas for collaboration? We would love to hear from you.
          </p>
          <div className="flex justify-center gap-4 text-xs font-semibold">
            <a 
              href="mailto:contact@tulugpt.org" 
              className="px-5 py-2.5 rounded-xl bg-[#c05c3c] text-white hover:bg-[#a74728] transition"
            >
              contact@tulugpt.org
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
