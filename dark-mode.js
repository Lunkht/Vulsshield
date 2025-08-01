/**
 * Script pour gérer l'adaptation du logo au mode sombre
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour mettre à jour tous les logos sur la page
    function updateLogos() {
        const logos = document.querySelectorAll('.logo img');
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        logos.forEach(logo => {
            // Obtenir le chemin du logo actuel
            const currentSrc = logo.getAttribute('src');
            
            // Déterminer si nous sommes dans un sous-dossier (pages/) ou à la racine
            const isSubfolder = currentSrc.includes('../');
            const basePath = isSubfolder ? '../assets/images/' : 'assets/images/';
            
            // Définir le chemin approprié en fonction du mode
            if (isDarkMode) {
                logo.setAttribute('src', basePath + 'logo-dark.svg');
            } else {
                logo.setAttribute('src', basePath + 'logo.svg');
            }
        });
    }
    
    // Mettre à jour les logos au chargement de la page
    updateLogos();
    
    // Écouter les changements de préférence de couleur du système
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogos);
    }
});