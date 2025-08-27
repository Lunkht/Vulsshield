// Initialisation AOS (gardée)
AOS.init({
    duration: 1000,
    once: true,
});

// --- Menus déroulants (Feedback, Notifications, Utilisateur) ---
let activeMenu = null;

function closeAllMenus() {
    const menus = document.querySelectorAll('.dropdown-menu');
    menus.forEach(menu => {
        menu.classList.remove('active');
    });
    activeMenu = null;
}

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    if (activeMenu === menu) {
        closeAllMenus();
    } else {
        closeAllMenus();
        menu.classList.add('active');
        activeMenu = menu;
    }
}

// Assurez-vous d'avoir ces IDs dans votre HTML pour les boutons de déclenchement
document.querySelector('.notification-icon')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu('notificationMenu');
});
document.querySelector('.user-avatar')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu('userMenu');
});
document.querySelector('.feedback-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu('feedbackMenu');
});

// Fermer les menus en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    if (activeMenu && !event.target.closest('.dropdown-menu') && !event.target.closest('.notification-icon') && !event.target.closest('.user-avatar') && !event.target.closest('.feedback-btn')) {
        closeAllMenus();
    }
});

// Empêcher la propagation des clics à l'intérieur des menus pour qu'ils ne se ferment pas immédiatement
document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// Fonctions de feedback
function submitFeedback() {
    const type = document.getElementById('feedbackType').value;
    const message = document.getElementById('feedbackMessage').value;
    const email = document.getElementById('feedbackEmail').value;
    console.log('Feedback Submitted:', { type, message, email });
    alert('Merci pour votre feedback !');
    closeAllMenus(); // Ferme le menu après soumission
}

function closeFeedbackMenu() {
    closeAllMenus();
}

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

// --- Fonctions de pilotage de drones (exemples) ---

let isDroneConnected = false;
let isDroneFlying = false;
let isRecording = false;
let flightTimeInterval;
let startTime = 0;

function updateDroneStatus(connected) {
    const droneStatusElements = document.querySelectorAll('.drone-status');
    droneStatusElements.forEach(el => {
        if (connected) {
            el.classList.remove('disconnected');
            el.classList.add('connected');
            el.querySelector('.fa-circle').style.color = 'var(--success-color)';
            if(el.querySelector('.battery-level')) el.querySelector('.battery-level').style.width = '85%';
            if(el.querySelector('.battery-text')) el.querySelector('.battery-text').textContent = '85%';
            el.querySelectorAll('.signal-bar').forEach((bar, i) => {
                if (i < 4) bar.classList.add('active'); // 4 barres actives pour une bonne connexion
                else bar.classList.remove('active');
            });
            if(el.querySelector('.stat-value')) el.querySelector('.stat-value').textContent = '0m'; // Altitude
        } else {
            el.classList.remove('connected');
            el.classList.add('disconnected');
            el.querySelector('.fa-circle').style.color = 'var(--danger-color)';
            if(el.querySelector('.battery-level')) el.querySelector('.battery-level').style.width = '0%';
            if(el.querySelector('.battery-text')) el.querySelector('.battery-text').textContent = '--';
            el.querySelectorAll('.signal-bar').forEach(bar => bar.classList.remove('active'));
            if(el.querySelector('.stat-value')) el.querySelector('.stat-value').textContent = '--'; // Altitude
        }
    });
    isDroneConnected = connected;
    updateControlButtons();
}

function updateControlButtons() {
    const takeoffBtn = document.getElementById('takeoffBtn');
    const landBtn = document.getElementById('landBtn');

    if (takeoffBtn) takeoffBtn.disabled = !isDroneConnected || isDroneFlying;
    if (landBtn) landBtn.disabled = !isDroneConnected || !isDroneFlying;
}

