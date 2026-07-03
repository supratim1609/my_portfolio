"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, HardDrive, Network, ShieldAlert, Zap, ZapOff, ArrowRight, Database, Server, CheckCircle2, DollarSign, ChevronRight, ChevronLeft, X, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types from the Enterprise WebSocket Server
type NodeState = {
  id: string;
  isPowerOn?: boolean;
  status: string;
  lastHeartbeat: number;
};

type TaskState = {
  id: string;
  status: string;
  assignedNodeId: string | null;
  retryCount: number;
};

type GridState = {
  nodes: NodeState[];
  tasks: TaskState[];
  logs: string[];
  matrixSnapshot: number[];
};

export default function LiveDemoPage() {
  const [gridState, setGridState] = useState<GridState>({
    nodes: [],
    tasks: [],
    logs: [],
    matrixSnapshot: []
  });
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Modal State for 3D View
  const [selectedNode, setSelectedNode] = useState<NodeState | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'GRID_STATE') {
          setGridState(message.data);
        }
      } catch (e) {
        console.error("Failed to parse message", e);
      }
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  const killNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'KILL_NODE', nodeId }));
    }
  };

  const activeNodesCount = gridState.nodes.filter(n => n.status !== 'DEAD').length;

  // ----------------------------------------------------
  // WASM MATHEMATICAL PIPELINE (Manual Control)
  // ----------------------------------------------------
  const [pipelineStep, setPipelineStep] = useState(0);
  const [rawTensor, setRawTensor] = useState<number[]>([]);
  const [noisyTensor, setNoisyTensor] = useState<number[]>([]);
  const [quantizedTensor, setQuantizedTensor] = useState<number[]>([]);

  const generateDataForStep = (step: number) => {
    if (step === 0) {
      setRawTensor([]); setNoisyTensor([]); setQuantizedTensor([]);
    } else if (step === 1) {
      const raw = Array.from({length: 12}, () => (Math.random() * 2 - 1));
      setRawTensor(raw);
    } else if (step === 2) {
      setNoisyTensor(rawTensor.map(val => val + (Math.random() * 0.4 - 0.2)));
    } else if (step === 3 || step === 4) {
      setQuantizedTensor(noisyTensor.map(val => Math.max(-128, Math.min(127, Math.round(val * 127)))));
    }
  };

  const nextStep = () => {
    const next = Math.min(pipelineStep + 1, 4);
    setPipelineStep(next);
    generateDataForStep(next);
  };

  const prevStep = () => {
    const prev = Math.max(pipelineStep - 1, 0);
    setPipelineStep(prev);
    generateDataForStep(prev);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans p-4 md:p-8 selection:bg-emerald-500/30 relative overflow-x-hidden">
      
      {/* 3D SUBSTATION MODAL */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-4xl w-full flex flex-col md:flex-row gap-12 relative overflow-hidden"
            >
              <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white bg-neutral-800/50 rounded-full">
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Box className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-2xl font-bold text-white">Substation {selectedNode.id}</h2>
                </div>
                <p className="text-neutral-400 text-sm mb-8">Live 3D Hardware & Execution Topology</p>
                
                <div className="space-y-6">
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Status</h4>
                    <p className={`font-mono ${selectedNode.status === 'DEAD' ? 'text-red-400' : 'text-emerald-400'}`}>{selectedNode.status}</p>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Local Tasks Processing</h4>
                    <p className="font-mono text-blue-400">{gridState.tasks?.filter(t => t.assignedNodeId === selectedNode.id).length || 0} Tensors</p>
                  </div>
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Memory Egress</h4>
                    <p className="font-mono text-purple-400">Int8 Quantized (1.2KB / sec)</p>
                  </div>
                </div>
              </div>

              {/* CSS 3D ISOMETRIC RENDERING */}
              <div className="flex-1 h-[400px] flex items-center justify-center relative perspective-[1000px]">
                <div className="relative w-64 h-64 transition-all duration-1000 transform-style-3d" 
                     style={{ transform: "rotateX(60deg) rotateZ(-45deg)", transformStyle: "preserve-3d" }}>
                  
                  {/* Layer 1: Physical Hardware */}
                  <motion.div 
                    initial={{ translateZ: -100, opacity: 0 }} animate={{ translateZ: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                    className={`absolute inset-0 border-2 rounded-xl flex items-end p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${selectedNode.status === 'DEAD' ? 'bg-red-950/40 border-red-900 shadow-red-900/20' : 'bg-neutral-900/80 border-neutral-700 shadow-neutral-900/50'}`}
                    style={{ transform: "translateZ(0px)" }}
                  >
                    <span className="text-neutral-500 font-mono text-xs font-bold uppercase tracking-widest">Physical Hardware (Edge)</span>
                  </motion.div>

                  {/* Layer 2: Wasm Sandbox */}
                  <motion.div 
                    initial={{ translateZ: -50, opacity: 0 }} animate={{ translateZ: 60, opacity: 1 }} transition={{ delay: 0.3 }}
                    className={`absolute inset-0 border-2 rounded-xl flex items-end p-4 backdrop-blur-sm ${selectedNode.status === 'DEAD' ? 'bg-red-500/10 border-red-500/30 hidden' : 'bg-blue-500/10 border-blue-500/40'}`}
                    style={{ transform: "translateZ(60px)" }}
                  >
                    <span className="text-blue-400 font-mono text-xs font-bold uppercase tracking-widest">Wasm Execution Sandbox</span>
                    
                    {/* Simulated compute particles */}
                    {selectedNode.status !== 'DEAD' && (
                       <div className="absolute top-4 right-4 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
                    )}
                  </motion.div>

                  {/* Layer 3: Neural Net Tensors */}
                  <motion.div 
                    initial={{ translateZ: 0, opacity: 0 }} animate={{ translateZ: 120, opacity: 1 }} transition={{ delay: 0.5 }}
                    className={`absolute inset-0 border-2 rounded-xl flex flex-col justify-between p-4 backdrop-blur-md ${selectedNode.status === 'DEAD' ? 'hidden' : 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'}`}
                    style={{ transform: "translateZ(120px)" }}
                  >
                    <div className="grid grid-cols-4 gap-2 w-full h-full p-2">
                       {Array.from({length: 16}).map((_, i) => (
                         <div key={i} className="bg-emerald-400/30 rounded-sm animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}/>
                       ))}
                    </div>
                    <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest mt-2">Int8 Tensor Matrix</span>
                  </motion.div>

                  {/* Vertical Connection Lines */}
                  {selectedNode.status !== 'DEAD' && (
                    <>
                      <div className="absolute top-0 left-0 w-0.5 h-[120px] bg-gradient-to-t from-neutral-700 via-blue-500/50 to-emerald-500/50 origin-top" style={{ transform: "rotateX(-90deg) translateY(-120px)" }} />
                      <div className="absolute top-0 right-0 w-0.5 h-[120px] bg-gradient-to-t from-neutral-700 via-blue-500/50 to-emerald-500/50 origin-top" style={{ transform: "rotateX(-90deg) translateY(-120px)" }} />
                      <div className="absolute bottom-0 right-0 w-0.5 h-[120px] bg-gradient-to-t from-neutral-700 via-blue-500/50 to-emerald-500/50 origin-top" style={{ transform: "rotateX(-90deg) translateY(-120px)" }} />
                      <div className="absolute bottom-0 left-0 w-0.5 h-[120px] bg-gradient-to-t from-neutral-700 via-blue-500/50 to-emerald-500/50 origin-top" style={{ transform: "rotateX(-90deg) translateY(-120px)" }} />
                    </>
                  )}

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
      {/* Enterprise Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-neutral-800 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Network className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">FlockML Enterprise Dashboard</h1>
            <p className="text-sm text-neutral-400">Decentralized Substation Grid Control</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-neutral-900/80 px-4 py-2 rounded-full border border-neutral-800 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-neutral-300">
              {isConnected ? "WSS CONNECTED" : "OFFLINE"}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE PHYSICAL ENTERPRISE GRID */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          
          {/* Top Enterprise KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-neutral-400" />
                <h3 className="text-sm font-medium text-neutral-400">Active Substations</h3>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{activeNodesCount} <span className="text-lg font-normal text-neutral-600">/ 5</span></div>
              <p className="text-xs text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Grid Redundancy</p>
            </div>
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <HardDrive className="w-5 h-5 text-neutral-400" />
                <h3 className="text-sm font-medium text-neutral-400">Wasm Architecture</h3>
              </div>
              <div className="text-4xl font-bold text-white mb-2">Int8</div>
              <p className="text-xs text-blue-400 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> 75% Memory Savings</p>
            </div>
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-medium text-emerald-400">Cloud OPEX Cost</h3>
              </div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">$0.00</div>
              <p className="text-xs text-emerald-500/70">AWS Firewalls Bypassed</p>
            </div>
          </div>

          {/* Substation Physical Map */}
          <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Network className="w-5 h-5 text-emerald-400"/> Decentralized Substation Grid</h2>
              <div className="text-xs text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-full border border-neutral-800">Click node for 3D View</div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {gridState.nodes.map((node) => {
                  const isAlive = node.status !== 'DEAD';
                  // Mock latency since lastHeartbeat is an absolute timestamp
                  const latency = isAlive ? Math.floor(Math.random() * 15 + 12) : 'OFFLINE'; 
                  
                  return (
                    <motion.div 
                      key={node.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSelectedNode(node)}
                      className={`relative p-5 rounded-xl border transition-all duration-300 cursor-pointer ${isAlive ? 'bg-neutral-950/50 border-neutral-800 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-red-950/10 border-red-900/30'}`}
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${isAlive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]' : 'bg-red-600'}`} />
                          <span className="font-mono text-sm font-bold text-neutral-200">{node.id}</span>
                        </div>
                        <button 
                          onClick={(e) => killNode(e, node.id)}
                          disabled={!isAlive}
                          className={`p-1.5 rounded-md transition-colors ${isAlive ? 'hover:bg-neutral-800 text-neutral-500 hover:text-red-400' : 'opacity-50 text-neutral-700'}`}
                          title="Simulate Hardware Failure"
                        >
                          {isAlive ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500">Status</span>
                          <span className={`px-2 py-0.5 rounded font-medium ${isAlive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{node.status}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500">Latency Ping</span>
                          <span className="font-mono text-neutral-400">{latency}{isAlive && 'ms'}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Action Logs */}
          <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl flex flex-col h-64 overflow-hidden">
            <div className="p-4 border-b border-neutral-800 bg-neutral-950/50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-200">Global Orchestrator Console</h2>
              <ShieldAlert className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="p-4 overflow-y-auto flex-1 font-mono text-[11px] flex flex-col gap-2">
              <AnimatePresence>
                {gridState.logs.map((log, i) => (
                  <motion.div 
                    key={log + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className={`pb-2 border-b border-neutral-800/30 leading-relaxed ${
                      log.includes('FAULT') || log.includes('ALERT') ? 'text-amber-400' : 
                      log.includes('BREACH') ? 'text-red-400' : 
                      log.includes('RECOVERY') || log.includes('✅') ? 'text-emerald-400' : 'text-neutral-400'
                    }`}
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: THE MATHEMATICAL WASM PIPELINE (MANUAL CONTROL) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-neutral-900/40 backdrop-blur-md border border-emerald-900/30 rounded-2xl p-6 flex-1 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Database className="w-5 h-5 text-blue-400"/> The Enterprise Edge Math</h2>
            <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
              Manually step through the cryptographic pipeline to visualize how Wasm computes and encrypts data at the edge.
            </p>
            
            {/* Steps Indicators */}
            <div className="flex justify-between relative z-10 mb-10 px-2">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-800 -z-10 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(pipelineStep / 4) * 100}%` }}></div>
              
              {['Data', 'Wasm', 'Noise', 'Int8', 'Egress'].map((step, idx) => {
                const isActive = pipelineStep >= idx;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'bg-emerald-900/50 border-emerald-500 text-emerald-400' : 'bg-neutral-900 border-neutral-700 text-neutral-500'}`}>
                      {idx === 1 ? <Cpu className="w-3.5 h-3.5"/> : 
                       idx === 2 ? <ShieldAlert className="w-3.5 h-3.5"/> : 
                       idx === 3 ? <HardDrive className="w-3.5 h-3.5"/> : 
                       <Network className="w-3.5 h-3.5"/>}
                    </div>
                    <span className={`text-[9px] uppercase font-bold tracking-wider ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`}>{step}</span>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Math Display Panel */}
            <div className="bg-black/50 rounded-xl border border-neutral-800 p-6 flex-1 flex flex-col justify-center relative min-h-[250px]">
              <AnimatePresence mode="wait">
                
                {pipelineStep === 0 && (
                  <motion.div key="step0" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="text-center">
                    <Database className="w-12 h-12 text-blue-400 mx-auto mb-4 opacity-80" />
                    <h4 className="text-lg font-bold text-white mb-2">Enterprise Edge Data</h4>
                    <p className="text-xs text-neutral-400">Strictly localized raw data. Never touches the cloud.</p>
                  </motion.div>
                )}

                {pipelineStep === 1 && (
                  <motion.div key="step1" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Cpu className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-lg font-bold text-white">Rust Wasm Backprop</h4>
                    </div>
                    <div className="bg-neutral-900 p-4 rounded-lg font-mono text-[10px] text-neutral-300 grid grid-cols-3 gap-2 border border-neutral-800">
                      {rawTensor.map((v, i) => (
                        <div key={i} className="text-emerald-400/80 bg-black/40 px-2 py-1 rounded text-center">{v.toFixed(4)}</div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {pipelineStep === 2 && (
                  <motion.div key="step2" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <ShieldAlert className="w-5 h-5 text-purple-400" />
                      <h4 className="text-lg font-bold text-white">Laplacian Noise Injected</h4>
                    </div>
                    <div className="bg-neutral-900 p-4 rounded-lg font-mono text-[10px] text-neutral-300 grid grid-cols-3 gap-2 border border-purple-900/30">
                      {noisyTensor.map((v, i) => {
                        const raw = rawTensor[i] || 0;
                        const diff = (v - raw).toFixed(4);
                        return (
                          <div key={i} className="flex flex-col items-center bg-black/40 px-1 py-1 rounded">
                            <span className="text-purple-400">{v.toFixed(4)}</span>
                            <span className="text-[8px] text-neutral-600">Δ {diff}</span>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {pipelineStep === 3 && (
                  <motion.div key="step3" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <HardDrive className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-bold text-white">Int8 Memory Quantization</h4>
                    </div>
                    <div className="bg-neutral-900 p-4 rounded-lg font-mono text-xs text-neutral-300 flex flex-wrap justify-center gap-2 border border-blue-900/30">
                      {quantizedTensor.map((v, i) => (
                        <div key={i} className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded border border-blue-500/20 shadow-inner w-10 text-center">
                          {v}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {pipelineStep === 4 && (
                  <motion.div key="step4" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="text-center">
                    <Network className="w-12 h-12 text-emerald-400 mx-auto mb-4 opacity-80 animate-pulse" />
                    <h4 className="text-lg font-bold text-white mb-2">Zero-Egress Transmission</h4>
                    <p className="text-xs text-neutral-400">1KB payload transmitted to Grid Master.</p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* MANUAL CONTROLS */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-neutral-800">
              <button 
                onClick={prevStep} 
                disabled={pipelineStep === 0}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm text-neutral-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <div className="text-xs text-neutral-500 font-mono tracking-widest uppercase">
                Step {pipelineStep + 1} / 5
              </div>

              <button 
                onClick={nextStep} 
                disabled={pipelineStep === 4}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-900/50 hover:bg-emerald-900/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm text-emerald-400 transition-colors border border-emerald-500/20"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
