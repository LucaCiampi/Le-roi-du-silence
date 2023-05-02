export default class Layout {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.event = _options.event;

        this.introMenu = null;
        this.pauseMenu = null;

        this.init();
    }

    init() {
        this.introMenu = document.getElementById('introMenu');
        this.pauseMenu = document.getElementById('pauseMenu');

        this.eventReceiver();
        this.eventListener();
    }

    eventReceiver() {
        this.event.on('Ready', () => {
            this.showIntroMenu()
        })
        this.event.on('Start', () => {
            this.hideIntroMenu()
        })
        this.event.on('Pause', () => {
            this.showPauseMenu()
        })
        this.event.on('Continue', () => {
            this.hidePauseMenu()
        })
    }

    eventListener() {
        this.introMenu.addEventListener('click', () => {
            this.event.start();
        })

        this.pauseMenu.addEventListener('click', () => {
            this.event.continue();
        })
    }

    showIntroMenu() {
        this.introMenu.classList.remove('d-none')
    }

    hideIntroMenu() {
        this.introMenu.classList.add('d-none')
    }
    
    showPauseMenu() {
        this.pauseMenu.classList.remove('d-none')
    }

    hidePauseMenu() {
        this.pauseMenu.classList.add('d-none')
    }

}