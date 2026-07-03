import React from 'react';
import { Cpu, Wifi } from 'lucide-react';

interface LocalNodeProps {
  nodeId: string | null;
  status: string;
}

export function LocalNodeCard({ nodeId, status }: LocalNodeProps) {
  if (!nodeId) {
    return (
      <div className="w-full bg-[#111] rounded-xl border border-white/5 p-6 animate-pulse">
        <div className="h-4 bg-white/10 w-1/3 rounded mb-4"></div>
        <div className="h-8 bg-white/10 w-2/3 rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-xl border border-white/5 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-mono text-[#888] uppercase tracking-widest mb-1">Your Edge Node</h3>
          <div className="text-xl font-mono text-white flex items-center gap-2">
            {nodeId}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wide border
          ${status === 'UPLOADING' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' : 
            status === 'JOINING' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 
            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
          {status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/50 rounded-lg p-3 border border-white/5">
          <div className="flex items-center gap-2 text-[#888] text-xs mb-1">
            <Cpu size={14} /> CPU Thread
          </div>
          <div className="font-mono text-sm text-gray-300">Int8 Quantized</div>
        </div>
        <div className="bg-black/50 rounded-lg p-3 border border-white/5">
          <div className="flex items-center gap-2 text-[#888] text-xs mb-1">
            <Wifi size={14} /> Latency
          </div>
          <div className="font-mono text-sm text-gray-300">~24ms</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 text-xs text-[#666] font-mono">
        Cryptographic Laplacian Noise Applied • Differential Privacy Active
      </div>
    </div>
  );
}
