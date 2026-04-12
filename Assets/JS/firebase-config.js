// Assets/JS/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove, push, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZwewZHH7ThJU5XBIwyERIvkgXaL3OF84",
  authDomain: "pharmatoolsthailand.firebaseapp.com",
  databaseURL: "https://pharmatoolsthailand-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pharmatoolsthailand",
  storageBucket: "pharmatoolsthailand.firebasestorage.app",
  messagingSenderId: "164301600139",
  appId: "1:164301600139:web:f5780cb1ade7f9c6026b8e",
  measurementId: "G-TRKNM90D8L"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, ref, set, onValue, remove, push, get, child, auth, signInWithEmailAndPassword, signOut, onAuthStateChanged };