"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeuralNetwork = void 0;
const matrix_1 = require("./matrix");
const activations_1 = require("./activations");
/**
 * The Core Neural Network Engine.
 *
 * This class orchestrates the Forward Pass and Backpropagation algorithms.
 * It is designed to be lightweight enough to run non-blocking in a Web Worker.
 */
class NeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;
        // Initialize weights
        this.weights_ih = new matrix_1.Matrix(this.hiddenNodes, this.inputNodes);
        this.weights_ho = new matrix_1.Matrix(this.outputNodes, this.hiddenNodes);
        this.weights_ih.randomize();
        this.weights_ho.randomize();
        // Initialize biases
        this.bias_h = new matrix_1.Matrix(this.hiddenNodes, 1);
        this.bias_o = new matrix_1.Matrix(this.outputNodes, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();
        this.learningRate = 0.1;
        // Default to Sigmoid activation (can be changed to ReLU or Tanh later)
        this.activationFunc = activations_1.sigmoid;
        this.dActivationFunc = activations_1.dsigmoid;
    }
    /**
     * The Forward Pass.
     * Feeds the input data through the network to generate a prediction.
     * Math: Output = Activation(Weights * Input + Bias)
     */
    predict(inputArray) {
        // 1. Convert input array to Matrix
        const inputs = matrix_1.Matrix.from1DArray(inputArray);
        // 2. Calculate Hidden Layer signals
        const hidden = matrix_1.Matrix.dot(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.map(this.activationFunc); // Apply non-linearity
        // 3. Calculate Output Layer signals
        const outputs = matrix_1.Matrix.dot(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(this.activationFunc); // Apply non-linearity
        // Return the prediction array
        return outputs.toArray();
    }
    /**
     * The Backpropagation Algorithm (Training).
     * 1. Performs a Forward Pass.
     * 2. Calculates the Error (Target - Output).
     * 3. Calculates Gradients using the Chain Rule (Calculus).
     * 4. Updates weights and biases.
     */
    train(inputArray, targetArray) {
        // --- FORWARD PASS (Same as predict) ---
        const inputs = matrix_1.Matrix.from1DArray(inputArray);
        const hidden = matrix_1.Matrix.dot(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.map(this.activationFunc);
        const outputs = matrix_1.Matrix.dot(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(this.activationFunc);
        // --- ERROR CALCULATION ---
        const targets = matrix_1.Matrix.from1DArray(targetArray);
        // Output Error = Targets - Outputs
        const outputErrors = matrix_1.Matrix.subtract(targets, outputs);
        // Hidden Error = Transpose(Weights_HO) * OutputErrors
        const weights_ho_t = matrix_1.Matrix.transpose(this.weights_ho);
        const hiddenErrors = matrix_1.Matrix.dot(weights_ho_t, outputErrors);
        // --- CALCULATE GRADIENTS (The Calculus) ---
        // Gradients for Output Layer
        // gradient = learningRate * error * derivative(output) * transpose(hidden)
        const gradients = matrix_1.Matrix.map(outputs, this.dActivationFunc);
        const gradientsMult = matrix_1.Matrix.multiply(gradients, outputErrors);
        gradientsMult.multiply(this.learningRate);
        // Calculate weight deltas for Output Layer
        const hidden_T = matrix_1.Matrix.transpose(hidden);
        const weight_ho_deltas = matrix_1.Matrix.dot(gradientsMult, hidden_T);
        // Adjust weights and biases (Output Layer)
        this.weights_ho.add(weight_ho_deltas);
        this.bias_o.add(gradientsMult);
        // Gradients for Hidden Layer
        const hiddenGradients = matrix_1.Matrix.map(hidden, this.dActivationFunc);
        const hiddenGradientsMult = matrix_1.Matrix.multiply(hiddenGradients, hiddenErrors);
        hiddenGradientsMult.multiply(this.learningRate);
        // Calculate weight deltas for Hidden Layer
        const inputs_T = matrix_1.Matrix.transpose(inputs);
        const weight_ih_deltas = matrix_1.Matrix.dot(hiddenGradientsMult, inputs_T);
        // Adjust weights and biases (Hidden Layer)
        this.weights_ih.add(weight_ih_deltas);
        this.bias_h.add(hiddenGradientsMult);
    }
    /**
     * Serializes the model weights and biases for network transmission.
     * Used when sending the locally trained math back to the central server.
     */
    serialize() {
        return JSON.stringify({
            weights_ih: this.weights_ih.data,
            weights_ho: this.weights_ho.data,
            bias_h: this.bias_h.data,
            bias_o: this.bias_o.data
        });
    }
    /**
     * Merges incoming weights (used by the FedAvg algorithm).
     */
    loadWeights(data) {
        this.weights_ih.data = data.weights_ih;
        this.weights_ho.data = data.weights_ho;
        this.bias_h.data = data.bias_h;
        this.bias_o.data = data.bias_o;
    }
}
exports.NeuralNetwork = NeuralNetwork;
