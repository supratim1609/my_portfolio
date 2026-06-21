import { Matrix } from './matrix';
/**
 * Differential Privacy Engine (Cryptographic Noise).
 *
 * To guarantee that the central server cannot reverse-engineer a user's private data
 * from their uploaded neural network gradients, we inject Laplacian noise into the matrices.
 *
 * According to Differential Privacy theorems, if enough users submit noisy gradients,
 * the random noise perfectly cancels out during Federated Averaging, leaving only the
 * true signal (the learned patterns) intact.
 */
export declare class DifferentialPrivacy {
    /**
     * Generates a random number drawn from a Laplace distribution.
     * Laplace(mu=0, b=scale)
     * @param scale The 'b' parameter controlling the spread (variance) of the noise. Higher = more privacy, less accuracy.
     */
    static generateLaplaceNoise(scale: number): number;
    /**
     * Mutates a Matrix by injecting Laplacian noise into every element.
     * This is called immediately before Quantization and Network Transmission.
     *
     * @param matrix The gradients/weights to anonymize.
     * @param epsilon The privacy budget (e.g., 0.1 for high privacy, 10 for low privacy).
     * @param sensitivity The maximum possible change a single data point can cause (usually clipped in DL).
     */
    static applyNoise(matrix: Matrix, epsilon?: number, sensitivity?: number): void;
}
