import { Sprite, Texture } from 'pixi.js';
import { ISceneResizeParams } from '../core/Scene';
import { getScale, getLerpT, lerp } from '../utils/misc';

const SAFE_AREA = { x: 530, y: 165, width: 973, height: 674 };
const THRESHOLD_WIDTH = { min: 760, max: 1340 };
const THRESHOLD_HEIGHT = { min: 380, max: 670 };

export default class Background extends Sprite {
    constructor(texture: Texture) {
        super(texture);
        this.anchor.set(0.5);
    }

    resize(params: ISceneResizeParams) {

        let viewport = {
            width: params.resolution > 1 ? params.screenWidth : params.deviceWidth,
            height: params.resolution > 1 ? params.screenHeight : params.deviceHeight
        };

        const fullfitScale = getScale(viewport, this.texture);
        const safeAreaScale = getScale(viewport, SAFE_AREA);

        let safeAreaCenterX = SAFE_AREA.x + SAFE_AREA.width * 0.5;
        let safeAreaCenterY = SAFE_AREA.y + SAFE_AREA.height * 0.5;

        let tWidth = getLerpT(viewport.width, THRESHOLD_WIDTH.min, THRESHOLD_WIDTH.max);
        let tHeight = getLerpT(viewport.height, THRESHOLD_HEIGHT.min, THRESHOLD_HEIGHT.max);
        let t = Math.min(tWidth, tHeight);

        let interpolatedScale = {
            x: lerp(safeAreaScale.x, fullfitScale.x, t),
            y: lerp(safeAreaScale.y, fullfitScale.y, t)
        };

        let scaleFactor = Math.min(interpolatedScale.x, interpolatedScale.y);
        this.scale.set(scaleFactor);

        let offsetX = (safeAreaCenterX - this.texture.width * 0.5) * scaleFactor;
        let offsetY = (safeAreaCenterY - this.texture.height * 0.5) * scaleFactor;

        this.x = viewport.width * 0.5 - offsetX;
        this.y = viewport.height * 0.5 - offsetY;
    }
}
