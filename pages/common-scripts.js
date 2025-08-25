/* ===== SCRIPTS COMMUNS POUR LES PAGES ADMINISTRATIVES ===== */

// Classe principale pour la gestion des pages administratives
class AdminPageManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadIncludes();
        this.initSidebar();
        this.initTabs();
        this.initToggles();
        this.initDropdowns();
        this.initSearch();
        this.initNotifications();
        this.bindEvents();
    }

    // Chargement des composants inclus
    async loadIncludes() {
        const includes = document.querySelectorAll('[data-include]');
        for (const el of includes) {
            const filePath = el.getAttribute('data-include');
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const html = await response.text();
                    el.innerHTML = html;
                } else {
                    console.error(`Failed to load include: ${filePath}`);
                    el.innerHTML = `<p style="color:red;">Error loading ${filePath}</p>`;
                }
            } catch (error) {
                console.error(`Error fetching include: ${filePath}`, error);
                el.innerHTML = `<p style="color:red;">Error loading ${filePath}</p>`;
            }
        }
    }

    // Gestion de la sidebar
    initSidebar() {
        // La logique de la sidebar est maintenant chargée dynamiquement
        // Nous devons nous assurer que les éléments sont présents avant d'attacher les écouteurs
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
            });

            // Restaurer l'état de la sidebar
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
            }
        }

        // Gestion responsive
        this.handleResponsiveSidebar();
    }

    handleResponsiveSidebar() {
        const sidebar = document.querySelector('.admin-sidebar');
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 99;
            display: none;
        `;
        document.body.appendChild(overlay);

        // Toggle mobile sidebar
        window.toggleMobileSidebar = () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-open');
                overlay.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
            }
        };

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            overlay.style.display = 'none';
        });
    }

    // Gestion des onglets
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Désactiver tous les onglets
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Activer l'onglet sélectionné
                button.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // Gestion des toggles/switches
    initToggles() {
        const toggles = document.querySelectorAll('.toggle-switch input');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const settingName = e.target.getAttribute('data-setting');
                const isEnabled = e.target.checked;
                
                if (settingName) {
                    this.saveSetting(settingName, isEnabled);
                    this.handleSettingChange(settingName, isEnabled);
                }
            });
        });
    }

    // Gestion des dropdowns
    initDropdowns() {
        document.addEventListener('click', (e) => {
            const dropdownToggle = e.target.closest('[data-dropdown-target]');

            // Fermer tous les dropdowns ouverts, sauf celui qui est cliqué
            const openDropdowns = document.querySelectorAll('.dropdown-menu.active');
            openDropdowns.forEach(dropdown => {
                // Si le clic n'est pas sur le toggle du dropdown actuel, ni à l'intérieur du dropdown
                if (!dropdown.contains(e.target) && (!dropdownToggle || dropdown.id !== dropdownToggle.getAttribute('data-dropdown-target'))) {
                    dropdown.classList.remove('active');
                }
            });

            if (dropdownToggle) {
                const targetId = dropdownToggle.getAttribute('data-dropdown-target');
                const targetDropdown = document.getElementById(targetId);
                if (targetDropdown) {
                    targetDropdown.classList.toggle('active');
                }
            }
        });
    }

    // Gestion de la recherche
    initSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        
        searchInputs.forEach(input => {
            let searchTimeout;
            
            input.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });
        });
    }

    // Gestion des notifications
    initNotifications() {
        this.notifications = [];
        this.createNotificationContainer();
    }

    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 9999;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
    }

    // Événements globaux
    bindEvents() {
        // Gestion des formulaires
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('admin-form')) {
                this.handleFormSubmit(e);
            }
        });

        // Gestion des boutons de sauvegarde
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('save-btn')) {
                this.handleSave(e);
            }
        });
    }

    // Méthodes utilitaires
    saveSetting(name, value) {
        const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
        settings[name] = value;
        localStorage.setItem('adminSettings', JSON.stringify(settings));
    }

    getSetting(name, defaultValue = null) {
        const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
        return settings[name] !== undefined ? settings[name] : defaultValue;
    }

    handleSettingChange(name, value) {
        // Logique spécifique selon le paramètre
        switch (name) {
            case 'darkMode':
                document.body.classList.toggle('dark-mode', value);
                break;
            case 'animations':
                document.body.classList.toggle('no-animations', !value);
                break;
            case 'autoSave':
                this.toggleAutoSave(value);
                break;
        }
    }

    performSearch(query) {
        // Implémentation de la recherche selon la page
        console.log('Recherche:', query);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Afficher un indicateur de chargement
        this.showLoading(form);
        
        // Simuler une sauvegarde
        setTimeout(() => {
            this.hideLoading(form);
            this.showNotification('Paramètres sauvegardés avec succès', 'success');
        }, 1000);
    }

    handleSave(e) {
        const button = e.target;
        const originalText = button.textContent;
        
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sauvegarde...';
        
        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
            this.showNotification('Sauvegardé', 'success');
        }, 1000);
    }

    showLoading(element) {
        element.classList.add('loading');
    }

    hideLoading(element) {
        element.classList.remove('loading');
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fade-in`;
        notification.style.cssText = `
            background: var(--admin-bg-secondary);
            border: 1px solid var(--admin-border);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            box-shadow: var(--admin-shadow);
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--admin-text-primary);
        `;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: var(--admin-text-muted);
                cursor: pointer;
                margin-left: auto;
                padding: 4px;
            ">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.getElementById('notification-container').appendChild(notification);
        
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, duration);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle text-success',
            error: 'fas fa-exclamation-circle text-danger',
            warning: 'fas fa-exclamation-triangle text-warning',
            info: 'fas fa-info-circle text-primary'
        };
        return icons[type] || icons.info;
    }

    // Méthodes pour les animations
    animateElement(element, animation = 'fadeIn') {
        element.classList.add(animation);
        element.addEventListener('animationend', () => {
            element.classList.remove(animation);
        }, { once: true });
    }

    // Validation de formulaire
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Ce champ est requis');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const error = document.createElement('div');
        error.className = 'field-error';
        error.style.cssText = `
            color: var(--admin-danger);
            font-size: 12px;
            margin-top: 4px;
        `;
        error.textContent = message;
        
        field.parentElement.appendChild(error);
        field.style.borderColor = 'var(--admin-danger)';
    }

    clearFieldError(field) {
        const error = field.parentElement.querySelector('.field-error');
        if (error) {
            error.remove();
        }
        field.style.borderColor = '';
    }
}

