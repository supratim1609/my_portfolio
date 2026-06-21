import { Matrix } from './matrix';
/**
 * The Core Neural Network Engine.
 *
 * This class orchestrates the Forward Pass and Backpropagation algorithms.
 * It is designed to be lightweight enough to run non-blocking in a Web Worker.
 */
export declare class NeuralNetwork {
    inputNodes: number;
    hiddenNodes: number;
    outputNodes: number;
    weights_ih: Matrix;
    weights_ho: Matrix;
    bias_h: Matrix;
    bias_o: Matrix;
    learningRate: number;
    activationFunc: (x: number) => number;
    dActivationFunc: (y: number) => number;
    constructor(inputNodes: number, hiddenNodes: number, outputNodes: number);
    /**
     * The Forward Pass.
     * Feeds the input data through the network to generate a prediction.
     * Math: Output = Activation(Weights * Input + Bias)
     */
    predict(inputArray: number[]): number[];
    /**
     * The Backpropagation Algorithm (Training).
     * 1. Performs a Forward Pass.
     * 2. Calculates the Error (Target - Output).
     * 3. Calculates Gradients using the Chain Rule (Calculus).
     * 4. Updates weights and biases.
     */
    train(inputArray: number[], targetArray: number[]): void;
    /**
     * Serializes the model weights and biases for network transmission.
     * Used when sending the locally trained math back to the central server.
     */
    serialize(): string;
    /**
     * Merges incoming weights (used by the FedAvg algorithm).
     */
    loadWeights(data: {
        weights_ih: number[][];
        weights_ho: number[][];
        bias_h: number[][];
        bias_o: number[][];
    }): void;
}
