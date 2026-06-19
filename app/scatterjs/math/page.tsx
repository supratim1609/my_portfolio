import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Box, Shield, Network } from 'lucide-react';

export default function ScatterMathPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-[#FF3B30] selection:text-white pb-32">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-16 space-y-8 border-b border-white/5">
        <Link href="/scatterjs" className="flex items-center space-x-2 text-[#A1A1A1] hover:text-white transition-colors text-sm font-mono w-fit">
          <ArrowLeft size={16} />
          <span>Back to ScatterJS</span>
        </Link>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
            The Mathematics of Scatter.js
          </h1>
          <p className="text-xl text-[#A1A1A1] font-light leading-relaxed">
            A technical deep dive into the cryptographic and compression algorithms powering the web-native federated learning infrastructure.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-24">
        
        {/* Section 1: 8-Bit Quantization */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-yellow-500">
            <Box size={24} />
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">1. 8-Bit Float Quantization</h2>
          </div>
          <div className="prose prose-invert max-w-none text-[#A1A1A1] text-lg leading-relaxed space-y-6">
            <p>
              Neural networks traditionally compute gradients using IEEE 754 <code className="bg-white/10 px-1 rounded text-white text-sm">Float32</code> arrays. While highly precise, transmitting millions of 32-bit floats across WebSockets introduces severe network bottlenecks. 
            </p>
            <p>
              ScatterJS implements a symmetric Min-Max Quantization algorithm to compress <code className="bg-white/10 px-1 rounded text-white text-sm">Float32</code> vectors down to signed <code className="bg-white/10 px-1 rounded text-white text-sm">Int8</code> (-127 to +127), reducing payload size by exactly 75% without compromising the statistical distribution of the gradients.
            </p>
            
            <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl font-mono text-sm space-y-4">
              <div className="text-white">Mapping Algorithm:</div>
              <div className="text-emerald-400 pl-4">scale = 127.0 / max(abs(min_val), abs(max_val))</div>
              <div className="text-emerald-400 pl-4">int8_val = round(float32_val * scale)</div>
            </div>

            <p>
              By retaining the absolute <code className="bg-white/10 px-1 rounded text-white text-sm">scale</code> factor in the payload metadata, the Central Coordinator can perfectly reconstruct the relative vector magnitudes upon receipt.
            </p>
          </div>
        </section>

        {/* Section 2: Differential Privacy */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-blue-500">
            <Shield size={24} />
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">2. Differential Privacy (Laplacian Noise)</h2>
          </div>
          <div className="prose prose-invert max-w-none text-[#A1A1A1] text-lg leading-relaxed space-y-6">
            <p>
              The fundamental flaw of centralized AI is data extraction. To ensure that a user&apos;s raw browser data can never be reverse-engineered from their transmitted gradients, ScatterJS injects cryptographic noise into the matrix <em>before</em> it is quantized.
            </p>
            <p>
              We utilize a Laplacian Distribution centered exactly at 0. The magnitude of the noise is controlled by the <code className="bg-white/10 px-1 rounded text-white text-sm">epsilon (ε)</code> parameter. 
            </p>

            <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl font-mono text-sm space-y-4">
              <div className="text-white">Laplacian Noise Generation (Inverse CDF):</div>
              <div className="text-blue-400 pl-4">u = random(-0.5, 0.5)</div>
              <div className="text-blue-400 pl-4">scale = 1.0 / epsilon</div>
              <div className="text-blue-400 pl-4">noise = -scale * sign(u) * ln(1 - 2 * abs(u))</div>
              <div className="text-blue-400 pl-4">secured_gradient = raw_gradient + noise</div>
            </div>

            <p>
              Because the noise is perfectly symmetric around 0, when the server averages gradients from thousands of users simultaneously, the noise mathematically cancels itself out, leaving behind only the pure, aggregated signal.
            </p>
          </div>
        </section>

        {/* Section 3: FedAvg */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-emerald-500">
            <Network size={24} />
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">3. Federated Averaging (FedAvg)</h2>
          </div>
          <div className="prose prose-invert max-w-none text-[#A1A1A1] text-lg leading-relaxed space-y-6">
            <p>
              The <code className="bg-white/10 px-1 rounded text-white text-sm">Coordinator</code> class in the Node.js backend acts as the central brain. It maintains the current state of the Global Model. When it receives a batch of secure, quantized Int8 arrays from the WebWorkers, it initiates the Federated Averaging (FedAvg) algorithm.
            </p>

            <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl font-mono text-sm space-y-4">
              <div className="text-white">Aggregation Algorithm:</div>
              <div className="text-teal-400 pl-4">1. Dequantize Int8 to Float32 using payload scale factor</div>
              <div className="text-teal-400 pl-4">2. Sum all incoming gradient matrices: Σ(G_i)</div>
              <div className="text-teal-400 pl-4">3. Divide by total participants (N) to find the Global Average</div>
              <div className="text-teal-400 pl-4">4. Apply the Global Average to the master weights</div>
            </div>

            <p>
              This completes the decentralization loop. The mathematical rigor ensures that your infrastructure can scale horizontally to millions of concurrent WebSockets without sacrificing security or bandwidth constraints.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
