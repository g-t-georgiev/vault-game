import { Sprite } from 'pixi.js';
import { centerObjects } from '../utils/misc';

export default class Background extends Sprite {

    resize(width: number, height: number) {
		const scaleByWidth = width / this.texture.width;
		const scaleByHeight = height / this.texture.height;
		const scaleFactor = Math.min(scaleByWidth, scaleByHeight);
		this.width = this.texture.width * scaleFactor;
		this.height = this.texture.width * scaleFactor;
		this.scale.set(scaleFactor);
		centerObjects(this);
	}
}