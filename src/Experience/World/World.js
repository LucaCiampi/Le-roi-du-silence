import GlobalParameter from "./GlobalParameter";
import UserInterface from "./UserInterface";
import Floor from "./GameElements/Floor";
import Light from "./GameElements/Light";
import TestCube from "./GameElements/TestCube";
import Controls from "./Controls";

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
            event: this.event,
            floor: this.floor,
        })

        this.light = new Light({
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter
        })

        this.testCube = new TestCube({
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter
        })

        this.isReady = true;
    }

    update(deltaT) {
        if (this.isReady && this.parameter.canUpdate) {
            this.controls.update(deltaT)
        }
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