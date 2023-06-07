export default class Layout {
    constructor(_options) {
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.event = _options.event;

        this.loader = null;
        this.motion = null;
        this.introMenu = null;
        this.introMenuStartButton = null;
        this.pauseMenu = null;
        this.endMenu = null;

        this.userInterface = null;
        this.userInterfaceLife = null;
        this.userInterfaceOnboarding = null;
        this.heartIcon = null;
        this.doorOpenLabel = null;
        this.memoriesOverlay = null;
        this.modal = null;
        this.modalContent = null;

        this.init();
    }

    init() {
        this.loader = document.getElementById('loader');
        this.motion = document.getElementById('motion');
        this.introMenu = document.getElementById('introMenu');
        this.introMenuStartButton = this.introMenu.querySelector('#startButton');
        this.pauseMenu = document.getElementById('pauseMenu');
        this.endMenu = document.getElementById('endMenu');

        this.userInterface = document.getElementById('userInterface');
        this.userInterfaceLife = this.userInterface.querySelector('#score');
        this.userInterfaceOnboarding = this.userInterface.querySelector('#onboarding');
        this.heartIcon = this.userInterface.querySelector('#heart');
        this.doorOpenLabel = this.userInterface.querySelector('#doorOpenLabel');
        this.memoriesOverlay = this.userInterface.querySelector('#memoriesOverlay');
        this.modal = this.userInterface.querySelector('#modal');
        this.modalContent = this.modal.querySelector('#modalContent');

        this.eventReceiver();
        this.eventListener();
    }

    /**
     * Listens to the events of the game
     */
    eventReceiver() {
        this.event.on('Ready', () => {
            this.hideLoader();
            this.showIntroMenu();
        })
        this.event.on('Start', () => {
            this.hideIntroMenu();
            this.showUserInterface();
        })
        this.event.on('Pause', () => {
            this.showPauseMenu();
        })
        this.event.on('Continue', () => {
            this.hidePauseMenu();
        })
        this.event.on('End', () => {
            this.showEndMenu();
        })
    }

    /**
     * Adds event listeners
     */
    eventListener() {
        this.motion.addEventListener('ended', () => {
            this.motion.classList.add('z--1');
        })

        this.introMenuStartButton.addEventListener('click', () => {
            this.event.start();
            this.parameter.sounds.play('uiButton');
        })

        this.pauseMenu.addEventListener('click', () => {
            this.event.continue();
        })
    }

    /**
     * Hides the loader
     */
    hideLoader() {
        this.fadeOutUiPanel(this.loader);
    }

    /**
     * Shows the intro menu
     */
    showIntroMenu() {
        this.introMenu.classList.remove('d-none');
    }

    /**
     * Hides the intro menu
     */
    hideIntroMenu() {
        // this.introMenu.classList.add('d-none');
        this.fadeOutUiPanel(this.introMenu);
    }

    /**
     * Shows the pause menu
     */
    showPauseMenu() {
        this.pauseMenu.classList.remove('d-none');
    }

    /**
     * Hides the pause menu
     */
    hidePauseMenu() {
        this.pauseMenu.classList.add('d-none');
    }

    /**
     * Shows the end menu
     */
    showEndMenu() {
        this.endMenu.classList.remove('d-none');
        this.fadeInUiPanel(this.endMenu);
    }

    /**
     * Hides the end menu
     */
    hideEndMenu() {
        this.endMenu.classList.add('d-none');
    }

    /**
     * Displays the user interface
     */
    showUserInterface() {
        this.userInterface.classList.remove('d-none');
    }

    /**
     * Displays the modal window
     * allowing to display images like Leo's notes
     */
    showUserInterfaceModal(fileSource) {
        this.parameter.modalOpen = true;
        this.parameter.sounds.play('page2');
        this.modalContent.src = fileSource;
        this.fadeInUiPanel(this.modal);
    }

    /**
     * Hides the modal window
     */
    hideUserInterfaceModal() {
        this.parameter.modalOpen = false;
        this.parameter.sounds.play('page');
        this.fadeOutUiPanel(this.modal);
    }

    /**
     * Hides the onboarding
     */
    hideOnboarding() {
        this.fadeOutUiPanel(this.userInterfaceOnboarding);
    }

    /**
     * Displays a heart to indicate a trust point has been earned
     */
    showUserIndicatorTrustPointEarned() {
        this.heartIcon.classList.add('animation--popup');

        setTimeout(() => {
            this.heartIcon.classList.remove('animation--popup');
        }, 2000);
    }

    /**
     * Displays a text indicating the door has been opened
     */
    showUserIndicatorDoorOpen() {
        this.doorOpenLabel.classList.add('door-open-label--popup');

        setTimeout(() => {
            this.doorOpenLabel.classList.remove('door-open-label--popup');
        }, 6000);
    }

    showMemoriesOverlay() {
        this.memoriesOverlay.classList.add('memories-overlay--visible');
    }

    hideMemoriesOverlay() {
        this.memoriesOverlay.classList.remove('memories-overlay--visible');
    }

    /**
     * Fade out effect for UI panel
     * @param {HTMLElement} panel - the element targeted
     */
    fadeOutUiPanel(panel) {
        panel.classList.add('hidden');

        setTimeout(() => {
            panel.classList.add('z--1');
        }, 1000);
    }

    /**
     * Fade in effect for UI panel
     * @param {HTMLElement} panel - the element targeted
     */
    fadeInUiPanel(panel) {
        panel.classList.remove('z--1');
        panel.classList.remove('hidden');
    }

    /**
     * Updates the current trust score
     * @param {Number} score - the current score
     */
    updateScore(score) {
        this.userInterfaceLife.innerHTML = score.toString() + '/20';
    }

}