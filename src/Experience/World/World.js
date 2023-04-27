import * as THREE from "three";

import GlobalParameter from "./GlobalParameter";

import Layout from "./GameElements/Layout";
import Floor from "./GameElements/Floor";
import Light from "./GameElements/Light";
import Player from "./GameElements/Player/Player";
import TestCube from "./GameElements/TestCube";

export default class World {
    constructor(_options) {
        this.event = _options.event;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.camera = _options.camera;
        this.canvas = _options.canvas;
        this.player = _options.player;

        this.parameter = new GlobalParameter({
            event: this.event,
            scene: this.scene
        });
    }

    ready() {
        this.layout = new Layout({
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

        this.player = new Player({
            event: this.event,
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter,
            canvas: this.canvas,
            camera: this.camera
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
            this.player.update(deltaT)
            // this.collisionChecker.update();
        }
    }

    destroy() {
        this.layout.destroy()
        this.layout = null
        
        this.floor.destroy()
        this.floor = null
        
        this.light.destroy()
        this.light = null

        this.player.destroy()
        this.player = null

        // this.collisionChecker.destroy()
        // this.collisionChecker = null
    }

}