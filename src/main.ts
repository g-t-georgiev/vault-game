import SceneManager from './core/SceneManager';
import Timer from './utils/Timer';

const sceneManager = new SceneManager();
Timer.getInstance(sceneManager.app.ticker);

await sceneManager.switchScene('VaultClosed');
