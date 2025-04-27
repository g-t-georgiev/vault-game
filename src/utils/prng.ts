/**
 * Pseudorandom Number Generator (PRNG) using the mulberry32 algorithm.
 * This generator provides high-quality, deterministic randomness for a given seed.
 * By default, the seed is based on `Date.now()` for random behavior on page reload.
 * 
 * The generator produces a pseudorandom number between 0 and 1 with each call to `next()`.
 * 
 * @example
 * // Create a PRNG with a specific seed
 * const prng = new PRNG(12345);
 * console.log(prng.next());  // Generates a deterministic random number based on the seed
 * 
 * @example
 * // Create a PRNG with the current timestamp (default seed)
 * const prng = new PRNG();
 * console.log(prng.next());  // Generates a random number based on the current time
 */
export class PRNG {

    /**
     * The seed value used to initialize the PRNG.
     * @private
     */
    private seed!: number;

    /**
     * Creates a new instance of the PRNG.
     * If no seed is provided, it defaults to `Date.now()` to ensure randomness.
     *
     * @param {number} [seed=Date.now()] - The seed value to initialize the PRNG. Defaults to `Date.now()`.
     */
    constructor(seed: number = Date.now()) {
        this.seed = seed;
    }

    /**
     * Generates the next pseudorandom number between 0 and 1.
     * This method uses the mulberry32 algorithm for deterministic randomness.
     * 
     * @returns {number} A pseudorandom number in the range [0, 1).
     * 
     * @example
     * const randomValue = prng.next();  // e.g., 0.123456789
     */
    next(): number {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}