import * as THREE from "three";

import GlobalParameter from "./GlobalParameter";

import Layout from "./GameElements/Layout";
import Floor from "./GameElements/Floor";
import Light from "./GameElements/Light";
import Player from "./GameElements/Player/Player";
import CollisionChecker from "./CollisionChecker";

export default class World {
    constructor(_options) {
        this.event = _options.event;
        this.scene = _options.scene;
        this.resources = _options.resources;

        this.parameter = new GlobalParameter({
            event: this.event,
            scene: this.scene
        });
    }

    ready() {
        this.layout = new Layout({
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter
        })
        
        this.floor = new Floor({
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter
        })
        
        this.light = new Light({
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter
        })

        this.player = new Player({
            event: this.event,
            scene: this.scene,
            resources: this.resources,
            parameter: this.parameter
        })

        this.collisionChecker = new CollisionChecker({
            event: this.event,
            parameter: this.parameter,
            player: this.player,
        })

        this.isReady = true;
        this.event.start();
    }

    update(deltaT) {
        if (this.isReady && this.parameter.canUpdate) {
            this.player.update(deltaT)
            this.collisionChecker.update();
        }
    }

}