import { Sprite, Texture, BLEND_MODES } from "pixi.js";
import gsap from "gsap";

export default class Glitter extends Sprite {
    private animationTl!: GSAPTimeline | null;

    constructor(texture: Texture) {
        super(texture);
        this.alpha = 0;
        this.anchor.set(0.5);
        this.blendMode = BLEND_MODES.ADD;
        this.animationTl = null;
    }

    playAnimation() {
        this.alpha = 0;
        const initialScale = 0.5 + Math.random() * 0.5;
        this.scale.set(initialScale);
        this.rotation = Math.random() * Math.PI * 2;

        const tl = gsap.timeline({
            paused: true,
            repeat: -1,
            repeatDelay: 1 + Math.random(),
            defaults: { ease: "sine.inOut" },
        });

        tl.to(this, {
            alpha: 1,
            duration: 0.6,
        })
            .to(
                this,
                {
                    rotation: `+=${0.3 + Math.random() * 0.3}`,
                    duration: 0.5,
                },
                "<"
            )
            .to(
                this.scale,
                {
                    x: initialScale + 0.2,
                    y: initialScale + 0.2,
                    duration: 0.5,
                },
                "<"
            )
            .to(
                this,
                {
                    alpha: 0.7,
                    duration: 0.35,
                    yoyo: true,
                    repeat: 1,
                },
                "<+0.3"
            )
            .to(
                this,
                {
                    alpha: 0,
                    duration: 1,
                },
                ">0.1"
            );

        const initialDelay = Math.random() * 1;
        gsap.delayedCall(initialDelay, () => tl.play());

        if (this.animationTl) {
            this.animationTl.kill();
            this.animationTl = null;
        }

        this.animationTl = tl;
        return this.animationTl;
    }

    killAnimation() {
        if (this.animationTl) {
            this.animationTl.kill();
            this.animationTl = null;
        }
    }
}
