import { Assets, Container, Sprite, Graphics } from 'pixi.js';
import gsap from 'gsap';

import Scene from '../core/Scene';

import { Locked, Unlocked } from '../states/vault/index';
import Background from '../prefabs/Background';
import Button from '../prefabs/Button';

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
    private rotateHandleBtns!: Container;

    async load() {
        await this.utils.assetLoader.loadAssetsGroup('Game');
        this.mainContainer = new Background(Assets.get('bg'));
        this.mainContainer.resize(window.innerWidth, window.innerHeight);
        this.addChild(this.mainContainer);
        this.switchState(VaultState.Locked);

        this.rotateHandleBtns = new Container();
        let rotateHandleToLeftBtn = new Button('counterclockwise', 0, 0, 75);
        rotateHandleToLeftBtn.on('pointertap', () => {
            console.log('1 PRESSED');
        });
        rotateHandleToLeftBtn.x -= 350;
        let rotateHandleToRightBtn = new Button('clockwise', 0, 0, 75);
        rotateHandleToRightBtn.on('pointertap', () => {
            console.log('2 PRESSED');
        });
        rotateHandleToRightBtn.x += 290;
        this.rotateHandleBtns.addChild(rotateHandleToLeftBtn, rotateHandleToRightBtn);
        this.mainContainer.addChild(this.rotateHandleBtns);
    }

    async start() {

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

    private createArrowButton(direction: 'clockwise' | 'counterclockwise', x: number, y: number, radius: number, onTap: () => void): Container {
    
        let isPressed = false;
        const btn = new Container();
        btn.alpha = 0.5;
        btn.x = x;
        btn.y = y;
        btn.interactive = true;
        btn.eventMode = 'static';
        btn.cursor = 'pointer';

        const backgr = new Graphics();
        backgr.alpha = 0.2;
        backgr
            .beginFill(0xffffff)
            .drawCircle(0, 0, radius)
            .endFill();

        const arrow = new Sprite(Assets.get(`arrow-rotate-${direction == 'clockwise' ? 'right' : 'left'}-solid`));
        const arrowSpriteRadius = radius * 2;
        const scaleArrowSpriteWidth = arrowSpriteRadius / arrow.width;
        const scaledArrowSpriteHeight = arrowSpriteRadius / arrow.height;
        const scale = Math.min(scaleArrowSpriteWidth, scaledArrowSpriteHeight) * 0.8;
        arrow.scale.set(scale);
        arrow.anchor.set(0.5);

        backgr.addChild(arrow);
        btn.addChild(backgr);

        btn.on('pointerenter', () => {
            btn.alpha = 1;
        });
        btn.on('pointerleave', () => {
            if (isPressed) return;
            btn.alpha = 0.5;
        });

        btn.on('pointerdown', () => {
            isPressed = true;
            btn.scale.set(0.85);
        });
        btn.on('pointerup', () => {
            isPressed = false;
            btn.scale.set(1);
        });
        btn.on('pointerupoutside', () => {
            isPressed = false;
            btn.scale.set(1);
            if (btn.alpha == 1) btn.alpha = 0.5;
        });

        btn.on('pointertap', onTap);

        return btn;
    }

}