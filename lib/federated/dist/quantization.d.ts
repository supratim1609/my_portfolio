import { Matrix } from './matrix';
/**
 * Quantization Engine.
 *
 * Standard neural networks use 32-bit floating point numbers (Float32).
 * This is too heavy for browsers to send over WebSockets rapidly.
 * We dynamically compress the Float32 matrices down to 8-bit integers (Int8)
 * for a 4x reduction in payload size before network transmission.
 */
export interface QuantizedPayload {
    data: number[];
    min: number;
    max: number;
    rows: number;
    cols: number;
}
export declare class Quantizer {
    /**
     * Compresses a Float32 Matrix into an 8-bit integer payload.
     * Maps the range [min, max] to [-127, 127].
     */
    static quantize(matrix: Matrix): QuantizedPayload;
    /**
     * Decompresses an 8-bit integer payload back into a Float32 Matrix.
     * Executed primarily by the Coordinator server, but included here for local testing.
     */
    static dequantize(payload: QuantizedPayload): Matrix;
}
