import { Sprite, Texture } from 'pixi.js';
import gsap from 'gsap';

export default class DoorClosed extends Sprite {

    constructor(texture: Texture) {
        super(texture);
        this.anchor.set(0.5);
    }

    async fadeOut() {
        if (this.alpha === 0) return;
        return gsap.to(this, { alpha: 0, duration: 0.3, ease: 'power2.out' });
    }

    async fadeIn() {
        if (this.alpha === 1) return;
        return gsap.to(this, { alpha: 1, duration: 0.3, ease: 'power2.out' });
    }
}
