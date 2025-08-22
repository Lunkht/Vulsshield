// =============================
// Vulsshield - User Status Manager
// =============================
// Ce module gère le statut de progression de l'utilisateur dans le flux d'onboarding

// Clés localStorage pour le statut utilisateur
const USER_STATUS_KEYS = {
    WELCOME_SHOWN: 'vuls_welcome_shown',
    PLAN_CHOSEN: 'vuls_plan_chosen',
    TERMS_ACCEPTED: 'vuls_terms_accepted',
    ONBOARDING_COMPLETE: 'vuls_onboarding_complete'
};

// Statuts possibles
const USER_STATUS = {
    NEW_USER: 'new_user',
    PLAN_SELECTED: 'plan_selected', 
    TERMS_ACCEPTED: 'terms_accepted',
    ONBOARDING_COMPLETE: 'onboarding_complete'
};

/**
 * Obtient le statut actuel de l'utilisateur
 * @returns {string} Le statut actuel
 */
function getUserStatus() {
    try {
        const welcomeShown = localStorage.getItem(USER_STATUS_KEYS.WELCOME_SHOWN) === 'true';
        const planChosen = localStorage.getItem(USER_STATUS_KEYS.PLAN_CHOSEN);
        const termsAccepted = localStorage.getItem(USER_STATUS_KEYS.TERMS_ACCEPTED) === 'true';
        const onboardingComplete = localStorage.getItem(USER_STATUS_KEYS.ONBOARDING_COMPLETE) === 'true';

        if (onboardingComplete) {
            return USER_STATUS.ONBOARDING_COMPLETE;
        } else if (termsAccepted) {
            return USER_STATUS.TERMS_ACCEPTED;
        } else if (planChosen) {
            return USER_STATUS.PLAN_SELECTED;
        } else {
            return USER_STATUS.NEW_USER;
        }
    } catch (e) {
        console.warn('Erreur lors de la lecture du statut utilisateur:', e);
        return USER_STATUS.NEW_USER;
    }
}

/**
 * Met à jour le plan choisi par l'utilisateur
 * @param {string} planName - Nom du plan choisi
 */
function setPlanChosen(planName) {
    try {
        localStorage.setItem(USER_STATUS_KEYS.PLAN_CHOSEN, planName);
        console.log('Plan choisi enregistré:', planName);
    } catch (e) {
        console.error('Erreur lors de la sauvegarde du plan:', e);
    }
}

/**
 * Marque les conditions d'utilisation comme acceptées
 */
function setTermsAccepted() {
    try {
        localStorage.setItem(USER_STATUS_KEYS.TERMS_ACCEPTED, 'true');
        console.log('Conditions d\'utilisation acceptées');
    } catch (e) {
        console.error('Erreur lors de l\'acceptation des conditions:', e);
    }
}

/**
 * Marque l'onboarding comme terminé et permet l'accès au dashboard
 */
function setOnboardingComplete() {
    try {
        localStorage.setItem(USER_STATUS_KEYS.ONBOARDING_COMPLETE, 'true');
        console.log('Onboarding terminé');
    } catch (e) {
        console.error('Erreur lors de la finalisation de l\'onboarding:', e);
    }
}

/**
 * Marque le message de bienvenue comme affiché
 */
function setWelcomeShown() {
    try {
        localStorage.setItem(USER_STATUS_KEYS.WELCOME_SHOWN, 'true');
        console.log('Message de bienvenue affiché');
    } catch (e) {
        console.error('Erreur lors de la sauvegarde du statut de bienvenue:', e);
    }
}

/**
 * Vérifie si le message de bienvenue doit être affiché
 * @returns {boolean} true si le message doit être affiché
 */
function shouldShowWelcome() {
    try {
        const welcomeShown = localStorage.getItem(USER_STATUS_KEYS.WELCOME_SHOWN) === 'true';
        const onboardingComplete = localStorage.getItem(USER_STATUS_KEYS.ONBOARDING_COMPLETE) === 'true';
        return onboardingComplete && !welcomeShown;
    } catch (e) {
        console.warn('Erreur lors de la vérification du statut de bienvenue:', e);
        return false;
    }
}

/**
 * Obtient le plan choisi par l'utilisateur
 * @returns {string|null} Le nom du plan ou null
 */
function getChosenPlan() {
    try {
        return localStorage.getItem(USER_STATUS_KEYS.PLAN_CHOSEN);
    } catch (e) {
        console.warn('Erreur lors de la lecture du plan choisi:', e);
        return null;
    }
}

/**
 * Réinitialise le statut utilisateur (pour le debug ou nouveau compte)
 */
function resetUserStatus() {
    try {
        Object.values(USER_STATUS_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('Statut utilisateur réinitialisé');
    } catch (e) {
        console.error('Erreur lors de la réinitialisation du statut:', e);
    }
}

/**
 * Redirige l'utilisateur selon son statut actuel
 * @param {string} currentPage - Page actuelle pour éviter les boucles
 */
function redirectBasedOnStatus(currentPage = '') {
    const status = getUserStatus();
    const currentPageName = currentPage.split('/').pop() || '';

    switch (status) {
        case USER_STATUS.NEW_USER:
            if (currentPageName !== 'offres.html') {
                window.location.href = 'pages/offres.html';
            }
            break;
        case USER_STATUS.PLAN_SELECTED:
            if (currentPageName !== 'conditions.html') {
                window.location.href = 'conditions.html';
            }
            break;
        case USER_STATUS.TERMS_ACCEPTED:
            // Finaliser l'onboarding et rediriger vers le dashboard
            setOnboardingComplete();
            if (currentPageName !== 'dashboard.html') {
                window.location.href = 'pages/dashboard.html';
            }
            break;
        case USER_STATUS.ONBOARDING_COMPLETE:
            // L'utilisateur peut accéder au dashboard
            break;
    }
}

// Export des fonctions pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getUserStatus,
        setPlanChosen,
        setTermsAccepted,
        setOnboardingComplete,
        setWelcomeShown,
        shouldShowWelcome,
        getChosenPlan,
        resetUserStatus,
        redirectBasedOnStatus,
        USER_STATUS,
        USER_STATUS_KEYS
    };
}