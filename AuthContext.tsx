import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from './firebaseConfig';

// Let TypeScript know that `firebase` is a global variable
declare var firebase: any;

// FIX: Added a namespace declaration for `firebase` to make the `firebase.auth.User` type available to TypeScript.
declare namespace firebase {
  namespace auth {
    interface User {}
  }
}

interface AuthContextType {
  // FIX: Corrected Firebase user type to `firebase.auth.User`. The User type is namespaced under `auth` in the Firebase compat library.
  currentUser: firebase.auth.User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Made the 'children' prop optional to resolve a TypeScript error where it was incorrectly reported as missing.
export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  // FIX: Corrected Firebase user type to `firebase.auth.User`. The User type is namespaced under `auth` in the Firebase compat library.
  const [currentUser, setCurrentUser] = useState<firebase.auth.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: firebase.auth.User | null) => {
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
