// ====================================================================================
//  CONFIGURATION COMPLETE
//  This file now contains your personal Firebase project credentials.
//  The application is ready to connect to Firebase.
//
//  NEXT STEP:
//  Go to the "Authentication" section in your Firebase project to add users.
//  You will then be able to log in with the credentials you create.
// ====================================================================================
// FIX: Switched to Firebase v8 compatibility layer to resolve module export errors.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzftyoXX4l1GF-P-SIHORZE4uIp9zoOjw",
  authDomain: "familyguardian-c8b2c.firebaseapp.com",
  projectId: "familyguardian-c8b2c",
  storageBucket: "familyguardian-c8b2c.firebasestorage.app",
  messagingSenderId: "15413900138",
  appId: "1:15413900138:web:0846fb7e2b43052e80ab13"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = firebase.auth();