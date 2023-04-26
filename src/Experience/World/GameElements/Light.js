import * as THREE from "three";


export default class Floor {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.setLight();
    }

    setLight() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        // gui.add(ambientLight, "intensity").min(0).max(1).name("Ambient intensity")
        this.scene.add(ambientLight)
    }

}