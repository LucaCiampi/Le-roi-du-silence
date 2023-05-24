import Sounds from "./Sounds";

export default class GlobalParameter {
    constructor(_options) {
        this.event = _options.event;
        this.scene = _options.scene;
        this.debug = _options.debug;

        this.sounds = null;
        this.counterOn = false;
        this.canUpdate = false;
        this.currentZone = null;
        this.gameEnded = false;
        this.playerSpawn = null;

        this.NUMBER_OF_ZONES = 4;

        this.init();
    }

    init() {
        this.currentZone = 0;
        this.sounds = new Sounds();
        this.playerSpawn = { x: 0, y: 0, z: -2 };

        this.eventReceiver();
        this.reset();

        if (this.debug.active) {
            this.addDebugOptions();
        }
    }

    eventReceiver() {
        this.event.on('Start', () => {
            this.counterOn = true;
        })

        this.event.on('Pause', () => {
            this.counterOn = false;
        })

        this.event.on('Continue', () => {
            this.counterOn = true;
        })

        this.event.on('Reset', () => {
            this.reset();
            this.counterOn = true;
        })

        this.event.on('StopTimer', () => {
            this.canUpdate = false;
        })
    }

    /**
     * Resets game
     */
    reset() {
        this.canUpdate = true;

        this.setStarter()
    }

    /**
     * Sets up game starter parameters
     */
    setStarter() {
        this.counterOn = false;
        this.TimerCount = 300;
        this.timer = this.TimerCount;
    }

    /**
     * Increments zone player has reached
     */
    incrementCurrentZone() {
        if (this.currentZone + 1 < this.NUMBER_OF_ZONES) {
            this.currentZone += 1
        }
        else {
            this.event.end();
            this.gameEnded = true;
        }
    }

    /**
     * Destroy an item passed in param
     * @param {any} item item to destroy
     */
    destroy(item) {
        item.geometry.dispose();
        for (const key in item.material) {
            const value = item.material[key]

            if (value && typeof value.dispose === 'function') {
                value.dispose()
            }
        }
        this.scene.remove(item)
    }

    /**
    * Adds debug options on GUI
    */
    addDebugOptions() {
        const folder = this.debug.gui.addFolder('GlobalParameter');

        folder.add(this, 'currentZone')
            .onChange((value) => {
                this.currentZone = value;
            });
    }
}