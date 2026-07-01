'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NodeStatus {
  id: string;
  status: 'ACTIVE' | 'DEAD';
  assignedTask: string | null;
}

interface Task {
  id: string;
  assignedToNodeId: string | null;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  retryCount: number;
}

export default function CommandCenter() {
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [matrix, setMatrix] = useState<number[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to the flockML Enterprise live backend
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'GRID_STATE') {
        setNodes(payload.data.nodes);
        setTasks(payload.data.tasks);
        if (payload.data.logs) setLogs(payload.data.logs);
        if (payload.data.matrixSnapshot) setMatrix(payload.data.matrixSnapshot);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono p-8 selection:bg-cyan-500/30">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">flockML <span className="text-cyan-400">Command Center</span></h1>
          <p className="text-sm text-slate-500 mt-2">Enterprise Grid Topology & Task Orchestration</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.7)]' : 'bg-rose-500'}`} />
          <span className="text-sm font-semibold tracking-wider text-slate-300">
            {connected ? 'WSS SECURE LINK : ONLINE' : 'CONNECTION LOST'}
          </span>
        </div>
      </div>

      {/* NETWORK TELEMETRY BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-1">TRANSPORT PROTOCOL</p>
          <p className="text-sm text-cyan-400 font-mono">WSS (WebSocket Secure)</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-1">DATA SERIALIZATION</p>
          <p className="text-sm text-fuchsia-400 font-mono">Int8 ArrayBuffer</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-1">BANDWIDTH SAVINGS</p>
          <p className="text-sm text-emerald-400 font-mono">400% (Float32 Compressed)</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-1">NETWORK LATENCY</p>
          <p className="text-sm text-amber-400 font-mono">{connected ? '~12ms (Edge Node)' : 'OFFLINE'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: THE PHYSICAL SUBSTATION GRID */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl text-white font-semibold flex items-center gap-2">
            <span className="text-cyan-500">_</span> Physical Substation Array
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {nodes.map(node => (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-6 rounded-xl border backdrop-blur-sm overflow-hidden ${
                    node.status === 'ACTIVE' 
                      ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                      : 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)] animate-pulse'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className={`text-xs font-bold tracking-widest ${node.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {node.status}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${node.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{node.id}</h3>
                  <p className="text-xs text-slate-500 mb-6">Hardware: A100 Simulation</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current Task:</span>
                      <span className={`font-semibold ${node.assignedTask ? 'text-cyan-400' : 'text-slate-600'}`}>
                        {node.status === 'DEAD' ? 'DROPPED' : (node.assignedTask || 'IDLE')}
                      </span>
                    </div>
                    {/* Fake Loading Bar for effect */}
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      {node.status === 'ACTIVE' && node.assignedTask && (
                        <motion.div 
                          className="h-full bg-cyan-500" 
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                      {node.status === 'DEAD' && (
                        <div className="w-full h-full bg-rose-600/50" />
                      )}
                    </div>
                    
                    {/* MANUAL OVERRIDE (THE MIC DROP) */}
                    {node.status === 'ACTIVE' && (
                      <button 
                        onClick={() => wsRef.current?.send(JSON.stringify({ type: 'KILL_NODE', nodeId: node.id }))}
                        className="mt-4 w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold border border-rose-500/30 text-[10px] tracking-widest py-2 rounded transition-colors"
                      >
                        MANUAL SEVER (KILL)
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {nodes.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-600 border border-dashed border-slate-800 rounded-xl">
                Awaiting Master Coordinator Boot Sequence...
              </div>
            )}
          </div>
          
          {/* GLOBAL MODEL MATH PANEL */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h2 className="text-lg text-white font-semibold flex items-center gap-2 mb-4">
              <span className="text-amber-500">_</span> Global Model Weights (FedAvg)
            </h2>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden">
              <p className="text-xs text-slate-500 mb-3">Live floating-point tensor snapshot from Master Coordinator:</p>
              <div className="flex flex-wrap gap-2 font-mono text-[10px] text-cyan-400">
                {matrix.length > 0 ? matrix.map((val, idx) => (
                  <div key={idx} className="bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/50">
                    {val.toFixed(8)}
                  </div>
                )) : <span className="text-slate-600">Awaiting Math Aggregation...</span>}
              </div>
            </div>
          </div>
          
          {/* SYSTEM AUDIT LOG */}
          <div className="mt-8 pt-6 border-t border-slate-800">
             <h2 className="text-lg text-white font-semibold flex items-center gap-2 mb-4">
               <span className="text-fuchsia-500">_</span> Live System Audit Trail
             </h2>
             <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-48 overflow-y-auto font-mono text-xs space-y-2">
               {logs.map((log, idx) => (
                 <div key={idx} className={`${
                   log.includes('⚠️') ? 'text-rose-400' : 
                   log.includes('✅') ? 'text-emerald-400' : 
                   log.includes('🔄') ? 'text-amber-400' : 'text-slate-400'
                 }`}>
                   {log}
                 </div>
               ))}
               {logs.length === 0 && <div className="text-slate-600">Waiting for backend events...</div>}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE DAG TASK QUEUE */}
        <div className="space-y-6">
          <h2 className="text-xl text-white font-semibold flex items-center gap-2">
            <span className="text-indigo-500">_</span> DAG Rerouting Queue
          </h2>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 min-h-[500px]">
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center text-slate-600 py-8">No active tasks</div>
              ) : (
                <AnimatePresence>
                  {tasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-200">{task.id}</span>
                        
                        {/* Task Status Badge */}
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold tracking-wider
                          ${task.status === 'RUNNING' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : ''}
                          ${task.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : ''}
                          ${task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : ''}
                        `}>
                          {task.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>
                          Assigned: <span className={task.assignedToNodeId ? 'text-slate-300' : 'text-slate-600'}>
                            {task.assignedToNodeId || 'None'}
                          </span>
                        </span>
                        
                        {/* Fault Tolerance Retries */}
                        {task.retryCount > 0 && (
                          <span className="text-rose-400 font-semibold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Rerouted {task.retryCount}x
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
