import { Assets, Sprite, Container, DisplayObject } from 'pixi.js';
import gsap from 'gsap';

const FADE_IN_DURATION = 0.5;
const FADE_OUT_DURATION = 0.5;

export default class DoorOpened extends Container {
    
    private door!: Sprite;
    private doorShadow!: Sprite;

    constructor() {
        super();
        this.alpha = 0;
        this.door = new Sprite(Assets.get('doorOpen'));
        this.door.anchor.set(0.5);
        this.doorShadow = new Sprite(Assets.get('doorOpenShadow'));
        this.doorShadow.anchor.set(0.5);
        this.doorShadow.position.set(23, 17);
        this.addChild(
            this.doorShadow as unknown as DisplayObject,
            this.door as unknown as DisplayObject
        );
    }

    async fadeIn() {
        if (this.alpha === 1) return;
        return gsap.to(this, { alpha: 1, duration: FADE_IN_DURATION, ease: 'power2.out' });
    }

    async fadeOut() {
        if (this.alpha === 0) return;
        return gsap.to(this, { alpha: 0, duration: FADE_OUT_DURATION, ease: 'power2.out' });
    }
}
