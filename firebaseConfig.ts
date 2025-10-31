// ====================================================================================
//  CONFIGURATION COMPLETE
//  This file now contains your personal Firebase project credentials.
//  The application is ready to connect to Firebase.
//
//  NEXT STEP:
//  Go to the "Authentication" section in your Firebase project to add users.
//  You will then be able to log in with the credentials you create.
// ====================================================================================
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzftyoXX4l1GF-P-SIHORZE4uIp9zoOjw",
  authDomain: "familyguardian-c8b2c.firebaseapp.com",
  projectId: "familyguardian-c8b2c",
  storageBucket: "familyguardian-c8b2c.firebasestorage.app",
  messagingSenderId: "15413900138",
  appId: "1:15413900138:web:0846fb7e2b43052e80ab13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);