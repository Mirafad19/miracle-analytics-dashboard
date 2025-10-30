// FIX: Added 'React' import to fix JSX parsing issue.
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './components/LoginPage';
import Dashboard from './Dashboard';
import { Activity } from './components/Icons';

const AppContent = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-75 animate-pulse"></div>
          <Activity className="relative h-16 w-16 text-blue-300 animate-pulse" />
        </div>
        <p className="text-lg text-zinc-100">Authenticating...</p>
      </div>
    );
  }

  return currentUser ? <Dashboard /> : <LoginPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}