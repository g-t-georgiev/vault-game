import { Assets, Sprite, Container, DisplayObject } from 'pixi.js';
import gsap from 'gsap';

import { Debug } from '../utils/debug';

export default class DoorHandle extends Container {

    private handle!: Sprite;
    private handleShadow!: Sprite;
    private handleShadowOffset = { x: 5, y: 12 };

    constructor() {
        super();
        this.handle = new Sprite(Assets.get('handle'));
        this.handle.anchor.set(0.5);
        this.handleShadow = new Sprite(Assets.get('handleShadow'));
        this.handleShadow.anchor.set(0.5);
        this.handleShadow.position.set(
            this.handleShadowOffset.x,
            this.handleShadowOffset.y
        );
        this.addChild(
            this.handleShadow as unknown as DisplayObject,
            this.handle as unknown as DisplayObject
        );
    }

    async rotate(step: number) {
        return gsap.to(this, {
            angle: `+=${step}`,
            duration: 0.3,
            ease: 'power2.out',
            onUpdate: () => {
                this.onUpdate();
            },
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
        let normalizedRotation = Math.abs(this.angle) % 360;
        let currentDirection = Math.sign(this.angle);
        let remainingToFullRotation = 
            currentDirection == direction 
                ? 360 - normalizedRotation
                : normalizedRotation;
        let fullResolutions = 360 * rounds + remainingToFullRotation;
        let rotation = fullResolutions * direction;
        Debug.log(currentDirection == direction, direction, currentDirection, remainingToFullRotation, this.angle, rotation);
        return gsap.to(this, {
            angle: `+=${rotation}`,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
                this.onUpdate();
            },
            onComplete: () => {
                this.onComplete();
            },
        });
    }

    killRotationTweens() {
        gsap.killTweensOf(this, "angle");
    }

    private onUpdate() {
        // TODO: Modify shadow offset to be more realistic during rotation
    }

    private onComplete() {
        this.angle = this.angle % 360;
        Debug.log(this.angle);
    }
}
