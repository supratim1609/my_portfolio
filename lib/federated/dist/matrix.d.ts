/**
 * Core Linear Algebra Engine for Browser-Native Neural Networks.
 *
 * This class handles all matrix math required for Forward Passes and Backpropagation.
 * Optimized for V8 JIT compilation using typed Float32Arrays where possible,
 * though standard arrays are used here for structural simplicity in the MVP.
 */
export declare class Matrix {
    rows: number;
    cols: number;
    data: number[][];
    constructor(rows: number, cols: number);
    /**
     * Creates a matrix from an existing 2D array.
     */
    static fromArray(arr: number[][]): Matrix;
    /**
     * Randomizes the matrix weights (typically for initialization).
     * Uses a standard normal distribution approximation (Xavier initialization simplified).
     */
    randomize(): void;
    /**
     * Matrix Dot Product (Matrix Multiplication).
     * Used heavily in the Forward Pass to calculate layer activations.
     * O(n^3) complexity - prime candidate for WebGPU acceleration later.
     */
    static dot(a: Matrix, b: Matrix): Matrix;
    /**
     * Element-wise addition.
     */
    add(n: Matrix | number): void;
    /**
     * Element-wise subtraction (A - B). Returns a new Matrix.
     * Crucial for calculating the Error (Target - Prediction).
     */
    static subtract(a: Matrix, b: Matrix): Matrix;
    /**
     * Element-wise multiplication (Hadamard product). Returns a new Matrix.
     */
    static multiply(a: Matrix, b: Matrix): Matrix;
    /**
     * Scalar multiplication.
     */
    multiply(n: number): void;
    /**
     * Applies a function to every element in the matrix.
     * Used for Activation Functions (e.g., Sigmoid, ReLU) and their derivatives.
     */
    map(func: (val: number, i: number, j: number) => number): void;
    /**
     * Static version of map, returns a new Matrix.
     */
    static map(matrix: Matrix, func: (val: number, i: number, j: number) => number): Matrix;
    /**
     * Transposes the matrix (flips rows and columns).
     * Crucial for calculating gradients during Backpropagation.
     */
    static transpose(matrix: Matrix): Matrix;
    /**
     * Converts a 1D array to a Matrix (Column vector).
     */
    static from1DArray(arr: number[]): Matrix;
    /**
     * Converts the Matrix back to a 1D array.
     */
    toArray(): number[];
}
