import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile, UserRole } from '../types';
import { handleFirestoreError, OperationType } from '../firebase/firestoreError';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isOwnerCeo: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('ceo');
  const [loading, setLoading] = useState<boolean>(true);

  // Check if current user or email is the provisioned owner
  const isOwnerCeo =
    currentUser?.email === 'zohaibalioffical12@gmail.com' ||
    userProfile?.role === 'ceo' ||
    activeRole === 'ceo';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setCurrentUser(firebaseUser);

        // Fetch or create profile in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUserProfile(data);
            setActiveRole(data.role || 'ceo');
          } else {
            // New user registration
            const isCeo = firebaseUser.email === 'zohaibalioffical12@gmail.com';
            const defaultRole: UserRole = isCeo ? 'ceo' : 'student';

            const newProfile: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'School Member',
              role: defaultRole,
              photoUrl: firebaseUser.photoURL || '',
              status: 'active',
              createdAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            setActiveRole(defaultRole);

            // Also bootstrap admins collection if CEO
            if (isCeo) {
              const adminRef = doc(db, 'admins', firebaseUser.uid);
              await setDoc(adminRef, {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                role: 'ceo',
                assignedAt: new Date().toISOString(),
              });
            }
          }
        } catch (err) {
          console.warn('Could not read user profile from Firestore, using fallback profile:', err);
          setUserProfile({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Authenticated User',
            role: 'ceo',
            status: 'active',
            createdAt: new Date().toISOString(),
          });
          setActiveRole('ceo');
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        // Default preview role when not logged in
        setActiveRole('ceo');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        activeRole,
        setActiveRole,
        loading,
        signInWithGoogle,
        signOut,
        isOwnerCeo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
