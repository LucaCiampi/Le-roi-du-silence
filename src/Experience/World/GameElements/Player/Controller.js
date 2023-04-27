import * as THREE from "three";
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export default class Controller {
    constructor(_options) {
        this.player = _options.player;
        this.canvas = _options.canvas;
        this.camera = _options.camera;
        this.scene = _options.scene;

        this.controls = null;
        this.velocity = null;
        this.direction = null;
        this.vertex = null;
        this.raycaster = null;
        this.movements = {};

        this.init();
    }

    init() {
        this.controls = new PointerLockControls(this.camera, this.canvas);
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.vertex = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);


        //
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

        document.addEventListener('keydown', (event) => {
            this.onKeyDown(event)
        });

        document.addEventListener('keyup', (event) => {
            this.onKeyUp(event)
        });
    }

    allowMovement() {
        console.log(this.controls)
        console.log("allowMovement")
        this.controls.lock();
    }

    onKeyDown(event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                this.movements.moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.movements.moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.movements.moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.movements.moveRight = true;
                break;

            case 'Space':
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    onKeyUp(event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                this.movements.moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.movements.moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.movements.moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.movements.moveRight = false;
                break;

        }
    };

    getMovement(deltaT) {
        console.log('is locked ? ' + this.controls.isLocked)

        if (this.controls.isLocked === true) {

            this.raycaster.ray.origin.copy(this.controls.getObject().position);
            this.raycaster.ray.origin.y -= 10;

            const intersections = this.raycaster.intersectObjects(objects, false);

            const onObject = intersections.length > 0;

            this.velocity.x -= this.velocity.x * 10.0 * deltaT;
            this.velocity.z -= this.velocity.z * 10.0 * deltaT;

            this.velocity.y -= 9.8 * 100.0 * deltaT; // 100.0 = mass

            this.direction.z = Number(this.movements.moveForward) - Number(this.movements.moveBackward);
            this.direction.x = Number(this.movements.moveRight) - Number(this.movements.moveLeft);
            this.direction.normalize(); // this ensures consistent movements in all this.directions

            if (this.movements.moveForward || this.movements.moveBackward) this.velocity.z -= this.direction.z * 400.0 * deltaT;
            if (this.movements.moveLeft || this.movements.moveRight) this.velocity.x -= this.direction.x * 400.0 * deltaT;

            if (onObject === true) {

                this.velocity.y = Math.max(0, this.velocity.y);
                canJump = true;

            }

            this.controls.moveRight(- this.velocity.x * deltaT);
            this.controls.moveForward(- this.velocity.z * deltaT);

            this.controls.getObject().position.y += (this.velocity.y * deltaT); // new behavior

            if (this.controls.getObject().position.y < 10) {

                this.velocity.y = 0;
                this.controls.getObject().position.y = 10;

                canJump = true;

            }
        }
    }
}  