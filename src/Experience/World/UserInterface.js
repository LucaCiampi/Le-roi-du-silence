import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export default class Layout {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.event = _options.event;

        this.blocker = null;
        this.introUI = null;

        this.init();
    }

    init() {
        this.blocker = document.getElementById('blocker')
        this.introUI = document.getElementById('instructions')

        this.eventReceiver();
        this.eventListener();
    }

    eventReceiver() {
        this.event.on('Ready', () => {
            this.displayIntroUI()
        })
    }

    eventListener() {
        this.introUI.addEventListener('click', () => {
            this.event.start();
        })
    }

    displayIntroUI() {
        this.blocker.classList.remove('d-none')
    }
}