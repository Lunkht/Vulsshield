import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    const userProfileSection = document.querySelector('.user-profile-section');
    const mainContent = document.querySelector('main');

    if (user) {
        // User is signed in, show the page content
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        if (userProfileSection) {
            const userName = userProfileSection.querySelector('h2');
            const userEmail = userProfileSection.querySelector('.user-email-large');
            if (userName) {
                userName.textContent = user.displayName || 'No Name';
            }
            if (userEmail) {
                userEmail.textContent = user.email;
            }
        }
    } else {
        // No user is signed in, redirect to the login page
        if (mainContent) {
            mainContent.style.display = 'none';
        }
        // Redirect to the login page, assuming it's at the root level
        window.location.href = '../connexion.html';
    }
});
