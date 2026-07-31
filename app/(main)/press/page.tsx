"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Mail } from "lucide-react";

export default function PressKit() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 md:px-12 selection:bg-emerald-500/30"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-4xl md:text-6xl font-mono tracking-tight font-medium mb-6">
            PRESS & MEDIA KIT
          </h1>
          <p className="text-white/50 text-lg md:text-xl font-mono leading-relaxed max-w-2xl">
            Official assets, founder biography, and technical specifications for journalists covering FlockML and Supratim Dhara.
          </p>
        </div>

        {/* Section: The Pitch */}
        <section className="mb-20 border-t border-white/10 pt-12">
          <h2 className="text-xs text-white/40 font-mono uppercase tracking-widest mb-6">01 // The 50-Word Pitch</h2>
          <div className="bg-white/5 border border-white/10 p-8 rounded-lg relative group">
            <p className="text-xl leading-relaxed font-sans text-white/90">
              FlockML is an open-source, decentralized AI infrastructure protocol. Instead of relying on expensive, centralized cloud data centers like AWS, FlockML utilizes WebAssembly to federate AI training across millions of idle consumer devices (laptops, phones), creating a mathematically secure, cost-effective global supercomputer for Sovereign AI.
            </p>
          </div>
        </section>

        {/* Section: Founder Bio */}
        <section className="mb-20 border-t border-white/10 pt-12">
          <h2 className="text-xs text-white/40 font-mono uppercase tracking-widest mb-6">02 // Founder Biography</h2>
          <div className="space-y-6 text-white/70 font-sans leading-relaxed text-lg max-w-3xl">
            <p>
              Supratim Dhara (23) is a deep-tech systems engineer and founder based in Kolkata, India. He specializes in distributed systems, Rust, WebAssembly, and low-level performance optimization.
            </p>
            <p>
              Recognizing the unsustainability of centralized GPU clusters, Supratim architected FlockML to democratize AI compute. He is a vocal advocate for Sovereign AI and Digital Public Infrastructure (DPI), frequently speaking at developer conferences across India on the mathematics of federated learning and cryptographic privacy.
            </p>
            <div className="pt-4 flex gap-4">
               <a href="mailto:supratim1609@gmail.com" className="inline-flex items-center gap-2 text-sm font-mono text-emerald-400 hover:text-emerald-300 transition-colors">
                 <Mail size={16} /> Contact for Interview
               </a>
            </div>
          </div>
        </section>

        {/* Section: Pre-written Quotes */}
        <section className="mb-20 border-t border-white/10 pt-12">
          <h2 className="text-xs text-white/40 font-mono uppercase tracking-widest mb-6">03 // Quotable</h2>
          <div className="grid gap-6">
            <Quote 
              text="The future of AI isn't in centralized server farms owned by three mega-corporations. It's in the billions of devices already sitting idle on our desks. The compute already exists; it just lacks the grid."
              author="Supratim Dhara"
            />
            <Quote 
              text="You cannot build Sovereign AI if you are routing national data through foreign cloud providers. We have to push the computation to the edge, locking the data on the citizen's device."
              author="Supratim Dhara"
            />
          </div>
        </section>

        {/* Section: FAQ */}
        <section className="mb-20 border-t border-white/10 pt-12">
          <h2 className="text-xs text-white/40 font-mono uppercase tracking-widest mb-6">04 // Technical FAQ</h2>
          <div className="space-y-8">
            <FAQItem 
              question="How is FlockML different from crypto/blockchain AI networks?"
              answer="FlockML does not use blockchain, tokens, or heavy cryptographic zero-knowledge proofs which waste immense compute power. It uses enterprise-grade Federated Averaging and Laplacian noise to secure data purely mathematically."
            />
            <FAQItem 
              question="What about network latency in places like India?"
              answer="By compressing 32-bit floating-point neural networks into 8-bit integers (Int8 Quantization), FlockML reduces payload sizes by 4x, allowing it to function over standard 4G networks without requiring high-speed fiber backbones."
            />
          </div>
        </section>



      </div>
    </motion.main>
  );
}

function Quote({ text, author }: { text: string, author: string }) {
  return (
    <div className="border-l-2 border-emerald-500 pl-6 py-2">
      <p className="text-xl md:text-2xl font-serif italic text-white/90 mb-4 leading-relaxed">&quot;{text}&quot;</p>
      <p className="font-mono text-sm text-white/50">— {author}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-2">{question}</h3>
      <p className="text-white/60 leading-relaxed font-sans max-w-3xl">{answer}</p>
    </div>
  );
}
