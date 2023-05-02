import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export default class Controls {
    constructor(_options) {
        this.canvas = _options.canvas;
        this.camera = _options.camera;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.event = _options.event;

        this.controls = null;
        this.velocity = null;
        this.direction = null;
        this.vertex = null;
        this.raycaster = null;
        this.movement = {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
            canJump: false,
        };

        // TODO: remove this below
        this.objects = []

        this.init();
    }

    init() {
        this.controls = new PointerLockControls(this.camera.instance, document.body);
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.vertex = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

        this.eventReciever();

        //
        const blocker = document.getElementById('blocker');
        const instructions = document.getElementById('instructions');


    }

    eventReciever() {
        // Wait until the "Start" event from eventEmitter to allow movement
        this.event.on('Start', () => {
            this.allowMovement();
        });

        // Wait for user to click on UI to allow pointer control
        this.controls.addEventListener('lock', function () {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
        });

        this.controls.addEventListener('unlock', function () {
            blocker.style.display = 'block';
            instructions.style.display = '';
        });
    }

    allowMovement() {
        this.controls.lock();

        document.addEventListener('keydown', (event) => {
            this.onKeyDown(event)
        });

        document.addEventListener('keyup', (event) => {
            this.onKeyUp(event)
        });
    }

    update(deltaT) {
        this.updatePlayer(deltaT);
    }

    updatePlayer(deltaT) {
        // Move the player according to the controller
        this.getMovement(deltaT);

        // this.player.position.x = this.player.position.x + movement.x
        // this.player.position.z = this.player.position.z + movement.z

        // this.resources.playerPosition = this.player.position

        // Update collider position
        // this.collider.setFromObject(this.player);
    }

    onKeyDown(event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                this.movement.moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.movement.moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.movement.moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.movement.moveRight = true;
                break;

            case 'Space':
                if (this.movement.canJump === true) this.velocity.y += 350;
                this.movement.canJump = false;
                break;

        }

    };

    onKeyUp(event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                this.movement.moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                this.movement.moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                this.movement.moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                this.movement.moveRight = false;
                break;

        }
    };

    getMovement(deltaT) {

        if (this.controls.isLocked === true) {

            this.raycaster.ray.origin.copy(this.controls.getObject().position);
            this.raycaster.ray.origin.y -= 10;

            const intersections = this.raycaster.intersectObjects(this.objects, false);

            const onObject = intersections.length > 0;

            const deltaMovement = deltaT / 1000;

            this.velocity.x -= this.velocity.x * 10.0 * deltaMovement;
            this.velocity.z -= this.velocity.z * 10.0 * deltaMovement;

            this.velocity.y -= 9.8 * 100.0 * deltaMovement; // 100.0 = mass

            this.direction.z = Number(this.movement.moveForward) - Number(this.movement.moveBackward);
            this.direction.x = Number(this.movement.moveRight) - Number(this.movement.moveLeft);
            this.direction.normalize(); // this ensures consistent movement in all this.directions

            if (this.movement.moveForward || this.movement.moveBackward) this.velocity.z -= this.direction.z * 400.0 * deltaMovement;
            if (this.movement.moveLeft || this.movement.moveRight) this.velocity.x -= this.direction.x * 400.0 * deltaMovement;

            if (onObject === true) {

                this.velocity.y = Math.max(0, this.velocity.y);
                this.movement.canJump = true;

            }

            this.controls.moveRight(- this.velocity.x * deltaMovement);
            this.controls.moveForward(- this.velocity.z * deltaMovement);

            console.log(this)

            this.controls.getObject().position.y += (this.velocity.y * deltaMovement); // new behavior

            if (this.controls.getObject().position.y < 10) {

                this.velocity.y = 0;
                this.controls.getObject().position.y = 10;

                this.movement.canJump = true;

            }
        }
    }
}  