function connectDrone() {
    console.log('Tentative de connexion du drone...');
    // Simule une connexion après 2 secondes
    setTimeout(() => {
        updateDroneStatus(true);
        console.log('Drone connecté !');
        // Mettre à jour les informations d'overlay et de télémétrie
        updateTelemetryDisplay({
            latitude: '48.8566° N',
            longitude: '2.3522° E',
            altitude: '0 m',
            groundSpeed: '0 km/h',
            verticalSpeed: '0 m/s',
            direction: 'N 0°',
            batteryLevel: '85%',
            voltage: '11.4V',
            remainingTime: '22 min',
            signalStrength: '-45 dBm',
            distance: '0 m',
            latency: '12 ms'
        });
        startFlightTimer();
    }, 2000);
}

function calibrateDrone() {
    console.log('Calibrage du drone...');
    // Logique de calibrage
    addLog('success', 'Calibration terminée.');
}

function takeOff() {
    if (!isDroneConnected) {
        alert("Veuillez connecter le drone d'abord !");
        return;
    }
    console.log('Décollage du drone...');
    isDroneFlying = true;
    updateControlButtons();
    addLog('info', 'Drone en phase de décollage...');
    document.getElementById('currentAltitude').textContent = '10m'; // Simule l'altitude
    document.getElementById('telemetryAltitude').textContent = '10m';
}

function land() {
    if (!isDroneConnected || !isDroneFlying) {
        alert("Le drone n'est pas en vol.");
        return;
    }
    console.log('Atterrissage du drone...');
    isDroneFlying = false;
    updateControlButtons();
    addLog('info', 'Drone en phase d\'atterrissage...');
    document.getElementById('currentAltitude').textContent = '0m';
    document.getElementById('telemetryAltitude').textContent = '0m';
    stopFlightTimer();
}

function hover() {
    if (!isDroneConnected || !isDroneFlying) {
        alert("Le drone n'est pas en vol.");
        return;
    }
    console.log('Vol stationnaire activé.');
    addLog('info', 'Mode vol stationnaire activé.');
}

function emergencyStop() {
    if (!isDroneConnected) {
        alert("Aucun drone connecté à arrêter.");
        return;
    }
    console.warn('Arrêt d\'urgence activé !');
    isDroneFlying = false;
    updateControlButtons();
    addLog('danger', 'Arrêt d\'urgence activé ! Drone en chute libre ou atterrissage forcé.');
    stopFlightTimer();
}

// --- Joysticks (logique simplifiée) ---
function setupJoystick(joystickId, knobId, xValueId, yValueId, type) {
    const joystick = document.getElementById(joystickId);
    const knob = document.getElementById(knobId);
    const xValueDisplay = document.getElementById(xValueId);
    const yValueDisplay = document.getElementById(yValueId);

    if (!joystick || !knob || !xValueDisplay || !yValueDisplay) return;

    let isDragging = false;

    knob.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        knob.style.transition = 'none'; // Désactive la transition pendant le drag
        joystick.classList.add('active'); // Style d'activation si besoin
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const rect = joystick.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        let x = e.clientX - center.x;
        let y = e.clientY - center.y;

        // Limiter le déplacement du knob dans le cercle du joystick
        const maxRadius = rect.width / 2 - knob.offsetWidth / 2;
        const distance = Math.sqrt(x * x + y * y);

        if (distance > maxRadius) {
            const angle = Math.atan2(y, x);
            x = Math.cos(angle) * maxRadius;
            y = Math.sin(angle) * maxRadius;
        }

        knob.style.left = `${x + rect.width / 2}px`;
        knob.style.top = `${y + rect.height / 2}px`;

        // Normalisation des valeurs entre -100 et 100 ou -1 et 1
        const normalizedX = Math.round((x / maxRadius) * 100);
        const normalizedY = Math.round((-y / maxRadius) * 100); // Y inversé pour haut positif

        if (type === 'left') { // Altitude / Rotation
            document.getElementById('altitudeValue').textContent = normalizedY;
            document.getElementById('rotationValue').textContent = normalizedX;
            // Envoyer les commandes au drone (simulé)
            console.log(`Commandes gauche - Altitude: ${normalizedY}, Rotation: ${normalizedX}`);
        } else if (type === 'right') { // Avant/Arrière - Gauche/Droite
            document.getElementById('xValue').textContent = normalizedX;
            document.getElementById('yValue').textContent = normalizedY;
            // Envoyer les commandes au drone (simulé)
            console.log(`Commandes droite - X: ${normalizedX}, Y: ${normalizedY}`);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            knob.style.transition = 'left 0.1s ease-out, top 0.1s ease-out, transform 0.1s ease'; // Rétablit la transition
            // Ramener le knob au centre
            knob.style.left = '50%';
            knob.style.top = '50%';
            joystick.classList.remove('active'); // Enlève le style d'activation

            // Réinitialiser les valeurs
            if (type === 'left') {
                document.getElementById('altitudeValue').textContent = '0';
                document.getElementById('rotationValue').textContent = '0';
            } else if (type === 'right') {
                document.getElementById('xValue').textContent = '0';
                document.getElementById('yValue').textContent = '0';
            }
            console.log('Joystick relâché, commandes réinitialisées.');
        }
    });
}

