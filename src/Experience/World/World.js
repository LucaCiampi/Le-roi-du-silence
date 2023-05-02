import GlobalParameter from "./GlobalParameter";
import UserInterface from "./UserInterface";
import Controls from "./Controls";
import Floor from "./GameElements/Floor";
import Light from "./GameElements/Light";
import TestCube from "./GameElements/TestCube";
import Zone from './GameElements/Zone'
import { Vector2 } from "three";

export default class World {
    constructor(_options) {
        this.event = _options.event;
        this.debug = _options.debug;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.camera = _options.camera;
        this.canvas = _options.canvas;

        this.parameter = new GlobalParameter({
            event: this.event,
            scene: this.scene
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
            parameter: this.parameter
        })

        this.controls = new Controls({
            camera: this.camera,
            userInterface: this.userInterface,
            event: this.event,
            floor: this.floor,
        })

        this.light = new Light({
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter
        })

        // this.testCube = new TestCube({
        //     scene: this.scene,
        //     resources: this.resources,
        //     parameter: this.parameter
        // })

        this.zones = [
            new Zone({
                name: "zone1",
                startPosition: new Vector2(1, 1),
                endPosition: new Vector2(20, 20),
            }),
            new Zone({
                name: "zone2",
                startPosition: new Vector2(-20, -20),
                endPosition: new Vector2(-1, -1),
            }),
            new Zone({
                name: "zone3",
                startPosition: new Vector2(-20, -1),
                endPosition: new Vector2(1, 20),
            }),
            new Zone({
                name: "zone4",
                startPosition: new Vector2(-1, -20),
                endPosition: new Vector2(20, 1),
            }),
        ]

        this.isReady = true;
    }

    update(deltaT) {
        if (this.isReady && this.parameter.canUpdate) {
            this.controls.update(deltaT)
            this.checkZone(this.parameter.currentZone)
        }
    }

    checkZone(zoneID) {

        // TODO: once the player has been in the zone, remove the listener and listen to the next zone (for loop)

        if (this.zones[zoneID].hasPlayerInZone(this.controls.playerCollider.end)) {
            console.log('zone ' + this.zones[zoneID].name + ' reached')
            this.parameter.incrementCurrentZone();
        }

        // zone.on('in', (_data) => {
        //     this.camera.angle.set(_data.cameraAngle)
        // })

        // zone.on('out', () => {
        //     this.camera.angle.set('default')
        // })
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