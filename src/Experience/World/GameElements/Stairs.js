import * as THREE from "three";

// TO DELETE
export default class Stairs {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.init();
    }

    init() {
        this.model = this.resources.items['escalier-1'].scene;
        this.model.position.set(-1, 1, 0);

        this.scene.add(this.model);
    }
}