import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter 
{
    constructor(){
        super();

        this.start = Date.now();
        this.currentTime = this.start;
        this.elapsedTime = 0;
        this.deltaTime = 16;

        window.requestAnimationFrame(() => {
            this.setTick();
        })
    }

    setTick(){
        const tickTack = Date.now();
        this.deltaTime = (tickTack - this.currentTime)
        this.currentTime = tickTack
        this.elapsedTime = this.start - this.currentTime

        this.trigger('update')

        window.requestAnimationFrame(() => {
            this.setTick();
        })
    }

}