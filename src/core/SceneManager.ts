import { Application, DisplayObject } from 'pixi.js';
import Scene, { ISceneResizeParams } from './Scene';
import AssetLoader from './AssetLoader';
// import { Debug } from '../utils/debug';

export interface SceneUtils {
    assetLoader: AssetLoader;
}

export default class SceneManager {
    private sceneConstructors = this.importScenes();

    app: Application;
    sceneInstances = new Map<string, Scene>();
    currentScene?: Scene;

    constructor() {
        this.app = new Application({
            view: document.querySelector('#app') as HTMLCanvasElement,
            autoDensity: true,
            resizeTo: window,
            resolution: 1,
            powerPreference: 'high-performance',
            backgroundColor: 0x23272a,
        });

        // @ts-expect-error Set PIXI app to global window object for the PIXI Inspector
        window.__PIXI_APP__ = this.app;
        window.addEventListener('resize', () => {
            requestAnimationFrame(() => {
                this.currentScene?.onResize?.({
                    screenWidth: this.app.screen.width,
                    screenHeight: this.app.screen.height,
                    resolution: this.app.renderer.resolution,
                    deviceWidth: window.innerWidth,
                    deviceHeight: window.innerHeight,
                    deviceOrientation: window.screen.orientation
                } as ISceneResizeParams);
            });
        });

        this.app.ticker.add(() => {
            this.currentScene?.update?.(this.app.ticker.elapsedMS);
        });
    }

    importScenes() {
        const sceneModules = import.meta.glob('/src/scenes/*.ts', {
            eager: true,
        }) as Record<string, { default: ConstructorType<typeof Scene> }>;

        return Object.entries(sceneModules).reduce((acc, [path, module]) => {
            const fileName = path.split('/').pop()?.split('.')[0];
            if (!fileName) throw new Error('Error while parsing filename');
            acc[fileName] = module.default;
            return acc;
        }, {} as Record<string, ConstructorType<typeof Scene>>);
    }

    async switchScene(
        sceneName: string,
        deletePrevious = true
    ): Promise<Scene> {
        await this.removeScene(deletePrevious);
        this.currentScene = this.sceneInstances.get(sceneName);
        if (!this.currentScene)
            this.currentScene = await this.initScene(sceneName);
        if (!this.currentScene)
            throw new Error(`Failed to initialize scene: ${sceneName}`);
        this.app.stage.addChild(this.currentScene as unknown as DisplayObject);
        if (this.currentScene.start) await this.currentScene.start();
        return this.currentScene;
    }

    private async removeScene(destroyScene: boolean) {
        if (!this.currentScene) return;
        if (destroyScene) {
            this.sceneInstances.delete(this.currentScene.name);
            this.currentScene.destroy({ children: true });
        } else {
            this.app.stage.removeChild(
                this.currentScene as unknown as DisplayObject
            );
        }

        if (this.currentScene.unload) await this.currentScene.unload();

        this.currentScene = undefined;
    }

    private async initScene(sceneName: string) {
        const sceneUtils = {
            assetLoader: new AssetLoader(),
        };

        const scene = new this.sceneConstructors[sceneName](sceneUtils);

        this.sceneInstances.set(sceneName, scene);

        if (scene.load) await scene.load();

        return scene;
    }
}
