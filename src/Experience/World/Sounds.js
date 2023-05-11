import { Howl } from "howler";

export default class Sounds {
    constructor(_options){

        this.items = [];

        this.setSounds();
    }

    setSounds(){
        this.sounds = {
            swoosh1 : new Howl({
                src: ['./Sounds/swoosh1.wav']
            }),
            swoosh2 : new Howl({
                src: ['./Sounds/swoosh2.wav']
            }),
            breathOfDeath : new Howl({
                src: ['./Sounds/breathOfDeath.aiff']
            }),
            wind : new Howl({
                src: ['./Sounds/wind.wav']
            }),
        }
    }

    play(sound_name){
        this.sounds[sound_name].play()
    }

    playLoop(sound_name){
        this.sounds[sound_name].loop(true).play()
    }

}