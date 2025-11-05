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
  authLoading: boolean;
  configLoading: boolean;
  workspaceConfig: WorkspaceConfig | null;
  reloadConfig: () => void; // Add a function to manually trigger a config reload
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [workspaceConfig, setWorkspaceConfig] = useState<WorkspaceConfig | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const reloadConfig = () => setReloadTrigger(prev => prev + 1);

  // Effect 1: Handle User Authentication State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe; // Cleanup listener on unmount
  }, []); // Run only once on component mount

  // Effect 2: Handle Workspace Configuration Loading
  useEffect(() => {
    // This effect runs when the user logs in/out, or when a reload is triggered.
    const fetchConfig = async () => {
      // Don't do anything if we don't have a user object.
      if (!currentUser) {
        setWorkspaceConfig(null);
        setConfigLoading(false); // No user means no config to load.
        return;
      }

      setConfigLoading(true); // Start loading config for the current user.
      try {
        const mappingDoc = await db.collection('mappings').doc(currentUser.uid).get();
        if (mappingDoc.exists) {
          setWorkspaceConfig(mappingDoc.data() as WorkspaceConfig);
        } else {
          // No mapping found, user needs to set it up.
          setWorkspaceConfig(null);
        }
      } catch (error) {
        console.error("Error fetching user mapping config:", error);
        setWorkspaceConfig(null); // Force to mapping screen on error
      } finally {
        setConfigLoading(false); // Finish loading
      }
    };
    
    // We only run the fetch logic after the initial authentication check is complete.
    if (!authLoading) {
      fetchConfig();
    }
  }, [currentUser, reloadTrigger, authLoading]);

  const value = {
    currentUser,
    authLoading,
    configLoading,
    workspaceConfig,
    reloadConfig,
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