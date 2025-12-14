// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBAslhQh2a3L0KhjWWM5i9FDEOreE4R9l0",
    authDomain: "grocery-delivery-app-13a9b.firebaseapp.com",
    projectId: "grocery-delivery-app-13a9b",
    storageBucket: "grocery-delivery-app-13a9b.firebasestorage.app",
    messagingSenderId: "323725567878",
    appId: "1:323725567878:web:4d6727ffb8c2b0d9dbee07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;