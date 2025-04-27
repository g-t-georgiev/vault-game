import { Assets } from 'pixi.js';

import State, { IStateUtils } from '../../core/State';

import Door from '../../prefabs/DoorOpened';
import Glitter from '../../prefabs/Glitter';

export class Unlocked extends State {

    private door!: Door;
    private particles!: Glitter[];

    constructor(utils: IStateUtils) {
        super(utils);

        this.door = new Door();
        this.door.position.set(1460, -15);

        this.particles = Array.from({ length: 3 }, (_, i) => {
            let glitter = new Glitter(Assets.get('blink'));
            if (i == 0) {
                glitter.position.set(-75, -15);
            } else if (i == 1) {
                glitter.position.set(-500, -15);
            } else {
                glitter.position.set(170, 330);
            }
            return glitter;
        });

        this.addChild(this.door, ...this.particles);
    } 

    load(): void {

        this.particles.forEach(glitter => glitter.playAnimation());
    }
}