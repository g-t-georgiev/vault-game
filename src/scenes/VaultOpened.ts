import { Assets } from 'pixi.js';
import Scene from '../core/Scene';

import Background from '../prefabs/Background';
import DoorOpened from '../prefabs/DoorOpened';
import Sparkle from '../prefabs/Sparkle';

export default class VaultOpened extends Scene {

    name = 'VaultOpened';

    private mainBackgr!: Background;
    private doorOpened!: DoorOpened;
    private sparkles!: Sparkle[];

    async load(): Promise<void> {

        await this.utils.assetLoader.loadAssetsGroup('VaultOpened');

        this.mainBackgr = new Background(Assets.get('bg'));
        this.doorOpened = new DoorOpened();
        this.doorOpened.position.set(1460, -15);

        this.sparkles = Array.from({ length: 3 }, (_, i) => {
            let sparkle = new Sparkle(Assets.get('blink'));
            if (i == 0) {
                sparkle.position.set(-75, -15);
            } else if (i == 1) {
                sparkle.position.set(-500, -15);
            } else {
                sparkle.position.set(170, 330);
            }
            return sparkle;
        });

        this.mainBackgr.resize(window.innerWidth, window.innerHeight);
        this.mainBackgr.addChild(this.doorOpened, ...this.sparkles);
        this.addChild(this.mainBackgr);
    }

    async start(): Promise<void> {
        this.sparkles.forEach(sparkle => sparkle.playAnimation());
    }

    onResize(width: number, height: number) {
        if (!this.mainBackgr) return;
        this.mainBackgr.resize(width, height);
    }
}