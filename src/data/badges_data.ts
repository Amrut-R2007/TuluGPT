import { Badge } from '../types';

export const BADGES_DATA: Badge[] = [
  {
    id: 'badge-1',
    slug: 'first-word',
    name: 'First Word',
    description: 'Began your Tulu journey with your very first completed learning session.',
    icon: 'Sparkles',
    criteria_type: 'lessons',
    criteria_value: 1,
    rarity: 'Common'
  },
  {
    id: 'badge-2',
    slug: 'first-lesson',
    name: 'First Lesson Master',
    description: 'Completed Lesson 1: Greetings & Respects with flying colors.',
    icon: 'BookOpen',
    criteria_type: 'lessons',
    criteria_value: 1,
    rarity: 'Common'
  },
  {
    id: 'badge-3',
    slug: 'first-quiz',
    name: 'Quiz Conqueror',
    description: 'Scored 80% or higher on an interactive practice quiz.',
    icon: 'CheckCircle2',
    criteria_type: 'quiz_score',
    criteria_value: 80,
    rarity: 'Common'
  },
  {
    id: 'badge-4',
    slug: 'streak-7',
    name: '7 Day Streak',
    description: 'Practiced Tulu consistently for 7 days in a row.',
    icon: 'Flame',
    criteria_type: 'streak',
    criteria_value: 7,
    rarity: 'Rare'
  },
  {
    id: 'badge-5',
    slug: 'streak-30',
    name: '30 Day Coastal Devotee',
    description: 'Built a powerful 30-day continuous Tulu learning habit.',
    icon: 'Award',
    criteria_type: 'streak',
    criteria_value: 30,
    rarity: 'Epic'
  },
  {
    id: 'badge-6',
    slug: 'streak-100',
    name: '100 Day Centurion',
    description: 'One hundred uninterrupted days of keeping Tulu alive.',
    icon: 'Crown',
    criteria_type: 'streak',
    criteria_value: 100,
    rarity: 'Legendary'
  },
  {
    id: 'badge-7',
    slug: 'vocab-builder',
    name: 'Vocabulary Builder',
    description: 'Learned and reviewed 25 verified Tulu words.',
    icon: 'Library',
    criteria_type: 'vocabulary',
    criteria_value: 25,
    rarity: 'Rare'
  },
  {
    id: 'badge-8',
    slug: 'conversation-starter',
    name: 'Conversation Starter',
    description: 'Completed 5 interactive conversational practice sessions with TuluGPT.',
    icon: 'MessageSquare',
    criteria_type: 'conversation',
    criteria_value: 5,
    rarity: 'Rare'
  },
  {
    id: 'badge-9',
    slug: 'grammar-explorer',
    name: 'Grammar Explorer',
    description: 'Deepened your knowledge of Tulu noun cases and verb conjugations.',
    icon: 'Compass',
    criteria_type: 'lessons',
    criteria_value: 5,
    rarity: 'Rare'
  },
  {
    id: 'badge-10',
    slug: 'weekly-scholar',
    name: 'Weekly Scholar',
    description: 'Successfully completed a comprehensive 6-part weekly assessment.',
    icon: 'GraduationCap',
    criteria_type: 'assessment',
    criteria_value: 1,
    rarity: 'Epic'
  },
  {
    id: 'badge-11',
    slug: 'tulu-traveller',
    name: 'Tulu Traveller',
    description: 'Mastered colloquial navigation, fish market dialogues, and travel vocabulary.',
    icon: 'MapPin',
    criteria_type: 'lessons',
    criteria_value: 8,
    rarity: 'Epic'
  },
  {
    id: 'badge-12',
    slug: 'consistency-champion',
    name: 'Consistency Champion',
    description: 'Accumulated over 500 XP through genuine, deliberate practice.',
    icon: 'Trophy',
    criteria_type: 'xp',
    criteria_value: 500,
    rarity: 'Legendary'
  }
];
