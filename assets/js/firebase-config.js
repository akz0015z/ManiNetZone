const firebaseConfig = {
    apiKey: "AIzaSyBI0LP_3NaMdAh09A-pPAQsx7RFziOqmZs",
    authDomain: "maninetzone.firebaseapp.com",
    projectId: "maninetzone",
    storageBucket: "maninetzone.firebasestorage.app",
    messagingSenderId: "121749229372",
    appId: "1:121749229372:web:e3a088475caa3958045839"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
