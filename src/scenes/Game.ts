import { Assets, DisplayObject, FederatedPointerEvent } from 'pixi.js';

import { SceneUtils } from '../core/SceneManager';
import Scene, { ISceneResizeParams } from '../core/Scene';

import { wait } from '../utils/misc';

import { Debug } from '../utils/debug';

import Timer from '../prefabs/Timer';
import VaultLock from '../prefabs/VaultLock';

import Background from '../prefabs/Background';
import DoorClosed from '../prefabs/DoorClosed';
import DoorOpened from '../prefabs/DoorOpened';
import DoorHandle from '../prefabs/DoorHandle';
import Glitter from '../prefabs/Sparkle';

type Door = {
    closed: DoorClosed,
    opened: DoorOpened,
    handle: DoorHandle
}

const ROTATION_STEP = 60;

export default class Game extends Scene {

    public name = 'Game';

    private hasInit: boolean = false;
    private timer!: Timer;
    private vaultLock!: VaultLock;
    private background!: Background;
    private door!: Door;
    private sparkles!: Glitter[];

    private get resizeParams(): ISceneResizeParams {
        return {
            screenWidth: window.screen.availWidth,
            screenHeight: window.screen.availHeight,
            resolution: 1,
            deviceWidth: window.innerWidth,
            deviceHeight: window.innerHeight,
            deviceOrientation: window.screen.orientation
        };
    }

    constructor(utils: SceneUtils) {
        super(utils);
    }

    async load() {

        await this.utils.assetLoader.loadAssetsGroup('Game');
        await this.init();

        this.timer.start();
    }

    update(elapsedMS: number) {
        this.timer.update(elapsedMS);
    }

    onResize(params: ISceneResizeParams): void {
        this.background.resize(params);
    }

    async unload() {
        Timer.removeInstance();
        this.door.handle.killRotationTweens();
        this.sparkles.forEach(sparkle => sparkle.killAnimation());
    }

    private async init() {

        if (this.hasInit) return;
        this.hasInit = true;
        await this.initSprites();
        await this.initVault();
    }

    private async initSprites() {
        this.timer = Timer.getInstance();
        this.timer.position.set(-433, -56);

        this.background = new Background(Assets.get('bg'));

        this.door = {
            opened: new DoorOpened(),
            closed: new DoorClosed(Assets.get('door')),
            handle: new DoorHandle()
        };

        this.door.closed.position.set(20, -15);
        this.door.handle.position.set(-31, -2);
        this.door.closed.addChild(this.door.handle as unknown as DisplayObject);

        this.door.opened.position.set(498, -12);

        this.sparkles = Array.from({ length: 3 }, (_, i) => {
            return new Glitter(Assets.get('blink'), {...(
                i === 0 ? { x: -25, y: -5 } : 
                i === 1 ? { x: -170, y: -5 } : 
                { x: 58, y: 112 }
            )});
        });

        this.background.addChild(
            this.timer as unknown as DisplayObject, 
            ...(this.sparkles as unknown[] as DisplayObject[]), 
            this.door.closed as unknown as DisplayObject,
            this.door.opened as unknown as DisplayObject
        );

        this.addChild(this.background as unknown as DisplayObject);
        this.background.resize(this.resizeParams);
    }

    private async initVault() {
        this.vaultLock = new VaultLock({
            onInit: async () => {
                Debug.log('VAULT_LOCK_INIT');
                this.setHandleInteractions(true);
            },
            onReset: async () => {
                Debug.log('VAULT_LOCK_RESET');
                await Promise.all([
                    this.door.closed.fadeIn(),
                    this.door.opened.fadeOut()
                ]);
                this.setHandleInteractions(false);
                const resetRotationDir = (this.vaultLock.lastDirection * -1) as -1 | 0 | 1;
                await this.door.handle.rotateNTimes(6, 1, resetRotationDir);
                this.door.handle.killRotationTweens();
                this.setHandleInteractions(true);
                this.timer.reset();
                this.timer.start();
            },
            onUnlock: async () => {
                Debug.log('VAULT_LOCK_UNLOCKED');
                this.setHandleInteractions(false);
                this.timer.stop();
                await Promise.all([
                    this.door.closed.fadeOut(),
                    this.door.opened.fadeIn()
                ]);
                this.sparkles.forEach((sparkle) => sparkle.playAnimation());
                await wait(5);
                this.sparkles.forEach((sparkle) => sparkle.killAnimation());
                await this.vaultLock.reset();
            },
        });
        await this.vaultLock.init();
    }

    private async onHandleClick(ev: FederatedPointerEvent) {
        const local = this.door.handle.toLocal(ev.global);
        if (local.x < 0) {
            await this.door.handle.rotate(-ROTATION_STEP);
            await this.vaultLock.tryToUnlock(1, 'counterclockwise');
        } else {
            await this.door.handle.rotate(ROTATION_STEP);
            await this.vaultLock.tryToUnlock(1, 'clockwise');
        }
    }

    private setHandleInteractions(toggle: boolean) {
        if (toggle) {
            this.door.handle.eventMode = 'static';
            this.door.handle.cursor = 'pointer';
            this.door.handle.on('pointerdown', this.onHandleClick, this);
        } else {
            this.door.handle.eventMode = 'none';
            this.door.handle.cursor = 'default';
            this.door.handle.off('pointerdown', this.onHandleClick, this);
        }
    }
}
