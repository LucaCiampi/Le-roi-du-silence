import * as THREE from "three";

export default class Floor {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.model = null;

        this.init();
    }

    init() {
        this.model = this.resources.items['floor'].scene;

        this.model.traverse((child, key) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial();

                child.material.map = this.resources.items['wood'];
                child.material.needsUpdate = true;

                // child.material.map = sprite;
            }
        })
        this.model.position.set(0, 0, 0)

        this.scene.add(this.model)
    }
}