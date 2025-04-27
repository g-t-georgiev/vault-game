import { Assets, Container } from 'pixi.js';
import gsap from 'gsap';

import State, { IStateUtils } from '../../core/State';

import Door from '../../prefabs/DoorClosed';
import Handle from '../../prefabs/DoorHandle';
import Button from '../../prefabs/Button';

import VaultLock from '../../prefabs/VaultLock';

// const R2D = 180 / Math.PI;
const D2R = Math.PI / 180;
const ROTATION_STEP = 60 * D2R;

export class Locked extends State {

    private door!: Door;
    private handle!: Handle;
    private rotateHandleBtns!: Container;

    private vaultLock!: VaultLock;

    constructor(utils: IStateUtils) {
        super(utils);

        this.door = new Door(Assets.get('door'));
        this.door.anchor.set(0.5);
        this.door.position.set(55, -35);

        this.handle = new Handle();
        this.handle.position.set(-92, -5);

        this.door.addChild(this.handle);

        this.rotateHandleBtns = new Container();
        let rotateHandleToLeftBtn = new Button('counterclockwise', 0, 0, 75);
        rotateHandleToLeftBtn.on('pointertap', this.rotateHandleCounterClockwise, this);
        rotateHandleToLeftBtn.x -= 350;
        let rotateHandleToRightBtn = new Button('clockwise', 0, 0, 75);
        rotateHandleToRightBtn.on('pointertap', this.rotateHandleClockwise, this);
        rotateHandleToRightBtn.x += 290;
        this.rotateHandleBtns.addChild(rotateHandleToLeftBtn, rotateHandleToRightBtn);

        this.vaultLock = new VaultLock({
            onInit: () => {
                console.log('VAULT_LOCK_INIT');
                this.handle.rotation = 0;
            },
            onReset: () => {
                console.log('VAULT_LOCK_RESET');
                this.handle.rotation = 0;
            },
            onUnlock: () => {
                console.log('VAULT_LOCK_UNLOCKED');
                this.utils.requestStateChange('Unlocked');
            }
        });

        this.addChild(this.door, this.rotateHandleBtns);
    }

    load(): void {
        this.vaultLock.isUnlocked ? this.vaultLock.reset() : this.vaultLock.init();
    }

    private async rotateHandleCounterClockwise() {
        await this.rotateHandle(-ROTATION_STEP);
        this.vaultLock.tryToUnlock(1, 'counterclockwise');
    }

    private async rotateHandleClockwise() {
        await this.rotateHandle(ROTATION_STEP);
        this.vaultLock.tryToUnlock(1, 'clockwise');
    }

    private async rotateHandle(step: number) {
        const currentRotation = this.handle.rotation;
        const targetRotation = Math.round((currentRotation + step) / ROTATION_STEP) * ROTATION_STEP;
        return gsap.to(this.handle, { 
            rotation: targetRotation, 
            duration: 0.3, 
            ease: 'power2.out', 
            onUpdate: this.handle.onRotate.bind(this.handle), 
            onUpdateParams: [this.handle.rotation]
        });
    }
}