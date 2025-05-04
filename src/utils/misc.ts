import { DisplayObject, Sprite } from 'pixi.js';

export const R2D = 180 / Math.PI;
export const D2R = Math.PI / 180;

export function getLerpT(value: number, min: number, max: number): number {
    return Math.min(Math.max((value - min) / (max - min), 0), 1);
};

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
};

export function getScale(
    viewport: { width: number, height: number },
    target: { width: number, height: number }): { x: number, y: number } {
    return {
        x: viewport.width / target.width,
        y: viewport.height / target.height
    };
}

export function centerObjects(...toCenter: DisplayObject[]) {
    const center = (obj: DisplayObject) => {
        obj.x = window.innerWidth / 2;
        obj.y = window.innerHeight / 2;

        if (obj instanceof Sprite) {
            obj.anchor.set(0.5);
        }
    };

    toCenter.forEach(center);
}

export function wait(seconds: number) {
    return new Promise<void>((res) => setTimeout(res, seconds * 1000));
}

export async function after(
    seconds: number,
    callback: (...args: unknown[]) => unknown
) {
    await wait(seconds);
    return callback();
}

export function getEntries<T extends object>(obj: T) {
    return Object.entries(obj) as Entries<T>;
}
