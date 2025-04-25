import { Ticker } from 'pixi.js';

let timer!:Timer;

export default class Timer {

    private ticker!: Ticker;
    private callbacks: Set<(elapsedTime: number) => void> = new Set();
    private running: boolean = false;
    private elapsedS: number = 0;
    
    constructor(ticker: Ticker) {
        if (timer) return timer;
        this.ticker = ticker;
    }

    addUpdateCallback(callback: (elapsedTime: number) => void) {
        if (!this.callbacks.has(callback)) {
            if (this.callbacks.size === 0) 
                this.ticker.add(this.update, this);
            this.callbacks.add(callback);
        }
    }

    removeUpdateCallback(callback: (elapsedTime: number) => void) {
        if (this.callbacks.has(callback)) {
            this.callbacks.delete(callback);
            if (this.callbacks.size === 0) this.running = false;
        }
    }

    start(): void {
        if (this.running || this.callbacks.size === 0) return;
        this.running = true;
    }

    resume(): void {
        this.running = true;
    }

    pause(): void {
        this.running = false;
    }

    stop(): void {
        this.running = false;
        this.elapsedS = 0;
    }

    destroy(): void {
        this.stop();
        this.callbacks.clear();
        this.ticker.remove(this.update, this);
    }

    private update(): void {
        if (!this.running || this.callbacks.size === 0) return;
        this.elapsedS += this.ticker.elapsedMS * 1000;
        this.callbacks.forEach(callback => callback(this.elapsedS));
    }
}