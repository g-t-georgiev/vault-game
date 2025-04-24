import { Sprite, Texture, BLEND_MODES } from "pixi.js";
import gsap from "gsap";

export default class Sparkle extends Sprite {

    private animationTl!: GSAPTimeline;

    constructor(texture: Texture) {

        super(texture);

        this.anchor.set(0.5);
        this.blendMode = BLEND_MODES.ADD;
    }

    playAnimation() {
        this.alpha = 0;
    
        const initialScale = 0.5 + Math.random() * 0.5;
        this.scale.set(initialScale);
        this.rotation = Math.random() * Math.PI * 2;
    
        const tl = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatDelay: 2 + Math.random(),
            defaults: { ease: "sine.inOut" }
        });
    
        tl
            .to(this, {
                alpha: 1,
                duration: 0.6
            })
            .to(this, {
                rotation: `+=${0.3 + Math.random() * 0.3}`,
                duration: 0.5
            }, "<")
            .to(this.scale, {
                x: initialScale + 0.2,
                y: initialScale + 0.2,
                duration: 0.5
            }, "<")
            .to(this, {
                alpha: 0.7,
                duration: 0.35,
                yoyo: true,
                repeat: 1
            }, "<+0.3")
            .to(this, {
                alpha: 0,
                duration: 1
            }, ">0.1");
    
        const initialDelay = Math.random() * 3;
        gsap.delayedCall(initialDelay, () => tl.play());
    
        this.animationTl = tl;
        return this.animationTl;
    }
    
}
