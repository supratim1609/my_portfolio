import { NeuralNetwork } from './network';
import { QuantizedPayload } from './quantization';
/**
 * The FlockML Client Node.
 *
 * This is the wrapper that end-developers import into their Next.js/React apps.
 * It encapsulates the neural network, the privacy engine, and the quantization engine.
 * In a full production build, this entire class would be serialized into a Blob
 * and executed inside a background Web Worker to keep the UI at 60fps.
 */
export declare class FlockNode {
    network: NeuralNetwork;
    isConnected: boolean;
    isTraining: boolean;
    privacyEpsilon: number;
    constructor(inputNodes?: number, hiddenNodes?: number, outputNodes?: number);
    /**
     * Connects to the central FedAvg Coordinator.
     */
    connect(websocketUrl: string): void;
    /**
     * Receives the latest global model from the server.
     */
    syncGlobalWeights(qWeightsIH: QuantizedPayload, qWeightsHO: QuantizedPayload, qBiasH: QuantizedPayload, qBiasO: QuantizedPayload): void;
    /**
     * Performs one local training epoch on a batch of data.
     */
    trainLocalBatch(inputs: number[][], targets: number[][]): void;
    /**
     * Secures and compresses the newly trained weights, ready to be sent to the server.
     */
    exportSecureGradients(): {
        weights_ih: QuantizedPayload;
        weights_ho: QuantizedPayload;
        bias_h: QuantizedPayload;
        bias_o: QuantizedPayload;
    };
}
