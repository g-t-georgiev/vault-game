import { Ticker } from 'pixi.js';

export default class Timer {

    private static _instance?: Timer;

    static getInstance(ticker?: Ticker): Timer {
        if (!this._instance) {
            if (!ticker) throw new Error('Invalid ticker argument');
            this._instance = new this(ticker);
        } else if (ticker && ticker !== this._instance.ticker) {
            throw new Error('Timer already initialized with a Ticker instance.');
        }
        return this._instance;
    }

    private ticker!: Ticker;
    private callbacks: Set<(elapsedTime: number) => void> = new Set();
    private running: boolean = false;
    private elapsedMS: number = 0;
    
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
        this.elapsedMS = 0;
        this.running = true;
    }

    resume(): void {
        this.running = true;
    }

    pause(): void {
        this.running = false;
    }

    stop(): void {
        this.pause();
        this.elapsedMS = 0;
    }

    destroy(): void {
        this.stop();
        this.callbacks.clear();
        this.ticker.remove(this.update, this);
        Timer._instance = undefined;
    }

    private update(): void {
        if (!this.running || this.callbacks.size === 0) return;
        this.elapsedMS += this.ticker.elapsedMS;
        [ ...this.callbacks ].forEach(cb => cb(this.elapsedMS));
    }
}