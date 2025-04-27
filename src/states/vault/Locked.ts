import { Assets, Container } from 'pixi.js';
import gsap from 'gsap';

import Door from '../../prefabs/DoorClosed';
import Handle from '../../prefabs/DoorHandle';
import Button from '../../prefabs/Button';

// const R2D = 180 / Math.PI;
const D2R = Math.PI / 180;
const ROTATION_STEP = 60 * D2R;

export class Locked extends Container {

    private door!: Door;
    private handle!: Handle;
    private rotateHandleBtns!: Container;
    private vaultOpenCombination!: (number | string)[][];

    load(): void {

        this.door = new Door(Assets.get('door'));
        this.door.anchor.set(0.5);
        this.door.position.set(55, -35);

        this.handle = new Handle();
        this.handle.position.set(-92, -5);

        this.door.addChild(this.handle);

        this.generateOpenCombination();
        this.rotateHandleBtns = new Container();
        let rotateHandleToLeftBtn = new Button('counterclockwise', 0, 0, 75);
        rotateHandleToLeftBtn.on('pointertap', this.rotateHandleCounterClockwise, this);
        rotateHandleToLeftBtn.x -= 350;
        let rotateHandleToRightBtn = new Button('clockwise', 0, 0, 75);
        rotateHandleToRightBtn.on('pointertap', this.rotateHandleClockwise, this);
        rotateHandleToRightBtn.x += 290;
        this.rotateHandleBtns.addChild(rotateHandleToLeftBtn, rotateHandleToRightBtn);

        this.addChild(this.door, this.rotateHandleBtns);
    }

    private generateOpenCombination() {
        this.vaultOpenCombination = [];
        for (let i = 0; i < 3; i++) {
            let displacement = Math.floor(Math.random() * 9) + 1;
            let direction = Math.random() < 0.5 ? 'clockwise' : 'counterclockwise';
            this.vaultOpenCombination.push([displacement, direction]);
        }
        console.log(
            '%c [SECRET COMBINATION]', 'color:#ff0000',
            this.vaultOpenCombination.map((step) => step.join(' ')).join(', ')
        );
    }

    private rotateHandleCounterClockwise() {
        this.rotateHandle(-ROTATION_STEP);
    }

    private rotateHandleClockwise() {
        this.rotateHandle(ROTATION_STEP);
    }

    private rotateHandle(step: number) {
        const currentRotation = this.handle.rotation;
        const targetRotation = Math.round((currentRotation + step) / ROTATION_STEP) * ROTATION_STEP;
        gsap.to(this.handle, { 
            rotation: targetRotation, 
            duration: 0.3, 
            ease: 'power2.out', 
            onUpdate: this.handle.onRotate.bind(this.handle), 
            onUpdateParams: [this.handle.rotation]
        });
    }
}