import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification, 
  signInWithPopup 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlorDXorlas_xm1FJj-j_crvc4OlRQSnk",
  authDomain: "finance-tracker-63535.firebaseapp.com",
  projectId: "finance-tracker-63535",
  storageBucket: "finance-tracker-63535.appspot.com",
  messagingSenderId: "175549985081",
  appId: "1:175549985081:web:95f6d0b5d3c47ed7c8b8e8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithPopup };













