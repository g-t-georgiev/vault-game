import { PRNG } from "../utils/prng";

export type HandleRotationDirection = "clockwise" | "counterclockwise";
export type VaultOpenCombination = [
  displacement: number,
  direction: HandleRotationDirection
][];

export default class VaultLock {
    private unlockCombination!: [
    displacement: number,
    direction: HandleRotationDirection
  ][];
    private combinationPairIndex = 0;
    private accumulatedSteps = 0;

    private onInit?: () => void;
    private onReset?: () => void;
    private onUnlock?: () => void;

    protected _isUnlocked = false;

    public prng!: PRNG;
    public get isUnlocked() {
        return this._isUnlocked;
    }

    constructor(
        params?: Partial<{
      onInit: () => Promise<void> | void;
      onReset: () => Promise<void> | void;
      onUnlock: () => Promise<void> | void;
    }>
    ) {
        this.prng = new PRNG();
        this._isUnlocked = false;
        if (params) {
            this.onInit = params?.onInit;
            this.onReset = params?.onReset;
            this.onUnlock = params?.onUnlock;
        }
    }

    async init() {
        this._isUnlocked = false;
        this.combinationPairIndex = 0;
        this.accumulatedSteps = 0;
        this.setUnlockCombination();
        if (typeof this.onInit == "function") await this.onInit();
    }

    async reset() {
        this._isUnlocked = false;
        this.combinationPairIndex = 0;
        this.accumulatedSteps = 0;
        this.setUnlockCombination();
        if (typeof this.onReset == "function") await this.onReset();
    }

    async tryToUnlock(
        step = 1,
        direction: HandleRotationDirection = "clockwise"
    ) {
        const [steps, dir] = this.unlockCombination[this.combinationPairIndex];

        if (direction !== dir) {
            return this.reset();
        }

        this.accumulatedSteps += step;
        if (this.accumulatedSteps == steps) {
            this.accumulatedSteps = 0;
            this.combinationPairIndex++;
            if (this.combinationPairIndex >= this.unlockCombination.length) {
                this._isUnlocked = true;
                if (typeof this.onUnlock == "function") await this.onUnlock();
            }
        }
    }

    private setUnlockCombination() {
        this.unlockCombination = [];
        for (let i = 0; i < 3; i++) {
            const displacement = Math.floor(this.prng.next() * 9) + 1;
            const direction: HandleRotationDirection =
        this.prng.next() < 0.5 ? "clockwise" : "counterclockwise";
            this.unlockCombination.push([displacement, direction]);
        }
        console.log(
            "%c [SECRET COMBINATION]",
            "color:#ff0000",
            this.unlockCombination.map((step) => step.join(" ")).join(", ")
        );
    }
}
