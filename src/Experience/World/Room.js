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
        this.world = _options.world;

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

        // Array containing 0, 1 or multiple audio tracks per room
        this.positionalAudioTracks = [];

        // Minimum score required to open the door
        this.minScoreRequired = null;

        // List of all trigger zones that will start a conversation
        this.triggerZones = [];

        this.initRoom();
    }

    /**
     * Room init that will be applied to each subclass of Room,
     * called before the subclass init()
     */
    initRoom() {
        this.closingDoor = this.resources.items['door'].scene.clone();
        this.exitDoor = this.resources.items['door'].scene.clone();
    }

    /**
     * Loads the Room .glb model and adds it to the scene
     */
    setRoomModel() {
        this.model = this.resources.items[this.name].scene;
        this.model.position.set(this.position.x, this.position.y, this.position.z)

        if (this.name == 'room3') {
            this.model.rotation.set(0, -3.16, 0);
        }
        else if (this.name == 'room4') {
            this.model.rotation.set(0, 2.9, 0);
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
     * Checks if the player has entered a zone of interest in the Room
     * @param {THREE.Vector2} playerPosition - player's coordinates
     */
    checkForRoomZonesOfInterest(playerPosition) {
        this.triggerZones.forEach((zone, index) => {
            if (zone.hasPlayerInZone(playerPosition)) {
                console.log('player in zone : ' + zone.name);
                this.triggerZones.splice(index, 1);
                this.world.zoneTriggeredEffect();
            }
        })
    }

    /**
     * Actions related to the entrance of the player in the zone
     */
    roomEntranceActions() {
        this.sendMessageToPhone();
        this.playZoneSound();
        if (this.name !== 'room4') {
            this.closeDoor();
        }
        this.additionalEntranceActions();
        this.playPositionalAudioTracks();
    }

    /**
     * Sends a message to every mobile device connected to the session
     */
    sendMessageToPhone() {
        this.zoneEvent({title: this.name});
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
        this.props.push(this.exitDoor);
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
     * Adds a positional audio track to the room
     * Does nothing if there is none
     */
    addPositionalAudioTrack(soundName, refDistance, x, y, z, loop = true, delay) {
        const newPositionalAudioTrack = new THREE.PositionalAudio(this.camera.audioListener);
        newPositionalAudioTrack.setBuffer(this.resources.items[soundName]);
        newPositionalAudioTrack.setRefDistance(refDistance);
        newPositionalAudioTrack.setLoop(loop);

        if (delay) {
            const playbackRate = 1 / delay;
            newPositionalAudioTrack.setPlaybackRate(playbackRate);
        }

        let audioPosition = null;

        if (this.debug.active) {
            // create an object for the sound to play from
            const audioGeometry = new THREE.BoxGeometry(1, 1, 1);
            const audioMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
            audioPosition = new THREE.Mesh(audioGeometry, audioMaterial);
        }
        else {
            audioPosition = new THREE.Object3D();
        }
        
        audioPosition.position.set(x, y, z);
        
        // finally add the sound to the mesh
        audioPosition.add(newPositionalAudioTrack);
        this.model.add(audioPosition)

        this.positionalAudioTracks.push(newPositionalAudioTrack);
    }

    /**
     * Starts every positional audio track of the room
     * Does nothing if there is none
     */
    playPositionalAudioTracks() {
        this.positionalAudioTracks.forEach((track) => {
            track.play();
        })
    }

    /**
     * Stops every positional audio track of the room
     * Does nothing if there is none
     */
    stopPositionalAudioTracks() {
        this.positionalAudioTracks.forEach((track) => {
            track.stop();
        })
    }

    /**
     * Pauses every positional audio track of the room
     * Does nothing if there is none
     */
    pausePositionalAudioTracks() {
        this.positionalAudioTracks.forEach((track) => {
            track.pause();
        })
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
                // TODO: Disposer les textures ici
                node.material.dispose();
            }
        });

        this.stopPositionalAudioTracks();

        this.scene.remove(this.model);
    }

    /**
     * Adds debug options
     */
    addDebugOptions() {
        const folder = this.debug.gui.addFolder(this.name);

        // this.roomPositionDebug(folder);
        // this.doorsPositionDebug(folder);
        this.propsPositionDebug(folder);
    }

    roomPositionDebug(folder) {
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

    doorsPositionDebug(folder) {
        // Closing door
        folder.add(this.closingDoor.rotation, 'y')
            .onChange((value) => {
                this.closingDoor.rotation.y = value;
            });
        folder.add(this.closingDoor.position, 'x')
            .onChange((value) => {
                this.closingDoor.position.x = value;
            });
        folder.add(this.closingDoor.position, 'y')
            .onChange((value) => {
                this.closingDoor.position.y = value;
            });
        folder.add(this.closingDoor.position, 'z')
            .onChange((value) => {
                this.closingDoor.position.z = value;
            });

        // Exit door
        folder.add(this.exitDoor.rotation, 'y')
            .onChange((value) => {
                this.exitDoor.rotation.y = value;
            });
        folder.add(this.exitDoor.position, 'x')
            .onChange((value) => {
                this.exitDoor.position.x = value;
            });
        folder.add(this.exitDoor.position, 'y')
            .onChange((value) => {
                this.exitDoor.position.y = value;
            });
        folder.add(this.exitDoor.position, 'z')
            .onChange((value) => {
                this.exitDoor.position.z = value;
            });
    }

    propsPositionDebug(folder) {
        this.props.forEach((prop, index) => {
            folder.add(prop.position, 'x')
                .onChange((value) => {
                    this.props[index].position.x = value;
                });

            folder.add(prop.position, 'y')
                .onChange((value) => {
                    this.props[index].position.y = value;
                });

            folder.add(prop.position, 'z')
                .onChange((value) => {
                    this.props[index].position.z = value;
                });
        })
    }
}