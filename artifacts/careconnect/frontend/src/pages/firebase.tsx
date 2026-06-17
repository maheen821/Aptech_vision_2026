import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyBOhriztKWAR1Iqtt9vhJJWU2LO3bAkx4M",
  authDomain: "doctor-23be0.firebaseapp.com",
  projectId: "doctor-23be0",
  storageBucket: "doctor-23be0.firebasestorage.app",
  messagingSenderId: "256914702892",
  appId: "1:256914702892:web:9dba5cb25b372b62fa0789",
  measurementId: "G-4M4LHLJ0TC"
};

const app = initializeApp(firebaseConfig);

// ✅ THIS IS IMPORTANT
export const auth = getAuth(app);