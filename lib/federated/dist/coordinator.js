"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coordinator = void 0;
const network_1 = require("./network");
const matrix_1 = require("./matrix");
const quantization_1 = require("./quantization");
/**
 * The Central Brain: FedAvg Coordinator.
 *
 * In a real production environment, this would run on a Node.js/Docker server.
 * It listens for incoming encrypted, quantized gradients from thousands of Web Workers,
 * decrypts them, and mathematically averages them together to update the Global Model.
 */
class Coordinator {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.globalModel = new network_1.NeuralNetwork(inputNodes, hiddenNodes, outputNodes);
        this.clientUpdates = [];
    }
    /**
     * Receives a quantized payload from a browser client.
     * De-quantizes the 8-bit integers back to Float32 matrices and stores them for aggregation.
     */
    receiveUpdate(qWeightsIH, qWeightsHO, qBiasH, qBiasO) {
        const weights_ih = quantization_1.Quantizer.dequantize(qWeightsIH);
        const weights_ho = quantization_1.Quantizer.dequantize(qWeightsHO);
        const bias_h = quantization_1.Quantizer.dequantize(qBiasH);
        const bias_o = quantization_1.Quantizer.dequantize(qBiasO);
        this.clientUpdates.push({
            weights_ih,
            weights_ho,
            bias_h,
            bias_o
        });
    }
    /**
     * The Federated Averaging (FedAvg) Algorithm.
     *
     * Averages all the incoming matrices. Because of Differential Privacy,
     * the Laplacian noise mathematically cancels out to 0 here, leaving only
     * the pure, learned signal from the crowdsourced devices.
     */
    aggregate() {
        if (this.clientUpdates.length === 0)
            return;
        const numClients = this.clientUpdates.length;
        // Helper function to average a specific matrix across all clients
        const averageMatrix = (matrixKey, targetMatrix) => {
            // Create a zeroed matrix to hold the sum
            const sumMatrix = new matrix_1.Matrix(targetMatrix.rows, targetMatrix.cols);
            // Sum all client matrices
            for (const update of this.clientUpdates) {
                sumMatrix.add(update[matrixKey]);
            }
            // Divide by N (number of clients) to get the average
            sumMatrix.multiply(1 / numClients);
            // Apply the averaged weights to the global model
            for (let i = 0; i < targetMatrix.rows; i++) {
                for (let j = 0; j < targetMatrix.cols; j++) {
                    targetMatrix.data[i][j] = sumMatrix.data[i][j];
                }
            }
        };
        // Run FedAvg on all weights and biases
        averageMatrix('weights_ih', this.globalModel.weights_ih);
        averageMatrix('weights_ho', this.globalModel.weights_ho);
        averageMatrix('bias_h', this.globalModel.bias_h);
        averageMatrix('bias_o', this.globalModel.bias_o);
        // Clear the queue for the next training round
        this.clientUpdates = [];
    }
    /**
     * Broadcasts the current global model weights to all new clients.
     * This is sent to browsers when they first connect to the WebSocket.
     */
    getGlobalWeightsForBroadcast() {
        return {
            weights_ih: quantization_1.Quantizer.quantize(this.globalModel.weights_ih),
            weights_ho: quantization_1.Quantizer.quantize(this.globalModel.weights_ho),
            bias_h: quantization_1.Quantizer.quantize(this.globalModel.bias_h),
            bias_o: quantization_1.Quantizer.quantize(this.globalModel.bias_o)
        };
    }
}
exports.Coordinator = Coordinator;
