import { NeuralNetwork } from './network';
import { Matrix } from './matrix';
import { QuantizedPayload } from './quantization';
/**
 * The Central Brain: FedAvg Coordinator.
 *
 * In a real production environment, this would run on a Node.js/Docker server.
 * It listens for incoming encrypted, quantized gradients from thousands of Web Workers,
 * decrypts them, and mathematically averages them together to update the Global Model.
 */
export declare class Coordinator {
    globalModel: NeuralNetwork;
    clientUpdates: {
        weights_ih: Matrix;
        weights_ho: Matrix;
        bias_h: Matrix;
        bias_o: Matrix;
    }[];
    constructor(inputNodes: number, hiddenNodes: number, outputNodes: number);
    /**
     * Receives a quantized payload from a browser client.
     * De-quantizes the 8-bit integers back to Float32 matrices and stores them for aggregation.
     */
    receiveUpdate(qWeightsIH: QuantizedPayload, qWeightsHO: QuantizedPayload, qBiasH: QuantizedPayload, qBiasO: QuantizedPayload): void;
    /**
     * The Federated Averaging (FedAvg) Algorithm.
     *
     * Averages all the incoming matrices. Because of Differential Privacy,
     * the Laplacian noise mathematically cancels out to 0 here, leaving only
     * the pure, learned signal from the crowdsourced devices.
     */
    aggregate(): void;
    /**
     * Broadcasts the current global model weights to all new clients.
     * This is sent to browsers when they first connect to the WebSocket.
     */
    getGlobalWeightsForBroadcast(): {
        weights_ih: QuantizedPayload;
        weights_ho: QuantizedPayload;
        bias_h: QuantizedPayload;
        bias_o: QuantizedPayload;
    };
}
