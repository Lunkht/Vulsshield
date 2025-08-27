class Drone {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.status = 'idle'; // idle, active, flying, moving, landing, charging
        this.battery = 100; // Percentage
        this.latitude = 0;
        this.longitude = 0;
        this.altitude = 0;
        this.telemetryInterval = null;
    }

    /**
     * Starts the drone's systems.
     * In a real scenario, this would involve communicating with drone hardware or a simulation API.
     */
    start() {
        if (this.status === 'idle' || this.status === 'charging') {
            this.status = 'active';
            console.log(`Drone ${this.name} (ID: ${this.id}) started. Status: ${this.status}`);
            // Start simulating battery drain and telemetry updates
            this.telemetryInterval = setInterval(() => {
                this.simulateBatteryDrain();
                this.simulateMovement();
            }, 1000); // Update every second
            return true;
        }
        console.log(`Drone ${this.name} cannot start from status: ${this.status}`);
        return false;
    }

    /**
     * Stops the drone's systems.
     */
    stop() {
        if (this.status !== 'idle') {
            this.status = 'idle';
            clearInterval(this.telemetryInterval); // Stop telemetry updates
            console.log(`Drone ${this.name} (ID: ${this.id}) stopped. Status: ${this.status}`);
            return true;
        }
        console.log(`Drone ${this.name} is already ${this.status}.`);
        return false;
    }

    /**
     * Initiates drone takeoff.
     * @param {number} targetAltitude - The altitude to reach after takeoff.
     */
    takeOff(targetAltitude = 10) {
        if (this.status === 'active' && this.battery > 20) { // Require minimum battery for takeoff
            this.status = 'flying';
            console.log(`Drone ${this.name} taking off to ${targetAltitude}m.`);
            // Simulate altitude gain
            let currentAltitude = this.altitude;
            const takeoffSimulation = setInterval(() => {
                if (currentAltitude < targetAltitude) {
                    currentAltitude += 1; // Increase altitude by 1m per second
                    this.altitude = currentAltitude;
                    console.log(`Drone ${this.name} altitude: ${this.altitude}m`);
                } else {
                    clearInterval(takeoffSimulation);
                    this.altitude = targetAltitude;
                    this.status = 'flying'; // Still flying after reaching target altitude
                    console.log(`Drone ${this.name} reached ${this.altitude}m. Status: ${this.status}`);
                }
            }, 1000);
            return true;
        }
        console.log(`Drone ${this.name} cannot take off. Current status: ${this.status}, Battery: ${this.battery}%`);
        return false;
    }

    /**
     * Initiates drone landing.
     */
    land() {
        if (this.status === 'flying' || this.status === 'moving') {
            this.status = 'landing';
            console.log(`Drone ${this.name} initiating landing.`);
            // Simulate altitude loss
            const landingSimulation = setInterval(() => {
                if (this.altitude > 0) {
                    this.altitude -= 1; // Decrease altitude by 1m per second
                    console.log(`Drone ${this.name} altitude: ${this.altitude}m`);
                } else {
                    clearInterval(landingSimulation);
                    this.altitude = 0;
                    this.status = 'idle';
                    console.log(`Drone ${this.name} landed. Status: ${this.status}`);
                }
            }, 1000);
            return true;
        }
        console.log(`Drone ${this.name} cannot land from status: ${this.status}`);
        return false;
    }

    /**
     * Moves the drone to a specified geographic location and altitude.
     * @param {number} latitude - Target latitude.
     * @param {number} longitude - Target longitude.
     * @param {number} altitude - Target altitude.
     */
    moveTo(latitude, longitude, altitude) {
        if ((this.status === 'flying' || this.status === 'active') && this.battery > 10) {
            this.status = 'moving';
            console.log(`Drone ${this.name} moving to Lat: ${latitude}, Lon: ${longitude}, Alt: ${altitude}m`);
            // In a real application, this would involve complex path planning and execution.
            // Here, we just update the target coordinates and simulate movement over time.
            const distanceLat = latitude - this.latitude;
            const distanceLon = longitude - this.longitude;
            const distanceAlt = altitude - this.altitude;

            let steps = 10; // Simulate movement in 10 steps
            let currentStep = 0;

            const moveSimulation = setInterval(() => {
                if (currentStep < steps) {
                    this.latitude += distanceLat / steps;
                    this.longitude += distanceLon / steps;
                    this.altitude += distanceAlt / steps;
                    console.log(`Drone ${this.name} current position: Lat ${this.latitude.toFixed(4)}, Lon ${this.longitude.toFixed(4)}, Alt ${this.altitude.toFixed(1)}m`);
                    currentStep++;
                } else {
                    clearInterval(moveSimulation);
                    this.latitude = latitude;
                    this.longitude = longitude;
                    this.altitude = altitude;
                    this.status = 'flying'; // After moving, it's still flying
                    console.log(`Drone ${this.name} arrived at destination. Status: ${this.status}`);
                }
            }, 1000); // Each step takes 1 second
            return true;
        }
        console.log(`Drone ${this.name} cannot move. Current status: ${this.status}, Battery: ${this.battery}%`);
        return false;
    }

    /**
     * Retrieves the current telemetry data of the drone.
     * @returns {object} An object containing the drone's current status, battery, and location.
     */
    getTelemetry() {
        return {
            id: this.id,
            name: this.name,
            status: this.status,
            battery: this.battery,
            latitude: this.latitude,
            longitude: this.longitude,
            altitude: this.altitude
        };
    }

    /**
     * Updates the drone's status. This might be called by an external system.
     * @param {string} newStatus - The new status of the drone.
     */
    updateStatus(newStatus) {
        this.status = newStatus;
        console.log(`Drone ${this.name} status updated to: ${this.status}`);
    }

    /**
     * Simulates battery drain over time.
     */
    simulateBatteryDrain() {
        if (this.battery > 0 && (this.status === 'active' || this.status === 'flying' || this.status === 'moving' || this.status === 'landing')) {
            this.battery = Math.max(0, this.battery - 0.1); // Drain 0.1% per second
            if (this.battery <= 10 && this.status !== 'landing' && this.status !== 'idle') {
                console.warn(`Drone ${this.name} battery is critically low: ${this.battery.toFixed(1)}%. Initiating emergency landing.`);
                this.land(); // Auto-land if battery is critically low
            } else if (this.battery === 0) {
                this.stop(); // Stop if battery is completely drained
                console.error(`Drone ${this.name} battery is empty. Drone stopped.`);
            }
        } else if (this.status === 'charging' && this.battery < 100) {
            this.battery = Math.min(100, this.battery + 0.5); // Charge 0.5% per second
        }
    }

    /**
     * Simulates random movement when the drone is flying or moving.
     */
    simulateMovement() {
        if (this.status === 'flying' || this.status === 'moving') {
            // Add small random fluctuations to simulate real-world movement/drift
            this.latitude += (Math.random() - 0.5) * 0.00001;
            this.longitude += (Math.random() - 0.5) * 0.00001;
            // Altitude might fluctuate slightly if not actively changing
            if (this.status === 'flying') {
                this.altitude += (Math.random() - 0.5) * 0.01;
                this.altitude = Math.max(0, this.altitude); // Ensure altitude doesn't go below 0
            }
        }
    }

    /**
     * Simulates charging the drone.
     */
    startCharging() {
        if (this.status === 'idle' && this.battery < 100) {
            this.status = 'charging';
            console.log(`Drone ${this.name} (ID: ${this.id}) started charging.`);
            // Battery drain simulation will handle charging when status is 'charging'
            if (!this.telemetryInterval) { // Ensure interval is running for charging simulation
                this.telemetryInterval = setInterval(() => {
                    this.simulateBatteryDrain();
                }, 1000);
            }
            return true;
        }
        console.log(`Drone ${this.name} cannot start charging from status: ${this.status} or battery is full.`);
        return false;
    }

    /**
     * Stops charging the drone.
     */
    stopCharging() {
        if (this.status === 'charging') {
            this.status = 'idle';
            console.log(`Drone ${this.name} (ID: ${this.id}) stopped charging.`);
            clearInterval(this.telemetryInterval); // Stop telemetry updates
            return true;
        }
        console.log(`Drone ${this.name} is not charging.`);
        return false;
    }
}

// Example Usage (for testing purposes, can be removed in production)
/*
const myDrone = new Drone('DRN001', 'Explorer 1');
console.log('Initial Telemetry:', myDrone.getTelemetry());

myDrone.start();
setTimeout(() => {
    myDrone.takeOff(50);
}, 2000);

setTimeout(() => {
    myDrone.moveTo(34.0522, -118.2437, 75); // Move to a new location
}, 10000);

setTimeout(() => {
    myDrone.land();
}, 25000);

setTimeout(() => {
    myDrone.startCharging();
}, 30000);

setTimeout(() => {
    myDrone.stopCharging();
    console.log('Final Telemetry:', myDrone.getTelemetry());
}, 40000);
*/