// Fonctions globales pour la compatibilité
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-hidden', 'true');
        tab.setAttribute('tabindex', '-1');
    });
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
    });
    
    const targetTab = document.getElementById(tabName);
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    
    if (targetTab) {
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-hidden', 'false');
        targetTab.setAttribute('tabindex', '0');
        targetTab.focus();
    }
    
    if (targetButton) {
        targetButton.classList.add('active');
        targetButton.setAttribute('aria-selected', 'true');
        targetButton.setAttribute('tabindex', '0');
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', async () => {
    window.adminManager = new AdminPageManager();
    await window.adminManager.loadIncludes();

    // Le reste de l'initialisation qui dépend des éléments chargés
    window.adminManager.initSidebar();
    window.adminManager.initTabs();
    window.adminManager.initToggles();
    window.adminManager.initDropdowns();
    window.adminManager.initSearch();
    window.adminManager.initNotifications();
    window.adminManager.bindEvents();
    
    // Gestion des onglets avec data-tab
    document.querySelectorAll('[data-tab]').forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
        
        // Navigation clavier pour les onglets
        button.addEventListener('keydown', function(e) {
            const tabButtons = Array.from(document.querySelectorAll('[data-tab]'));
            const currentIndex = tabButtons.indexOf(this);
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
                    tabButtons[prevIndex].focus();
                    tabButtons[prevIndex].click();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
                    tabButtons[nextIndex].focus();
                    tabButtons[nextIndex].click();
                    break;
                case 'Home':
                    e.preventDefault();
                    tabButtons[0].focus();
                    tabButtons[0].click();
                    break;
                case 'End':
                    e.preventDefault();
                    tabButtons[tabButtons.length - 1].focus();
                    tabButtons[tabButtons.length - 1].click();
                    break;
            }
        });
    });
    
    // Gestion des toggles avec data-setting
    document.querySelectorAll('[data-setting]').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.getAttribute('data-setting');
            const value = this.checked;
            console.log(`Setting ${setting} changed to:`, value);
            // Ici vous pouvez ajouter la logique de sauvegarde
        });
    });
    
    // Amélioration de l'accessibilité pour les boutons
    document.querySelectorAll('.btn').forEach(button => {
        if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
            const icon = button.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                if (iconClass.includes('fa-save')) button.setAttribute('aria-label', 'Enregistrer');
                else if (iconClass.includes('fa-edit')) button.setAttribute('aria-label', 'Modifier');
                else if (iconClass.includes('fa-trash')) button.setAttribute('aria-label', 'Supprimer');
                else if (iconClass.includes('fa-plus')) button.setAttribute('aria-label', 'Ajouter');
                else if (iconClass.includes('fa-sync')) button.setAttribute('aria-label', 'Synchroniser');
                else if (iconClass.includes('fa-refresh')) button.setAttribute('aria-label', 'Actualiser');
            }
        }
    });
    
    // Gestion de l'échappement pour fermer les modales/dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Fermer les dropdowns ouverts
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            // Fermer les modales ouvertes
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
    
    // Initialiser AOS si disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true
        });
    }
});

// Export pour utilisation modulaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminPageManager;
}