import { Assets } from 'pixi.js';
import { Debug } from '../utils/debug';
import 'pixi-spine';

type Asset = {
    name: string;
    url: string;
    ext: string;
    category: string;
    group: string;
};

export default class AssetLoader {
    private manifest: Asset[];

    constructor() {
        this.manifest = this.generateManifest();
    }

    private generateManifest(): Asset[] {
        const assetFiles = import.meta.glob('/src/assets/**/*.*', {
            eager: true,
            import: 'default',
        });

        const assetPathRegexp =
            /src\/assets\/(?<group>[\w.-]+)\/(?<category>[\w.-]+)\/(?<name>[\w.-]+)\.(?<ext>\w+)$/;

        const manifest: Asset[] = [];

        for (const [path, url] of Object.entries(assetFiles)) {
            const match = assetPathRegexp.exec(path);
            if (!match?.groups) {
                console.error(`❌ Invalid asset path: ${path}`);
                continue;
            }

            const { group, category, name, ext } = match.groups;

            // Skip unnecessary files
            if (category === 'spritesheets' && ext !== 'json') continue;
            if (category === 'spine' && !['json', 'skel'].includes(ext)) continue;

            manifest.push({
                group,
                category,
                name,
                ext,
                url: url as string,
            });
        }

        return manifest;
    }

    async loadAssetsGroup(group: string) {
        const sceneAssets = this.manifest.filter(asset => asset.group === group);

        for (const asset of sceneAssets) {
            Assets.add(asset.name, asset.url);
        }

        const resources = await Assets.load(sceneAssets.map(a => a.name));
        Debug.log('✅ Loaded assets group:', group, resources);
        return resources;
    }
}
