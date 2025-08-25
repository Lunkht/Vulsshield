// Variables pour gérer les menus
let activeMenu = null;

// Fonction pour fermer tous les menus
function closeAllMenus() {
    const menus = document.querySelectorAll('.dropdown-menu');
    menus.forEach(menu => {
        menu.classList.remove('active');
    });
    activeMenu = null;
}

// Fonction pour ouvrir/fermer le menu des notifications
function toggleNotificationMenu() {
    const menu = document.getElementById('notificationMenu');
    
    if (activeMenu === menu) {
        closeAllMenus();
    } else {
        closeAllMenus();
        menu.classList.add('active');
        activeMenu = menu;
    }
}

// Fonction pour ouvrir/fermer le menu utilisateur
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    
    if (activeMenu === menu) {
        closeAllMenus();
    } else {
        closeAllMenus();
        menu.classList.add('active');
        activeMenu = menu;
    }
}

// Fermer les menus en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    if (!event.target.closest('.notification-icon') && !event.target.closest('.dropdown-menu') && !event.target.closest('.user-avatar')) {
        closeAllMenus();
    }
});

// Empêcher la propagation des clics à l'intérieur des menus
document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// --- Sidebar collapse toggle ---
document.addEventListener('DOMContentLoaded', function() {
    const layout = document.querySelector('.admin-layout');
    const toggleBtn = document.getElementById('sidebarToggle');
    if (!layout || !toggleBtn) return;

    const saved = localStorage.getItem('sidebarCollapsed') === 'true';
    if (saved) layout.classList.add('sidebar-collapsed');

    function updateToggleAria() {
        const isCollapsed = layout.classList.contains('sidebar-collapsed');
        toggleBtn.setAttribute('aria-expanded', (!isCollapsed).toString());
        toggleBtn.title = isCollapsed ? 'Déplier la sidebar' : 'Réduire la sidebar';
        toggleBtn.innerHTML = isCollapsed ? '<i class="fas fa-angle-right"></i>' : '<i class="fas fa-angle-left"></i>';
    }

    updateToggleAria();

    toggleBtn.addEventListener('click', function() {
        layout.classList.toggle('sidebar-collapsed');
        const isCollapsed = layout.classList.contains('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
        updateToggleAria();
    });
});