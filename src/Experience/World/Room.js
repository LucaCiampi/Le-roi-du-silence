import * as THREE from 'three'

export default class Room {
    constructor(_options) {
        this.parameter = _options.parameter;
        this.debug = _options.debug;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.zoneEvent = _options.zoneEvent;

        this.name = null;
        this.position = null;
        this.spawnPosition = null;
        this.entranceTriggerZone = null;
        this.model = null;
        this.additionalEntranceActions = () => { };
        this.props = [];

        this.initRoom();
    }

    initRoom() {
        // Silence is golden...
    }

    /**
     * Loads the Room .glb model and adds it to the scene
     */
    setRoomModel() {
        this.model = this.resources.items[this.name].scene;
        this.model.position.set(this.position.x, this.position.y, this.position.z)

        this.model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial();

                child.material.map = this.resources.items['wood'];
                child.material.needsUpdate = true;
            }
        })

        this.scene.add(this.model)
    }

    /**
     * Checks if the player has entered the Room
     * @param {THREE.Vector2} playerPosition - player's coordinates
     * @returns {boolean} True if the player has stepped in the room
     */
    hasPlayerInRoom(playerPosition) {
        return this.entranceTriggerZone.hasPlayerInZone(playerPosition);
    }

    /**
     * Actions related to the entrance of the player in the zone
     */
    roomEntranceActions() {
        this.sendMessageToPhone();
        this.playZoneSound();
        this.additionalEntranceActions();
    }

    /**
     * Sends a message to every mobile device connected to the session
     */
    sendMessageToPhone() {
        this.zoneEvent(this.name)
    }

    /**
     * When entering a zone, plays a sound
     */
    playZoneSound() {
        this.parameter.sounds.play('swoosh1');
    }

    /**
     * Adds all Room props to the scene
     */
    addPropsToScene() {
        this.props.forEach(prop => {
            this.scene.add(prop)
        });
    }

    /**
     * Removes the room and all of its components from the scene
     */
    destroy() {
        this.props.forEach((prop) => {
            if (prop instanceof THREE.Mesh) {
                prop.geometry.dispose();
                prop.material.dispose();
                this.scene.remove(prop);
            }
            else {
                while (prop.children.length > 0) {
                    prop.remove(prop.children[0]);
                }
                this.scene.remove(prop);
            }
        })

        this.model.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                node.geometry.dispose();
                node.material.dispose();
            }
        });
        this.scene.remove(this.model);
    }
}