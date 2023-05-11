import GlobalParameter from "./GlobalParameter";
import UserInterface from "./UserInterface";
import Controls from "./Controls";
import Floor from "./GameElements/Floor";
import Light from "./GameElements/Light";
import TestCube from "./GameElements/TestCube";
import Stairs from "./GameElements/Stairs";
import Room from "./Room";
import WorldOctree from "./WorldOctree";
import Room1 from "./Rooms/Room1";
import Room2 from "./Rooms/Room2";
import Room3 from "./Rooms/Room3";
import Room4 from "./Rooms/Room4";
import EntranceSas from "./Rooms/EntranceSas";

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

        // this.floor = new Floor({
        //     scene: this.scene,
        //     resources: this.resources,
        //     parameter: this.parameter,
        // })

        this.worldOctree = new WorldOctree({
            scene: this.scene,
            debug: this.debug,
            event: this.event,
            // models: [this.floor]
        })

        this.controls = new Controls({
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
            parameter: this.parameter
        })

        this.setRooms();

        this.isReady = true;
        this.startAmbientWorldSound();
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

    setRooms() {
        const options = {
            parameter: this.parameter,
            debug: this.debug,
            scene: this.scene,
            resources: this.resources,
            zoneEvent: this.zoneEvent,
        }

        this.rooms = [
            new EntranceSas({ ...options }),
            new Room1({ ...options }),
            new Room2({ ...options }),
            new Room3({...options}),
            new Room4({...options}),
        ]
    }

    updateCurrentRoom() {
        this.rooms[this.parameter.currentZone].update();
    }

    /**
     * Checks if the player has entered the zone
     */
    checkNextZoneEntrance() {
        // TODO: once the player has been in the zone, remove the listener and listen to the next zone (for loop)

        if (this.rooms[this.parameter.currentZone + 1].hasPlayerInRoom(this.controls.playerCollider.end)) {
            this.parameter.incrementCurrentZone();
            // TODO : the increment just above influences the function below, make this easier to understand
            this.rooms[this.parameter.currentZone].roomEntranceActions();
            this.updatePlayerSpawnLocation();
            this.freeUpPreviousZone();
        }

        // TODO: uncomment and use this piece of code for zone-specific actions
        // zone.on('in', (_data) => {
        //     this.camera.angle.set(_data.cameraAngle)
        // })

        // zone.on('out', () => {
        //     this.camera.angle.set('default')
        // })
    }

    updatePlayerSpawnLocation() {
        this.parameter.playerSpawn.x = this.rooms[this.parameter.currentZone].spawnPosition.x;
        this.parameter.playerSpawn.y = this.rooms[this.parameter.currentZone].spawnPosition.y;
        this.parameter.playerSpawn.z = this.rooms[this.parameter.currentZone].spawnPosition.z;
    }

    /**
     * Starts the ambient sound that will loop throughout the experience
     */
    startAmbientWorldSound() {
        this.parameter.sounds.playLoop('wind')
    }

    /**
     * Frees up space by destroying the previously visited rooms
     */
    freeUpPreviousZone() {
        this.rooms[this.parameter.currentZone - 1].destroy()
    }

    destroy() {
        this.userInterface.destroy()
        this.userInterface = null

        this.floor.destroy()
        this.floor = null

        this.light.destroy()
        this.light = null
    }

}