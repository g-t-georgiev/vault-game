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
    manifest: Asset[] = [];

    constructor() {
        this.generateManifest();
    }

    private generateManifest() {
        const assetFiles = import.meta.glob('../../assets/**/*.*', {
            eager: true,
            query: '?url',
            import: 'default'
        }) as Record<string, string>;

        Debug.log('Assets found:', assetFiles); // Debugging assets

        const assetPathRegexp =
            /assets\/(?<group>[\w.-]+)\/(?<category>[\w.-]+)\/(?<name>[\w.-]+)\.(?<ext>\w+)$/;

        this.manifest = [];

        for (const path in assetFiles) {
            const match = assetPathRegexp.exec(path);
            if (!match?.groups) {
                Debug.warn(`Skipped invalid asset path: ${path}`);
                continue;
            }

            const { group, category, name, ext } = match.groups;

            // Optional filtering
            if (category === 'spritesheets' && ext !== 'json') continue;
            if (category === 'spine' && ext !== 'json' && ext !== 'skel') continue;

            // Debug.log(`Asset URL for ${name}:`, assetFiles[path]);

            this.manifest.push({
                group,
                category,
                name,
                ext,
                url: assetFiles[path]
            });
        }

        Debug.log('📦 Generated manifest:', this.manifest);
    }

    async loadAssetsGroup(group: string) {

        const sceneAssets = this.manifest.filter(a => a.group === group);

        if (sceneAssets.length === 0) {
            Debug.warn(`⚠️ No assets found for group: ${group}`);
            return;
        }

        sceneAssets.forEach(asset => {
            if (!asset.url) {
                Debug.warn(`⚠️ Skipping asset "${asset.name}" with missing URL`, asset);
            }
        });

        sceneAssets.forEach(asset => {
            Assets.add({ alias: asset.name, src: asset.url });
        });

        // Loading the assets
        const resources = await Assets.load(sceneAssets.map(a => a.name));
        Debug.log('✅ Loaded assets group:', group, resources);

        return resources;
    }
}
