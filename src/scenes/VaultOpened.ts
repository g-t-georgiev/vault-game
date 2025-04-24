import { Assets } from "pixi.js";
import Scene from "../core/Scene";

import Background from '../prefabs/Background';
import DoorOpened from "../prefabs/DoorOpened";

export default class VaultOpened extends Scene {

    name = "VaultOpened";

    private mainBackgr!: Background;
    private doorOpened!: DoorOpened;

    async load() {

        await this.utils.assetLoader.loadAssetsGroup("VaultOpened");

        this.mainBackgr = new Background(Assets.get('bg'));
        this.doorOpened = new DoorOpened();

        this.doorOpened.position.set(1460, -15);

        this.mainBackgr.resize(window.innerWidth, window.innerHeight);

        this.mainBackgr.addChild(this.doorOpened);

        this.addChild(this.mainBackgr);
    }

    async start() {

    }

    onResize(width: number, height: number) {
        if (!this.mainBackgr) return;
        this.mainBackgr.resize(width, height);
    }
}