// Initialiser les joysticks
document.addEventListener('DOMContentLoaded', () => {
    setupJoystick('leftJoystick', 'leftKnob', 'rotationValue', 'altitudeValue', 'left'); // Note: xValue pour rotation, yValue pour altitude
    setupJoystick('rightJoystick', 'rightKnob', 'xValue', 'yValue', 'right'); // Note: xValue pour droite/gauche, yValue pour avant/arrière
});


// --- Vues Caméra/Carte ---
function switchView(viewType) {
    document.getElementById('cameraView').classList.remove('active');
    document.getElementById('mapView').classList.remove('active');
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));

    if (viewType === 'camera') {
        document.getElementById('cameraView').classList.add('active');
        document.querySelector('.view-btn:nth-child(1)').classList.add('active');
        console.log('Passage à la vue caméra.');
    } else if (viewType === 'map') {
        document.getElementById('mapView').classList.add('active');
        document.querySelector('.view-btn:nth-child(2)').classList.add('active');
        console.log('Passage à la vue carte.');
    }
}

function takePhoto() {
    console.log('Photo prise !');
    addLog('info', 'Photo prise avec succès.');
    // Implémentation réelle : capture d'écran du flux vidéo ou commande au drone
}

function startRecording() {
    const recordBtn = document.getElementById('recordBtn');
    if (!isRecording) {
        console.log('Enregistrement vidéo démarré.');
        recordBtn.classList.add('recording');
        recordBtn.innerHTML = '<i class="fas fa-stop"></i>';
        addLog('info', 'Enregistrement vidéo démarré.');
    } else {
        console.log('Enregistrement vidéo arrêté.');
        recordBtn.classList.remove('recording');
        recordBtn.innerHTML = '<i class="fas fa-video"></i>';
        addLog('info', 'Enregistrement vidéo arrêté.');
    }
    isRecording = !isRecording;
}

function toggleGimbal() {
    console.log('Basculement du contrôle de la nacelle.');
    addLog('info', 'Contrôle de la nacelle basculé.');
    // Implémentation réelle : activer/désactiver le contrôle du gimbal
}

// --- Modes de vol et vitesse ---
function changeFlightMode() {
    const mode = document.querySelector('.mode-select').value;
    console.log(`Mode de vol changé: ${mode}`);
    addLog('info', `Mode de vol changé en : ${mode}.`);
    // Envoyer la commande de mode de vol au drone
}

function adjustSpeed() {
    const speedSlider = document.querySelector('.speed-slider');
    const speedDisplay = document.querySelector('.speed-display');
    const speed = speedSlider.value;
    speedDisplay.textContent = `${speed}/10`;
    console.log(`Vitesse ajustée à: ${speed}/10`);
    // Envoyer la commande de vitesse au drone
}

