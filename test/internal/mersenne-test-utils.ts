// Moved to a separate file to avoid importing the tests

/**
 * The maximum value that can be returned by `MersenneTwister19937.genrandReal2()`.
 * This is the max possible value with 32 bits of precision that is less than 1.
 */
export const TWISTER_32CO_MAX_VALUE = 0.999_999_999_767_169_4;
/**
 * The maximum value that can be returned by `MersenneTwister19937.genrandRes53()`.
 * This is the max possible value with 53 bits of precision that is less than 1.
 */
export const TWISTER_53CO_MAX_VALUE = 0.999_999_999_999_999_9;
// Re-exported because the value might change in the future
/**
 * The maximum value that can be returned by `next()`.
 */
export const MERSENNE_MAX_VALUE = TWISTER_32CO_MAX_VALUE;
