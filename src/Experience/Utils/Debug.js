import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export default class Debug {
    constructor(_options) {
        this.active = null;
        this.gui = null;

        this.init()
    }

    init() {
        this.active = window.location.hash === "#debug";

        if (this.active) {
            console.log('debug active')
            this.gui = new GUI();
        }
    }
}