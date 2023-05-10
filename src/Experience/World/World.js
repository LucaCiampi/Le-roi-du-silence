import GlobalParameter from "./GlobalParameter";
import UserInterface from "./UserInterface";
import Controls from "./Controls";
import Floor from "./GameElements/Floor";
import Light from "./GameElements/Light";
import TestCube from "./GameElements/TestCube";
import Stairs from "./GameElements/Stairs";
import Room from "./GameElements/Room";
import Zone from './GameElements/Zone'
import { Vector2 } from "three";
import WorldOctree from "./WorldOctree";

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

        this.floor = new Floor({
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter,
        })

        this.worldOctree = new WorldOctree({
            scene: this.scene,
            debug: this.debug,
            event: this.event,
            models: [this.floor]
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

        // this.testCube = new TestCube({
        //     scene: this.scene,
        //     resources: this.resources,
        //     parameter: this.parameter
        // })

        this.stairs = new Stairs({
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter
        })

        this.zones = [
            new Zone({
                parameter: this.parameter,
                scene: this.scene,
                debug: this.debug,
                name: "zone1",
                startPosition: new Vector2(0, -20),
                endPosition: new Vector2(10, -7),
                zoneEvent: () => this.zoneEvent("green zone"),

            }),
            new Zone({
                parameter: this.parameter,
                scene: this.scene,
                debug: this.debug,
                name: "zone2",
                startPosition: new Vector2(-20, -20),
                endPosition: new Vector2(-1, -1),
                zoneEvent: () => this.zoneEvent("zone 2"),
            }),
            new Zone({
                parameter: this.parameter,
                scene: this.scene,
                debug: this.debug,
                name: "zone3",
                startPosition: new Vector2(-20, -1),
                endPosition: new Vector2(1, 20),
                zoneEvent: () => this.zoneEvent("zone 3")
            }),
            new Zone({
                parameter: this.parameter,
                scene: this.scene,
                debug: this.debug,
                name: "zone4",
                startPosition: new Vector2(-1, -20),
                endPosition: new Vector2(20, 1),
                zoneEvent: () => this.zoneEvent("zone 4"),
                //     actions: () => {
                //     const now = this.time.elapsedTime;
                //     console.log(now);
                //     this.camera.instance.fov = 40;
                //     this.camera.instance.updateProjectionMatrix();
                // }
            }),
        ]

        this.isReady = true;
        this.startAmbientWorldSound();
    }

    update(deltaT) {
        if (this.isReady && this.parameter.counterOn) {
            this.controls.update(deltaT)

            if (!this.parameter.gameEnded) {
                this.checkNextZoneEntrance(this.parameter.currentZone)
            }
        }
    }

    /**
     * Checks if the player has entered the zone
     * @param {Number} zoneId - the ID of the zone to check in the array
     */
    checkNextZoneEntrance(zoneId) {
        // TODO: once the player has been in the zone, remove the listener and listen to the next zone (for loop)

        if (this.zones[zoneId].hasPlayerInZone(this.controls.playerCollider.end)) {
            console.log('zone ' + this.zones[zoneId].name + ' entered')
            this.parameter.incrementCurrentZone();
            this.zones[zoneId].startZoneActions();
        }

        // TODO: uncomment and use this piece of code for zone-specific actions
        // zone.on('in', (_data) => {
        //     this.camera.angle.set(_data.cameraAngle)
        // })

        // zone.on('out', () => {
        //     this.camera.angle.set('default')
        // })
    }

    /**
     * Starts the ambient sound that will loop throughout the experience
     */
    startAmbientWorldSound() {
        this.parameter.sounds.playLoop('wind')
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