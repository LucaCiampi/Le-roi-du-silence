import * as THREE from 'three'
import GlobalParameter from "./GlobalParameter";
import UserInterface from "./UserInterface";
import Controls from "./Controls";
import Light from "./Light";
import WorldOctree from "./WorldOctree";
import EntranceSas from "./Rooms/EntranceSas";
import Room1 from "./Rooms/Room1";
import Room2 from "./Rooms/Room2";
import Room3 from "./Rooms/Room3";
import Room4 from "./Rooms/Room4";

export default class World {
    constructor(_options) {
        this.event = _options.event;
        this.time = _options.time;
        this.debug = _options.debug;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.camera = _options.camera;
        this.canvas = _options.canvas;
        this.zoneEvent = _options.zoneEvent;

        this.parameter = new GlobalParameter({
            event: this.event,
            scene: this.scene,
            debug: this.debug
        });
    }

    ready() {
        this.userInterface = new UserInterface({
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter,
            event: this.event
        })

        this.setRooms();

        this.worldOctree = new WorldOctree({
            scene: this.scene,
            debug: this.debug,
            event: this.event,
            models: this.rooms,
            onFinish: () => this.setRoomsProps()
        })

        this.controls = new Controls({
            canvas: this.canvas,
            camera: this.camera,
            parameter: this.parameter,
            event: this.event,
            debug: this.debug,
            userInterface: this.userInterface,
            worldOctree: this.worldOctree,
        })

        this.light = new Light({
            scene: this.scene,
            debug: this.debug,
            resources: this.resources,
            parameter: this.parameter,
            camera: this.camera,
        })

        this.isReady = true;
        this.startAmbientWorldSound();

        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    update(deltaT) {
        if (this.isReady && this.parameter.counterOn) {
            this.controls.update(deltaT)

            if (!this.parameter.gameEnded) {
                this.updateCurrentRoom();
                this.checkNextZoneEntrance();
            }
        }
    }

    /**
     * Initializes every room
     */
    setRooms() {
        const options = {
            parameter: this.parameter,
            debug: this.debug,
            scene: this.scene,
            resources: this.resources,
            zoneEvent: this.zoneEvent,
            camera: this.camera,
            world: this,
        }

        this.rooms = [
            new EntranceSas({ ...options }),
            new Room1({ ...options }),
            new Room2({ ...options }),
            new Room3({ ...options }),
            new Room4({ ...options }),
        ]
    }

    /**
     * Sets the props of each room, these will not be counted in the octree
     */
    setRoomsProps() {
        this.rooms.forEach((room) => {
            room.addPropsToRoom();
        })
    }

    /**
     * Updates the room the player is currently in
     */
    updateCurrentRoom() {
        this.rooms[this.parameter.currentZone].update();
        this.rooms[this.parameter.currentZone].checkForRoomZonesOfInterest(this.controls.playerCollider.end);
    }

    /**
     * Checks if the player has entered the zone
     */
    checkNextZoneEntrance() {
        if (this.rooms[this.parameter.currentZone + 1].hasPlayerInRoom(this.controls.playerCollider.end)) {
            this.parameter.incrementCurrentZone();
            this.roomEntranceSetup();
        }
    }

    /**
     * Sets up everything in the entrance of a new room
     */
    roomEntranceSetup() {
        this.rooms[this.parameter.currentZone].roomEntranceActions();
        this.updatePlayerSpawnLocation();
        this.addRoomClosingDoorHitbox();
        this.freeUpPreviousZone();
    }

    /**
     * Increase the trust score
     * if it's equal to the minimum required to open the next room,
     * then opens the exit door
     */
    increaseTrustScore() {
        if (this.parameter.score < this.rooms[this.parameter.currentZone + 1].minScoreRequired) {
            this.parameter.score++;
            this.userInterface.updateScore(this.parameter.score);
            this.userInterface.showUserIndicatorTrustPointEarned();
            
            if (this.parameter.score === this.rooms[this.parameter.currentZone + 1].minScoreRequired) {
                this.userInterface.showUserIndicatorDoorOpen();
                console.log('🚪 Exit door of room ' + this.parameter.currentZone + ' open')
                this.rooms[this.parameter.currentZone].openExitDoor();
            }
        }

        else {
            console.log('Max score already reached for this room');
        }
    }

    /**
     * Updates where the player should respawn in case of oob when he enters a new room
     */
    updatePlayerSpawnLocation() {
        this.parameter.playerSpawn.x = this.rooms[this.parameter.currentZone].spawnPosition.x;
        this.parameter.playerSpawn.y = this.rooms[this.parameter.currentZone].spawnPosition.y;
        this.parameter.playerSpawn.z = this.rooms[this.parameter.currentZone].spawnPosition.z;
    }

    /**
     * Adds the closing door of the room to the octree
     */
    addRoomClosingDoorHitbox() {
        this.rooms[this.parameter.currentZone].closingDoor.traverse(mesh => {
            if (mesh instanceof THREE.Mesh) {
                this.worldOctree.octree.fromGraphNode(mesh);
            }
        });
    }

    /**
     * Starts the ambient sound that will loop throughout the experience
     */
    startAmbientWorldSound() {
        this.parameter.sounds.playLoop('wind');
    }

    /**
     * Frees up space by destroying the previously visited rooms
     */
    freeUpPreviousZone() {
        this.rooms[this.parameter.currentZone - 1].destroy()
    }

    /**
     * Effects triggered when the player reaches a zone
     * that sends SMS
     */
    zoneTriggeredEffect() {
        this.controls.playerSpeed = 4;
        this.parameter.sounds.play('swoosh2');
        this.userInterface.showMemoriesOverlay();
        setTimeout(() => {
            this.controls.playerSpeed = 15;
            this.userInterface.hideMemoriesOverlay();
        }, 6000);
    }

    destroy() {
        this.userInterface.destroy()
        this.userInterface = null

        this.floor.destroy()
        this.floor = null

        this.light.destroy()
        this.light = null
    }

    addDebugOptions() {
        const folder = this.debug.gui.addFolder('World');

        folder.add(this, 'increaseTrustScore');
    }

}