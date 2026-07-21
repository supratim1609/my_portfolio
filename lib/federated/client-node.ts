import { NeuralNetwork } from './network';
import { Quantizer, QuantizedPayload } from './quantization';
import { DifferentialPrivacy } from './privacy';

/**
 * The FlockML Client Node.
 * 
 * This is the wrapper that end-developers import into their Next.js/React apps.
 * It encapsulates the neural network, the privacy engine, and the quantization engine.
 * In a full production build, this entire class would be serialized into a Blob 
 * and executed inside a background Web Worker to keep the UI at 60fps.
 */
export class FlockNode {
  network: NeuralNetwork;
  isConnected: boolean = false;
  isTraining: boolean = false;
  privacyEpsilon: number = 0.5;

  constructor(inputNodes: number = 2, hiddenNodes: number = 4, outputNodes: number = 1) {
    this.network = new NeuralNetwork(inputNodes, hiddenNodes, outputNodes);
  }

  /**
   * Connects to the central FedAvg Coordinator.
   */
  connect(websocketUrl: string): void {
    // Mocking WebSocket connection for the MVP
    console.log(`[FlockML] Connecting to ${websocketUrl}...`);
    this.isConnected = true;
    console.log(`[FlockML] Connected. Awaiting global weights.`);
  }

  /**
   * Receives the latest global model from the server.
   */
  syncGlobalWeights(
    qWeightsIH: QuantizedPayload,
    qWeightsHO: QuantizedPayload,
    qBiasH: QuantizedPayload,
    qBiasO: QuantizedPayload
  ): void {
    // SECURITY PATCH: Validate incoming matrix dimensions to prevent OOB memory crashes
    // If a malicious coordinator sends oversized payloads, it will crash the linear memory bounds.
    if (
      qWeightsIH.rows !== this.network.hiddenNodes || qWeightsIH.cols !== this.network.inputNodes ||
      qWeightsHO.rows !== this.network.outputNodes || qWeightsHO.cols !== this.network.hiddenNodes ||
      qBiasH.rows !== this.network.hiddenNodes || qBiasH.cols !== 1 ||
      qBiasO.rows !== this.network.outputNodes || qBiasO.cols !== 1
    ) {
      throw new Error("FlockML Security Error: Incoming global weights do not match initialized matrix dimensions. Rejecting payload.");
    }

    this.network.weights_ih = Quantizer.dequantize(qWeightsIH);
    this.network.weights_ho = Quantizer.dequantize(qWeightsHO);
    this.network.bias_h = Quantizer.dequantize(qBiasH);
    this.network.bias_o = Quantizer.dequantize(qBiasO);
  }

  /**
   * Performs one local training epoch on a batch of data.
   */
  trainLocalBatch(inputs: number[][], targets: number[][]): void {
    if (!this.isConnected) throw new Error("FlockNode is not connected to a coordinator.");
    
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
    DifferentialPrivacy.applyNoise(this.network.weights_ih, this.privacyEpsilon);
    DifferentialPrivacy.applyNoise(this.network.weights_ho, this.privacyEpsilon);
    DifferentialPrivacy.applyNoise(this.network.bias_h, this.privacyEpsilon);
    DifferentialPrivacy.applyNoise(this.network.bias_o, this.privacyEpsilon);

    // 3. Quantize matrices to 8-bit integers to save bandwidth
    return {
      weights_ih: Quantizer.quantize(this.network.weights_ih),
      weights_ho: Quantizer.quantize(this.network.weights_ho),
      bias_h: Quantizer.quantize(this.network.bias_h),
      bias_o: Quantizer.quantize(this.network.bias_o)
    };
  }
}
