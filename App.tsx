

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './Dashboard';
import { Spinner } from './components/Icons';
import { ThemeProvider } from './ThemeContext';
import { CurrencyProvider } from './CurrencyContext';
import LandingPage from './components/LandingPage';

const AppContent = () => {
  const { currentUser, authLoading, configLoading } = useAuth();
  const [showLoginPage, setShowLoginPage] = useState(false);

  // 1. Show the initial loading spinner while firebase auth is initializing.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Spinner className="h-16 w-16 text-purple-400 animate-spin" />
        <p className="text-lg text-zinc-300">Initializing...</p>
      </div>
    );
  }

  // 2. If a user is logged in, but we are still fetching their specific config, show a dedicated loading screen.
  if (currentUser && configLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Spinner className="h-16 w-16 text-purple-400 animate-spin" />
        <p className="text-lg text-zinc-300">Configuring Workspace...</p>
      </div>
    );
  }

  // 3. If a user is logged in and their config is loaded, show the dashboard.
  if (currentUser) {
    return <Dashboard />;
  }

  // 4. If no user, handle the public-facing pages (Landing/Login).
  if (showLoginPage) {
    return <LoginPage onBackToHome={() => setShowLoginPage(false)} />;
  }
  
  return <LandingPage onLoginClick={() => setShowLoginPage(true)} />;
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