import { Assets, Sprite, Container } from 'pixi.js';

export default class DoorHandle extends Container {

    private handle!: Sprite;
    private handleShadow!: Sprite;
    private handleShadowOffset = { x: 20, y: 35 };
    private handleShadowRotationEffect = 10;

    constructor() {
        super();
        this.handle = new Sprite(Assets.get('handle'));
        this.handle.anchor.set(0.5);
        this.handleShadow = new Sprite(Assets.get('handleShadow'));
        this.handleShadow.anchor.set(0.5);
        this.handleShadow.position.set(this.handleShadowOffset.x, this.handleShadowOffset.y);
        this.addChild(this.handleShadow, this.handle);
    }

    onRotate() {
        // TODO: Modify shadow offset to be more realistic during rotation
        this.handleShadow.position.set(
            this.handleShadowOffset.x + Math.sin(this.rotation) * this.handleShadowRotationEffect,
            this.handleShadowOffset.y + Math.cos(this.rotation) * this.handleShadowRotationEffect
        );
    }
}