"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quantizer = void 0;
const matrix_1 = require("./matrix");
class Quantizer {
    /**
     * Compresses a Float32 Matrix into an 8-bit integer payload.
     * Maps the range [min, max] to [-127, 127].
     */
    static quantize(matrix) {
        let min = Infinity;
        let max = -Infinity;
        // 1. Find the min and max values in the matrix
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                const val = matrix.data[i][j];
                if (val < min)
                    min = val;
                if (val > max)
                    max = val;
            }
        }
        // 2. Calculate the scaling factor
        // We map to [-127, 127] for Int8 representation
        const range = Math.max(Math.abs(min), Math.abs(max));
        const scale = range === 0 ? 1 : 127 / range;
        const quantizedData = [];
        // 3. Scale and round to nearest integer
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                const val = matrix.data[i][j];
                // Round to integer between -127 and 127
                const qVal = Math.round(val * scale);
                quantizedData.push(qVal);
            }
        }
        return {
            data: quantizedData,
            min: -range, // Symmetric range
            max: range,
            rows: matrix.rows,
            cols: matrix.cols
        };
    }
    /**
     * Decompresses an 8-bit integer payload back into a Float32 Matrix.
     * Executed primarily by the Coordinator server, but included here for local testing.
     */
    static dequantize(payload) {
        const matrix = new matrix_1.Matrix(payload.rows, payload.cols);
        const range = Math.max(Math.abs(payload.min), Math.abs(payload.max));
        const scale = range === 0 ? 1 : range / 127;
        let index = 0;
        for (let i = 0; i < payload.rows; i++) {
            for (let j = 0; j < payload.cols; j++) {
                const qVal = payload.data[index++];
                // Convert back to float
                matrix.data[i][j] = qVal * scale;
            }
        }
        return matrix;
    }
}
exports.Quantizer = Quantizer;
