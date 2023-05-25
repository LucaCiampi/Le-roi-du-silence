import * as THREE from 'three'

/**
 * Mother class of all subrooms, containing methods common to all of them
 * and default values for all properties
 */
export default class Room {
    constructor(_options) {
        this.parameter = _options.parameter;
        this.debug = _options.debug;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.zoneEvent = _options.zoneEvent;
        this.camera = _options.camera;

        // Name of the room used to fetch the model
        this.name = null;

        // Position of the room in the scene
        this.position = null;

        // Where the player spawns in case of death
        this.spawnPosition = null;
        
        // The zone determining either the player has stepped in the room
        this.entranceTriggerZone = null;
    
        // 3DObject model of the room    
        this.model = null;
        
        // Methods called on room entrance
        this.additionalEntranceActions = () => { };
        
        // Array that contains all room 3D Objects
        this.props = [];

        // Closing door
        this.closingDoor = null;

        // Exit closing door
        this.exitDoor = null;

        // Positional audio
        this.positionalAudioTrack;

        // Minimum score required to open the door
        this.minScoreRequired = null;

        // List of all trigger zones that will start a conversation
        // with Leo
        this.triggerZones = [];

        this.initRoom();
    }

    /**
     * Room init that will be applied to each subclass of Room,
     * called before the subclass init()
     */
    initRoom() {
        const closingDoorGeometry = new THREE.BoxGeometry(10, 20, 10);
        const closingDoorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.closingDoor = new THREE.Mesh(closingDoorGeometry, closingDoorMaterial);
        const exitDoorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.exitDoor = new THREE.Mesh(closingDoorGeometry, exitDoorMaterial);

        // --------- Positional audio ---------
        // this.positionalAudioTrack = new THREE.PositionalAudio(this.camera.audioListener);
        // this.positionalAudioTrack = new THREE.Audio(this.camera.audioListener);
        // this.positionalAudioTrack = new THREE.Audio(this.camera.instance.children[0]);
        // this.positionalAudioTrack.setBuffer(this.resources.items['eww']);
        // this.positionalAudioTrack.setMediaElementSource(document.getElementById("test_audio"))
        // this.positionalAudioTrack.setRefDistance(20);
        // this.positionalAudioTrack.play();
        // console.log("this.positionalAudioTrack.play();")

        // create an object for the sound to play from
        const audioSphere = new THREE.SphereGeometry(1, 32, 16);
        const audioMaterial = new THREE.MeshPhongMaterial({ color: 0xff2200 });
        const audioMesh = new THREE.Mesh(audioSphere, audioMaterial);
        audioMesh.position.set(4, 1, 4);
        this.scene.add(audioMesh);

        // finally add the sound to the mesh
        audioMesh.add(this.positionalAudioTrack);
    }

    /**
     * Loads the Room .glb model and adds it to the scene
     */
    setRoomModel() {
        this.model = this.resources.items[this.name].scene;
        this.model.position.set(this.position.x, this.position.y, this.position.z)

        if (this.name == 'sas') {
            this.model.scale.set(0.01, 0.01, 0.01);
        }

        else if (this.name == 'room1') {
            this.model.scale.set(0.01, 0.01, 0.01);
        }

        else if (this.name == 'room2') {
            this.model.scale.set(0.01, 0.01, 0.01);
        }

        else if (this.name == 'room3') {
            this.model.scale.set(0.25, 0.25, 0.25);
            this.model.rotation.set(0, -3.16, 0);
        }

        else if (this.name == 'room4') {
            this.model.scale.set(0.008, 0.008, 0.008);
        }

        // if (this.name == 'room2' || this.name == 'room4') {
        if (this.name == 'room2') {
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshToonMaterial();

                    child.material.map = this.resources.items['wood'];
                    child.material.needsUpdate = true;
                }
            })
        }

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
        // this.positionalAudioTrack.play();
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
     * Adds the exit door model to the room model
     * on the room init
     */
    addExitDoor() {
        this.model.add(this.exitDoor);
    }

    /**
     * Adds the closing door model to the room model
     */
    closeDoor() {
        this.model.add(this.closingDoor);
    }

    /**
     * Removes the exit door from the room model
     * in order to let the user go further
     */
    openExitDoor() {
        this.model.remove(this.exitDoor);
    }

    /**
     * Adds all Room props to the room model, 
     * allowing the props position to be relative to the room model
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
                // TODO: Disposer les textures ici
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

    /**
     * Adds debug options
     */
    addDebugOptions() {
        const folder = this.debug.gui.addFolder(this.name);

        // Rotation
        folder.add(this.model.rotation, 'y')
            .onChange((value) => {
                this.model.rotation.y = value;
            });

        // Position
        folder.add(this.model.position, 'x')
            .onChange((value) => {
                this.model.position.x = value;
            });
        folder.add(this.model.position, 'y')
            .onChange((value) => {
                this.model.position.y = value;
            });
        folder.add(this.model.position, 'z')
            .onChange((value) => {
                this.model.position.z = value;
            });
    }
}