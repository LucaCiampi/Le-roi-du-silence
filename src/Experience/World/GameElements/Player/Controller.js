import * as THREE from "three";

export default class Controller {
    constructor({ player }) {
        this.player = player;

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
        };

        this.SPEED = 0.005;

        // Computer
        document.body.addEventListener('keydown', this.onKeyDown.bind(this));
        document.body.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 90: // Z key
                this.keys.forward = true;
                break;
            case 81: // Q key
                this.keys.left = true;
                break;
            case 83: // S key
                this.keys.backward = true;
                break;
            case 68: // D key
                this.keys.right = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case 90: // Z key
                this.keys.forward = false;
                break;
            case 81: // Q key
                this.keys.left = false;
                break;
            case 83: // S key
                this.keys.backward = false;
                break;
            case 68: // D key
                this.keys.right = false;
                break;
        }
    }

    getMovement(deltaT) {
        let movement = {x: 0, z: 0};

        if (this.keys.left) {
            movement.x -= this.SPEED;
        }
        else if (this.keys.right) {
            movement.x += this.SPEED;
        }

        if (this.keys.forward) {
            movement.z -= this.SPEED
        }
        else if (this.keys.backward) {
            movement.z += this.SPEED
        }

        return movement;
    }
}  