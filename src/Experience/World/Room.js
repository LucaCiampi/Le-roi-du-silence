import * as THREE from 'three'

export default class Room {
    constructor(_options) {
        this.scene = _options.scene;

        this.initRoom();
    }

    initRoom() {
        console.log("Room : initRoom")
    }

    /**
     * Actions related to the entrance of the player in the zone
     */
    roomEntranceActions() {
        this.sendMessageToPhone();
        this.playZoneSound();
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
     * 
     * @param {THREE.Vector2} playerPosition - player's coordinates
     * @returns {boolean} True if the player has stepped in the room
     */
    hasPlayerInRoom(playerPosition) {
        return this.entranceTriggerZone.hasPlayerInZone(playerPosition);
    }

    addPropsToScene(props) {
        console.log('addPropsToScene')

        props.forEach(prop => {
            this.scene.add(prop)
        });
    }

    dispose(room) {
        console.log('Room : dispose()')

        room.props.forEach((prop) => {
            prop.geometry.dispose();
            prop.material.dispose();
            this.scene.remove(prop);
        })

        room.model.traverse((node) => {
            if (node instanceof THREE.Mesh) {
                node.geometry.dispose();
                node.material.dispose();
            }
        });
        this.scene.remove(room.model);
    }
}