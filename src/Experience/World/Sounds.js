import { Howl } from "howler";

export default class Sounds {
    constructor(_options) {

        this.items = [];

        this.setSounds();
    }

    setSounds() {
        this.sounds = {
            swoosh1: new Howl({
                src: ['./Sounds/swoosh1.mp3']
            }),
            swoosh2: new Howl({
                src: ['./Sounds/swoosh2.mp3']
            }),
            wind: new Howl({
                src: ['./Sounds/wind.mp3'],
                volume: 0.2
            }),
            uiButton: new Howl({
                src: ['./Sounds/uiButton.mp3']
            }),
            page: new Howl({
                src: ['./Sounds/page1.wav']
            }),
            page2: new Howl({
                src: ['./Sounds/page2.wav']
            }),
            end: new Howl({
                src: ['./Sounds/end.mp3']
            }),
        }

        this.steps = [
            new Howl({
                src: ['./Sounds/step0.mp3'],
                volume: 0.3
            }),
            new Howl({
                src: ['./Sounds/step1.mp3'],
                volume: 0.3
            }),
            new Howl({
                src: ['./Sounds/step2.mp3'],
                volume: 0.3
            }),
            new Howl({
                src: ['./Sounds/step3.mp3'],
                volume: 0.3
            }),
        ]
    }

    /**
     * Plays a sound once
     * @param {String} sound_name the name of the sound file
     */
    play(sound_name) {
        this.sounds[sound_name].play()
    }

    /**
     * Plays loop a sound
     * @param {String} sound_name the name of the sound file
     */
    playLoop(sound_name) {
        this.sounds[sound_name].loop(true).play()
    }


    /**
     * Pauses a sound
     * @param {String} sound_name the name of the sound file
     */
    pause(sound_name) {
        this.sounds[sound_name].pause()
    }

}