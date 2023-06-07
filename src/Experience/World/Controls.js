import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Capsule } from 'three/addons/math/Capsule.js';

export default class Controls {
    constructor(_options) {
        this.canvas = _options.canvas;
        this.camera = _options.camera;
        this.parameter = _options.parameter;
        this.event = _options.event;
        this.debug = _options.debug;
        this.userInterface = _options.userInterface;
        this.worldOctree = _options.worldOctree;

        this.controls = null;
        this.playerVelocity = null;
        this.playerDirection = null;
        this.playerCollider = null;
        this.playerOnFloor = false;
        this.playerPositionDebugUi = null;
        this.stepSoundPlaying = false;
        this.stepSoundIndex = null;
        this.stepSoundTimeout = 600;

        this.keyStates = {};

        this.playerSpeed = 7;
        this.playerSpeedAir = 2;
        this.GRAVITY = 70;

        this.init();
    }

    init() {
        this.controls = new PointerLockControls(this.camera.instance, document.body);
        this.playerVelocity = new THREE.Vector3();
        this.playerDirection = new THREE.Vector3();
        this.playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);
        this.clock = new THREE.Clock();
        this.playerPositionDebugUi = document.getElementById('playerPosition');
        this.stepSoundIndex = 0;

        this.eventReciever();

        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    // update(deltaT) {
    //     this.controlsKeyBindings(deltaT)
    //     this.updatePlayer(deltaT);
    //     this.teleportPlayerIfOob();
    // }

    // TODO: merge with local 'Time' class
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

    /**
     * Listens for the 'Start' event triggered by the 'Event' class
     */
    eventReciever() {
        // Wait until the "Start" event from eventEmitter to allow movement
        this.event.on('Start', () => {
            this.allowPlayerMovement();
            this.setPointerLockControlsEventListeners();
        });

        this.event.on('Continue', () => {
            this.allowPlayerMovement();
        })

        this.event.on('End', () => {
            this.controls.unlock();
        })
    }

    /**
     * Event listeners related to pointer lock control
     * If user presses escape, pauses the game
     */
    setPointerLockControlsEventListeners() {
        this.canvas.addEventListener('click', () => {
            this.setPointerLockControlsEventListeners();
        });

        this.controls.addEventListener('unlock', () => {
            if (!this.parameter.gameEnded) {
                this.event.pause();
            }
        });
    }

    /**
     * Allows the player to move if the game is ready
     */
    allowPlayerMovement() {
        this.controls.lock();

        document.addEventListener('keydown', (event) => {
            this.keyStates[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keyStates[event.code] = false;
        });
    }

    /**
     * Listens for user keyboard input at every deltaTime
     * @param {number} deltaTime 
     */
    controlsKeyBindings(deltaTime) {

        // gives a bit of air control
        const speedDelta = deltaTime * (this.playerOnFloor ? this.playerSpeed : this.playerSpeedAir);

        if (this.keyStates['KeyW'] || this.keyStates['ArrowUp']) {

            this.playerVelocity.add(this.getForwardVector().multiplyScalar(speedDelta));
            this.makeStepNoise();

        }

        if (this.keyStates['KeyS'] || this.keyStates['ArrowDown']) {

            this.playerVelocity.add(this.getForwardVector().multiplyScalar(- speedDelta));
            this.makeStepNoise();

        }

        if (this.keyStates['KeyA'] || this.keyStates['ArrowLeft']) {

            this.playerVelocity.add(this.getSideVector().multiplyScalar(- speedDelta));
            this.makeStepNoise();

        }

        if (this.keyStates['KeyD'] || this.keyStates['ArrowRight']) {

            this.playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta));
            this.makeStepNoise();

        }

        if (this.keyStates['KeyF']) {

            if (this.parameter.modalOpen) {
                this.userInterface.hideUserInterfaceModal();
            }

        }
    }

    /**
     * Gets the forward vector
     * @returns {THREE.Vector3} player forward vector
     */
    getForwardVector() {

        this.camera.instance.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();

        return this.playerDirection;

    }

    /**
     * Gets the side vector
     * @returns {THREE.Vector3} player side vector
     */
    getSideVector() {

        this.camera.instance.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.cross(this.camera.instance.up);

        return this.playerDirection;

    }

    /**
     * Updates the player position
     * @param {number} deltaTime 
     */
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
        this.parameter.playerPosition = this.playerCollider.end;

        // TODO: remove
        this.playerPositionDebugUi.innerHTML =
            'x: ' + this.playerCollider.end.x +
            '<br />y: ' + this.playerCollider.end.y +
            '<br />z: ' + this.playerCollider.end.z;
    }

    /**
     * Checks if the player capsule collides with the world octree map
     */
    playerCollisions() {

        const result = this.worldOctree.octree.capsuleIntersect(this.playerCollider);

        this.playerOnFloor = false;

        if (result) {


            this.playerOnFloor = result.normal.y > 0;

            if (!this.playerOnFloor) {

                this.playerVelocity.addScaledVector(result.normal, - result.normal.dot(this.playerVelocity));

            }

            this.playerCollider.translate(result.normal.multiplyScalar(result.depth));

        }

    }

    /**
     * Teleports player to origin if he falls below -25 height unit
     */
    teleportPlayerIfOob() {

        if (this.camera.instance.position.y <= - 25) {

            this.playerCollider.start.set(
                this.parameter.playerSpawn.x,
                this.parameter.playerSpawn.y + 0.35,
                this.parameter.playerSpawn.z
            );
            this.playerCollider.end.set(
                this.parameter.playerSpawn.x,
                this.parameter.playerSpawn.y + 1,
                this.parameter.playerSpawn.z
            );
            this.playerCollider.radius = 0.35;
            this.camera.instance.position.copy(this.playerCollider.end);
            this.camera.instance.rotation.set(0, 0, 0);

        }

    }

    makeStepNoise() {
        if (this.stepSoundPlaying === false) {
            this.parameter.sounds.steps[this.stepSoundIndex].play();
            this.stepSoundPlaying = true;

            setTimeout(() => {
                this.stepSoundPlaying = false;
                this.stepSoundIndex += 1;
                if (this.stepSoundIndex >= 4) {
                    this.stepSoundIndex = 0;
                }
            }, this.stepSoundTimeout);
        }
    }

    /**
    * Adds controls options in case of debug
    */
    addDebugOptions() {
        this.playerPositionDebugUi.classList.remove('d-none');
        this.playerSpeed = 15;
        // this.GRAVITY = 0;
    }
}  