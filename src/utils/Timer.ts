import { Ticker } from 'pixi.js';

type TimerUpdateCallback = (elapsedMS: number) => void;

export default class Timer {

    private static _instance?: Timer;
    
    public static config: Record<string,any> = {};
    public static getInstance(): Timer {
        if (!this._instance) {
            if (!this.config) throw new Error('Missing config');
            if (!this.config.ticker) throw new Error('Mission ticker in the config');
            this._instance = new this(this.config.ticker);
        }
        return this._instance;
    }

    private ticker!: Ticker;
    private callbacks: Set<TimerUpdateCallback> = new Set();
    private running: boolean = false;
    private elapsedMS: number = 0;
    
    private constructor(ticker: Ticker) {
        this.ticker = ticker;
    }

    addUpdateCallback(callback: TimerUpdateCallback) {
        if (!this.callbacks.has(callback)) {
            if (this.callbacks.size === 0) 
                this.ticker.add(this.update, this);
            this.callbacks.add(callback);
        }
    }

    removeUpdateCallback(callback: TimerUpdateCallback) {
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