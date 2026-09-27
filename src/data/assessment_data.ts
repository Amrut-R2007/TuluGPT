import { WeeklyAssessment } from '../types';

export const CURRENT_WEEKLY_ASSESSMENT: WeeklyAssessment = {
  id: 'assessment-w1-2026',
  week_number: 39,
  year: 2026,
  title: 'Weekly Tulu Assessment: Foundations & Practical Daily Use',
  sections: [
    {
      id: 'sec-vocab',
      name: 'Vocabulary',
      weight: 15,
      questions: [
        {
          id: 'q-ass-v1',
          prompt: 'Which word is the authentic native Tulu equivalent of "Respectful Greetings / Salutations"?',
          options: ['Solmelu', 'Pranama', 'Shukriya', 'Namaste'],
          correct_answer: 'Solmelu',
          explanation: '"Solmelu" is the timeless Tulu expression for respect and gratitude.'
        },
        {
          id: 'q-ass-v2',
          prompt: 'What does "Bonda" mean in coastal Tulunadu daily conversation?',
          options: ['Deep-fried snack', 'Tender green coconut', 'Mango pickle', 'Clay pot'],
          correct_answer: 'Tender green coconut',
          explanation: 'In Tulu, "Bonda" specifically refers to tender coconut.'
        }
      ]
    },
    {
      id: 'sec-grammar',
      name: 'Grammar',
      weight: 20,
      questions: [
        {
          id: 'q-ass-g1',
          prompt: 'When expressing personal desire ("I want water"), which subject pronoun case must be used?',
          options: ['Nominative (Yaan)', 'Dative (Enk)', 'Genitive (Enna)', 'Ablative (Enಡ್ದ್)'],
          correct_answer: 'Dative (Enk)',
          explanation: 'In Tulu, expressions of necessity ("bodu") and knowledge ("gothundu") require dative subjects (Enk).'
        },
        {
          id: 'q-ass-g2',
          prompt: 'Which negative particle is used when negating existence ("I do not have tea at home")?',
          options: ['Ath', 'Ijji', 'Balla', 'Bodu'],
          correct_answer: 'Ijji',
          explanation: '"Ijji" negates existence ("unduu" vs "ijji"). "Ath" negates identity.'
        }
      ]
    },
    {
      id: 'sec-trans',
      name: 'Translation',
      weight: 20,
      questions: [
        {
          id: 'q-ass-t1',
          prompt: 'Translate into English: "ಮಾತೆರೆಗ್ಲಾ ಎನ್ನ ಎಡ್ಡೊ ಸೊಲ್ಮೆಲು."',
          options: [
            'Warm greetings / respects to everyone.',
            'Let us all go to Mangalore.',
            'Have you all eaten your meals?',
            'Where are you all going?'
          ],
          correct_answer: 'Warm greetings / respects to everyone.',
          explanation: '"Maateregla" (to all) + "enna" (my) + "eddo" (good) + "solmelu" (greetings).'
        },
        {
          id: 'q-ass-t2',
          prompt: 'Translate into Tulu: "My name is Amrut and I am in Kudla."',
          options: [
            'Enna pudar Amrut bokka yaan Kudlad ulle.',
            'Yaan pudar Amrut bokka Kudlad popini.',
            'Enk pudar Amrut bokka Kudla ill.',
            'Eerena pudar Amrut Kudla barpe.'
          ],
          correct_answer: 'Enna pudar Amrut bokka yaan Kudlad ulle.',
          explanation: 'Correct possessive "Enna", conjunction "bokka", nominative "yaan", and locative "Kudlad ulle".'
        }
      ]
    },
    {
      id: 'sec-sentence',
      name: 'Sentence formation',
      weight: 15,
      questions: [
        {
          id: 'q-ass-s1',
          prompt: 'Which sentence correctly asks "Where are you going?" to a friend in natural spoken Tulu?',
          options: [
            'Ee ode popina?',
            'Ee daane thinpina?',
            'Yaan ode popina?',
            'Eerena ode ill?'
          ],
          correct_answer: 'Ee ode popina?',
          explanation: '"Ee" (you) + "ode" (whither / where to) + "popina" (going).'
        }
      ]
    },
    {
      id: 'sec-comp',
      name: 'Comprehension',
      weight: 15,
      questions: [
        {
          id: 'q-ass-c1',
          prompt: 'Read: "ಕಾಂಡೆ ಒಡಿಪುಗು ಪೋದು ಶ್ರೀ ಕೃಷ್ಣನ ದರ್ಶನ ಮಲ್ತೆ. ಬೊಕ್ಕ ಮಧ್ಯಾಹ್ನ ಉಪ್ಪಿಟ್ಟು ತಿಂದೆ." What did the speaker do first in the morning?',
          options: [
            'Went to Udupi and had darshana of Krishna',
            'Cooked fish curry at home',
            'Bought two coconuts',
            'Travelled to Bengaluru by train'
          ],
          correct_answer: 'Went to Udupi and had darshana of Krishna',
          explanation: '"Kaande Odipugu podu Shri Krishnana darshana malthe" means "In the morning went to Udupi and visited Krishna".'
        }
      ]
    },
    {
      id: 'sec-conv',
      name: 'Conversation',
      weight: 15,
      questions: [
        {
          id: 'q-ass-cv1',
          prompt: 'A friendly neighbor asks: "ವಣಸ್ ಆಂಡಾ?" (Vanas aanda?). If you have just finished lunch, what is the best natural response?',
          options: [
            'ಅಂದ್, ವಣಸ್ ಆಂಡ್. ಈರೆನ ಆಂಡಾ? (Andh, vanas aand. Eerena aanda?)',
            'ಇಜ್ಜಿ ಕಾಪಿ ಬೊಡ್ಚಿ (Ijji kaapi bodchi)',
            'ಒಡೆ ಪೋಪಿನ? (Ode popina?)',
            'ಎನ್ನ ಪುದರ್ ಅಮೃತ್ (Enna pudar Amrut)'
          ],
          correct_answer: 'ಅಂದ್, ವಣಸ್ ಆಂಡ್. ಈರೆನ ಆಂಡಾ? (Andh, vanas aand. Eerena aanda?)',
          explanation: 'Confirming your meal warmly ("Yes, had meal") and inquiring back ("Did you have yours?") is classic Coastal Karnataka conversational etiquette.'
        }
      ]
    }
  ]
};
