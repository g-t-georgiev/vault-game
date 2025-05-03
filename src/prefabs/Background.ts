import { Sprite, Texture } from 'pixi.js';

import { ISceneResizeParams } from '../core/Scene';

const SAFE_AREA = { x: 493, y: 137, width: 1047, height: 738 };

export default class Background extends Sprite {
    constructor(texture: Texture) {
        super(texture);
    }

    resize(params: ISceneResizeParams) {

        let viewport = {
            width: params.resolution > 1 ? params.screenWidth : params.deviceWidth,
            height: params.resolution > 1 ? params.screenHeight : params.deviceHeight
        };

        const fullfitScale = getScale(viewport, this.texture);
        const safeAreaScale = getScale(viewport, SAFE_AREA);

        let useSafeAreaScale = viewport.width <= 1100 || viewport.height <= 550;
        let safeAreaCenterX = SAFE_AREA.x + SAFE_AREA.width * 0.5;
        let safeAreaCenterY = SAFE_AREA.y + SAFE_AREA.height * 0.5;

        let scaleFactor = useSafeAreaScale 
            ? Math.min(safeAreaScale.x, safeAreaScale.y) 
            : Math.min(fullfitScale.x, fullfitScale.y);

        this.scale.set(scaleFactor);
        this.anchor.set(0.5);

        let offsetX = (safeAreaCenterX - this.texture.width * 0.5) * scaleFactor;
        let offsetY = (safeAreaCenterY - this.texture.height * 0.5) * scaleFactor;

        this.x = viewport.width * 0.5 - offsetX;
        this.y = viewport.height * 0.5 - offsetY;
    }
}

function getScale(
    viewport: { width: number, height: number }, 
    target: { width: number, height: number}) {
        return { 
            x: viewport.width / target.width, 
            y: viewport.height / target.height
        };
}
