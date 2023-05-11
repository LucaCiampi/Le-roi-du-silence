import * as THREE from "three";


export default class Light {
    constructor(_options) {
        this.scene = _options.scene;
        this.debug = _options.debug;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.camera = _options.camera;

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
        const spotLight = new THREE.SpotLight(0xffffff, 2)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
        spotLight.angle = 0.3;
        spotLight.penumbra = 0.1;
        spotLight.decay = 2;
        spotLight.distance = 50;
        spotLight.position.y += 1
        
        this.scene.add(ambientLight)
        this.camera.instance.add(spotLight)
        spotLight.position.set( 0, 0, 1);
        spotLight.target = this.camera.instance;
    }

    setFog() {
        this.scene.fog = new THREE.Fog(0x000000, 0, 15);
    }

    /**
   * Adds debug options on GUI
   */
    addDebugOptions() {
        this.scene.fog.far = 100;
        this.debug.gui.add(this.scene.fog, 'far');
    }

}