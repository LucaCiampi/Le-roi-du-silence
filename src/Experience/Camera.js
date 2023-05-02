import * as THREE from "three";
// import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

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
        this.instance.position.set(0, 0, 0);
        this.scene.add(this.instance);
    }

    resize() {
        // this.controls.handleResize();
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        // console.log(this.controls)
        // this.controls.update();

        // if (this.resources.playerPosition) {
        //     this.instance.position.copy(this.resources.playerPosition)
        // }

        // console.log(this.instance.position)
    }

}

