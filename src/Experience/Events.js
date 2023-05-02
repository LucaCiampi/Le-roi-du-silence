import EventEmitter from "./Utils/EventEmitter";

export default class Event extends EventEmitter{
    constructor(_options){
        super();
    }

    ready(){
        console.log('⭐️ EVENT : Ready');
        this.trigger('Ready');
    }

    start(){
        console.log('⭐️ EVENT : Start');
        this.trigger('Start');
    }

    pause(){
        console.log('⭐️ EVENT : Pause');
        this.trigger('Pause');
    }

    continue(){
        console.log('⭐️ EVENT : Continue');
        this.trigger('Continue');
    }

    reset(){
        console.log('⭐️ EVENT : Reset');
        this.trigger('Reset');
    }

    dead(){
        console.log('⭐️ EVENT : Dead');
        this.trigger('Dead');
    }

    end(){
        console.log('⭐️ EVENT : End');
        this.trigger('End');
    }

    startTimer(){
        console.log('⭐️ EVENT : StartTimer');
        this.trigger('StartTimer');
    }

    stopTimer(){
        console.log('⭐️ EVENT : StopTimer');
        this.trigger('StopTimer');
    }
}