import * as THREE from "three";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export default class Camera {
    constructor(_options) {

        this.canvas = _options.canvas;
        this.scene = _options.scene;
        this.sizes = _options.sizes;
        this.resources = _options.resources;
        
        this.instance = null;
        this.controls = null;

        this.init();
    }

    init() {
        this.setInstance();
        // this.setControl();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(60, this.sizes.width / this.sizes.height, 1, 1000);
        this.instance.position.set(0, 0, 10);
        this.scene.add(this.instance);
    }

    setControl() {
        this.controls = new PointerLockControls(this.instance, this.canvas);

        this.controls.addEventListener('lock', () => {
            this.player.controlsEnabled = true;
            console.log('lock')
        });
        this.controls.addEventListener('unlock', () => {
            this.player.controlsEnabled = false;
            console.log('unlock')
        });

        console.log(this.instance)
        console.log(this.controls)

        this.scene.add(this.controls.getObject())
    }

    resize() {
        this.controls.handleResize();
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        // console.log(this.controls)
        // console.log(this)
        // this.controls.update();
        if (this.resources.playerPosition) {
            this.instance.position.copy(this.resources.playerPosition)
        }
    }

}

