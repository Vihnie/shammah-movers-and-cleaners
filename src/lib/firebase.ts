import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  type User 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const googleAuthProvider = new GoogleAuthProvider();
// Request Google Workspace scopes for Google Sheets and Drive
googleAuthProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

// Cache the Google OAuth access token in memory (never in localStorage)
let cachedGoogleAccessToken: string | null = null;
let isSigningIn = false;

export const getGoogleAccessToken = (): string | null => {
  return cachedGoogleAccessToken;
};

export const setGoogleAccessToken = (token: string | null) => {
  cachedGoogleAccessToken = token;
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string; idToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleAuthProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || '';
    if (accessToken) {
      cachedGoogleAccessToken = accessToken;
    }
    const idToken = await result.user.getIdToken();
    return { user: result.user, accessToken, idToken };
  } catch (error: any) {
    console.error('Firebase Google sign-in failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    cachedGoogleAccessToken = null;
  } catch (error) {
    console.error('Sign out failed:', error);
  }
};

export const initAuthListener = (
  onSuccess?: (user: User) => void,
  onSignedOut?: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (onSuccess) onSuccess(user);
    } else {
      cachedGoogleAccessToken = null;
      if (onSignedOut) onSignedOut();
    }
  });
};
