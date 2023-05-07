import * as THREE from 'three'

export default class Zone {
    constructor(_options) {
        // Options
        this.parameter = _options.parameter;
        this.name = _options.name;
        this.startPosition = _options.startPosition;
        this.endPosition = _options.endPosition;
        this.data = _options.data;
        this.zoneEvent = _options.zoneEvent;

        // Set up
        this.isIn = false;
        this.boundingBox = null;

        this.init()
    }

    init() {
        // Box
        this.boundingBox = new THREE.Box2(this.startPosition, this.endPosition);
    }

    /**
     * Checks if the player is in the delimited zone
     * @param {THREE.Vector2} playerPosition - player's coordinates
     * @returns {boolean} True if the player has stepped in the zone
     */
    hasPlayerInZone(playerPosition) {
        if (this.boundingBox.containsPoint(new THREE.Vector2(playerPosition.x, playerPosition.z))) {
            return true
        }

        return false
    }

    /**
     * Actions related to the entrance of the player in the zone
     */
    startZoneActions() {
        this.sendMessageToPhone()
        this.playZoneSound()
    }

    /**
     * Sends a message to every mobile device connected to the session
     */
    sendMessageToPhone() {
        this.zoneEvent()
    }

    /**
     * When entering a zone, plays a sound
     */
    playZoneSound() {
        this.parameter.sounds.play('swoosh1');
    }
}