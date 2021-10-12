// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdJ1M68f9RYbqkYdcNRK2aDs7hcfaB6t8",
  authDomain: "bernhardt-github-client.firebaseapp.com",
  databaseURL: "https://bernhardt-github-client-default-rtdb.firebaseio.com",
  projectId: "bernhardt-github-client",
  storageBucket: "bernhardt-github-client.appspot.com",
  messagingSenderId: "921983661820",
  appId: "1:921983661820:web:83591f92bd98ccff4d8979"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);