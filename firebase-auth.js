// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC96G3sw6K9gSjWfhjstIyeOr4Wvsd9cN8",
  authDomain: "vulsshield-9f0ec.firebaseapp.com",
projectId: "vulsshield-9f0ec",
storageBucket: "vulsshield-9f0ec.firebasestorage.app",
  messagingSenderId: "746089630426",
  appId: "1:746089630426:web:532d935628d5e988cf73e3",
  measurementId: "G-HGJG72PGY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        createUserWithEmailAndPassword(auth, email, password)
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

        signInWithEmailAndPassword(auth, email, password)
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

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    const projectName = document.querySelector('.project-name');
    const userMenu = document.getElementById('userMenu');
    const logoutButton = document.querySelector('.logout');
    const userAvatar = document.querySelector('.user-avatar');
    const inscriptionButton = document.querySelector('.inscription.cta-button');
    const passwordButton = document.querySelector('.password-action-btn');

    if (user) {
        // User is signed in
        if (projectName) {
            projectName.textContent = user.displayName || user.email;
        }
        if (userMenu) {
            const userDetails = userMenu.querySelector('.user-details');
            if (userDetails) {
                userDetails.querySelector('.user-name').textContent = user.displayName || 'No Name';
                userDetails.querySelector('.user-email').textContent = user.email;
            }
        }
        if (logoutButton) {
            logoutButton.style.display = 'block';
            logoutButton.addEventListener('click', () => {
                signOut(auth).then(() => {
                    window.location.href = 'index.html';
                });
            });
        }
        if (userAvatar) {
            userAvatar.style.display = 'block';
        }
        if (inscriptionButton) {
            inscriptionButton.style.display = 'none';
        }
        if (passwordButton) {
            passwordButton.style.display = 'block';
        }

    } else {
        // User is signed out
        if (projectName) {
            projectName.textContent = 'Vulsshield Projects';
        }
        if (userAvatar) {
            userAvatar.style.display = 'none';
        }
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
        if (inscriptionButton) {
            inscriptionButton.style.display = 'block';
        }
        if (passwordButton) {
            passwordButton.style.display = 'none';
        }
    }
});
