import { extensions } from "@pixi/extensions";
import { EventSystem } from "@pixi/events";

extensions.add(EventSystem);

import SceneManager from "./core/SceneManager";

const sceneManager = new SceneManager();
await sceneManager.switchScene("Game");
