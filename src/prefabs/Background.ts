import { Sprite, Texture } from 'pixi.js';

import { ISceneResizeParams } from '../core/Scene';

export default class Background extends Sprite {
    constructor(texture: Texture) {
        super(texture);
    }

    resize(params: ISceneResizeParams) {
        let width = params.resolution > 1 ? params.screenWidth : params.deviceWidth;
        let height = params.resolution > 1 ? params.screenHeight : params.deviceHeight;
        const scaleByWidth = width / this.texture.width;
        const scaleByHeight = height / this.texture.height;
        const scaleFactor = Math.min(scaleByWidth, scaleByHeight);
        this.width = this.texture.width * scaleFactor;
        this.height = this.texture.width * scaleFactor;
        this.scale.set(scaleFactor);
        this.x = width / 2;
        this.y = height / 2;
        this.anchor.set(0.5);
    }
}
