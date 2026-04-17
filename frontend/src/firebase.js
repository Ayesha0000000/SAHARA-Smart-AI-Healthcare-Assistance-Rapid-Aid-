// SAHARA | Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXjJrDBYFg6-__f9rqlTr3f7jLcxr94l4",
  authDomain: "sahara-9406c.firebaseapp.com",
  projectId: "sahara-9406c",
  storageBucket: "sahara-9406c.firebasestorage.app",
  messagingSenderId: "853461838417",
  appId: "1:853461838417:web:101dd429dd9c9a862ca670",
  measurementId: "G-80FWTQFVGK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
