import { Assets, Sprite, Container, DisplayObject } from 'pixi.js';
import gsap from 'gsap';

export default class DoorHandle extends Container {

    private handle!: Sprite;
    private shadow!: Sprite;

    constructor() {
        super();

        this.handle = new Sprite(Assets.get('handle'));
        this.handle.anchor.set(0.5);

        this.shadow = new Sprite(Assets.get('handleShadow'));
        this.shadow.anchor.set(0.5);
        this.shadow.pivot.set(-5, -15);
    
        this.addChild(
            this.shadow as unknown as DisplayObject,
            this.handle as unknown as DisplayObject
        );
    }

    async rotate(step: number) {
        return gsap.to([this.handle, this.shadow], {
            angle: `+=${step}`,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                this.onComplete();
            }
        });
    }

    async rotateNTimes(
        rounds: number,
        duration: number,
        direction: -1 | 0 | 1
    ) {
        let normalizedRotation = Math.abs(this.handle.angle) % 360;
        let currentDirection = Math.sign(this.handle.angle);
        let remainingToFullRotation = 
            currentDirection == direction 
                ? 360 - normalizedRotation
                : normalizedRotation;
        let fullResolutions = 360 * rounds + remainingToFullRotation;
        return gsap.to([this.handle, this.shadow], {
            angle: `+=${fullResolutions * direction}`,
            duration: duration,
            ease: 'power2.out',
            onComplete: () => {
                this.onComplete();
            },
        });
    }

    killRotationTweens() {
        gsap.killTweensOf(this, 'angle');
    }

    private onComplete() {
        this.handle.angle = this.handle.angle % 360;
        // Debug.log(this.angle);
    }
}