// --- Télémétrie et Logs ---
function updateTelemetryDisplay(data) {
    if (document.getElementById('latitude')) document.getElementById('latitude').textContent = data.latitude;
    if (document.getElementById('longitude')) document.getElementById('longitude').textContent = data.longitude;
    if (document.getElementById('telemetryAltitude')) document.getElementById('telemetryAltitude').textContent = data.altitude;
    if (document.getElementById('groundSpeed')) document.getElementById('groundSpeed').textContent = data.groundSpeed;
    if (document.getElementById('verticalSpeed')) document.getElementById('verticalSpeed').textContent = data.verticalSpeed;
    if (document.getElementById('direction')) document.getElementById('direction').textContent = data.direction;
    if (document.getElementById('batteryLevel')) document.getElementById('batteryLevel').textContent = data.batteryLevel;
    if (document.getElementById('voltage')) document.getElementById('voltage').textContent = data.voltage;
    if (document.getElementById('remainingTime')) document.getElementById('remainingTime').textContent = data.remainingTime;
    if (document.getElementById('signalStrength')) document.getElementById('signalStrength').textContent = data.signalStrength;
    if (document.getElementById('distance')) document.getElementById('distance').textContent = data.distance;
    if (document.getElementById('latency')) document.getElementById('latency').textContent = data.latency;

    // Mise à jour de l'overlay caméra
    if (document.querySelector('.overlay-info.top-left .info-item:nth-child(1) span')) document.querySelector('.overlay-info.top-left .info-item:nth-child(1) span').textContent = data.batteryLevel;
    if (document.querySelector('.overlay-info.top-left .info-item:nth-child(2) span')) document.querySelector('.overlay-info.top-left .info-item:nth-child(2) span').textContent = '4/5'; // À adapter avec la force du signal
    if (document.getElementById('speed')) document.getElementById('speed').textContent = data.groundSpeed;
    if (document.getElementById('currentAltitude')) document.getElementById('currentAltitude').textContent = data.altitude;
    if (document.getElementById('heading')) document.getElementById('heading').textContent = data.direction;
    // La boussole (compassNeedle) nécessiterait une logique de rotation en CSS basée sur la direction
    // Ex: document.getElementById('compassNeedle').style.transform = `rotate(${angle}deg)`;
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${tabId}Panel`).classList.add('active');
    document.querySelector(`.tab-btn[onclick="switchTab('${tabId}')"]`).classList.add('active');
    console.log(`Passage à l'onglet : ${tabId}`);
}

