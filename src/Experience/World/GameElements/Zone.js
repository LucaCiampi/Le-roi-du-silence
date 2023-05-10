import * as THREE from 'three'

export default class Zone {
    constructor(_options) {
        // Options
        this.parameter = _options.parameter;
        this.debug = _options.debug;
        this.scene = _options.scene;
        this.name = _options.name;
        this.startPosition = _options.startPosition;
        this.endPosition = _options.endPosition;
        this.zoneEvent = _options.zoneEvent;
        this.actions = _options.actions;

        // Set up
        this.isIn = false;
        this.boundingBox = null;
        this.boundingBoxHelper = null;
        this.boundingBoxHelperVisible = false;

        this.init()
    }

    init() {
        // Box
        this.boundingBox = new THREE.Box2(this.startPosition, this.endPosition);

        if (this.debug.active) {
            this.addDebugOptions();
        }
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

        if (this.actions) this.actions()
        else console.log('no actions')
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

    /**
    * Adds debug options on GUI
    */
    addDebugOptions() {
        this.boundingBoxHelperVisible = true;
        const geometry = new THREE.BoxGeometry(this.startPosition, 10, this.endPosition);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const mesh = new THREE.Mesh(geometry, material);
        this.boundingBoxHelper = new THREE.BoxHelper(mesh, 0xffff00);
        this.scene.add(this.boundingBoxHelper);
        this.debug.gui.add(this, 'boundingBoxHelperVisible');
    }
}