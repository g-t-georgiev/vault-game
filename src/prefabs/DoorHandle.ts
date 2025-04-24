import { Assets, Sprite, Container } from "pixi.js";

export default class DoorHandle extends Container {

    private handle!: Sprite;
    private handleShadow!: Sprite;

    constructor() {
        super();
        this.handle = new Sprite(Assets.get('handle'));
        this.handle.anchor.set(0.5);
        this.handleShadow = new Sprite(Assets.get('handleShadow'));
        this.handleShadow.anchor.set(0.5);
        this.handleShadow.position.set(20, 35);
        this.addChild(this.handleShadow, this.handle);
    }
}