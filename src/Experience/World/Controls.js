import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Capsule } from 'three/addons/math/Capsule.js';

export default class Controls {
    constructor(_options) {
        this.canvas = _options.canvas;
        this.camera = _options.camera;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.event = _options.event;
        this.floor = _options.floor;

        this.controls = null;
        this.playerVelocity = null;
        this.playerDirection = null;
        this.playerOnFloor = false;

        this.keyStates = {};

        this.GRAVITY = 30;

        this.init();
    }

    init() {
        this.controls = new PointerLockControls(this.camera.instance, document.body);
        this.playerVelocity = new THREE.Vector3();
        this.playerDirection = new THREE.Vector3();
        this.playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
        this.DISTANCE_THRESHOLD = 0.5

        this.camera.instance.rotation.order = 'YXZ';

        this.eventReciever();

        this.clock = new THREE.Clock();
    }

    // update(deltaT) {
    //     this.controlsKeyBindings(deltaT)
    //     this.updatePlayer(deltaT);
    //     this.teleportPlayerIfOob();
    // }

    update() {
        const deltaTime = Math.min(0.05, this.clock.getDelta()) / 5;

        // we look for collisions in substeps to mitigate the risk of
        // an object traversing another too quickly for detection.

        for (let i = 0; i < 5; i++) {

            this.controlsKeyBindings(deltaTime);

            this.updatePlayer(deltaTime);

            this.teleportPlayerIfOob();

        }

    }

    eventReciever() {
        // Wait until the "Start" event from eventEmitter to allow movement
        this.event.on('Start', () => {
            this.allowPlayerMovement();
        });

        // Wait for user to click on UI to allow pointer control
        const blocker = document.getElementById('blocker');
        const instructions = document.getElementById('instructions');

        this.controls.addEventListener('lock', function () {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
        });

        this.controls.addEventListener('unlock', function () {
            blocker.style.display = 'block';
            instructions.style.display = '';
        });
    }

    allowPlayerMovement() {
        this.controls.lock();

        document.addEventListener('keydown', (event) => {
            this.keyStates[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keyStates[event.code] = false;
        });
    }

    controlsKeyBindings(deltaTime) {

        // gives a bit of air control
        const speedDelta = deltaTime * (this.playerOnFloor ? 25 : 8);

        if (this.keyStates['KeyW']) {

            this.playerVelocity.add(this.getForwardVector().multiplyScalar(speedDelta));

        }

        if (this.keyStates['KeyS']) {

            this.playerVelocity.add(this.getForwardVector().multiplyScalar(- speedDelta));

        }

        if (this.keyStates['KeyA']) {

            this.playerVelocity.add(this.getSideVector().multiplyScalar(- speedDelta));

        }

        if (this.keyStates['KeyD']) {

            this.playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta));

        }

        if (this.playerOnFloor) {

            if (this.keyStates['Space']) {

                this.playerVelocity.y = 15;

            }

        }
    }

    getForwardVector() {

        this.camera.instance.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();

        return this.playerDirection;

    }

    getSideVector() {

        this.camera.instance.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.cross(this.camera.instance.up);

        return this.playerDirection;

    }

    updatePlayer(deltaTime) {
        let damping = Math.exp(- 4 * deltaTime) - 1;

        if (!this.playerOnFloor) {

            this.playerVelocity.y -= this.GRAVITY * deltaTime;

            // small air resistance
            damping *= 0.1;

        }

        this.playerVelocity.addScaledVector(this.playerVelocity, damping);

        const deltaPosition = this.playerVelocity.clone().multiplyScalar(deltaTime);
        this.playerCollider.translate(deltaPosition);

        this.playerCollisions();

        this.camera.instance.position.copy(this.playerCollider.end);
    }

    playerCollisions() {
        const result = this.floor.worldOctree.capsuleIntersect(this.playerCollider);

        this.playerOnFloor = false;

        // console.log(result)

        if (result) {

            this.playerOnFloor = result.normal.y > 0;

            if (!this.playerOnFloor) {

                this.playerVelocity.addScaledVector(result.normal, - result.normal.dot(this.playerVelocity));

            }

            this.playerCollider.translate(result.normal.multiplyScalar(result.depth));

        }
    }

    teleportPlayerIfOob() {

        if (this.camera.instance.position.y <= - 25) {

            this.playerCollider.start.set(0, 0.35, 0);
            this.playerCollider.end.set(0, 1, 0);
            this.playerCollider.radius = 0.35;
            this.camera.instance.position.copy(this.playerCollider.end);
            this.camera.instance.rotation.set(0, 0, 0);

        }

    }
}  