import { Container } from "pixi.js";

export interface IState {
  load(): Promise<void> | void;
  unload(): Promise<void> | void;
  update(elapsedMS: number): void;
}

export interface IStateUtils {
  requestStateChange: (state: string) => void;
}

export type BaseState = Container & Partial<IState>;

export default abstract class State extends Container {
    constructor(protected utils: IStateUtils) {
        super();
    }
}
