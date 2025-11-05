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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Spinner className="h-16 w-16 text-purple-400 animate-spin" />
        <p className="text-lg text-zinc-300">Initializing Miracle Analytics...</p>
      </div>
    );
  }

  if (currentUser) {
    // If user is logged in, they either see the dashboard or the mapping setup.
    // The loading of the config is already handled by the `isLoading` check above.
    return workspaceConfig ? <Dashboard /> : <DataMapping />;
  }

  // If no user, show either the landing page or the login page.
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