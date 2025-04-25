import {
  EmailAuthProvider,
  User,
  isSignInWithEmailLink,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
  updatePassword,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { auth, db } from '../configs/firebase';
import { Permission } from '../models/permissions';

interface UserData {
  email: string;
  permissions: Permission[];
  loginCount: number;
  lastLogin: { seconds: number; nanoseconds: number } | null;
  hasPassword?: boolean;
}

interface AuthContextProps {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  sendLoginLink: (email: string) => Promise<boolean>;
  confirmSignIn: (email: string) => Promise<boolean>;
  loginWithPassword: (email: string, password: string) => Promise<boolean>;
  setUserPassword: (
    password: string,
    currentPassword?: string,
  ) => Promise<boolean>;
  checkUserExists: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHasPermission = (permission: Permission): boolean => {
    if (!userData || !userData.permissions || userData.permissions.length === 0)
      return false;
    return userData.permissions.includes(permission);
  };

  const checkHasAnyPermission = (permissions: Permission[]): boolean => {
    if (!userData || !userData.permissions || userData.permissions.length === 0)
      return false;
    return permissions.some((permission) =>
      userData.permissions.includes(permission),
    );
  };

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar se o usuário existe:', error);
      return false;
    }
  };

  const sendLoginLink = async (email: string): Promise<boolean> => {
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return true;
    } catch (error) {
      console.error('Erro ao enviar link de login:', error);
      return false;
    }
  };

  const loginWithPassword = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (result.user) {
        const userDocRef = doc(db, 'users', result.user.uid);
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
          loginCount: increment(1),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login com senha:', error);
      return false;
    }
  };

  const setUserPassword = async (
    password: string,
    currentPassword?: string,
  ): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      if (currentPassword && userData?.hasPassword) {
        const credential = EmailAuthProvider.credential(
          currentUser.email || '',
          currentPassword,
        );
        await reauthenticateWithCredential(currentUser, credential);
      }

      await updatePassword(currentUser, password);

      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        hasPassword: true,
      });

      if (userData) {
        setUserData({ ...userData, hasPassword: true });
      }

      return true;
    } catch (error) {
      console.error('Erro ao configurar senha:', error);
      return false;
    }
  };

  const confirmSignIn = async (email: string): Promise<boolean> => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      return false;
    }

    try {
      const result = await signInWithEmailLink(
        auth,
        email,
        window.location.href,
      );
      window.localStorage.removeItem('emailForSignIn');

      if (result.user) {
        const userDocRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            lastLogin: serverTimestamp(),
            loginCount: increment(1),
          });
        } else {
          await setDoc(userDocRef, {
            email: result.user.email,
            permissions: [Permission.DASHBOARD_VIEW],
            loginCount: 1,
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp(),
            hasPassword: false,
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao confirmar login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              ...data,
              permissions: data.permissions || [Permission.DASHBOARD_VIEW],
            } as UserData);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }

        setLoading(false);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    sendLoginLink,
    confirmSignIn,
    loginWithPassword,
    setUserPassword,
    checkUserExists,
    logout,
    hasPermission: checkHasPermission,
    hasAnyPermission: checkHasAnyPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
