import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from './firebaseConfig';
import firebase from 'firebase/compat/app';

// This interface is now the definitive structure for a user's mapping configuration.
export interface WorkspaceConfig {
  incomeField: string;
  expenseField: string;
  dateField: string;
  departmentField: string;
  paymentModeField: string;
  purposeField: string;
  nameField: string;
  balanceField: string;
  workersField: string;
  serialNumberField: string;
  expenseCategoryDateField: string;
  expenseCategoryDepartmentField: string;
  expenseCategoryPurposeField: string;
  expenseModeIdentifier: string;
  cashBfIdentifier: string;
  cashBalanceIdentifier: string;
}

interface AuthContextType {
  currentUser: firebase.User | null;
  isLoading: boolean;
  workspaceConfig: WorkspaceConfig | null;
  setWorkspaceConfig: (config: WorkspaceConfig | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [workspaceConfig, setWorkspaceConfig] = useState<WorkspaceConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const mappingDoc = await db.collection('mappings').doc(user.uid).get();
          if (mappingDoc.exists) {
            setWorkspaceConfig(mappingDoc.data() as WorkspaceConfig);
          } else {
            setWorkspaceConfig(null);
          }
        } catch (error) {
          console.error("Error fetching user mapping config:", error);
          setWorkspaceConfig(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        // No user, no config, loading is done.
        setWorkspaceConfig(null);
        setIsLoading(false);
      }
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const value = {
    currentUser,
    isLoading,
    workspaceConfig,
    setWorkspaceConfig, // Expose setter for optimistic updates
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