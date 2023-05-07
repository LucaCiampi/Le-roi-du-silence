import Sounds from "./Sounds";

export default class GlobalParameter {
    constructor(_options) {
        this.event = _options.event;
        this.scene = _options.scene;

        this.sounds = null;
        this.counterOn = false;
        this.canUpdate = false;
        this.currentZone = null;
        this.gameEnded = false;

        this.NUMBER_OF_ZONES = 4;

        this.init();
    }

    init() {
        this.sounds = new Sounds();
        this.currentZone = 0;

        this.eventReceiver();
        this.reset();
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

    reset() {
        this.canUpdate = true;

        this.setStarter()
    }

    setStarter() {
        this.counterOn = false;
        this.TimerCount = 300;
        this.timer = this.TimerCount;
    }

    incrementCurrentZone() {
        if (this.currentZone + 1 < this.NUMBER_OF_ZONES) {
            this.currentZone += 1
        }
        else {
            this.event.end();
            this.gameEnded = true;
        }
    }

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
}