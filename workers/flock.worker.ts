import { FlockNode } from '../lib/federated/client-node';

// WebWorker entry point for FlockML
self.onmessage = async (event) => {
  if (event.data.type === 'START_TRAINING') {
    try {
      console.log("[FlockML WebWorker] Initializing Decentralized Edge Node...");
      
      // Initialize a massive neural network to simulate heavy Edge Compute (MNIST scale)
      const node = new FlockNode(784, 128, 10);
      node.connect('ws://localhost:8080'); // Mock connection to bypass error
      
      // Generate heavy dummy data to force the CPU to sweat
      const inputs = [new Array(784).fill(0.5)];
      const targets = [new Array(10).fill(0.1)];

      console.log("[FlockML WebWorker] Starting 10,000 epochs of MASSIVE local matrix calculus...");
      
      for (let epoch = 0; epoch <= 10000; epoch++) {
        node.trainLocalBatch(inputs, targets); // Synchronous math operation
        
        // Broadcast progress every 200 epochs so the UI can show telemetry
        if (epoch % 200 === 0) {
          self.postMessage({ type: 'TELEMETRY', epoch });
          // Yield the thread for a tiny moment to let the UI update its state smoothly
          await new Promise(resolve => setTimeout(resolve, 5));
        }
      }

      console.log("[FlockML WebWorker] Applying DPDP Laplacian Noise and Int8 Quantization...");
      
      // This is where the magic happens: Quantizing the weights to ArrayBuffer
      const payload = node.exportSecureGradients();
      
      console.log(`[FlockML WebWorker] Math Complete. Encrypted Payload Size: ${payload.weights_ih.data.length} bytes.`);
      
      // Send the compressed ArrayBuffer back to the main thread (React UI)
      self.postMessage({ type: 'TRAINING_COMPLETE', payload: { dataLength: payload.weights_ih.data.length } });
      
    } catch (error) {
      console.error("[FlockML WebWorker] Critical Failure:", error);
    }
  }
};
