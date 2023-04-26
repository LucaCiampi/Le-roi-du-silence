import * as THREE from "three";
import { ceilPowerOfTwo } from "three/src/math/MathUtils";

export default class CollisionChecker {
    constructor(_options) {
        this.event = _options.event;
        this.parameter = _options.parameter;
        this.player = _options.player;
    }
    
    checkCollision() {
    }

    update() {
        this.checkCollision();
    }
}