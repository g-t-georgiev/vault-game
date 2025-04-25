import { Assets } from 'pixi.js';
import Scene from '../core/Scene';

import Background from '../prefabs/Background';
import DoorClosed from '../prefabs/DoorClosed';
import DoorHandle from '../prefabs/DoorHandle';

import Timer from '../utils/Timer';

export default class VaultClosed extends Scene {

    name = 'VaultClosed';

    private mainBackgr!: Background;
    private doorClosed!: DoorClosed;
    private doorHandle!: DoorHandle;

    private timer!: Timer;

	async load(): Promise<void> {

		await this.utils.assetLoader.loadAssetsGroup('VaultClosed');

        this.mainBackgr = new Background(Assets.get('bg'));
        this.doorClosed = new DoorClosed(Assets.get('door'));
        this.doorHandle = new DoorHandle();

        this.doorClosed.anchor.set(0.5);
        this.doorClosed.position.set(55, -35);
        this.doorHandle.position.set(-92, -5);

        this.mainBackgr.resize(window.innerWidth, window.innerHeight);
        this.doorClosed.addChild(this.doorHandle);
        this.mainBackgr.addChild(this.doorClosed);

        this.addChild(this.mainBackgr);
	}

	async start(): Promise<void> {
        this.timer = Timer.getInstance();
        this.timer.addUpdateCallback((elapsedMS) => {
            console.log(elapsedMS / 1000);
        });
	}

    async unload() {
        this.timer.destroy();
    }

	onResize(width: number, height: number): void {
		if (!this.mainBackgr) return;
        this.mainBackgr.resize(width, height);
	}
}