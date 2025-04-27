import { PRNG } from "../utils/prng";

export type HandleRotationDirection = 'clockwise' | 'counterclockwise';
export type VaultOpenCombination = [displacement: number, direction: HandleRotationDirection][];

export default class VaultLock {

    private unlockCombination!: [displacement: number, direction: HandleRotationDirection][];
    private combinationPairIndex: number = 0;
    private accumulatedSteps: number = 0;

    private onInit?: () => void;
    private onReset?: () => void;
    private onUnlock?: () => void;

    protected _isUnlocked: boolean = false;

    public prng!: PRNG;
    public get isUnlocked() {
        return this._isUnlocked;
    }

    constructor(params?: Partial<{ 
        onInit: () => void, 
        onReset: () => void,
        onUnlock: () => void
    }>) {
        this.prng = new PRNG();
        this._isUnlocked = false;
        if (params) {
            this.onInit = params?.onInit;
            this.onReset = params?.onReset;
            this.onUnlock = params?.onUnlock;
        }
    }

    init() {
        this._isUnlocked = false;
        this.combinationPairIndex = 0;
        this.accumulatedSteps = 0;
        this.setUnlockCombination();
        if (typeof this.onInit == 'function') this.onInit();
    }

    reset() {
        this._isUnlocked = false;
        this.combinationPairIndex = 0;
        this.accumulatedSteps = 0;
        this.setUnlockCombination();
        if (typeof this.onReset == 'function') this.onReset();
    }

    tryToUnlock(step: number = 1, direction: HandleRotationDirection = 'clockwise') {
        
        let [steps, dir] = this.unlockCombination[this.combinationPairIndex];

        if (direction !== dir) {
            return this.reset();
        }

        this.accumulatedSteps += step;
        if (this.accumulatedSteps == steps) {
            this.accumulatedSteps = 0;
            this.combinationPairIndex++;
            if (this.combinationPairIndex >= this.unlockCombination.length) {
                this._isUnlocked = true;
                if (typeof this.onUnlock == 'function') this.onUnlock();
            }
        }
    }

    private setUnlockCombination() {
        this.unlockCombination = [];
        for (let i = 0; i < 3; i++) {
            let displacement = Math.floor(this.prng.next() * 9) + 1;
            let direction: HandleRotationDirection = this.prng.next() < 0.5 ? 'clockwise' : 'counterclockwise';
            this.unlockCombination.push([displacement, direction]);
        }
        console.log(
            '%c [SECRET COMBINATION]', 'color:#ff0000',
            this.unlockCombination.map((step) => step.join(' ')).join(', ')
        );
    }
}