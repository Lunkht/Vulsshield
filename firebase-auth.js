
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDCPG79NnAI0dosZfqi-Dgua3NWnmJ5XaQ",
  authDomain: "forge-643b5.firebaseapp.com",
  projectId: "forge-643b5",
  storageBucket: "forge-643b5.firebasestorage.app",
  messagingSenderId: "41015118503",
  appId: "1:41015118503:web:315036db6e7bdbc6c66982",
  measurementId: "G-2N913H7J6W"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('User created:', user);
                window.location.href = 'index.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error signing up:', errorCode, errorMessage);
                alert(`Error: ${errorMessage}`);
            });
    });
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('User logged in:', user);
                window.location.href = 'index.html';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error logging in:', errorCode, errorMessage);
                alert(`Error: ${errorMessage}`);
            });
    });
}