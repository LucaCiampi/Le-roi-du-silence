import { Howl, Howler } from "howler";

export default class Sounds {
    constructor(_options){

        this.items = [];

        this.setSounds();
    }

    setSounds(){
        this.sounds = {
            sound_Starter_Number : new Howl({
                src: ['./Starter/Sounds/Starter_Countdown_Number.mp3']
            }),
            sound_Starter_Go : new Howl({
                src: ['./Starter/Sounds/Starter_Countdown_Go.mp3']
            }),
        }
    }

    play(sound_name){
        this.sounds[sound_name].play()
    }

}