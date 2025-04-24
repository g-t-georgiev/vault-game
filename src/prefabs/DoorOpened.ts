import { Assets, Sprite, Container } from 'pixi.js';

export default class DoorOpened extends Container {

    private door!: Sprite;
    private doorShadow!: Sprite;

    constructor() {
        super();
        this.door = new Sprite(Assets.get('doorOpen'));
        this.door.anchor.set(0.5);
        this.doorShadow = new Sprite(Assets.get('doorOpenShadow'));
        this.doorShadow.anchor.set(0.5);
        this.doorShadow.position.set(85, 50);
        this.addChild(this.doorShadow, this.door);
    }
}