import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext(null);

const LOADING_TIMEOUT = 5000;

function isMobileBrowser() {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId = setTimeout(() => {
      console.warn('Firebase auth timeout – showing UI anyway');
      setLoading(false);
    }, LOADING_TIMEOUT);

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      },
      (error) => {
        console.error('Firebase auth error:', error);
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    );

    // Handle redirect result (Apple/Google Sign-In on mobile)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          setLoading(false);
          if (timeoutId) clearTimeout(timeoutId);
        }
      })
      .catch((error) => {
        // Ignore errors from getRedirectResult (expected when no redirect happened)
        console.warn('Redirect sign-in result check:', error.code || error.message);
      });

    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const registerWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (isMobileBrowser()) {
        // On mobile, use redirect instead of popup
        return await signInWithRedirect(auth, provider);
      }
      return await signInWithPopup(auth, provider);
    } catch (err) {
      if (
        err.code === 'auth/operation-not-supported-in-this-environment' ||
        err.code === 'auth/web-context-unsupported' ||
        err.code === 'auth/popup-blocked'
      ) {
        return signInWithRedirect(auth, provider);
      }
      throw err;
    }
  };

  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    try {
      // On mobile, Apple Sign-In works better with redirect
      if (isMobileBrowser()) {
        return await signInWithRedirect(auth, provider);
      }
      return await signInWithPopup(auth, provider);
    } catch (err) {
      if (
        err.code === 'auth/operation-not-supported-in-this-environment' ||
        err.code === 'auth/web-context-unsupported' ||
        err.code === 'auth/popup-blocked'
      ) {
        return signInWithRedirect(auth, provider);
      }
      throw err;
    }
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithApple,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
