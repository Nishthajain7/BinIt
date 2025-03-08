import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

    apiKey: "AIzaSyBKYQw3PP7hR7XAMfe2egMoz14e_nD4fhM",
    authDomain: "binit-b5a03.firebaseapp.com",
    projectId: "binit-b5a03",
    storageBucket: "binit-b5a03.firebasestorage.app",
    messagingSenderId: "97160835650",
    appId: "1:97160835650:web:696c5feb91ef8aff0b33db",
    measurementId: "G-JB5D3FBD77"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
