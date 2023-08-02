// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp7rOWiQPKADcUZ2D_KLWdpYqPNVZQ9G8",
  authDomain: "agriconnect-uganda.firebaseapp.com",
  projectId: "agriconnect-uganda",
  storageBucket: "agriconnect-uganda.appspot.com",
  messagingSenderId: "154194491896",
  appId: "1:154194491896:web:8e8ec4822450afd7313e0d",
  measurementId: "G-N417D4D675"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);

export {  auth, db, storage };