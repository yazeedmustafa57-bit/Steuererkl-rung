import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

const LOADING_TIMEOUT = 8000;

function isMobileBrowser() {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        console.warn('Firebase auth timeout – showing UI anyway');
        setLoading(false);
      }
    }, LOADING_TIMEOUT);

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (cancelled) return;
        setUser(firebaseUser);
        setLoading(false);
        setError(null);
        clearTimeout(timeoutId);
      },
      (fbError) => {
        if (cancelled) return;
        console.error('Firebase auth error:', fbError);
        if (fbError.code === 'auth/unauthorized-domain') {
          setError({
            type: 'domain',
            message: `Diese Domain (${window.location.origin}) ist nicht für Firebase Auth freigegeben. Bitte füge sie in der Firebase-Konsole hinzu.`,
          });
        } else if (fbError.code?.includes('network') || fbError.message?.includes('network')) {
          setError({
            type: 'network',
            message: 'Netzwerkfehler – bitte prüfe deine Internetverbindung.',
          });
        } else {
          setError({
            type: 'unknown',
            message: fbError.message || 'Ein Fehler ist aufgetreten.',
          });
        }
        setLoading(false);
        clearTimeout(timeoutId);
      }
    );

    // Handle redirect result (Apple/Google Sign-In on mobile)
    getRedirectResult(auth)
      .then((result) => {
        if (cancelled) return;
        if (result?.user) {
          setUser(result.user);
          setLoading(false);
          setError(null);
          clearTimeout(timeoutId);
        }
      })
      .catch((redirectError) => {
        if (cancelled) return;
        if (redirectError.code === 'auth/unauthorized-domain' || redirectError.message?.includes('unauthorized-domain')) {
          setError({
            type: 'domain',
            message: `Diese Domain (${window.location.origin}) ist nicht für Firebase Auth freigegeben. Bitte füge sie in der Firebase-Konsole hinzu.`,
          });
          setLoading(false);
          clearTimeout(timeoutId);
        }
        console.warn('Redirect sign-in result check:', redirectError.code || redirectError.message);
      });

    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
      cancelled = true;
    };
  }, []);

  const clearAuthError = useCallback(() => setError(null), []);

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const registerWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      if (isMobileBrowser()) {
        await signInWithRedirect(auth, provider);
        return null;
      }
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (err) {
      if (err.code === 'auth/unauthorized-domain') {
        setError({ type: 'domain', message: `Domain nicht autorisiert. Bitte füge ${window.location.origin} in der Firebase-Konsole hinzu.` });
        throw err;
      }
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
    provider.setCustomParameters({
      locale: 'de-DE',
    });
    try {
      // Apple Sign-In works best with redirect for cross-browser compatibility
      await signInWithRedirect(auth, provider);
      return null;
    } catch (err) {
      if (
        err.code === 'auth/operation-not-supported-in-this-environment' ||
        err.code === 'auth/unauthorized-domain'
      ) {
        setError({
          type: 'domain',
          message: err.code === 'auth/unauthorized-domain'
            ? `Domain nicht autorisiert. Bitte füge ${window.location.origin} in der Firebase-Konsole hinzu.`
            : 'Apple Anmeldung wird in diesem Browser nicht unterstützt.',
        });
        throw err;
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
        authError: error,
        clearAuthError,
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
