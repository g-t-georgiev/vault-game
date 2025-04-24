import { Assets } from "pixi.js";
import Scene from "../core/Scene";

import Background from '../prefabs/Background';
import DoorClosed from "../prefabs/DoorClosed";

export default class VaultOpened extends Scene {

    name = "VaultOpened";

    private mainBackgr!: Background;
    private doorClosed!: DoorClosed;

    async load() {

        await this.utils.assetLoader.loadAssetsGroup("VaultOpened");

        this.mainBackgr = new Background(Assets.get('bg'));
        this.doorClosed = new DoorClosed(Assets.get('door'));

        this.doorClosed.anchor.set(0.5);
        this.doorClosed.position.set(55, -35);

        this.mainBackgr.resize(window.innerWidth, window.innerHeight);

        this.mainBackgr.addChild(this.doorClosed);

        this.addChild(this.mainBackgr);
    }

    async start() {

    }

    onResize(width: number, height: number) {
        if (!this.mainBackgr) return;
        this.mainBackgr.resize(width, height);
    }
}