import * as THREE from "three";

export default class Camera {
    constructor(_options) {
        this.scene = _options.scene;
        this.sizes = _options.sizes;

        this.instance = null;
        this.audioListener = null;

        this.init();
    }

    init() {
        this.instance = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.instance.position.set(0, 0, 0);

        this.audioListener = new THREE.AudioListener();
        this.instance.add(this.audioListener);

        this.scene.add(this.instance);
    }
    
    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }
    
    update() {
        // silence is golden...
    }
}

