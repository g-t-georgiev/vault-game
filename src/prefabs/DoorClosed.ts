import { Sprite, Texture } from 'pixi.js';
import gsap from 'gsap';

const FADE_IN_DURATION = 0.7;
const FADE_OUT_DURATION = 0.3;

export default class DoorClosed extends Sprite {

    constructor(texture: Texture) {
        super(texture);
        this.anchor.set(0.5);
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
