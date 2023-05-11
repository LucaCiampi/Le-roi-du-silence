import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export default class Debug {
    constructor(_options) {
        this.active = null;
        this.gui = null;
        this.stats = null;

        this.init()
    }

    init() {
        this.active = window.location.hash === "#debug";

        if (this.active) {
            console.log('🪲 DEBUG active')

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '0px';
            document.body.appendChild(this.stats.domElement);

            this.gui = new GUI();
        }
    }

    update() {
        this.stats.update();
    }
}