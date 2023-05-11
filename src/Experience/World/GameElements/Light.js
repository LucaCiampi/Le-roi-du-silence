import * as THREE from "three";


export default class Light {
    constructor(_options) {
        this.scene = _options.scene;
        this.debug = _options.debug;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.init();
    }

    init() {
        this.setWorldColor();
        this.setLight();
        this.setFog();

        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    setWorldColor() {
        this.scene.background = new THREE.Color(0x000000);
    }

    setLight() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)
    }

    setFog() {
        this.scene.fog = new THREE.Fog(0x000000, 0, 15);
    }

    /**
   * Adds debug options on GUI
   */
    addDebugOptions() {
        this.scene.fog.far = 100;

        const folder = this.debug.gui.addFolder('Light');
        folder.add(this.scene.fog, 'far');
    }

}