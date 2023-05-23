import * as THREE from 'three'

export default class Room {
    constructor(_options) {
        this.parameter = _options.parameter;
        this.debug = _options.debug;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.zoneEvent = _options.zoneEvent;
        this.camera = _options.camera;

        this.name = null;
        this.position = null;
        this.spawnPosition = null;
        this.entranceTriggerZone = null;
        this.model = null;
        this.additionalEntranceActions = () => { };
        this.props = [];
        this.closingDoor = null;
        this.positionalAudioTrack;

        this.initRoom();
    }

    /**
     * Room init that will be applied to each subclass of Room,
     * called before the subclass init()
     */
    initRoom() {
        const closingDoorGeometry = new THREE.BoxGeometry(1, 2, 1);
        const closingDoorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.closingDoor = new THREE.Mesh(closingDoorGeometry, closingDoorMaterial);

        // --------- Positional audio ---------
        this.positionalAudioTrack = new THREE.PositionalAudio(this.camera.audioListener);
        // this.positionalAudioTrack = new THREE.Audio(this.camera.audioListener);
        // this.positionalAudioTrack = new THREE.Audio(this.camera.instance.children[0]);
        this.positionalAudioTrack.setBuffer(this.resources.items['eww']);
        // this.positionalAudioTrack.setMediaElementSource(document.getElementById("test_audio"))
        this.positionalAudioTrack.setRefDistance(20);
        this.positionalAudioTrack.play();

        // create an object for the sound to play from
        // const audioSphere = new THREE.SphereGeometry(1, 32, 16);
        // const audioMaterial = new THREE.MeshPhongMaterial({ color: 0xff2200 });
        // const audioMesh = new THREE.Mesh(audioSphere, audioMaterial);
        // audioMesh.position.set(4, 1, 4);
        // this.scene.add(audioMesh);

        // finally add the sound to the mesh
        // audioMesh.add(this.positionalAudioTrack);
    }

    /**
     * Loads the Room .glb model and adds it to the scene
     */
    setRoomModel() {
        this.model = this.resources.items[this.name].scene;
        this.model.position.set(this.position.x, this.position.y, this.position.z)

        this.model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshToonMaterial();

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
        this.closeDoor();
        this.additionalEntranceActions();
    }

    /**
     * Sends a message to every mobile device connected to the session
     */
    sendMessageToPhone() {
        this.zoneEvent(this.name);
    }

    /**
     * When entering a zone, plays a sound
     */
    playZoneSound() {
        this.parameter.sounds.play('swoosh1');
    }

    /**
     * Adds the closing door model to the room model
     */
    closeDoor() {
        this.model.add(this.closingDoor)
    }

    /**
     * Adds all Room props to the scene
     */
    addPropsToRoom() {
        this.props.forEach(prop => {
            this.model.add(prop);
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