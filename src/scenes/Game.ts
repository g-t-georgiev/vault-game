import { Assets } from 'pixi.js';

import { SceneUtils } from '../core/SceneManager';
import Scene from '../core/Scene';

import { BaseState } from '../core/State';
import { Locked, Unlocked } from '../states/vault/index';

import Background from '../prefabs/Background';

enum VaultState {
    Locked = 'Locked',
    Unlocked = 'Unlocked'
}

type VaultStates = {
    [VaultState.Locked]: Locked,
    [VaultState.Unlocked]: Unlocked
}

export default class Game extends Scene {

    name: string = 'Game';

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
            this.mainContainer.resize(window.innerWidth, window.innerHeight);
            this.addChild(this.mainContainer);
        }
        if (!this.states) {
            this.states = {
                Locked: new Locked({ requestStateChange: this.switchState.bind(this) }),
                Unlocked: new Unlocked({ requestStateChange: this.switchState.bind(this) })
            };
        }
        this.switchState(VaultState.Locked);
    }

    update(elapsedMS: number) {
        if (typeof this.currentState?.update == 'function')
            this.currentState.update(elapsedMS);
    }

    onResize(width: number, height: number): void {
        if (!this.mainContainer) return;
        this.mainContainer.resize(width, height);
    }

    private switchState(state: string) {
        if (this.currentState) {
            if (typeof this.currentState?.unload == 'function')
                this.currentState.unload();
            this.mainContainer.removeChild(this.currentState);
        }

        let nextState = Object.entries(this.states).find(([s]) => s === state)?.[1];
        if (nextState) {
            this.currentState = nextState;
            if (typeof this.currentState?.load == 'function')
                this.currentState.load();
            this.mainContainer.addChild(this.currentState);
        }
    }
}