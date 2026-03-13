
// import { getAuth } from "firebase/auth";
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyAByZ4yb6lfGvmS5QaaZOWga8qmwqN8Jm4",
//   authDomain: "netflix-clone-d30f1.firebaseapp.com",
//   projectId: "netflix-clone-d30f1",
//   storageBucket: "netflix-clone-d30f1.firebasestorage.app",
//   messagingSenderId: "162408520513",
//   appId: "1:162408520513:web:899040637460c93baf5fc0",
//   measurementId: "G-TDPP58ZQKC"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const firebaseAuth = getAuth(app);




// Import the functions you need from the SDKs you need 
import { getAuth, browserSessionPersistence, setPersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAByZ4yb6lfGvmS5QaaZOWga8qmwqN8Jm4",
  authDomain: "netflix-clone-d30f1.firebaseapp.com",
  projectId: "netflix-clone-d30f1",
  storageBucket: "netflix-clone-d30f1.firebasestorage.app",
  messagingSenderId: "162408520513",
  appId: "1:162408520513:web:899040637460c93baf5fc0",
  measurementId: "G-TDPP58ZQKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const firebaseAuth = getAuth(app);

// Session clears when tab/browser is closed
setPersistence(firebaseAuth, browserSessionPersistence).catch(console.error);