const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

let firebaseAppPromise = null;

async function getFirebaseApp() {
  if (!hasFirebaseConfig) {
    return null;
  }

  if (!firebaseAppPromise) {
    firebaseAppPromise = (async () => {
      const { initializeApp, getApps } = await import('firebase/app');
      return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    })();
  }

  return firebaseAppPromise;
}

export async function loadFirebaseAuthTools() {
  if (!hasFirebaseConfig) {
    return null;
  }

  const app = await getFirebaseApp();
  const [authMod, firestoreMod] = await Promise.all([import('firebase/auth'), import('firebase/firestore')]);

  return {
    auth: authMod.getAuth(app),
    browserLocalPersistence: authMod.browserLocalPersistence,
    onAuthStateChanged: authMod.onAuthStateChanged,
    onSnapshot: firestoreMod.onSnapshot,
    setPersistence: authMod.setPersistence,
    createUserWithEmailAndPassword: authMod.createUserWithEmailAndPassword,
    signInWithEmailAndPassword: authMod.signInWithEmailAndPassword,
    signInWithPopup: authMod.signInWithPopup,
    signOut: authMod.signOut,
    updateProfile: authMod.updateProfile,
    sendPasswordResetEmail: authMod.sendPasswordResetEmail,
    getGoogleProvider: () => new authMod.GoogleAuthProvider(),
    doc: firestoreMod.doc,
    setDoc: firestoreMod.setDoc,
    serverTimestamp: firestoreMod.serverTimestamp,
    db: firestoreMod.getFirestore(app),
  };
}

export async function loadFirebaseStoreTools() {
  if (!hasFirebaseConfig) {
    return null;
  }

  const app = await getFirebaseApp();
  const [firestoreMod, storageMod] = await Promise.all([import('firebase/firestore'), import('firebase/storage')]);

  return {
    db: firestoreMod.getFirestore(app),
    collection: firestoreMod.collection,
    deleteDoc: firestoreMod.deleteDoc,
    doc: firestoreMod.doc,
    getDocs: firestoreMod.getDocs,
    onSnapshot: firestoreMod.onSnapshot,
    orderBy: firestoreMod.orderBy,
    query: firestoreMod.query,
    serverTimestamp: firestoreMod.serverTimestamp,
    updateDoc: firestoreMod.updateDoc,
    writeBatch: firestoreMod.writeBatch,
    addDoc: firestoreMod.addDoc,
    ref: storageMod.ref,
    uploadBytes: storageMod.uploadBytes,
    getDownloadURL: storageMod.getDownloadURL,
    storage: storageMod.getStorage(app),
  };
}

export function isFirebaseReady() {
  return hasFirebaseConfig;
}