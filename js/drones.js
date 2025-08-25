document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.dashboard-main');

    // Données factices pour les drones
    const drones = [
        { name: 'Drone Alpha', status: 'En ligne', battery: '85%', signal: 'Fort' },
        { name: 'Drone Beta', status: 'Hors ligne', battery: '0%', signal: 'Aucun' },
        { name: 'Drone Gamma', status: 'En mission', battery: '60%', signal: 'Moyen' },
        { name: 'Drone Delta', status: 'Maintenance', battery: 'N/A', signal: 'N/A' }
    ];

    // Affichage des cartes de drones
    const droneCardsHTML = drones.map(drone => `
        <div class="drone-card">
            <h3>${drone.name}</h3>
            <p>Statut: <span class="status-${drone.status.toLowerCase().replace(' ', '-')}">${drone.status}</span></p>
            <p>Batterie: ${drone.battery}</p>
            <p>Signal: ${drone.signal}</p>
        </div>
    `).join('');

    mainContent.innerHTML = `
        <div class="drone-grid">
            ${droneCardsHTML}
        </div>
        <div class="drone-details">
            <!-- Les détails du drone sélectionné s'afficheront ici -->
        </div>
    `;

    const droneCards = document.querySelectorAll('.drone-card');
    const droneDetailsContainer = document.querySelector('.drone-details');

    droneCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const drone = drones[index];
            droneDetailsContainer.innerHTML = `
                <h2>${drone.name}</h2>
                <p>Statut: <span class="status-${drone.status.toLowerCase().replace(' ', '-')}">${drone.status}</span></p>
                <p>Batterie: ${drone.battery}</p>
                <p>Signal: ${drone.signal}</p>
                <!-- Ajouter d'autres détails et actions ici -->
                <div class="telemetry-tabs">
                    <button class="tab-btn active" data-tab="telemetry">Télémétrie</button>
                    <button class="tab-btn" data-tab="mission">Mission</button>
                    <button class="tab-btn" data-tab="settings">Paramètres</button>
                    <button class="tab-btn" data-tab="logs">Logs</button>
                </div>
                <div id="tab-content"></div>
            `;

            const tabButtons = document.querySelectorAll('.tab-btn');
            const tabContent = document.getElementById('tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const tab = button.getAttribute('data-tab');
                    renderTabContent(tab);
                });
            });

            function renderTabContent(tab) {
                if (tab === 'telemetry') {
                    tabContent.innerHTML = `
                        <div class="telemetry-grid">
                            <div class="telemetry-card"><h4>Position</h4><p>Lat: 48.85, Lon: 2.35</p></div>
                            <div class="telemetry-card"><h4>Vitesse</h4><p>Sol: 0 km/h, Vert: 0 m/s</p></div>
                            <div class="telemetry-card"><h4>Énergie</h4><p>Batterie: 85%</p></div>
                            <div class="telemetry-card"><h4>Signal</h4><p>Force: -45 dBm</p></div>
                        </div>
                    `;
                } else if (tab === 'mission') {
                    tabContent.innerHTML = `
                        <div class="mission-controls">
                            <button class="btn-secondary">Charger mission</button>
                            <button class="btn-secondary">Sauvegarder</button>
                            <button class="btn-primary">Démarrer mission</button>
                        </div>
                        <div class="waypoints-list">
                            <h4>Points de passage</h4>
                            <!-- Les points de passage seront ajoutés ici -->
                        </div>
                    `;
                } else if (tab === 'settings') {
                    tabContent.innerHTML = `
                        <div class="settings-group">
                            <h4>Paramètres de vol</h4>
                            <div class="setting-item"><label>Altitude maximale:</label><input type="number" value="120"> m</div>
                            <div class="setting-item"><label>Distance maximale:</label><input type="number" value="500"> m</div>
                            <div class="setting-item"><label>Vitesse maximale:</label><input type="number" value="15"> m/s</div>
                        </div>
                        <div class="settings-group">
                            <h4>Sécurité</h4>
                            <div class="setting-item"><label><input type="checkbox" checked> Retour auto.</label></div>
                            <div class="setting-item"><label><input type="checkbox" checked> Atterrissage auto.</label></div>
                        </div>
                    `;
                } else if (tab === 'logs') {
                    tabContent.innerHTML = `
                        <div class="logs-container">
                            <div class="logs-header">
                                <h4>Journal de vol</h4>
                                <button class="btn-secondary">Effacer</button>
                            </div>
                            <div class="logs-list">
                                <div class="log-entry info">[14:32:15] Drone connecté</div>
                                <div class="log-entry warning">[14:30:42] Signal faible</div>
                            </div>
                        </div>
                    `;
                }
            }

            // Afficher le premier onglet par défaut
            renderTabContent('telemetry');
        });
    });
});