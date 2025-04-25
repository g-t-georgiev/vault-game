import { Ticker } from 'pixi.js';

export default class Timer {

    private static _instance?: Timer;

    static getInstance(ticker: Ticker): Timer {
        if (!this._instance) {
            this._instance = new this(ticker);
        }
        return this._instance;
    }

    private ticker!: Ticker;
    private callbacks: Set<(elapsedTime: number) => void> = new Set();
    private running: boolean = false;
    private elapsedSeconds: number = 0;
    
    private constructor(ticker: Ticker) {
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
            if (this.callbacks.size === 0) 
                this.ticker.remove(this.update, this);
        }
    }

    start(): void {
        if (this.running || this.callbacks.size === 0) return;
        this.elapsedSeconds = 0;
        this.running = true;
    }

    resume(): void {
        if (this.running) return;
        this.running = true;
    }

    pause(): void {
        if (!this.running) return;
        this.running = false;
    }

    stop(): void {
        if (!this.running) return;
        this.pause();
        this.elapsedSeconds = 0;
    }

    destroy(): void {
        this.stop();
        this.callbacks.clear();
        this.ticker.remove(this.update, this);
    }

    private update(): void {
        if (!this.running || this.callbacks.size === 0) return;
        this.elapsedSeconds += this.ticker.elapsedMS * 1000;
        this.callbacks.forEach(callback => callback(this.elapsedSeconds));
    }
}