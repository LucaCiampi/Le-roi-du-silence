import { Howl } from "howler";

export default class Sounds {
    constructor(_options) {

        this.items = [];

        this.setSounds();
    }

    setSounds() {
        this.sounds = {
            swoosh1: new Howl({
                src: ['./Sounds/swoosh1.wav']
            }),
            swoosh2: new Howl({
                src: ['./Sounds/swoosh2.wav']
            }),
            wind: new Howl({
                src: ['./Sounds/wind.wav']
            }),
            uiButton: new Howl({
                src: ['./Sounds/uiButton.mp3']
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

}