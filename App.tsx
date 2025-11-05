import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './Dashboard';
import { Spinner } from './components/Icons';
import { ThemeProvider } from './ThemeContext';
import { CurrencyProvider } from './CurrencyContext';
import LandingPage from './components/LandingPage';
import DataMapping from './components/DataMapping';

const AppContent = () => {
  const { currentUser, authLoading, configLoading, workspaceConfig } = useAuth();
  const [showLoginPage, setShowLoginPage] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Spinner className="h-16 w-16 text-purple-400 animate-spin" />
        <p className="text-lg text-zinc-300">Initializing...</p>
      </div>
    );
  }

  if (currentUser) {
    if (configLoading) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
          <Spinner className="h-16 w-16 text-purple-400 animate-spin" />
          <p className="text-lg text-zinc-300">Checking Configuration...</p>
        </div>
      );
    }
    // If config is loaded and exists, show dashboard.
    // If config is loaded but is null (doesn't exist), show the mapping screen.
    return workspaceConfig ? <Dashboard /> : <DataMapping />;
  }

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
