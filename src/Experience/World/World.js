import * as THREE from "three";

import GlobalParameter from "./GlobalParameter";

import Layout from "./GameElements/Layout";
import Floor from "./GameElements/Floor";
import Light from "./GameElements/Light";
import TestCube from "./GameElements/TestCube";
import Controls from "./Controls";
import CollisionChecker from "./CollisionChecker";

export default class World {
    constructor(_options) {
        this.event = _options.event;
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

        this.controls = new Controls({
            canvas: this.canvas,
            camera: this.camera,
            scene: this.scene,
            resources: this.resources,
            event: this.event
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

        this.collisionChecker = new CollisionChecker({
            event: this.event,
            parameter: this.parameter,
            floor: this.floor,
        })

        this.isReady = true;
    }

    update(deltaT) {
        if (this.isReady && this.parameter.canUpdate) {
            this.controls.update(deltaT)
            this.collisionChecker.update();
        }
    }

    destroy() {
        this.layout.destroy()
        this.layout = null

        this.floor.destroy()
        this.floor = null

        this.light.destroy()
        this.light = null

        // this.collisionChecker.destroy()
        // this.collisionChecker = null
    }

}