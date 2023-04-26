import EventEmitter from "./Utils/EventEmitter";

export default class Event extends EventEmitter{
    constructor(_options){
        super();
    }

    start(){
        this.trigger('Start');
    }

    reset(){
        this.trigger('Reset');
    }

    ready(){
        this.trigger('Ready');
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