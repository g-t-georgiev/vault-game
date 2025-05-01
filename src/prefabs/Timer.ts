import { Container, DisplayObject, Graphics, Text } from 'pixi.js';

export default class Timer extends Container {
    private static instance: Timer | null = null;
    public static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
    public static removeInstance() {
        this.instance?.destroy();
        this.instance = null;
    }

    protected time = 0;
    protected isRunning = false;

    private timerPad!: Graphics;
    private timerText!: Text;

    constructor() {
        super();

        this.timerText = new Text(this.formatTime(this.time), {
            fontFamily: 'Share Tech Mono',
            fontWeight: '600',
            fontSize: 22,
            lineHeight: 1,
            fill: 0xff0000,
        });
        this.timerText.scale.set(1, 1.35);
        this.timerText.position.set(5, 5);

        this.timerPad = new Graphics();
        this.timerPad.beginFill(0x000000);
        this.timerPad.drawRoundedRect(
            0,
            0,
            this.timerText.width + 5,
            this.timerText.height + 5,
            5
        );
        this.timerPad.endFill();

        this.addChild(
            this.timerPad as unknown as DisplayObject,
            this.timerText as unknown as DisplayObject
        );
    }

    reset() {
        this.time = 0;
        this.timerText.text = this.formatTime(this.time);
    }

    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    update(elapsedMS: number) {
        if (this.isRunning) {
            this.time += elapsedMS;
            this.timerText.text = this.formatTime(this.time);
        }
    }

    private formatTime(ms: number) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const paddedHours = String(hours).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
}
