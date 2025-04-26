import { Assets, Container } from 'pixi.js';

import Scene from '../core/Scene';

import { Locked, Unlocked } from '../states/vault/index';
import Background from '../prefabs/Background';

enum VaultState {
    Locked = 'Locked',
    Unlocked = 'Unlocked'
}

interface State {
    load(): void,
    update(elapsedMS: number): void,
    unload(): void
};

export default class Game extends Scene {

    name: string = 'Game';

    private states = {
        Locked: new Locked(),
        Unlocked: new Unlocked()
    };
    private currentState!: null | Container & Partial<State>;

    private mainContainer!: Background;

    async load() {
        await this.utils.assetLoader.loadAssetsGroup('Game');
        this.mainContainer = new Background(Assets.get('bg'));
        this.mainContainer.resize(window.innerWidth, window.innerHeight);
        this.addChild(this.mainContainer);
        this.switchState(VaultState.Locked);
    }

    async start() {}

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