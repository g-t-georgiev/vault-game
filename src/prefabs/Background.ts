import { DisplayObject, Sprite, Texture } from 'pixi.js';
import { centerObjects } from '../utils/misc';

import { ISceneResizeParams } from '../core/Scene';

export default class Background extends Sprite {
    constructor(texture: Texture) {
        super(texture);
    }

    resize(params: ISceneResizeParams) {
        const scaleByWidth = Math.min(params.deviceWidth, params.screenWidth) / this.texture.width;
        const scaleByHeight = Math.min(params.deviceHeight, params.screenHeight) / this.texture.height;
        const scaleFactor = Math.min(scaleByWidth, scaleByHeight);
        this.width = this.texture.width * scaleFactor;
        this.height = this.texture.width * scaleFactor;
        this.scale.set(scaleFactor);
        centerObjects(this as unknown as DisplayObject);
    }
}
