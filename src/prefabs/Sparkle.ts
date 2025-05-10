import { Sprite, Texture } from 'pixi.js';
import gsap from 'gsap';

export default class Glitter extends Sprite {
    private animationTl!: GSAPTimeline;

    constructor(texture: Texture, position?: { x: number, y: number }) {
        super(texture);
        if (position) {
            this.position = { ...position };
        }
        this.anchor.set(0.5);
        this.animationTl = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatDelay: 1 + Math.random(),
            yoyo: true,
            defaults: { 
                ease: 'power2.out', 
                yoyoEase: 'power2.out' 
            }
        }).set(this, {
            rotation: Math.random() * (Math.PI * 2)
        }).set(this.scale, { x: 0, y: 0 })
        .progress(0);
    }

    async playAnimation() {
        this.animationTl
            .progress(0)
            .pause()
            .to(this, {
                rotation: `+=${Math.random() * 0.3 + 0.3}`,
                duration: 0.5,
            }).to(this.scale, { 
                x: 1, 
                y: 1, 
                duration: 0.5 
            }, '<');

        return gsap.delayedCall(Math.random() * 1, () => this.animationTl.play());
    }

    killAnimation() {
        this.animationTl
            .progress(0)
            .pause()
            .kill();
    }
}
