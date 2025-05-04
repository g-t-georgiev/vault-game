import { Assets, Container, DisplayObject } from 'pixi.js';

import { Debug } from '../../utils/debug';

import State, { IStateUtils } from '../../core/State';

import Door from '../../prefabs/DoorClosed';
import Handle from '../../prefabs/DoorHandle';
import Button from '../../prefabs/Button';

import VaultLock from '../../prefabs/VaultLock';
import Timer from '../../prefabs/Timer';

const ROTATION_STEP = 60;

export class Locked extends State {
    private door!: Door;
    private handle!: Handle;
    private rotateHandleBtns!: Container;

    private vaultLock!: VaultLock;
    private timer!: Timer;

    constructor(utils: IStateUtils) {
        super(utils);

        this.timer = Timer.getInstance();

        this.door = new Door(Assets.get('door'));
        this.door.anchor.set(0.5);
        this.door.position.set(20, -15);
        this.handle = new Handle();
        this.handle.position.set(-31, -2);
        this.door.addChild(this.handle as unknown as DisplayObject);

        const rotateHandleToLeftBtn = new Button('counterclockwise', 0, 0, 30);
        rotateHandleToLeftBtn.on('pointertap', this.rotateHandleCounterClockwise, this);
        rotateHandleToLeftBtn.x -= 122;

        const rotateHandleToRightBtn = new Button('clockwise', 0, 0, 30);
        rotateHandleToRightBtn.on('pointertap', this.rotateHandleClockwise, this);
        rotateHandleToRightBtn.x += 100;

        this.rotateHandleBtns = new Container();
        this.rotateHandleBtns.addChild(
            rotateHandleToLeftBtn as unknown as DisplayObject,
            rotateHandleToRightBtn as unknown as DisplayObject
        );

        this.vaultLock = new VaultLock({
            onInit: async () => {
                Debug.log('VAULT_LOCK_INIT');
                this.handle.angle = 0;
            },
            onReset: async () => {
                Debug.log('VAULT_LOCK_RESET');
                this.handle.interactive = false;
                this.handle.eventMode = 'none';
                const resetRotationDir = (this.vaultLock.lastDirection * -1) as -1 | 0 | 1;
                await this.handle.rotateNTimes(6, 1, resetRotationDir);
                this.handle.killRotationTweens();
                this.handle.interactive = true;
                this.handle.eventMode = 'static';
                this.timer.reset();
                this.timer.start();
            },
            onUnlock: async () => {
                Debug.log('VAULT_LOCK_UNLOCKED');
                this.timer.stop();
                this.utils.requestStateChange('Unlocked');
            },
        });

        this.addChild(
            this.door as unknown as DisplayObject,
            this.rotateHandleBtns as unknown as DisplayObject
        );
    }

    async load(): Promise<void> {
        await (this.vaultLock.isUnlocked
            ? this.vaultLock.reset()
            : this.vaultLock.init());
    }

    async unload(): Promise<void> {
        this.handle.killRotationTweens();
    }

    private async rotateHandleCounterClockwise() {
        await this.handle.rotate(-ROTATION_STEP);
        await this.vaultLock.tryToUnlock(1, 'counterclockwise');
    }

    private async rotateHandleClockwise() {
        await this.handle.rotate(ROTATION_STEP);
        await this.vaultLock.tryToUnlock(1, 'clockwise');
    }
}
