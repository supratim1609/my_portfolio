import { Activity, Shield, Zap, Server, Network } from 'lucide-react';

interface MetricsProps {
  metrics: {
    activeNodes: number;
    globalRound: number;
    globalAccuracy: string;
    totalTFlops: string;
    serverCostAvoided: string;
    bandwidthSavedMB: string;
  };
}

export function MetricsHeader({ metrics }: MetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-[#111] border border-white/5 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-[#888] mb-2">
          <Network size={16} />
          <span className="text-xs uppercase tracking-wider font-semibold">Active Nodes</span>
        </div>
        <div className="text-2xl font-mono text-emerald-400">{metrics.activeNodes}</div>
      </div>
      
      <div className="bg-[#111] border border-white/5 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-[#888] mb-2">
          <Activity size={16} />
          <span className="text-xs uppercase tracking-wider font-semibold">Global Accuracy</span>
        </div>
        <div className="text-2xl font-mono text-white">{(Number(metrics.globalAccuracy)*100).toFixed(2)}%</div>
      </div>

      <div className="bg-[#111] border border-white/5 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-[#888] mb-2">
          <Zap size={16} />
          <span className="text-xs uppercase tracking-wider font-semibold">Edge Compute</span>
        </div>
        <div className="text-2xl font-mono text-yellow-400">{metrics.totalTFlops} <span className="text-sm">TFLOPs</span></div>
      </div>

      <div className="bg-[#111] border border-white/5 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-[#888] mb-2">
          <Server size={16} />
          <span className="text-xs uppercase tracking-wider font-semibold">Cloud Cost Saved</span>
        </div>
        <div className="text-2xl font-mono text-fuchsia-400">${metrics.serverCostAvoided}</div>
      </div>

      <div className="bg-[#111] border border-white/5 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-[#888] mb-2">
          <Shield size={16} />
          <span className="text-xs uppercase tracking-wider font-semibold">Training Rounds</span>
        </div>
        <div className="text-2xl font-mono text-blue-400">{metrics.globalRound}</div>
      </div>
    </div>
  );
}
