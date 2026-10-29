import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, testFirestoreConnection } from '../firebase';
import { UserProfile } from '../types/lms';
import { getOrCreateUserProfile, addXPToUser } from '../services/lmsService';

// Bootstrapped admin email from runtime
const BOOTSTRAP_ADMIN_EMAIL = 'muhammad.syauqi.2302316@students.um.ac.id';
const ADMIN_SESSION_KEY = 'al_fusha_admin_session';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsAdmin: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize connection check and auth listeners
  useEffect(() => {
    testFirestoreConnection();

    // Check existing admin custom session
    const savedAdminSession = localStorage.getItem(ADMIN_SESSION_KEY);
    if (savedAdminSession) {
      try {
        const parsed = JSON.parse(savedAdminSession);
        setUserProfile(parsed);
        setIsLoading(false);
        return;
      } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const isRuntimeAdmin = user.email === BOOTSTRAP_ADMIN_EMAIL;
          const profile = await getOrCreateUserProfile(
            user.uid,
            user.email || '',
            user.displayName || '',
            user.photoURL || '',
            isRuntimeAdmin
          );
          setUserProfile(profile);
        } catch (err) {
          console.error('Error getting or creating user profile in Firestore:', err);
          // Fallback profile to prevent app crash if Firestore is offline
          setUserProfile({
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Siswa Al-Fusha',
            photoURL: user.photoURL || '',
            role: user.email === BOOTSTRAP_ADMIN_EMAIL ? 'admin' : 'student',
            xp: 100,
            streak: 1,
            level: "Mubtadi' (Pemula)"
          });
        }
      } else {
        // If not logged in via Firebase and no admin session, set profile to null
        const currentAdmin = localStorage.getItem(ADMIN_SESSION_KEY);
        if (!currentAdmin) {
          setUserProfile(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const isRuntimeAdmin = result.user.email === BOOTSTRAP_ADMIN_EMAIL;
      const profile = await getOrCreateUserProfile(
        result.user.uid,
        result.user.email || '',
        result.user.displayName || '',
        result.user.photoURL || '',
        isRuntimeAdmin
      );
      setUserProfile(profile);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (error: unknown) {
      console.error('Google Sign-In Error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const adminProfile: UserProfile = {
          id: data.adminUser.id,
          email: data.adminUser.email,
          displayName: data.adminUser.displayName,
          role: 'admin',
          xp: 9999,
          streak: 30,
          level: "Mutaqaddim (Ustadz / Admin)"
        };
        setUserProfile(adminProfile);
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminProfile));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Login admin gagal' };
      }
    } catch (err: unknown) {
      // Local fallback for admin123 / 12345 in case of proxy delay
      if (username === 'admin123' && password === '12345') {
        const adminProfile: UserProfile = {
          id: 'admin_sys_123',
          email: 'admin123@alfusha-lms.internal',
          displayName: 'Administrator Al-Fusha',
          role: 'admin',
          xp: 9999,
          streak: 30,
          level: "Mutaqaddim (Ustadz / Admin)"
        };
        setUserProfile(adminProfile);
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminProfile));
        return { success: true, message: 'Login admin berhasil' };
      }
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Koneksi ke server gagal'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      await signOut(auth);
      setFirebaseUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Sign-out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addXP = async (amount: number) => {
    if (!userProfile) return;
    try {
      if (firebaseUser) {
        await addXPToUser(userProfile.id, amount);
      }
      setUserProfile((prev) => (prev ? { ...prev, xp: prev.xp + amount } : null));
    } catch (err) {
      console.error('Failed to update XP:', err);
    }
  };

  const refreshProfile = async () => {
    if (firebaseUser) {
      const isRuntimeAdmin = firebaseUser.email === BOOTSTRAP_ADMIN_EMAIL;
      const profile = await getOrCreateUserProfile(
        firebaseUser.uid,
        firebaseUser.email || '',
        firebaseUser.displayName || '',
        firebaseUser.photoURL || '',
        isRuntimeAdmin
      );
      setUserProfile(profile);
    }
  };

  const isAdmin = userProfile?.role === 'admin' || userProfile?.email === BOOTSTRAP_ADMIN_EMAIL;

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        isAdmin,
        isLoading,
        loginWithGoogle,
        loginAsAdmin,
        logout,
        addXP,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
