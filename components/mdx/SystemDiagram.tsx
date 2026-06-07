"use client";

import { motion } from "framer-motion";

export default function SystemDiagram({ type }: { type: "monolith" | "distributed" }) {
  if (type === "monolith") {
    return (
      <div className="my-10 p-8 rounded-xl bg-[#050505] border border-white/10 overflow-hidden flex flex-col items-center shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B30]/5 to-transparent pointer-events-none" />
        <svg viewBox="0 0 400 200" className="w-full max-w-md h-auto relative z-10">
          {/* Central Monolith */}
          <rect x="150" y="60" width="100" height="80" rx="8" className="fill-black stroke-white/20 stroke-2" />
          <text x="200" y="105" textAnchor="middle" className="fill-white/80 text-sm font-mono font-bold tracking-widest">MONOLITH</text>
          
          {/* Incoming Traffic Lines */}
          {[20, 60, 100, 140, 180].map((y, i) => (
            <motion.path
              key={i}
              d={`M 20 ${y} L 140 ${y > 100 ? 120 : y < 100 ? 80 : 100}`}
              className="stroke-[#FF3B30] stroke-2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
            />
          ))}

          {/* Outgoing Bottleneck */}
          <motion.path
            d="M 260 100 L 380 100"
            className="stroke-white/20 stroke-[6px]"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
          <text x="320" y="90" textAnchor="middle" className="fill-[#FF3B30] text-[10px] font-mono">BOTTLENECK</text>
        </svg>
        <div className="mt-6 text-xs font-mono text-[#A1A1A1] uppercase tracking-widest text-center">
          Fig A: Legacy Monolith Architecture
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 p-8 rounded-xl bg-[#050505] border border-white/10 overflow-hidden flex flex-col items-center shadow-lg relative">
      <div className="absolute inset-0 bg-gradient-to-tl from-[#10B981]/5 to-transparent pointer-events-none" />
      <svg viewBox="0 0 400 200" className="w-full max-w-md h-auto relative z-10">
        {/* Edge Nodes */}
        {[40, 100, 160].map((y, i) => (
          <g key={`node-${i}`}>
            <rect x="250" y={y - 20} width="80" height="40" rx="4" className="fill-black stroke-white/20 stroke-2" />
            <text x="290" y={y + 4} textAnchor="middle" className="fill-white/80 text-[10px] font-mono tracking-widest">EDGE {i + 1}</text>
          </g>
        ))}

        {/* Incoming Traffic Lines distributing evenly */}
        {[40, 100, 160].map((y, i) => (
          <motion.path
            key={`path-${i}`}
            d={`M 20 100 L 120 100 L 240 ${y}`}
            className="stroke-[#10B981] stroke-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: i * 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
          />
        ))}
      </svg>
      <div className="mt-6 text-xs font-mono text-[#A1A1A1] uppercase tracking-widest text-center">
        Fig B: Distributed Edge Routing
      </div>
    </div>
  );
}
