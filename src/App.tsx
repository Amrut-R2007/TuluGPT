import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, MobileBottomNav, MobileDrawer } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { LessonPlayerPage } from './pages/LessonPlayerPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { BadgesPage } from './pages/BadgesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';

import { UserProfile, LessonProgress, UserBadge, TuluErrorReport, ErrorReportStatus } from './types';
import { SupabaseService } from './services/supabase';
import { LocalStore } from './services/storage';
import { CURRICULUM_LESSONS } from './data/curriculum_data';

export function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [errorReports, setErrorReports] = useState<TuluErrorReport[]>(LocalStore.getErrorReports());
  const [leaderboardData, setLeaderboardData] = useState(LocalStore.getLeaderboard());

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Supabase Auth and listen for OAuth redirects
  useEffect(() => {
    // 1. Instant check from localStorage to prevent flash of landing page
    const localUser = LocalStore.getSavedUser();
    if (localUser) {
      setUser(localUser);
      setLessonProgress(LocalStore.getLessonProgress());
      setUserBadges(LocalStore.getUserBadges());
      if (!localUser.onboarding_completed) {
        setOnboardingOpen(true);
      }
    }

    async function checkAuth() {
      try {
        const currentUser = await SupabaseService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setLessonProgress(LocalStore.getLessonProgress());
          setUserBadges(LocalStore.getUserBadges());
          if (!currentUser.onboarding_completed) {
            setOnboardingOpen(true);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setAuthChecked(true);
      }
    }

    checkAuth();

    // Listen to real-time auth changes (e.g. returning from Google OAuth redirect)
    const unsubscribe = SupabaseService.onAuthStateChange((updatedUser) => {
      if (updatedUser) {
        setUser(updatedUser);
        setLessonProgress(LocalStore.getLessonProgress());
        setUserBadges(LocalStore.getUserBadges());
        if (!updatedUser.onboarding_completed) {
          setOnboardingOpen(true);
        }
      }
      setAuthChecked(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateUser = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    const res = await SupabaseService.updateUserProfile(updated);
    setUser(res);
  };

  const handleOnboardingComplete = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    const full = { ...user, ...updated, onboarding_completed: true };
    setUser(full);
    LocalStore.saveUser(full);
    setOnboardingOpen(false);
    try {
      await SupabaseService.updateUserProfile(full);
    } catch (e) {
      console.warn('Profile sync warning:', e);
    }
  };

  const handleSignOut = async () => {
    await SupabaseService.signOut();
    LocalStore.clearUser();
    setUser(null);
    setCurrentTab('dashboard');
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('learn');
  };

  const handleCompleteLesson = (lessonId: string, score: number) => {
    if (!user) return;
    const newProgress = {
      ...lessonProgress,
      [lessonId]: {
        id: `lp-${Date.now()}`,
        user_id: user.id,
        lesson_id: lessonId,
        status: 'completed' as const,
        score,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
    setLessonProgress(newProgress);
    LocalStore.saveLessonProgress(newProgress);

    // Award +20 XP
    const newTotalXP = LocalStore.addXP(20, 'lesson', `Completed ${lessonId}`);
    setUser(prev => prev ? ({ ...prev, total_xp: newTotalXP }) : null);

    // Check first lesson badge
    if (LocalStore.awardBadge('badge-2')) {
      setUserBadges(LocalStore.getUserBadges());
    }
  };

  const handleUpdateReportStatus = (id: string, status: ErrorReportStatus, adminNotes?: string) => {
    LocalStore.updateErrorReport(id, status, adminNotes);
    setErrorReports(LocalStore.getErrorReports());
  };

  const handleToggleLeaderboardOptIn = (optedIn: boolean) => {
    if (!user) return;
    handleUpdateUser({ leaderboard_opt_in: optedIn });
    const updated = leaderboardData.map(e => e.user_id === user.id ? { ...e, opted_in: optedIn } : e);
    setLeaderboardData(updated);
  };

  const handleQuickStart = (targetTab: string = 'dashboard') => {
    const freshUser: UserProfile = {
      id: `usr-${Date.now()}`,
      username: 'tululearner_' + Math.floor(1000 + Math.random() * 9000),
      display_name: 'Tulu Learner',
      email: 'learner@tulugpt.org',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      learning_level: 'zero',
      native_language: 'English',
      target_level: 'intermediate',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      streak_count: 1,
      longest_streak: 1,
      total_xp: 0,
      leaderboard_opt_in: true,
      social_shoutout_opt_in: true,
      onboarding_completed: false, // Triggers the 5 onboarding questions!
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    LocalStore.saveUser(freshUser);
    setUser(freshUser);
    setLessonProgress(LocalStore.getLessonProgress());
    setUserBadges(LocalStore.getUserBadges());
    setAuthModalOpen(false);
    setOnboardingOpen(true);
    setCurrentTab(targetTab);
  };

  const handleExploreCurriculum = () => {
    if (user) {
      setSelectedLessonId(null);
      setCurrentTab('learn');
    } else {
      handleQuickStart('learn');
    }
  };

  const selectedLessonData = selectedLessonId ? CURRICULUM_LESSONS.find(l => l.id === selectedLessonId) : null;

  // Show loading indicator until auth status is evaluated
  if (!authChecked && !user) {
    return (
      <div className="h-screen w-screen bg-[#fbf8f2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#c05c3c] text-white flex items-center justify-center font-bold text-xl animate-pulse shadow-md">
            ತು
          </div>
          <p className="text-xs text-[#776a61] font-medium">Loading TuluGPT...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show the Landing Page with Auth Modal
  if (!user) {
    return (
      <>
        <LandingPage
          onStartLearning={() => setAuthModalOpen(true)}
          onExploreCurriculum={handleExploreCurriculum}
          onQuickStart={() => handleQuickStart('dashboard')}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(freshUser) => {
            setUser(freshUser);
            LocalStore.saveUser(freshUser);
            setAuthModalOpen(false);
            if (!freshUser.onboarding_completed) {
              setOnboardingOpen(true);
            }
            setCurrentTab('dashboard');
          }}
        />
      </>
    );
  }

  // Authenticated Workspace Layout
  return (
    <div className="h-screen w-screen bg-[#fbf8f2] flex flex-col text-[#241e1a] overflow-hidden">
      {/* 1. Full-Width Fixed Top Navbar */}
      <Navbar
        onSelectTab={(tab) => {
          setSelectedLessonId(null);
          setCurrentTab(tab);
        }}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSignOut={handleSignOut}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Menu Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedLessonId(null);
          setCurrentTab(tab);
        }}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* 2. Main Row: Sidebar on Left, Content on Right */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setSelectedLessonId(null);
            setCurrentTab(tab);
          }}
          user={user}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 overflow-y-auto pb-16 md:pb-8">
          {currentTab === 'dashboard' && (
            <DashboardPage
              user={user}
              lessonProgress={lessonProgress}
              onNavigate={(tab, param) => {
                if (param) setSelectedLessonId(param);
                setCurrentTab(tab);
              }}
            />
          )}

          {currentTab === 'learn' && (
            selectedLessonData ? (
              <LessonPlayerPage
                lesson={selectedLessonData}
                onBack={() => setSelectedLessonId(null)}
                onCompleteLesson={handleCompleteLesson}
              />
            ) : (
              <CurriculumPage
                lessonProgress={lessonProgress}
                onSelectLesson={handleSelectLesson}
              />
            )
          )}

          {currentTab === 'chat' && (
            <ChatPage user={user} />
          )}

          {currentTab === 'assessment' && (
            <AssessmentPage
              userId={user.id}
              onNavigateLesson={(lessonId) => {
                setSelectedLessonId(lessonId);
                setCurrentTab('learn');
              }}
            />
          )}

          {currentTab === 'leaderboard' && (
            <LeaderboardPage
              user={user}
              leaderboardData={leaderboardData}
              onToggleOptIn={handleToggleLeaderboardOptIn}
            />
          )}

          {currentTab === 'badges' && (
            <BadgesPage userBadges={userBadges} />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              user={user}
              onUpdateUser={handleUpdateUser}
              onNavigateAbout={() => setCurrentTab('about')}
              onSignOut={handleSignOut}
            />
          )}

          {currentTab === 'about' && (
            <AboutPage />
          )}

          {currentTab === 'admin' && (
            <AdminDashboardPage
              reports={errorReports}
              onUpdateReportStatus={handleUpdateReportStatus}
              leaderboard={leaderboardData}
            />
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedLessonId(null);
          setCurrentTab(tab);
        }}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        user={user}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}

export default App;