function addLog(type, message) {
    const logsList = document.getElementById('logsList');
    if (!logsList) return;

    const now = new Date();
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry', type); // type peut être 'info', 'warning', 'success', 'danger'
    logEntry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-message">${message}</span>
    `;
    logsList.prepend(logEntry); // Ajoute le nouveau log en haut

    // Garder un nombre limité de logs (ex: 50)
    if (logsList.children.length > 50) {
        logsList.removeChild(logsList.lastChild);
    }
}

function clearLogs() {
    const logsList = document.getElementById('logsList');
    if (confirm('Voulez-vous vraiment effacer tous les logs ?')) {
        logsList.innerHTML = '';
        addLog('info', 'Journal de vol effacé.');
    }
}

// Fonctions Mission (Placeholders)
function loadMission() {
    console.log('Chargement de mission...');
    addLog('info', 'Chargement de mission...');
}
function saveMission() {
    console.log('Sauvegarde de mission...');
    addLog('info', 'Mission sauvegardée.');
}
function startMission() {
    console.log('Démarrage de mission...');
    addLog('info', 'Démarrage de la mission.');
}
// ... (code JavaScript précédent) ...

// Fonctions Mission (Suite)
function editWaypoint(id) {
    console.log(`Éditer le point de passage ${id}`);
    addLog('info', `Édition du point de passage ${id}.`);
    // Implémenter une modale ou un formulaire pour éditer les coordonnées/altitude
}

function deleteWaypoint(id) {
    if (confirm(`Voulez-vous vraiment supprimer le point de passage ${id} ?`)) {
        console.log(`Supprimer le point de passage ${id}`);
        addLog('warning', `Point de passage ${id} supprimé.`);
        // Implémenter la suppression visuelle de l'élément dans le DOM
        // Exemple (simplifié) :
        const waypointItem = document.querySelector(`.waypoint-item:has(.waypoint-number:text("${id}"))`);
        if (waypointItem) {
            waypointItem.remove();
            // Réindexer les numéros de points de passage si nécessaire
            updateWaypointNumbers();
        }
    }
}

function addWaypoint() {
    console.log('Ajouter un nouveau point de passage');
    addLog('info', 'Nouveau point de passage ajouté (par défaut).');
    // Implémenter l'ajout d'un nouvel élément de point de passage au DOM
    // Obtenir le nombre de points existants pour le nouvel ID
    const waypointsList = document.querySelector('.waypoints-list');
    const newId = waypointsList.querySelectorAll('.waypoint-item').length + 1;

    const newWaypoint = document.createElement('div');
    newWaypoint.classList.add('waypoint-item');
    newWaypoint.innerHTML = `
        <div class="waypoint-number">${newId}</div>
        <div class="waypoint-info">
            <div class="waypoint-coords">Nouveau point, 0.0000°N, 0.0000°E</div>
            <div class="waypoint-altitude">Alt: 0m</div>
        </div>
        <div class="waypoint-actions">
            <button class="waypoint-btn" onclick="editWaypoint(${newId})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="waypoint-btn" onclick="deleteWaypoint(${newId})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    waypointsList.insertBefore(newWaypoint, waypointsList.querySelector('.add-waypoint-btn'));
    updateWaypointNumbers(); // S'assurer que les numéros sont corrects
}

function updateWaypointNumbers() {
    const waypointNumbers = document.querySelectorAll('.waypoints-list .waypoint-number');
    waypointNumbers.forEach((numElement, index) => {
        const newId = index + 1;
        numElement.textContent = newId;
        // Mettre à jour les appels onclick dans les boutons si le HTML est recréé
        const parentItem = numElement.closest('.waypoint-item');
        if (parentItem) {
            parentItem.querySelector('.waypoint-btn:nth-child(1)').setAttribute('onclick', `editWaypoint(${newId})`);
            parentItem.querySelector('.waypoint-btn:nth-child(2)').setAttribute('onclick', `deleteWaypoint(${newId})`);
        }
    });
}

// --- Flight Timer ---
function startFlightTimer() {
    if (flightTimeInterval) clearInterval(flightTimeInterval); // Arrêter l'ancien si existant
    startTime = Date.now();
    flightTimeInterval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
        const seconds = String(elapsedSeconds % 60).padStart(2, '0');
        if (document.getElementById('flightTime')) {
            document.getElementById('flightTime').textContent = `${minutes}:${seconds}`;
        }
    }, 1000);
}

function stopFlightTimer() {
    if (flightTimeInterval) {
        clearInterval(flightTimeInterval);
        flightTimeInterval = null;
    }
    if (document.getElementById('flightTime')) {
        document.getElementById('flightTime').textContent = '00:00';
    }
}


// --- Initialisation des fonctionnalités au chargement du DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser l'état initial des boutons de contrôle
    updateDroneStatus(false); // Drone désactivé par défaut
    startFlightTimer(); // Démarrer le compteur de temps de vol
    // Ajouter un écouteur d'événements pour le bouton de contrôle
    document.getElementById('controlButton').addEventListener('click', () => {
        if (isDroneActive) {
            stopFlightTimer(); // Arrêter le compteur de temps de vol
            isDroneActive = false; // Drone désactivé
            updateDroneStatus(false); // Mettre à jour l'état du drone
        } else {
            startFlightTimer(); // Drone