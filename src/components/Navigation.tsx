import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  Trophy, 
  Award, 
  Settings, 
  ShieldCheck, 
  Info,
  Flame, 
  Sparkles, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'learn', label: 'Curriculum', icon: BookOpen },
  { id: 'chat', label: 'AI Tulu Tutor', icon: MessageSquare, badge: '7 Modes' },
  { id: 'assessment', label: 'Weekly Assessment', icon: GraduationCap },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'badges', label: 'Badges', icon: Award },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About TuluGPT', icon: Info },
];

interface NavbarProps {
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  onOpenAuth: () => void;
  onSignOut: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectTab,
  user,
  onOpenAuth,
  onSignOut,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  return (
    <header className="h-16 shrink-0 z-40 w-full border-b border-amber-900/10 bg-[#fbf8f2] shadow-2xs">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c05c3c] to-[#943d24] flex items-center justify-center shadow-xs text-white font-bold text-lg border border-[#e3b86a]/40">
            ತು
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl font-bold tracking-tight text-[#241e1a]">TuluGPT</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#1f4e38]/10 text-[#1f4e38]">Coastal AI</span>
            </div>
            <p className="text-[11px] text-[#776a61] hidden sm:block">ತುಳು ಕಲ್ಪುಲೆ • ಪಾತೆರ್ಲೆ • ಒರಿಪಾಲೆ</p>
          </div>
        </div>

        {/* Gamification Stats: Streak & XP */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Streak */}
          <div 
            title="Current Daily Streak"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 font-semibold text-xs sm:text-sm"
          >
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-pulse" />
            <span>{user.streak_count} <span className="hidden sm:inline font-normal text-amber-800/70">days</span></span>
          </div>

          {/* Total XP */}
          <div 
            title="Total XP Earned"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1f4e38]/10 border border-[#1f4e38]/20 text-[#1f4e38] font-semibold text-xs sm:text-sm"
          >
            <Sparkles className="w-4 h-4 text-[#1f4e38]" />
            <span>{user.total_xp} <span className="hidden sm:inline font-normal text-[#1f4e38]/70">XP</span></span>
          </div>

          {/* User Profile Avatar / Sign In */}
          <div className="flex items-center gap-2 pl-2 border-l border-amber-900/10">
            <button
              onClick={() => onSelectTab('settings')}
              title="Open Settings"
              className="flex items-center gap-2 hover:opacity-90 transition p-1 rounded-full border border-amber-800/20 bg-white shadow-2xs"
            >
              <img 
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                alt={user.display_name} 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
              />
            </button>

            {/* Mobile menu toggle button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#241e1a] hover:bg-amber-100/50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onSignOut
}) => {
  const items = [...NAV_ITEMS];
  if (user.is_admin) {
    items.push({ id: 'admin', label: 'Admin Studio', icon: ShieldCheck, badge: 'Admin' });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-amber-900/10 bg-[#fbf8f2] shrink-0 p-4 justify-between h-full overflow-y-auto">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#776a61]">
          Learning Space
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive 
                  ? 'bg-[#c05c3c] text-white shadow-xs' 
                  : 'text-[#241e1a] hover:bg-amber-100/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/25 text-white' : 'bg-[#c05c3c]/10 text-[#c05c3c]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Coastal Heritage Motto & Sign Out */}
      <div className="pt-4 border-t border-amber-900/10 space-y-3">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-[#38302b]">
          <p className="font-semibold text-amber-900 flex items-center gap-1.5">
            <span>🌾</span> Coastal Karnataka
          </p>
          <p className="text-[11px] text-amber-900/80 mt-1">
            "Learn Tulu. Speak Tulu. Keep Tulu alive."
          </p>
        </div>

        <button
          onClick={onSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-[#776a61] hover:text-red-700 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fbf8f2]/95 backdrop-blur-md border-t border-amber-900/10 px-2 py-1.5 flex justify-around items-center">
      {[
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'learn', label: 'Learn', icon: BookOpen },
        { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
        { id: 'assessment', label: 'Test', icon: GraduationCap },
        { id: 'leaderboard', label: 'Ranks', icon: Trophy },
      ].map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition ${
              isActive ? 'text-[#c05c3c] font-semibold' : 'text-[#776a61]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  onSignOut: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  user,
  onSignOut
}) => {
  if (!isOpen) return null;

  const items = [...NAV_ITEMS];
  if (user.is_admin) {
    items.push({ id: 'admin', label: 'Admin Studio', icon: ShieldCheck, badge: 'Admin' });
  }

  const handleSelect = (id: string) => {
    onSelectTab(id);
    onClose();
  };

  return (
    <div className="md:hidden fixed inset-0 top-16 z-30 bg-[#fbf8f2]/95 backdrop-blur-md p-4 overflow-y-auto border-b border-amber-900/10">
      <nav className="flex flex-col gap-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left font-medium transition ${
                isActive 
                  ? 'bg-[#c05c3c] text-white shadow-xs' 
                  : 'text-[#241e1a] hover:bg-amber-100/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#c05c3c]/10 text-[#c05c3c]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
        <div className="pt-4 mt-2 border-t border-amber-900/10">
          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left font-medium text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
