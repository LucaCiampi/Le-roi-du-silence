import * as THREE from "three";
import { Capsule } from 'three/addons/math/Capsule.js';

export default class CollisionChecker {
    constructor(_options) {
        this.event = _options.event;
        this.parameter = _options.parameter;
        this.floor = _options.floor;

        this.init()
    }

    init() {
        this.playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 );
        this.DISTANCE_THRESHOLD = 0.5
        this.playerOnFloor = false;
    }

    update() {
        this.checkPlayerOctreeCollision();
    }

    checkPlayerOctreeCollision() {
        const result = this.floor.worldOctree.capsuleIntersect(this.playerCollider);

        this.playerOnFloor = false;

        if (result) {

            this.playerOnFloor = result.normal.y > 0;

            if (!this.playerOnFloor) {

                playerVelocity.addScaledVector(result.normal, - result.normal.dot(playerVelocity));

            }

            this.playerCollider.translate(result.normal.multiplyScalar(result.depth));

        }
    }

    addPoint(item) {
        if (item.name == 'good') {
            this.parameter.score += 1;
        } else if (item.name == 'bad') {
            if (this.parameter.score > 0) {
                this.parameter.score -= 1;
            }
            this.parameter.multiplier = 1;
        } else {
            this.parameter.score += 5 * this.parameter.multiplier;
            this.parameter.multiplier += 1
        }
        this.event.updateScoreIndicator();
    }
}