import { Assets, Container } from 'pixi.js';

import Door from '../../prefabs/DoorClosed';
import Handle from '../../prefabs/DoorHandle';

export class Locked extends Container {

    private door!: Door;
    private handle!: Handle;

    load(): void {

        this.door = new Door(Assets.get('door'));
        this.door.anchor.set(0.5);
        this.door.position.set(55, -35);

        this.handle = new Handle();
        this.handle.position.set(-92, -5);

        this.door.addChild(this.handle);

        this.addChild(this.door);
    }
}