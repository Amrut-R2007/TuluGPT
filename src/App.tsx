import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { validateEnv } from './config/env';
import { ConfigErrorScreen } from './components/ConfigErrorScreen';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { AppWorkspacePage } from './pages/AppWorkspacePage';
import { CurriculumRoutePage } from './pages/CurriculumRoutePage';
import { SetupCheckPage } from './pages/SetupCheckPage';

// Route Guard: Protected Routes (requires authenticated user + onboarding check)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf8f2] flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-[#c05c3c] text-white flex items-center justify-center font-bold text-lg animate-pulse shadow-md">
          ತು
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (!user.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

// Route Guard: Public Only (redirects logged-in users away from / and /login to /app)
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Avoid flicker while verifying initial session
  }

  if (user) {
    if (!user.onboarding_completed) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

// Main Router Content with Env Blocker
const AppRoutes: React.FC = () => {
  const location = useLocation();
  const envValidation = validateEnv();

  // If env keys are missing or invalid, display full-screen error (unless inspecting /setup-check)
  if (!envValidation.isValid && location.pathname !== '/setup-check') {
    return <ConfigErrorScreen missing={envValidation.missing} />;
  }

  return (
    <Routes>
      {/* Public Landing & Login */}
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <LandingPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      {/* OAuth Callback */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Diagnostics / Setup Check */}
      <Route path="/setup-check" element={<SetupCheckPage />} />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Protected App Workspace & Curriculum */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppWorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/curriculum"
        element={
          <ProtectedRoute>
            <CurriculumRoutePage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
