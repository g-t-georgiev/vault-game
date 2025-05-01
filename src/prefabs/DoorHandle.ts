import { Assets, Sprite, Container, DisplayObject } from 'pixi.js';

export default class DoorHandle extends Container {
    private handle!: Sprite;
    private handleShadow!: Sprite;
    private handleShadowOffset = { x: 20, y: 35 };

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

    onRotate() {
        // TODO: Modify shadow offset to be more realistic during rotation
    }

    onRotateComplete() {
        this.angle = this.angle % 360;
    }
}
