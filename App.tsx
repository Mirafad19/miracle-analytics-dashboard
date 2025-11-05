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
  const { currentUser, isLoading, workspaceConfig } = useAuth();
  const [showLoginPage, setShowLoginPage] = useState(false);

  // This is the single, unified loading screen. It shows until both auth and config state are resolved.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Spinner className="h-16 w-16 text-purple-400 animate-spin" />
        <p className="text-lg text-zinc-300">Initializing Miracle Analytics...</p>
      </div>
    );
  }

  // After loading, route based on the resolved state.
  if (currentUser) {
    // If a user is logged in, they either see their dashboard or the one-time mapping setup.
    // The workspaceConfig is guaranteed to be resolved (either as an object or null) at this point.
    return workspaceConfig ? <Dashboard /> : <DataMapping />;
  }

  // If no user is logged in, show either the landing page or the login page.
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