

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './Dashboard';
import { Spinner } from './components/Icons';
import { ThemeProvider } from './ThemeContext';
import { CurrencyProvider } from './CurrencyContext';
import LandingPage from './components/LandingPage';

const AppContent = () => {
  const { currentUser, loading, workspaceConfig } = useAuth();
  // Initialize based on whether a user is already logged in.
  // If no user, default to showing the landing page.
  const [showLanding, setShowLanding] = useState(!currentUser);

  useEffect(() => {
    // This effect runs when the authentication state changes.
    // If the user logs out (currentUser becomes null), we ensure
    // the landing page is shown next.
    if (!currentUser) {
      setShowLanding(true);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Spinner className="h-16 w-16 text-purple-400 animate-spin" />
        <p className="text-lg text-zinc-300">Loading Dashboard...</p>
      </div>
    );
  }

  if (currentUser) {
    // If the user is logged in, we must wait for their specific workspace config to load.
    if (workspaceConfig) {
      return <Dashboard />;
    }
    // While waiting for the config, show a specific loading state.
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Spinner className="h-16 w-16 text-purple-400 animate-spin" />
        <p className="text-lg text-zinc-300">Configuring Workspace...</p>
      </div>
    );
  }

  return showLanding 
    ? <LandingPage onLoginClick={() => setShowLanding(false)} /> 
    : <LoginPage onBackToHome={() => setShowLanding(true)} />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <AppContent />
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}