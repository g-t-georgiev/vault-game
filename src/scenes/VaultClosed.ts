import Scene from "../core/Scene";

export default class VaultClosed extends Scene {

    name = "VaultClosed";

	async load() {

		await this.utils.assetLoader.loadAssetsGroup("VaultClosed");


	}

	async start() {

	}

	onResize(width: number, height: number) {
		
	}
}