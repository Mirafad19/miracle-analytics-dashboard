import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from './firebaseConfig';
import firebase from 'firebase/compat/app';
import { WorkspaceConfig, workspaceConfigs, defaultWorkspaceId } from './workspaceConfig';

interface AuthContextType {
  currentUser: firebase.User | null;
  authLoading: boolean;
  configLoading: boolean;
  workspaceConfig: WorkspaceConfig | null;
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setAuthLoading(false); // Initial auth check is complete

      if (user) {
        setConfigLoading(true); // Start loading the workspace config
        try {
          const userDoc = await db.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const workspaceId = userData?.workspaceId;
            const config = workspaceConfigs[workspaceId] || workspaceConfigs[defaultWorkspaceId];
            setWorkspaceConfig(config);
          } else {
            console.warn(`No user document found for UID ${user.uid}. Using default workspace.`);
            setWorkspaceConfig(workspaceConfigs[defaultWorkspaceId]);
          }
        } catch (error) {
          console.error("Error fetching user workspace config:", error);
          setWorkspaceConfig(workspaceConfigs[defaultWorkspaceId]);
        } finally {
          setConfigLoading(false); // Config loading is complete
        }
      } else {
        setWorkspaceConfig(null);
        setConfigLoading(false); // No user, so no config to load
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    authLoading,
    configLoading,
    workspaceConfig,
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