import SceneManager from './core/SceneManager';
import Timer from './utils/Timer';

const sceneManager = new SceneManager();
Timer.config.ticker = sceneManager.app.ticker;

await sceneManager.switchScene('VaultClosed');
