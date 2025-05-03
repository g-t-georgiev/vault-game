import { Assets, DisplayObject } from 'pixi.js';

import { SceneUtils } from '../core/SceneManager';
import Scene, { ISceneResizeParams } from '../core/Scene';

import { BaseState } from '../core/State';
import { Locked, Unlocked } from '../states/vault/index';

import Background from '../prefabs/Background';
import Timer from '../prefabs/Timer';

enum VaultState {
    Locked = 'Locked',
    Unlocked = 'Unlocked',
}

type VaultStates = {
    [VaultState.Locked]: Locked;
    [VaultState.Unlocked]: Unlocked;
};

export default class Game extends Scene {
    name = 'Game';

    private timer!: Timer;

    private states!: VaultStates;
    private currentState!: null | BaseState;

    private mainContainer!: Background;

    constructor(utils: SceneUtils) {
        super(utils);
    }

    async load() {
        await this.utils.assetLoader.loadAssetsGroup('Game');
        if (!this.mainContainer) {
            this.mainContainer = new Background(Assets.get('bg'));
            let resizeParams = {
                screenWidth: window.screen.availWidth,
                screenHeight: window.screen.availHeight,
                resolution: window.devicePixelRatio,
                deviceWidth: window.innerWidth,
                deviceHeight: window.innerHeight,
                deviceOrientation: window.screen.orientation
            } as ISceneResizeParams;
            console.log('resize params', resizeParams);
            this.mainContainer.resize(resizeParams);
            this.addChild(this.mainContainer as unknown as DisplayObject);
        }
        if (!this.states) {
            this.states = {
                Locked: new Locked({
                    requestStateChange: this.switchState.bind(this),
                }),
                Unlocked: new Unlocked({
                    requestStateChange: this.switchState.bind(this),
                }),
            };
        }
        this.switchState(VaultState.Locked);

        if (!this.timer) {
            this.timer = Timer.getInstance();
            this.timer.position.set(-452, -60);
            this.mainContainer.addChild(this.timer as unknown as DisplayObject);
        } else {
            this.timer.reset();
        }
        this.timer.start();
    }

    async unload() {
        Timer.removeInstance();
    }

    update(elapsedMS: number) {
        this.timer.update(elapsedMS);

        if (typeof this.currentState?.update == 'function')
            this.currentState.update(elapsedMS);
    }

    onResize(params: ISceneResizeParams): void {
        if (!this.mainContainer) return;
        this.mainContainer?.resize?.(params);
    }

    private switchState(state: string) {
        if (this.currentState) {
            if (typeof this.currentState?.unload == 'function')
                this.currentState.unload();
            this.mainContainer.removeChild(
                this.currentState as unknown as DisplayObject
            );
        }

        const nextState = Object.entries(this.states).find(
            ([s]) => s === state
        )?.[1];
        if (nextState) {
            this.currentState = nextState;
            if (typeof this.currentState?.load == 'function') {
                this.currentState.load();
                this.mainContainer.addChild(
                    this.currentState as unknown as DisplayObject
                );
            }
        }
    }
}
