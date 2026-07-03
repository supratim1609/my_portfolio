import React from 'react';

export function EventLog({ logs }: { logs: string[] }) {
  return (
    <div className="w-full h-64 bg-[#111] rounded-xl border border-white/5 p-4 flex flex-col font-mono text-sm overflow-hidden relative">
      <div className="text-xs text-[#888] uppercase tracking-widest mb-4 flex justify-between items-center">
        <span>System Log</span>
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 flex flex-col-reverse no-scrollbar">
        {logs.map((log, i) => (
          <div key={i} className="text-gray-400 border-l-2 border-white/10 pl-2">
            <span className="text-[#666] mr-2">{log.substring(0, 10)}</span>
            <span className={log.includes('offline') ? 'text-rose-400' : log.includes('securely joined') ? 'text-sky-400' : log.includes('FedAvg') ? 'text-fuchsia-400' : 'text-gray-300'}>
              {log.substring(11)}
            </span>
          </div>
        ))}
      </div>
      {/* Fade out top */}
      <div className="absolute top-10 left-0 right-0 h-8 bg-gradient-to-b from-[#111] to-transparent pointer-events-none"></div>
    </div>
  );
}
