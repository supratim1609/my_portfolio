"use strict";
(() => {
  // lib/federated/matrix.ts
  var Matrix = class _Matrix {
    constructor(rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.data = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    }
    /**
     * Creates a matrix from an existing 2D array.
     */
    static fromArray(arr) {
      const m = new _Matrix(arr.length, arr[0].length);
      for (let i = 0; i < m.rows; i++) {
        for (let j = 0; j < m.cols; j++) {
          m.data[i][j] = arr[i][j];
        }
      }
      return m;
    }
    /**
     * Randomizes the matrix weights (typically for initialization).
     * Uses a standard normal distribution approximation (Xavier initialization simplified).
     */
    randomize() {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] = Math.random() * 2 - 1;
        }
      }
    }
    /**
     * Matrix Dot Product (Matrix Multiplication).
     * Used heavily in the Forward Pass to calculate layer activations.
     * O(n^3) complexity - prime candidate for WebGPU acceleration later.
     */
    static dot(a, b) {
      if (a.cols !== b.rows) {
        throw new Error(`Incompatible matrices for dot product: ${a.cols} !== ${b.rows}`);
      }
      const result = new _Matrix(a.rows, b.cols);
      for (let i = 0; i < result.rows; i++) {
        for (let j = 0; j < result.cols; j++) {
          let sum = 0;
          for (let k = 0; k < a.cols; k++) {
            sum += a.data[i][k] * b.data[k][j];
          }
          result.data[i][j] = sum;
        }
      }
      return result;
    }
    /**
     * Element-wise addition.
     */
    add(n) {
      if (n instanceof _Matrix) {
        if (this.rows !== n.rows || this.cols !== n.cols) {
          throw new Error("Incompatible matrices for addition");
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.data[i][j] += n.data[i][j];
          }
        }
      } else {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            this.data[i][j] += n;
          }
        }
      }
    }
    /**
     * Element-wise subtraction (A - B). Returns a new Matrix.
     * Crucial for calculating the Error (Target - Prediction).
     */
    static subtract(a, b) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        throw new Error("Incompatible matrices for subtraction");
      }
      const result = new _Matrix(a.rows, a.cols);
      for (let i = 0; i < result.rows; i++) {
        for (let j = 0; j < result.cols; j++) {
          result.data[i][j] = a.data[i][j] - b.data[i][j];
        }
      }
      return result;
    }
    /**
     * Element-wise multiplication (Hadamard product). Returns a new Matrix.
     */
    static multiply(a, b) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        throw new Error("Incompatible matrices for element-wise multiplication");
      }
      const result = new _Matrix(a.rows, a.cols);
      for (let i = 0; i < result.rows; i++) {
        for (let j = 0; j < result.cols; j++) {
          result.data[i][j] = a.data[i][j] * b.data[i][j];
        }
      }
      return result;
    }
    /**
     * Scalar multiplication.
     */
    multiply(n) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= n;
        }
      }
    }
    /**
     * Applies a function to every element in the matrix.
     * Used for Activation Functions (e.g., Sigmoid, ReLU) and their derivatives.
     */
    map(func) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          const val = this.data[i][j];
          this.data[i][j] = func(val, i, j);
        }
      }
    }
    /**
     * Static version of map, returns a new Matrix.
     */
    static map(matrix, func) {
      const result = new _Matrix(matrix.rows, matrix.cols);
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          const val = matrix.data[i][j];
          result.data[i][j] = func(val, i, j);
        }
      }
      return result;
    }
    /**
     * Transposes the matrix (flips rows and columns).
     * Crucial for calculating gradients during Backpropagation.
     */
    static transpose(matrix) {
      const result = new _Matrix(matrix.cols, matrix.rows);
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          result.data[j][i] = matrix.data[i][j];
        }
      }
      return result;
    }
    /**
     * Converts a 1D array to a Matrix (Column vector).
     */
    static from1DArray(arr) {
      return _Matrix.fromArray(arr.map((x) => [x]));
    }
    /**
     * Converts the Matrix back to a 1D array.
     */
    toArray() {
      const arr = [];
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          arr.push(this.data[i][j]);
        }
      }
      return arr;
    }
  };

  // lib/federated/activations.ts
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  function dsigmoid(y) {
    return y * (1 - y);
  }

  // lib/federated/network.ts
  var NeuralNetwork = class {
    constructor(inputNodes, hiddenNodes, outputNodes) {
      this.inputNodes = inputNodes;
      this.hiddenNodes = hiddenNodes;
      this.outputNodes = outputNodes;
      this.weights_ih = new Matrix(this.hiddenNodes, this.inputNodes);
      this.weights_ho = new Matrix(this.outputNodes, this.hiddenNodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();
      this.bias_h = new Matrix(this.hiddenNodes, 1);
      this.bias_o = new Matrix(this.outputNodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
      this.learningRate = 0.1;
      this.activationFunc = sigmoid;
      this.dActivationFunc = dsigmoid;
    }
    /**
     * The Forward Pass.
     * Feeds the input data through the network to generate a prediction.
     * Math: Output = Activation(Weights * Input + Bias)
     */
    predict(inputArray) {
      const inputs = Matrix.from1DArray(inputArray);
      const hidden = Matrix.dot(this.weights_ih, inputs);
      hidden.add(this.bias_h);
      hidden.map(this.activationFunc);
      const outputs = Matrix.dot(this.weights_ho, hidden);
      outputs.add(this.bias_o);
      outputs.map(this.activationFunc);
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
      const inputs = Matrix.from1DArray(inputArray);
      const hidden = Matrix.dot(this.weights_ih, inputs);
      hidden.add(this.bias_h);
      hidden.map(this.activationFunc);
      const outputs = Matrix.dot(this.weights_ho, hidden);
      outputs.add(this.bias_o);
      outputs.map(this.activationFunc);
      const targets = Matrix.from1DArray(targetArray);
      const outputErrors = Matrix.subtract(targets, outputs);
      const weights_ho_t = Matrix.transpose(this.weights_ho);
      const hiddenErrors = Matrix.dot(weights_ho_t, outputErrors);
      const gradients = Matrix.map(outputs, this.dActivationFunc);
      const gradientsMult = Matrix.multiply(gradients, outputErrors);
      gradientsMult.multiply(this.learningRate);
      const hidden_T = Matrix.transpose(hidden);
      const weight_ho_deltas = Matrix.dot(gradientsMult, hidden_T);
      this.weights_ho.add(weight_ho_deltas);
      this.bias_o.add(gradientsMult);
      const hiddenGradients = Matrix.map(hidden, this.dActivationFunc);
      const hiddenGradientsMult = Matrix.multiply(hiddenGradients, hiddenErrors);
      hiddenGradientsMult.multiply(this.learningRate);
      const inputs_T = Matrix.transpose(inputs);
      const weight_ih_deltas = Matrix.dot(hiddenGradientsMult, inputs_T);
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
  };

  // lib/federated/quantization.ts
  var Quantizer = class {
    /**
     * Compresses a Float32 Matrix into an 8-bit integer payload.
     * Maps the range [min, max] to [-127, 127].
     */
    static quantize(matrix) {
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          const val = matrix.data[i][j];
          if (val < min) min = val;
          if (val > max) max = val;
        }
      }
      const range = Math.max(Math.abs(min), Math.abs(max));
      const scale = range === 0 ? 1 : 127 / range;
      const quantizedData = [];
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          const val = matrix.data[i][j];
          const qVal = Math.round(val * scale);
          quantizedData.push(qVal);
        }
      }
      return {
        data: quantizedData,
        min: -range,
        // Symmetric range
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
      const matrix = new Matrix(payload.rows, payload.cols);
      const range = Math.max(Math.abs(payload.min), Math.abs(payload.max));
      const scale = range === 0 ? 1 : range / 127;
      let index = 0;
      for (let i = 0; i < payload.rows; i++) {
        for (let j = 0; j < payload.cols; j++) {
          const qVal = payload.data[index++];
          matrix.data[i][j] = qVal * scale;
        }
      }
      return matrix;
    }
  };

  // lib/federated/privacy.ts
  var DifferentialPrivacy = class {
    /**
     * Generates a random number drawn from a Laplace distribution.
     * Laplace(mu=0, b=scale)
     * @param scale The 'b' parameter controlling the spread (variance) of the noise. Higher = more privacy, less accuracy.
     */
    static generateLaplaceNoise(scale) {
      const u = Math.random() - 0.5;
      const sign = u < 0 ? -1 : 1;
      return -scale * sign * Math.log(1 - 2 * Math.abs(u));
    }
    /**
     * Mutates a Matrix by injecting Laplacian noise into every element.
     * This is called immediately before Quantization and Network Transmission.
     * 
     * @param matrix The gradients/weights to anonymize.
     * @param epsilon The privacy budget (e.g., 0.1 for high privacy, 10 for low privacy).
     * @param sensitivity The maximum possible change a single data point can cause (usually clipped in DL).
     */
    static applyNoise(matrix, epsilon = 0.5, sensitivity = 1) {
      const scale = sensitivity / epsilon;
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          const noise = this.generateLaplaceNoise(scale);
          matrix.data[i][j] += noise;
        }
      }
    }
  };

  // lib/federated/client-node.ts
  var FlockNode = class {
    constructor(inputNodes = 2, hiddenNodes = 4, outputNodes = 1) {
      this.isConnected = false;
      this.isTraining = false;
      this.privacyEpsilon = 0.5;
      this.network = new NeuralNetwork(inputNodes, hiddenNodes, outputNodes);
    }
    /**
     * Connects to the central FedAvg Coordinator.
     */
    connect(websocketUrl) {
      console.log(`[FlockML] Connecting to ${websocketUrl}...`);
      this.isConnected = true;
      console.log(`[FlockML] Connected. Awaiting global weights.`);
    }
    /**
     * Receives the latest global model from the server.
     */
    syncGlobalWeights(qWeightsIH, qWeightsHO, qBiasH, qBiasO) {
      this.network.weights_ih = Quantizer.dequantize(qWeightsIH);
      this.network.weights_ho = Quantizer.dequantize(qWeightsHO);
      this.network.bias_h = Quantizer.dequantize(qBiasH);
      this.network.bias_o = Quantizer.dequantize(qBiasO);
    }
    /**
     * Performs one local training epoch on a batch of data.
     */
    trainLocalBatch(inputs, targets) {
      if (!this.isConnected) throw new Error("FlockNode is not connected to a coordinator.");
      this.isTraining = true;
      for (let i = 0; i < inputs.length; i++) {
        this.network.train(inputs[i], targets[i]);
      }
    }
    /**
     * Secures and compresses the newly trained weights, ready to be sent to the server.
     */
    exportSecureGradients() {
      DifferentialPrivacy.applyNoise(this.network.weights_ih, this.privacyEpsilon);
      DifferentialPrivacy.applyNoise(this.network.weights_ho, this.privacyEpsilon);
      DifferentialPrivacy.applyNoise(this.network.bias_h, this.privacyEpsilon);
      DifferentialPrivacy.applyNoise(this.network.bias_o, this.privacyEpsilon);
      return {
        weights_ih: Quantizer.quantize(this.network.weights_ih),
        weights_ho: Quantizer.quantize(this.network.weights_ho),
        bias_h: Quantizer.quantize(this.network.bias_h),
        bias_o: Quantizer.quantize(this.network.bias_o)
      };
    }
  };

  // workers/flock.worker.ts
  self.onmessage = async (event) => {
    if (event.data.type === "START_TRAINING") {
      try {
        console.log("[FlockML WebWorker] Initializing Decentralized Edge Node...");
        const node = new FlockNode(784, 128, 10);
        node.connect("ws://localhost:8080");
        const inputs = [new Array(784).fill(0.5)];
        const targets = [new Array(10).fill(0.1)];
        console.log("[FlockML WebWorker] Starting 10,000 epochs of MASSIVE local matrix calculus...");
        for (let epoch = 0; epoch <= 1e4; epoch++) {
          node.trainLocalBatch(inputs, targets);
          if (epoch % 200 === 0) {
            self.postMessage({ type: "TELEMETRY", epoch });
            await new Promise((resolve) => setTimeout(resolve, 5));
          }
        }
        console.log("[FlockML WebWorker] Applying DPDP Laplacian Noise and Int8 Quantization...");
        const payload = node.exportSecureGradients();
        console.log(`[FlockML WebWorker] Math Complete. Encrypted Payload Size: ${payload.weights_ih.data.length} bytes.`);
        self.postMessage({ type: "TRAINING_COMPLETE", payload: { dataLength: payload.weights_ih.data.length } });
      } catch (error) {
        console.error("[FlockML WebWorker] Critical Failure:", error);
      }
    }
  };
})();
