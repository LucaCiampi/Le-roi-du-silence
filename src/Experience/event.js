import EventEmitter from "./Utils/EventEmitter";

export default class Event extends EventEmitter{
    constructor(_options){
        super();
    }

    ready(){
        this.trigger('Ready');
    }

    start(){
        this.trigger('Start');
    }

    reset(){
        this.trigger('Reset');
    }

    dead(){
        this.trigger('Dead');
    }

    startTimer(){
        this.trigger('StartTimer');
    }

    stopTimer(){
        this.trigger('StopTimer');
    }
}