import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Cole a configuração do seu projeto Firebase aqui
const firebaseConfig = {
  apiKey: "AIzaSyA9s3TTgY1jDZihF_nJ1-0zhF4EuWW1bMQ",
  authDomain: "budgetmanager-31d09.firebaseapp.com",
  projectId: "budgetmanager-31d09",
  storageBucket: "budgetmanager-31d09.firebasestorage.app",
  messagingSenderId: "595047601522",
  appId: "1:595047601522:web:bcc84dcb844c96b99239eb",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { app, auth, googleProvider };
