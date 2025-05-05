import { initializeApp } from "firebase/app";
import { getAnalytics }     from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  enableIndexedDbPersistence
} from "firebase/firestore";

// Firebase Configurations
const firebaseConfig = {
  apiKey: "AIzaSyAXjb8cSGmoI9vUaffTP9onqWE_VROxzeY",
  authDomain: "multi-language-compiler.firebaseapp.com",
  projectId: "multi-language-compiler",
  storageBucket: "multi-language-compiler.appspot.com",
  messagingSenderId: "788103730326",
  appId: "1:788103730326:web:3df3c8c3ba6debbb54deb7",
  measurementId: "G-PNVEWTEYMB"
};

const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db   = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn("Persistence failed-precondition:", err);
  } else if (err.code === 'unimplemented') {
    console.warn("Persistence unimplemented:", err);
  }
});
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const ref = doc(db, "users", user.uid);
    try {
      await setDoc(
        ref,
        {
          email:       user.email       || "",
          displayName: user.displayName || "",
          photoURL:    user.photoURL    || "",
          dateOfBirth: "",
          profession:  "",
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Failed to upsert user doc:", e);
    }
  }
});

export { app, analytics };
