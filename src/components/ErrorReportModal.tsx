import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TuluErrorReport } from '../types';

interface ErrorReportModalProps {
  isOpen: boolean;
  messageId?: string;
  userInput?: string;
  aiResponse?: string;
  onClose: () => void;
  onSubmit: (report: {
    message_id?: string;
    reason: TuluErrorReport['reason'];
    description: string;
    user_input?: string;
    ai_response?: string;
  }) => Promise<void>;
}

export const ErrorReportModal: React.FC<ErrorReportModalProps> = ({
  isOpen,
  messageId,
  userInput,
  aiResponse,
  onClose,
  onSubmit
}) => {
  const [reason, setReason] = useState<TuluErrorReport['reason']>('wrong_translation');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reasonsList: { value: TuluErrorReport['reason']; label: string; desc: string }[] = [
    { value: 'wrong_translation', label: 'Wrong Translation', desc: 'The English or Tulu translation is incorrect or misleading' },
    { value: 'wrong_grammar', label: 'Wrong Grammar', desc: 'Incorrect tense, noun case, verb ending, or agreement' },
    { value: 'wrong_pronunciation', label: 'Wrong Pronunciation / Transliteration', desc: 'The phonetic spelling does not match spoken Tulu' },
    { value: 'wrong_dialect', label: 'Wrong Dialect / Regional Mismatch', desc: 'Misidentifies Coastal vs Brahmin vs Southern dialect' },
    { value: 'made_up_word', label: 'Made-Up Word / Hallucination', desc: 'The word does not exist in any known Tulu dictionary or usage' },
    { value: 'other', label: 'Other Issue', desc: 'Kannada substitution, cultural inaccuracy, etc.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        message_id: messageId,
        reason,
        description,
        user_input: userInput,
        ai_response: aiResponse,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#fbf8f2] p-6 shadow-2xl border border-amber-900/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#1f4e38] mx-auto" />
            <h3 className="text-lg font-bold text-[#241e1a]">Solmelu! Report Submitted</h3>
            <p className="text-xs text-[#776a61] max-w-xs mx-auto">
              Our linguistic admin team will review this report against the Tulu Nighantu corpus to preserve accuracy.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 text-[#c05c3c]" />
              <h3 className="font-serif text-lg font-bold text-[#241e1a]">Report Tulu Linguistic Inaccuracy</h3>
            </div>
            <p className="text-xs text-[#776a61]">
              Accuracy is our top priority. Help us eliminate AI hallucinations and ensure authentic Tulu is taught.
            </p>

            {aiResponse && (
              <div className="p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-xs text-[#544942] max-h-24 overflow-y-auto">
                <span className="font-semibold text-[#241e1a]">AI Response Snippet: </span>
                {aiResponse.substring(0, 160)}...
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#241e1a] mb-1.5">What type of error is this?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {reasonsList.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    className={`p-2.5 rounded-xl text-left border transition text-xs ${
                      reason === r.value 
                        ? 'border-[#c05c3c] bg-[#c05c3c]/10 font-semibold text-[#c05c3c]' 
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-[#544942]'
                    }`}
                  >
                    <div>{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#241e1a] mb-1.5">
                Explain the correction or verified native usage:
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. In Mangaluru we say 'Vanas aanda' rather than Kannada-influenced phrases, and the verb ending should be..."
                className="w-full p-3 rounded-xl border border-stone-200 bg-white text-xs text-[#241e1a] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c05c3c]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-xs font-medium text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="px-5 py-2 rounded-xl bg-[#c05c3c] text-white text-xs font-medium hover:bg-[#a74728] transition disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
