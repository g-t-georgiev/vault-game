export default class Timer {

    private running: boolean = false;
    private elapsedMS: number = 0;

    start(): void {
        if (this.running) return;
        this.elapsedMS = 0;
        this.running = true;
    }

    stop(): void {
        this.pause();
        this.elapsedMS = 0;
    }

    resume(): void {
        this.running = true;
    }

    pause(): void {
        this.running = false;
    }

    update(elapsedMS: number) {
        this.elapsedMS += elapsedMS;
    }

    destroy(): void {
        this.stop();
    }
}