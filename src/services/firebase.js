import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// Firebase API keys are safe to include in client-side code by design.
// Security is enforced by Firestore Security Rules (see /firestore.rules).
// See: https://firebase.google.com/docs/projects/api-keys
const firebaseConfig = {
    apiKey: "AIzaSyC_x18I169I-SBhHlCDqNzQE8hfbTpckOY",
    authDomain: "mitanshu-6a6f6.firebaseapp.com",
    projectId: "mitanshu-6a6f6",
    storageBucket: "mitanshu-6a6f6.firebasestorage.app",
    messagingSenderId: "9018733180",
    appId: "1:9018733180:web:b370745799ade283f5cff9",
    measurementId: "G-294BT4167H"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export { firebase };
