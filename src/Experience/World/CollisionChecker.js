import * as THREE from "three";
import { Capsule } from 'three/addons/math/Capsule.js';

export default class CollisionChecker {
    constructor(_options) {
        this.event = _options.event;
        this.parameter = _options.parameter;
        this.camera = _options.camera;
        this.controls = _options.controls;
        this.floor = _options.floor;

        this.playerCollider = null;

        this.init()
    }

    init() {
        this.playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 );
        this.DISTANCE_THRESHOLD = 0.5
    }

    update(deltaT) {
        this.updatePlayer(deltaT);
    }
    
    updatePlayer(deltaT) {
        const deltaPosition = this.controls.playerVelocity.clone().multiplyScalar( deltaT );
        this.playerCollider.translate( deltaPosition );
        
        this.checkPlayerOctreeCollision();

        this.camera.instance.position.copy( this.playerCollider.end );

        // console.log(this.camera.instance.position)
    }

    checkPlayerOctreeCollision() {
        const result = this.floor.worldOctree.capsuleIntersect(this.playerCollider);

        this.controls.playerOnFloor = false;

        // console.log(result)

        if (result) {

            this.controls.playerOnFloor = result.normal.y > 0;

            if (!this.controls.playerOnFloor) {

                this.controls.playerVelocity.addScaledVector(result.normal, - result.normal.dot(this.controls.playerVelocity));

            }

            this.playerCollider.translate(result.normal.multiplyScalar(result.depth));

        }
    }
}