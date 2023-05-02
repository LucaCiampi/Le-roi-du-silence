import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export default class Debug {
    constructor(_options) {
        this.world = _options.world;

        this.active = null;

        this.init()
    }

    init() {
        this.active = window.location.hash === "#debug";

        if (this.active) {
            console.log('debug active')
            this.gui = new GUI();
            this.addOptions();
        }
    }

    addOptions() {
        this.gui.add(this.world.floor.octreeHelper, 'visible')
            .onChange((value) => {
                this.world.floor.octreeHelper.visible = value;
                console.log(this.world.floor.octreeHelper.visible)
            });
    }
}