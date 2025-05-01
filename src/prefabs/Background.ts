import { DisplayObject, Sprite, Texture } from 'pixi.js';
import { centerObjects } from '../utils/misc';

export default class Background extends Sprite {
    constructor(texture: Texture) {
        super(texture);
    }

    resize(width: number, height: number) {
        const scaleByWidth = width / this.texture.width;
        const scaleByHeight = height / this.texture.height;
        const scaleFactor = Math.min(scaleByWidth, scaleByHeight);
        this.width = this.texture.width * scaleFactor;
        this.height = this.texture.width * scaleFactor;
        this.scale.set(scaleFactor);
        centerObjects(this as unknown as DisplayObject);
    }
}
