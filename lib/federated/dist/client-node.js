"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlockNode = void 0;
const network_1 = require("./network");
const quantization_1 = require("./quantization");
const privacy_1 = require("./privacy");
/**
 * The FlockML Client Node.
 *
 * This is the wrapper that end-developers import into their Next.js/React apps.
 * It encapsulates the neural network, the privacy engine, and the quantization engine.
 * In a full production build, this entire class would be serialized into a Blob
 * and executed inside a background Web Worker to keep the UI at 60fps.
 */
class FlockNode {
    constructor(inputNodes = 2, hiddenNodes = 4, outputNodes = 1) {
        this.isConnected = false;
        this.isTraining = false;
        this.privacyEpsilon = 0.5;
        this.network = new network_1.NeuralNetwork(inputNodes, hiddenNodes, outputNodes);
    }
    /**
     * Connects to the central FedAvg Coordinator.
     */
    connect(websocketUrl) {
        // Mocking WebSocket connection for the MVP
        console.log(`[FlockML] Connecting to ${websocketUrl}...`);
        this.isConnected = true;
        console.log(`[FlockML] Connected. Awaiting global weights.`);
    }
    /**
     * Receives the latest global model from the server.
     */
    syncGlobalWeights(qWeightsIH, qWeightsHO, qBiasH, qBiasO) {
        this.network.weights_ih = quantization_1.Quantizer.dequantize(qWeightsIH);
        this.network.weights_ho = quantization_1.Quantizer.dequantize(qWeightsHO);
        this.network.bias_h = quantization_1.Quantizer.dequantize(qBiasH);
        this.network.bias_o = quantization_1.Quantizer.dequantize(qBiasO);
    }
    /**
     * Performs one local training epoch on a batch of data.
     */
    trainLocalBatch(inputs, targets) {
        if (!this.isConnected)
            throw new Error("FlockNode is not connected to a coordinator.");
        this.isTraining = true;
        // 1. Train local network (Forward Pass & Backprop)
        for (let i = 0; i < inputs.length; i++) {
            this.network.train(inputs[i], targets[i]);
        }
    }
    /**
     * Secures and compresses the newly trained weights, ready to be sent to the server.
     */
    exportSecureGradients() {
        // 2. Apply Differential Privacy (Laplacian Noise) to protect user data
        privacy_1.DifferentialPrivacy.applyNoise(this.network.weights_ih, this.privacyEpsilon);
        privacy_1.DifferentialPrivacy.applyNoise(this.network.weights_ho, this.privacyEpsilon);
        privacy_1.DifferentialPrivacy.applyNoise(this.network.bias_h, this.privacyEpsilon);
        privacy_1.DifferentialPrivacy.applyNoise(this.network.bias_o, this.privacyEpsilon);
        // 3. Quantize matrices to 8-bit integers to save bandwidth
        return {
            weights_ih: quantization_1.Quantizer.quantize(this.network.weights_ih),
            weights_ho: quantization_1.Quantizer.quantize(this.network.weights_ho),
            bias_h: quantization_1.Quantizer.quantize(this.network.bias_h),
            bias_o: quantization_1.Quantizer.quantize(this.network.bias_o)
        };
    }
}
exports.FlockNode = FlockNode;
