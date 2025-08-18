import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
            const avatarLarge = userProfileSection.querySelector('.user-avatar-large');

            const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'Utilisateur');

            if (userName) {
                userName.textContent = displayName;
            }
            if (userEmail) {
                userEmail.textContent = user.email || '';
            }
            if (avatarLarge) {
                // Replace placeholder with user avatar or initial
                avatarLarge.innerHTML = '';
                if (user.photoURL) {
                    const img = document.createElement('img');
                    img.src = user.photoURL;
                    img.alt = 'Avatar';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '50%';
                    avatarLarge.appendChild(img);
                } else {
                    const span = document.createElement('span');
                    span.textContent = displayName.charAt(0).toUpperCase();
                    span.style.display = 'flex';
                    span.style.alignItems = 'center';
                    span.style.justifyContent = 'center';
                    span.style.width = '100%';
                    span.style.height = '100%';
                    span.style.fontSize = '2rem';
                    span.style.color = '#fff';
                    avatarLarge.appendChild(span);
                }
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
