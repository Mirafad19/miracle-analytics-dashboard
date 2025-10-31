import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from './firebaseConfig';
// FIX: Using Firebase v8 compatible User type.
import firebase from 'firebase/app';
import 'firebase/auth';

interface AuthContextType {
  // FIX: Using firebase.User type from v8 API.
  currentUser: firebase.User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  // FIX: Using firebase.User type from v8 API.
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Using firebase.User type from v8 API.
    const unsubscribe = auth.onAuthStateChanged((user: firebase.User | null) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
