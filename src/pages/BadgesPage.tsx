import React from 'react';
import { 
  Award, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  MessageSquare, 
  Compass, 
  GraduationCap, 
  MapPin, 
  Trophy,
  Library
} from 'lucide-react';
import { BADGES_DATA } from '../data/badges_data';
import { UserBadge } from '../types';

interface BadgesPageProps {
  userBadges: UserBadge[];
}

export const BadgesPage: React.FC<BadgesPageProps> = ({ userBadges }) => {
  const earnedBadgeIds = userBadges.map(ub => ub.badge_id);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'BookOpen': return BookOpen;
      case 'CheckCircle2': return CheckCircle2;
      case 'Flame': return Flame;
      case 'Award': return Award;
      case 'Library': return Library;
      case 'MessageSquare': return MessageSquare;
      case 'Compass': return Compass;
      case 'GraduationCap': return GraduationCap;
      case 'MapPin': return MapPin;
      case 'Trophy': return Trophy;
      default: return Award;
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-stone-100 text-stone-700';
      case 'Rare': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Epic': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Legendary': return 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
      default: return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c05c3c]/10 text-[#c05c3c] text-xs font-semibold">
          <Award className="w-4 h-4" />
          <span>Cultural & Learning Achievements</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241e1a]">
          Tulu Milestones & Badges
        </h1>
        <p className="text-xs sm:text-sm text-[#776a61]">
          Earn recognition for streaks, vocabulary mastery, grammatical exploration, and commitment to the Tulu language.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {BADGES_DATA.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          const Icon = getIcon(badge.icon);

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition relative flex flex-col justify-between ${
                isEarned 
                  ? 'bg-white border-amber-900/15 shadow-xs' 
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isEarned 
                        ? 'bg-gradient-to-br from-[#c05c3c] to-[#943d24] text-white shadow-xs' 
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getRarityBadge(badge.rarity)}`}>
                    {badge.rarity}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#241e1a]">{badge.name}</h3>
                  <p className="text-xs text-[#544942] mt-1 leading-relaxed">{badge.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {isEarned ? (
                  <span className="text-[#1f4e38] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-[#776a61] flex items-center gap-1 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Criteria: {badge.criteria_value} {badge.criteria_type}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
