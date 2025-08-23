/**
 * Shimmer Loading Effects Manager
 * Gère les effets shimmer pendant les états de chargement
 */

class ShimmerLoader {
    constructor() {
        this.loadingElements = new Set();
        this.init();
    }

    init() {
        // Simuler le chargement initial de la page
        this.simulatePageLoad();
        
        // Écouter les événements de chargement
        this.setupEventListeners();
    }

    /**
     * Simule le chargement initial de la page
     */
    simulatePageLoad() {
        // Ajouter la classe loading au body pendant le chargement initial
        document.body.classList.add('loading');
        
        // Simuler un temps de chargement de 2 secondes
        setTimeout(() => {
            document.body.classList.remove('loading');
            console.log('✅ Chargement initial terminé - effets shimmer désactivés');
        }, 2000);
    }

    /**
     * Active l'effet shimmer sur un élément pendant le chargement
     * @param {HTMLElement|string} element - Élément DOM ou sélecteur CSS
     * @param {number} duration - Durée du chargement en millisecondes (défaut: 1500ms)
     */
    startLoading(element, duration = 1500) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        // Ajouter la classe loading
        el.classList.add('loading');
        this.loadingElements.add(el);
        
        console.log('🔄 Début du chargement avec shimmer:', el);

        // Retirer la classe loading après la durée spécifiée
        setTimeout(() => {
            this.stopLoading(el);
        }, duration);
    }

    /**
     * Arrête l'effet shimmer sur un élément
     * @param {HTMLElement|string} element - Élément DOM ou sélecteur CSS
     */
    stopLoading(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.classList.remove('loading');
        this.loadingElements.delete(el);
        
        console.log('✅ Fin du chargement - shimmer désactivé:', el);
    }

    /**
     * Active le shimmer sur tous les éléments d'un conteneur
     * @param {HTMLElement|string} container - Conteneur parent
     * @param {number} duration - Durée du chargement
     */
    startContainerLoading(container, duration = 2000) {
        const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
        if (!containerEl) return;

        containerEl.classList.add('loading');
        console.log('🔄 Chargement du conteneur avec shimmer:', containerEl);

        setTimeout(() => {
            containerEl.classList.remove('loading');
            console.log('✅ Fin du chargement du conteneur:', containerEl);
        }, duration);
    }

    /**
     * Simule le chargement d'une carte de produit
     * @param {HTMLElement} card - Carte de produit
     */
    loadProductCard(card) {
        this.startLoading(card, 1200);
    }

    /**
     * Simule le chargement d'un bouton après une action
     * @param {HTMLElement} button - Bouton à charger
     */
    loadButton(button) {
        this.startLoading(button, 800);
    }

    /**
     * Configure les écouteurs d'événements pour les démonstrations
     */
    setupEventListeners() {
        // Démonstration sur les cartes de produits
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('demo-load-card')) {
                const card = e.target.closest('.product-card, .team-card, .solution-card, .whyus-card');
                if (card) {
                    this.loadProductCard(card);
                }
            }
            
            // Démonstration sur les boutons
            if (e.target.classList.contains('demo-load-button')) {
                this.loadButton(e.target);
            }
        });

        // Démonstration globale
        if (document.getElementById('demo-global-loading')) {
            document.getElementById('demo-global-loading').addEventListener('click', () => {
                this.startContainerLoading('body', 3000);
            });
        }
    }

    /**
     * Ajoute des boutons de démonstration aux éléments existants
     */
    addDemoButtons() {
        // Ajouter des boutons de démo aux cartes
        const cards = document.querySelectorAll('.product-card, .team-card, .solution-card, .whyus-card');
        cards.forEach(card => {
            if (!card.querySelector('.demo-load-card')) {
                const demoBtn = document.createElement('button');
                demoBtn.textContent = '🔄 Tester Shimmer';
                demoBtn.className = 'demo-load-card';
                demoBtn.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(237, 5, 5, 0.8);
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                    z-index: 10;
                `;
                card.style.position = 'relative';
                card.appendChild(demoBtn);
            }
        });

        // Ajouter des boutons de démo aux boutons principaux
        const buttons = document.querySelectorAll('.shimmer-button');
        buttons.forEach(button => {
            if (!button.classList.contains('demo-load-card')) {
                button.addEventListener('dblclick', () => {
                    this.loadButton(button);
                });
                button.title = button.title + ' (Double-clic pour tester le shimmer)';
            }
        });
    }

    /**
     * Méthode utilitaire pour tester tous les effets shimmer
     */
    testAllShimmers() {
        console.log('🧪 Test de tous les effets shimmer...');
        
        // Tester les boutons
        const buttons = document.querySelectorAll('.shimmer-button');
        buttons.forEach((btn, index) => {
            setTimeout(() => this.loadButton(btn), index * 200);
        });

        // Tester les cartes
        const cards = document.querySelectorAll('.shimmer-hover');
        cards.forEach((card, index) => {
            setTimeout(() => this.loadProductCard(card), index * 300);
        });
    }
}

// Initialiser le gestionnaire de shimmer au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    window.shimmerLoader = new ShimmerLoader();
    
    // Ajouter les boutons de démonstration après un délai
    setTimeout(() => {
        window.shimmerLoader.addDemoButtons();
    }, 2500);
    
    // Exposer une méthode globale pour tester
    window.testShimmers = () => window.shimmerLoader.testAllShimmers();
    
    console.log('🎨 Shimmer Loader initialisé!');
    console.log('💡 Utilisez testShimmers() dans la console pour tester tous les effets');
});