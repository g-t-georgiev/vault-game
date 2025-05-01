import { Sprite, Texture } from 'pixi.js';
import gsap from 'gsap';

export default class Glitter extends Sprite {
    private animationTl!: GSAPTimeline | null;

    constructor(texture: Texture) {
        super(texture);
        this.anchor.set(0.5);
    }

    playAnimation() {

        if (this.animationTl) {
            this.animationTl.kill();
        }

        this.animationTl = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatDelay: 1 + Math.random(),
            yoyo: true,
            defaults: { ease: 'power2.out' },
        })
        .set(this.scale, {
            x: 0,
            y: 0
        })
        .set(this, {
            rotation: Math.random() * (Math.PI * 2)
        })
        .to(this.scale, {
            x: 1,
            y: 1,
            duration: 0.5,
        })
        .to(this, {
            rotation: `+=${Math.random() * 0.3 + 0.3}`,
            duration: 0.5,
        }, '<');

        const initialDelay = Math.random() * 1;
        gsap.delayedCall(initialDelay, () => this.animationTl?.play());

        return this.animationTl;
    }

    killAnimation() {
        if (this.animationTl) {
            this.animationTl.kill();
            this.animationTl = null;
        }
    }
}
