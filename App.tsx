

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './Dashboard';
import { Spinner } from './components/Icons';
import { ThemeProvider } from './ThemeContext';
import { CurrencyProvider } from './CurrencyContext';
import LandingPage from './components/LandingPage';

const AppContent = () => {
  const { currentUser, loading } = useAuth();
  const [showLoginPage, setShowLoginPage] = useState(false);

  // 1. Show a generic loading screen while the initial authentication check is running.
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Spinner className="h-16 w-16 text-purple-400 animate-spin" />
        <p className="text-lg text-zinc-300">Initializing...</p>
      </div>
    );
  }

  // 2. If a user is logged in, show the main Dashboard component.
  if (currentUser) {
    return <Dashboard />;
  }

  // 3. If no user is logged in, manage showing the Landing Page or Login Page.
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