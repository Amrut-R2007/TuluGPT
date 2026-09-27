import { Lesson } from '../types';

export const CURRICULUM_LESSONS: Lesson[] = [
  // ==========================================
  // LEVEL 0: ABSOLUTE BEGINNER
  // ==========================================
  {
    id: 'lesson-0-1',
    level: 0,
    level_name: 'Level 0: Absolute Beginner',
    unit: 1,
    order_index: 1,
    title: 'Greetings & Respects',
    title_tulu: 'ಸೊಲ್ಮೆಲು ಬೊಕ್ಕ ನಮಸ್ಕಾರ',
    description: 'Learn authentic Tulu ways to say hello, ask how someone is doing, and show respect.',
    estimated_minutes: 5,
    objective: 'Confidently greet any Tulu speaker politely using "Solmelu" and ask "Encha ullar?".',
    vocabulary_ids: ['vocab-001', 'vocab-002', 'vocab-003', 'vocab-005'],
    grammar_concept: {
      name: 'Polite Address: ullar vs ulla',
      explanation: 'In Tulu, verb endings indicate respect. When speaking to elders, strangers, or anyone you respect, use "-ar" (Eer encha ullar?). When speaking to peers or youngsters informally, you can use "-a" (Ee encha ulla?).',
      rules: [
        'Use "Solmelu" for traditional respectful greetings or heartfelt thanks.',
        'Use "Enk edde ulle" to reply "I am doing well".',
        'When parting, say "Barpe" (I will come/see you), never "Pope" (I go).'
      ],
      examples: [
        {
          tulu: 'ನಮಸ್ಕಾರ, ಎಂಚ ಉಲ್ಲರ್?',
          transliteration: 'Namaskara, encha ullar?',
          english: 'Hello, how are you? (Respectful)',
          explanation: 'Standard polite greeting across all of Tulunadu.'
        },
        {
          tulu: 'ಎಂಕ್ ಎಡ್ಡೆ ಉಲ್ಲೆ.',
          transliteration: 'Enk edde ulle.',
          english: 'I am fine / doing well.',
          explanation: 'Takes the dative "Enk" (to me) + stative verb "ulle".'
        }
      ]
    },
    practice_questions: [
      {
        id: 'q-0-1-1',
        type: 'multiple_choice',
        prompt: 'What is the traditional, authentic Tulu word for greetings and respectful salutation?',
        options: ['Solmelu', 'Dhanyavaada', 'Namaste', 'Shukriya'],
        correct_answer: 'Solmelu',
        explanation: '"Solmelu" is the distinct Tulu word expressing respectful greetings and gratitude.'
      },
      {
        id: 'q-0-1-2',
        type: 'multiple_choice',
        prompt: 'How do you politely ask an elder or teacher "How are you?" in Tulu?',
        options: ['Ee encha ulla?', 'Eer encha ullar?', 'Enk edde ulle', 'Ode popar?'],
        correct_answer: 'Eer encha ullar?',
        explanation: '"Eer" (you - respectful) pairs with the polite verb form "ullar".'
      },
      {
        id: 'q-0-1-3',
        type: 'translation',
        prompt: 'Translate to Tulu: "I am fine / doing well"',
        correct_answer: 'Enk edde ulle',
        explanation: '"Enk" (to me) + "edde" (good) + "ulle" (I am).'
      },
      {
        id: 'q-0-1-4',
        type: 'recall',
        prompt: 'When taking leave, what culturally respectful phrase do you say instead of saying "I go"?',
        correct_answer: 'Barpe',
        explanation: 'Saying "Barpe" (literally "I will come back / see you") is the auspicious and polite way to depart.'
      }
    ]
  },

  {
    id: 'lesson-0-2',
    level: 0,
    level_name: 'Level 0: Absolute Beginner',
    unit: 1,
    order_index: 2,
    title: 'Introducing Yourself',
    title_tulu: 'ಎನ್ನ ಪುದರ್... (My Name Is...)',
    description: 'Tell people your name, where you are from, and ask what someone else is called.',
    estimated_minutes: 6,
    objective: 'Introduce yourself in Tulu and ask others their name.',
    vocabulary_ids: ['vocab-006', 'vocab-007', 'vocab-008', 'vocab-018'],
    grammar_concept: {
      name: 'Genitive Pronouns: Enna & Eerena',
      explanation: 'To express possession: "Enna" means "my/mine", "Eerena" means "your" (respectful), and "Nina" means "your" (informal). "Pudar" means name.',
      rules: [
        '"Enna pudar [Your Name]" = My name is [Your Name].',
        '"Eerena pudar daane?" = What is your name? (Polite)',
        '"Yaan [Place]-daye" = I am a man from [Place]; "Yaan [Place]-dal" = I am a woman from [Place].'
      ],
      examples: [
        {
          tulu: 'ಎನ್ನ ಪುದರ್ ಅಮೃತ್.',
          transliteration: 'Enna pudar Amrut.',
          english: 'My name is Amrut.',
          explanation: 'Clear, direct sentence of introduction.'
        },
        {
          tulu: 'ಈರೆನ ಪುದರ್ ದಾನೆ?',
          transliteration: 'Eerena pudar daane?',
          english: 'What is your name? (Respectful)',
          explanation: '"Eerena" (your) + "pudar" (name) + "daane" (what).'
        }
      ]
    },
    practice_questions: [
      {
        id: 'q-0-2-1',
        type: 'multiple_choice',
        prompt: 'What does "Enna pudar" mean in Tulu?',
        options: ['My house', 'My name', 'Where are you', 'Good morning'],
        correct_answer: 'My name',
        explanation: '"Enna" = my, "pudar" = name.'
      },
      {
        id: 'q-0-2-2',
        type: 'fill_in_the_blank',
        prompt: 'Fill in the blank: "______ pudar daane?" (Asking an elder politely for their name)',
        options: ['Nina', 'Eerena', 'Aayana', 'Enna'],
        correct_answer: 'Eerena',
        explanation: '"Eerena" is the respectful form for "your".'
      },
      {
        id: 'q-0-2-3',
        type: 'translation',
        prompt: 'How do you say "I am from Kudla (Mangaluru)" if you are male?',
        correct_answer: 'Yaan Kudladaye',
        explanation: 'Suffix "-daye" denotes a male inhabitant; "-dal" denotes a female inhabitant.'
      }
    ]
  },

  {
    id: 'lesson-0-3',
    level: 0,
    level_name: 'Level 0: Absolute Beginner',
    unit: 1,
    order_index: 3,
    title: 'Yes, No & Negation Nuances',
    title_tulu: 'ಅಂದ್, ಅತ್ತ್, ಉಂಡು ಬೊಕ್ಕ ಇಜ್ಜಿ',
    description: 'Master the critical difference between "Andh/Ath" (Identity) and "Undu/Ijji" (Existence).',
    estimated_minutes: 7,
    objective: 'Correctly distinguish when to use "Andh/Ath" vs "Undu/Ijji".',
    vocabulary_ids: ['vocab-004', 'vocab-032'],
    grammar_concept: {
      name: 'Existential vs Equational Negation',
      explanation: 'Tulu has a crucial distinction that trips up beginners:\n1. Equational: "Andh" (Yes, it is that) / "Ath" (No, it is not that).\n2. Existential: "Undu" (It exists / is available) / "Ijji" (It does not exist / not available).',
      rules: [
        'Is this tea? -> "Andh" (Yes) / "Ath" (No, it is not tea).',
        'Do you have tea? -> "Undu" (Yes, I have it) / "Ijji" (No, I don\'t have any).'
      ],
      examples: [
        {
          tulu: 'ಈ ತುಳುವಾಯಾ? - ಅಂದ್.',
          transliteration: 'Ee Tuluvaaya? - Andh.',
          english: 'Are you a Tuluva? - Yes.',
          explanation: 'Identity question -> Use "Andh".'
        },
        {
          tulu: 'ಇಲ್ಲಡ್ ಕಾಪಿ ಉಂಡಾ? - ಇಜ್ಜಿ.',
          transliteration: 'Illad kaapi undaa? - Ijji.',
          english: 'Is there coffee at home? - No (none available).',
          explanation: 'Existence question -> Use "Undu / Ijji".'
        }
      ]
    },
    practice_questions: [
      {
        id: 'q-0-3-1',
        type: 'multiple_choice',
        prompt: 'If someone asks if coffee is available at a canteen ("Kaapi undaa?"), and it is sold out, what do you say?',
        options: ['Ath', 'Ijji', 'Andh', 'Bodchi'],
        correct_answer: 'Ijji',
        explanation: 'For non-existence or unavailability, Tulu uses "Ijji".'
      },
      {
        id: 'q-0-3-2',
        type: 'multiple_choice',
        prompt: 'If someone mistakenly thinks you are someone else ("Are you Ramesh?"), what do you say?',
        options: ['Ijji', 'Ath', 'Bodu', 'Undu'],
        correct_answer: 'Ath',
        explanation: 'For incorrect identity ("I am not Ramesh"), Tulu uses "Ath".'
      }
    ]
  },

  {
    id: 'lesson-0-4',
    level: 0,
    level_name: 'Level 0: Absolute Beginner',
    unit: 1,
    order_index: 4,
    title: 'Basic Question Words',
    title_tulu: 'ಪ್ರಶ್ನೆ ಪದಕುಲು (Daane, Ode, Epa, Daayeg)',
    description: 'Learn the primary interrogative words to ask who, what, where, when, and why.',
    estimated_minutes: 6,
    objective: 'Form basic questions to inquire about objects, places, time, and reasons.',
    vocabulary_ids: ['vocab-009', 'vocab-010', 'vocab-011', 'vocab-012'],
    grammar_concept: {
      name: 'Question Particles: -a and -e',
      explanation: 'In Tulu, simply adding the suffix "-a" turns any declarative sentence into a yes/no question. Wh-words (Daane, Ode, Epa, Daayeg) take sentence-initial or pre-verbal positions.',
      rules: [
        'Daane = What (Daane sampaadane? What\'s going on?)',
        'Ode = Whither / To where (Ode popina? Where are you going?)',
        'Olpa = Where at (Ill olpa undu? Where is the house located?)',
        'Epa = When (Epa barpina? When will you come?)',
        'Daayeg = Why (Daayeg botherana? Why worry?)'
      ],
      examples: [
        {
          tulu: 'ದಾನೆ ಸಮಾಚಾರ?',
          transliteration: 'Daane samaachaara?',
          english: 'What\'s the news? / What\'s up?',
          explanation: 'Universal casual opener in Tulunadu.'
        },
        {
          tulu: 'ಈ ಒಡೆ ಪೋಪಿನ?',
          transliteration: 'Ee ode popina?',
          english: 'Where are you going?',
          explanation: '"Ode" specifically indicates destination.'
        }
      ]
    },
    practice_questions: [
      {
        id: 'q-0-4-1',
        type: 'multiple_choice',
        prompt: 'How do you ask "Where are you going?" in Tulu?',
        options: ['Ee daane thinpina?', 'Ee ode popina?', 'Ee epa barpina?', 'Ee daayeg paatheruna?'],
        correct_answer: 'Ee ode popina?',
        explanation: '"Ode" means "to where", and "popina" means "going".'
      },
      {
        id: 'q-0-4-2',
        type: 'multiple_choice',
        prompt: 'Which word means "Why" in Tulu?',
        options: ['Daane', 'Ode', 'Epa', 'Daayeg'],
        correct_answer: 'Daayeg',
        explanation: '"Daayeg" translates directly to "Why" or "For what reason".'
      }
    ]
  },

  {
    id: 'lesson-0-5',
    level: 0,
    level_name: 'Level 0: Absolute Beginner',
    unit: 1,
    order_index: 5,
    title: 'Numbers & Counting',
    title_tulu: 'ಸಂಖ್ಯೆಲು (1 to 10)',
    description: 'Count from one to ten in Tulu and use numbers in everyday shopping.',
    estimated_minutes: 5,
    objective: 'Count 1 through 10 in Tulu and order items at a local shop.',
    vocabulary_ids: ['vocab-026', 'vocab-027', 'vocab-028', 'vocab-029', 'vocab-030'],
    grammar_concept: {
      name: 'Tulu Numbers System',
      explanation: 'Tulu numbers: 1 = Onji, 2 = Radd, 3 = Mooji, 4 = Naal, 5 = Aiy, 6 = Aaji, 7 = Elu, 8 = Enma, 9 = Orumba, 10 = Patth.',
      rules: [
        'Place the numeral directly before the noun: "Radd kaapi" (Two coffees).',
        'Add "bodu" to request: "Onji bonda bodu" (I need one tender coconut).'
      ],
      examples: [
        {
          tulu: 'ಒಂಜಿ ಚಾ ಬೊಕ್ಕ ರಡ್ಡ್ ಬಿಸ್ಕೇಟ್ ಕೊರ್ಲೆ.',
          transliteration: 'Onji chaa bokka radd biscuit korle.',
          english: 'Please give one tea and two biscuits.',
          explanation: '"Bokka" means "and". "Korle" means "please give".'
        }
      ]
    },
    practice_questions: [
      {
        id: 'q-0-5-1',
        type: 'multiple_choice',
        prompt: 'What is the Tulu word for the number 3?',
        options: ['Onji', 'Radd', 'Mooji', 'Naal'],
        correct_answer: 'Mooji',
        explanation: '1 = Onji, 2 = Radd, 3 = Mooji.'
      },
      {
        id: 'q-0-5-2',
        type: 'multiple_choice',
        prompt: 'How do you ask for "two tender coconuts" in Tulu?',
        options: ['Mooji bonda bodu', 'Radd bonda bodu', 'Onji bonda bodu', 'Aiy bonda bodu'],
        correct_answer: 'Radd bonda bodu',
        explanation: '"Radd" = two, "bonda" = tender coconut, "bodu" = needed.'
      }
    ]
  },

  // ==========================================
  // LEVEL 1: SENTENCE FORMATION
  // ==========================================
  {
    id: 'lesson-1-1',
    level: 1,
    level_name: 'Level 1: Sentence Formation',
    unit: 2,
    order_index: 1,
    title: 'Pronouns and Tulu Cases',
    title_tulu: 'ಸರ್ವನಾಮ ಬೊಕ್ಕ ವಿಭಕ್ತಿ',
    description: 'Learn how pronouns change in nominative, accusative, dative, and genitive cases.',
    estimated_minutes: 8,
    objective: 'Build accurate sentences using nominative (Yaan) vs dative (Enk) case frames.',
    vocabulary_ids: ['vocab-006', 'vocab-007', 'vocab-032', 'vocab-034'],
    grammar_concept: {
      name: 'The Dative Subject Construction',
      explanation: 'In Tulu, feelings, needs, and cognitive states do not use the nominative "Yaan" (I). Instead, they take the dative "Enk" (To me):\n- Enk bodu (I want)\n- Enk gothundu (I know)\n- Enk banga aavundu (It is difficult for me)',
      rules: [
        'Nominative: Yaan (I), Ee (You), Aaye (He), Aal (She), Nama (We inclusive), Enkulu (We exclusive).',
        'Dative suffix is "-g" or "-k": Enk (to me), Ereg (to you), Aayeg (to him), Aalg (to her).',
        'Actions use nominative: "Yaan popinte" (I am going). States use dative: "Enk thirgunji" (I cannot).'
      ],
      examples: [
        {
          tulu: 'ಯಾನ್ ಪೋಪೆ, ಆಂಡ ಎಂಕ್ ಪೊರ್ತು ಇಜ್ಜಿ.',
          transliteration: 'Yaan pope, aanda enk porthu ijji.',
          english: 'I will go, but I have no time.',
          explanation: '"Porthu" = time. "Enk porthu ijji" = I do not have time.'
        }
      ]
    },
    practice_questions: [
      {
        id: 'q-1-1-1',
        type: 'multiple_choice',
        prompt: 'To say "I want coffee", which pronoun form must you use in Tulu?',
        options: ['Yaan kaapi bodu', 'Enk kaapi bodu', 'Enna kaapi bodu', 'Erekaapi bodu'],
        correct_answer: 'Enk kaapi bodu',
        explanation: 'Because "bodu" expresses need, the experiencer takes the dative case "Enk".'
      }
    ]
  },

  // ==========================================
  // LEVEL 2: EVERYDAY CONVERSATION
  // ==========================================
  {
    id: 'lesson-2-1',
    level: 2,
    level_name: 'Level 2: Everyday Conversation',
    unit: 3,
    order_index: 1,
    title: 'At the Mangaluru Fish Market',
    title_tulu: 'ಮೀನ್ ಮಾರ್ಕೆಟ್ಡ್ ಪಾತೆರುನ',
    description: 'Experience real dialogue at the lively coastal fish harbor and learn bargaining etiquette.',
    estimated_minutes: 10,
    objective: 'Negotiate price and ask about fresh catch in natural colloquial Tulu.',
    vocabulary_ids: ['vocab-015', 'vocab-027', 'vocab-031'],
    grammar_concept: {
      name: 'Colloquial Bargaining Phrasing',
      explanation: 'Learn key market idioms: "Thaarumaaru paatherade" (don\'t talk unreasonably), "Pudharji meen" (fresh catch directly off the boat), "Ethe korpar?" (how much will you give it for?).',
      rules: [
        '"Ethe?" = How much?',
        '"Kammi malple" = Please reduce/make it less.',
        '"Porkalu meen" = Extremely fresh fish.'
      ],
      examples: [
        {
          tulu: 'ಅಕ್ಕಾ, ಈ ಅಂಜಲ್ ಮೀನ್ಗ್ ಎತ್ತ್?',
          transliteration: 'Akka, ee anjal meen-g ethe?',
          english: 'Sister, how much for this kingfish?',
          explanation: 'Standard polite question in Mangaluru fish markets.'
        }
      ]
    },
    practice_questions: [
      {
        id: 'q-2-1-1',
        type: 'multiple_choice',
        prompt: 'How do you ask "How much is this?" in Tulu?',
        options: ['Undu daane?', 'Undek ethe?', 'Undu olpa?', 'Undu epa?'],
        correct_answer: 'Undek ethe?',
        explanation: '"Undek" (for this) + "ethe" (how much).'
      }
    ]
  }
];
