"use client";

// Security: Purely client-side simulated dashboard.
// All values are from static and client-side randomized state. No user inputs are rendered
// into the DOM, eliminating any potential XSS or injection vulnerabilities.

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, X, Play, AlertTriangle, CheckCircle, Shield, 
  Activity, Cpu, Server, Radio, Database,
  Terminal, Globe, Zap, Settings, RefreshCw
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type NodeStatus = "active" | "idle" | "failed" | "recovering" | "training";
type NodeType   = "Government" | "Data Centre" | "University" | "Hospital" | "Edge Gateway" | "Research Lab";

interface InfraNode {
  id: number;
  name: string;
  city: string;
  type: NodeType;
  lat: number;
  lon: number;
  status: NodeStatus;
  cpu: number;
  gpu: number;
  memory: number;
  bandwidth: number;
  temperature: number;
  workload: string;
  modelVersion: string;
  trainingProgress: number;
  uptime: string;
  logs: string[];
}

interface StreamEvent {
  id: number;
  time: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  nodeId?: number;
}

interface DataFlow {
  id: string;
  from: number;
  to: number;
}

// ─── CONSTANTS & CONFIGS ──────────────────────────────────────────────────────

const INITIAL_NODES: InfraNode[] = [
  { id: 1,  name: "NIC Delhi",             city: "New Delhi",   type: "Government",   lat: 28.6, lon: 77.2, status: "training",   cpu: 87, gpu: 92, memory: 78, bandwidth: 1240, temperature: 72, workload: "Federated Training v3.2",    modelVersion: "v3.2.1", trainingProgress: 67, uptime: "14d 6h", logs: ["[system] WGSL compiled", "[opfs] Streamed block #18", "[learning] Epoch 3 initialized"] },
  { id: 2,  name: "CtrlS Mumbai",          city: "Mumbai",      type: "Data Centre",  lat: 19.1, lon: 72.8, status: "active",     cpu: 65, gpu: 71, memory: 58, bandwidth: 2100, temperature: 68, workload: "Inference Pipeline",          modelVersion: "v3.2.0", trainingProgress: 100, uptime: "22d 14h", logs: ["[system] Port 443 active", "[webrtc] Connection ok", "[system] WebGPU online"] },
  { id: 3,  name: "ISRO Bangalore",        city: "Bangalore",   type: "Research Lab", lat: 12.9, lon: 77.6, status: "training",   cpu: 94, gpu: 98, memory: 88, bandwidth: 890,  temperature: 79, workload: "Satellite Imagery Model",    modelVersion: "v3.2.1", trainingProgress: 43, uptime: "7d 2h", logs: ["[system] Target tracking v2", "[learning] Local FedAvg ok", "[webrtc] Swarm linked"] },
  { id: 4,  name: "CDAC Chennai",          city: "Chennai",     type: "Data Centre",  lat: 13.1, lon: 80.3, status: "active",     cpu: 51, gpu: 44, memory: 62, bandwidth: 760,  temperature: 65, workload: "NLP Tamil Corpus",             modelVersion: "v3.2.0", trainingProgress: 100, uptime: "31d 8h", logs: ["[opfs] Models cached", "[system] Cache hit 100%", "[webrtc] Connected to Kochi"] },
  { id: 5,  name: "IIIT Hyderabad",        city: "Hyderabad",   type: "University",   lat: 17.5, lon: 78.5, status: "training",   cpu: 78, gpu: 83, memory: 71, bandwidth: 650,  temperature: 74, workload: "Vision Transformer",           modelVersion: "v3.2.1", trainingProgress: 81, uptime: "5d 20h", logs: ["[learning] Local convergence", "[opfs] Storing weights", "[system] Thread pool size 16"] },
  { id: 6,  name: "IIT Kharagpur",         city: "Kolkata",     type: "University",   lat: 22.6, lon: 88.4, status: "active",     cpu: 43, gpu: 38, memory: 55, bandwidth: 420,  temperature: 61, workload: "Gradient Aggregation",         modelVersion: "v3.2.0", trainingProgress: 100, uptime: "18d 4h", logs: ["[webrtc] Ring layout connected", "[system] Int8 Quant active", "[learning] Loss delta -0.012"] },
  { id: 7,  name: "CoEP Pune",             city: "Pune",        type: "Research Lab", lat: 18.5, lon: 73.9, status: "idle",       cpu: 12, gpu: 8,  memory: 31, bandwidth: 380,  temperature: 54, workload: "Standby",                     modelVersion: "v3.1.9", trainingProgress: 0,   uptime: "11d 16h", logs: ["[system] Standby status", "[webrtc] Channel open", "[system] CPU temp normal"] },
  { id: 8,  name: "ADIT Ahmedabad",        city: "Ahmedabad",   type: "Edge Gateway", lat: 23.0, lon: 72.6, status: "active",     cpu: 38, gpu: 29, memory: 44, bandwidth: 290,  temperature: 58, workload: "Gradient Aggregation",         modelVersion: "v3.2.0", trainingProgress: 100, uptime: "9d 3h", logs: ["[system] Router config active", "[learning] Shard downloaded", "[system] WebGPU ok"] },
  { id: 9,  name: "MNIT Jaipur",           city: "Jaipur",      type: "University",   lat: 26.9, lon: 75.8, status: "active",     cpu: 55, gpu: 61, memory: 48, bandwidth: 340,  temperature: 63, workload: "Federated Round 41",           modelVersion: "v3.2.0", trainingProgress: 100, uptime: "6d 11h", logs: ["[system] Link online", "[webrtc] Swarm update complete", "[system] Local port open"] },
  { id: 10, name: "AIIMS Lucknow",         city: "Lucknow",     type: "Hospital",     lat: 26.8, lon: 80.9, status: "idle",       cpu: 8,  gpu: 3,  memory: 22, bandwidth: 180,  temperature: 51, workload: "Standby",                     modelVersion: "v3.1.9", trainingProgress: 0,   uptime: "4d 8h", logs: ["[system] Standby active", "[learning] Cache status clear", "[system] CPU Idle"] },
  { id: 11, name: "PEC Chandigarh",        city: "Chandigarh",  type: "University",   lat: 30.7, lon: 76.8, status: "training",   cpu: 71, gpu: 67, memory: 65, bandwidth: 410,  temperature: 68, workload: "Language Model v3",            modelVersion: "v3.2.1", trainingProgress: 29, uptime: "3d 5h", logs: ["[system] Compiler: WGSL success", "[webrtc] Connected to Delhi", "[opfs] Storage ok"] },
  { id: 12, name: "MHRD Bhopal",           city: "Bhopal",      type: "Government",   lat: 23.3, lon: 77.4, status: "active",     cpu: 34, gpu: 28, memory: 41, bandwidth: 260,  temperature: 57, workload: "Policy Analytics",             modelVersion: "v3.2.0", trainingProgress: 100, uptime: "8d 14h", logs: ["[system] Data query processed", "[webrtc] Shard routed", "[system] Uptime confirmed"] },
  { id: 13, name: "DRDO Hyderabad",        city: "Hyderabad",   type: "Research Lab", lat: 17.2, lon: 78.3, status: "training",   cpu: 91, gpu: 95, memory: 84, bandwidth: 720,  temperature: 77, workload: "Defense Vision Model",          modelVersion: "v3.2.1", trainingProgress: 55, uptime: "2d 18h", logs: ["[system] Target priority 1", "[learning] Shard verified", "[system] Int8 Quant active"] },
  { id: 14, name: "IIT Guwahati",          city: "Guwahati",    type: "University",   lat: 26.2, lon: 91.7, status: "active",     cpu: 47, gpu: 41, memory: 53, bandwidth: 210,  temperature: 60, workload: "NER Northeast Languages",       modelVersion: "v3.2.0", trainingProgress: 100, uptime: "13d 9h", logs: ["[system] Link up", "[webrtc] Sync ok", "[learning] Ep. 12 convergent"] },
  { id: 15, name: "C-DAC Trivandrum",      city: "Trivandrum",  type: "Government",   lat: 8.5,  lon: 76.9, status: "active",     cpu: 62, gpu: 58, memory: 67, bandwidth: 310,  temperature: 66, workload: "Malayalam NLP",                modelVersion: "v3.2.0", trainingProgress: 100, uptime: "17d 22h", logs: ["[opfs] Model loaded", "[system] Cache status OK", "[learning] Ep. 1 convergence"] },
  { id: 16, name: "Naval Base Vizag",      city: "Vizag",       type: "Government",   lat: 17.7, lon: 83.3, status: "training",   cpu: 82, gpu: 88, memory: 74, bandwidth: 580,  temperature: 73, workload: "Maritime Surveillance",         modelVersion: "v3.2.1", trainingProgress: 72, uptime: "1d 14h", logs: ["[system] Target identified", "[webrtc] Dynamic sync active", "[system] Port active"] },
  { id: 17, name: "Supernovah DC",         city: "Indore",      type: "Data Centre",  lat: 22.7, lon: 75.9, status: "active",     cpu: 58, gpu: 52, memory: 61, bandwidth: 490,  temperature: 64, workload: "Model Serving",                modelVersion: "v3.2.0", trainingProgress: 100, uptime: "25d 6h", logs: ["[system] Host operational", "[webrtc] Client link established", "[opfs] Storage clean"] },
  { id: 18, name: "Nagpur Gateway",        city: "Nagpur",      type: "Edge Gateway", lat: 21.1, lon: 79.1, status: "recovering", cpu: 22, gpu: 18, memory: 35, bandwidth: 140,  temperature: 55, workload: "Recovery in Progress",          modelVersion: "v3.1.9", trainingProgress: 15, uptime: "0d 3h", logs: ["[system] Recovery mode", "[webrtc] Reconnecting...", "[learning] Cache reset"] },
  { id: 19, name: "SVNIT Surat",           city: "Surat",       type: "University",   lat: 21.2, lon: 72.6, status: "idle",       cpu: 5,  gpu: 2,  memory: 18, bandwidth: 120,  temperature: 49, workload: "Standby",                     modelVersion: "v3.1.9", trainingProgress: 0,   uptime: "2d 1h", logs: ["[system] Standby active", "[webrtc] Channel closed", "[system] CPU Idle"] },
  { id: 20, name: "PSG Coimbatore",        city: "Coimbatore",  type: "University",   lat: 11.0, lon: 76.9, status: "active",     cpu: 44, gpu: 39, memory: 50, bandwidth: 280,  temperature: 62, workload: "Tamil ASR Model",              modelVersion: "v3.2.0", trainingProgress: 100, uptime: "10d 7h", logs: ["[learning] Convergence local", "[webrtc] Connected to Kochi", "[system] Uptime confirmed"] },
  { id: 21, name: "Startup Hub Kochi",     city: "Kochi",       type: "Edge Gateway", lat: 9.9,  lon: 76.3, status: "active",     cpu: 33, gpu: 27, memory: 42, bandwidth: 190,  temperature: 58, workload: "Inference Cache",              modelVersion: "v3.2.0", trainingProgress: 100, uptime: "7d 19h", logs: ["[system] Port operational", "[webrtc] Connected to Coimbatore", "[system] Cache hit 100%"] },
  { id: 22, name: "SOA Bhubaneswar",       city: "Bhubaneswar", type: "University",   lat: 20.3, lon: 85.8, status: "active",     cpu: 49, gpu: 44, memory: 56, bandwidth: 230,  temperature: 61, workload: "Odia Language Model",           modelVersion: "v3.2.0", trainingProgress: 100, uptime: "12d 3h", logs: ["[system] Network sync confirmed", "[learning] Shard verified", "[webrtc] Connection ok"] },
  { id: 23, name: "NIT Raipur",            city: "Raipur",      type: "Edge Gateway", lat: 21.3, lon: 81.6, status: "idle",       cpu: 7,  gpu: 4,  memory: 20, bandwidth: 150,  temperature: 52, workload: "Standby",                     modelVersion: "v3.1.9", trainingProgress: 0,   uptime: "5d 22h", logs: ["[system] Standby status", "[webrtc] Channel open", "[system] CPU temp normal"] },
  { id: 24, name: "IIIT Dehradun",         city: "Dehradun",    type: "Research Lab", lat: 30.3, lon: 78.0, status: "active",     cpu: 52, gpu: 47, memory: 59, bandwidth: 270,  temperature: 63, workload: "Hindi NLP",                   modelVersion: "v3.2.0", trainingProgress: 100, uptime: "8d 11h", logs: ["[system] Host active", "[learning] Epoch 24 finished", "[webrtc] Link quality 98%"] },
  { id: 25, name: "Border Compute Shimla", city: "Shimla",      type: "Government",   lat: 31.1, lon: 77.2, status: "training",   cpu: 76, gpu: 72, memory: 68, bandwidth: 320,  temperature: 67, workload: "Edge Intelligence",            modelVersion: "v3.2.1", trainingProgress: 38, uptime: "4d 6h", logs: ["[system] WGSL success", "[webrtc] Link to Delhi established", "[learning] Loss status normal"] },
];

const INITIAL_EVENTS: StreamEvent[] = [
  { id: 1,  time: "12:40:12", message: "WebGPU WGSL shaders loaded locally on Node #3 (ISRO Bangalore)",  type: "info"    },
  { id: 2,  time: "12:39:58", message: "Federated convergence round 41 verified — Global model converged", type: "success" },
  { id: 3,  time: "12:39:41", message: "Node #18 (Nagpur Gateway) recovering after WebRTC timeout",      type: "warning" },
  { id: 4,  time: "12:39:24", message: "Ternary quantization applied to model v3.2.1 Safetensors weights", type: "info"    },
  { id: 5,  time: "12:39:10", message: "Workload re-allocation completed in 14ms across 18 nodes",         type: "success" },
  { id: 6,  time: "12:38:55", message: "New federated training task received — Ministry of Electronics",    type: "info"    },
  { id: 7,  time: "12:38:40", message: "Node #14 (IIT Guwahati) successfully rejoined the compute swarm",  type: "success" },
  { id: 8,  time: "12:38:22", message: "Differential privacy noise (Laplacian distribution) injected",    type: "info"    },
  { id: 9,  time: "12:38:09", message: "WebGPU pipeline initialized for model inference on Edge Gateways",  type: "info"    },
];

const DEPLOY_STEPS = [
  { step: 1, title: "Compile WebGPU Shaders",   desc: "Packaging raw model weights into 1.58-bit ternary Safetensors", duration: 1100 },
  { step: 2, title: "Initialize WASM Runtimes",  desc: "Spawning local sandboxed workers across 18 edge compute sites", duration: 900  },
  { step: 3, title: "Allocate Local Storage",   desc: "Setting up sandboxed Origin Private File System cache space", duration: 1400 },
  { step: 4, title: "Verify WebRTC Handshake",   desc: "Establishing secure peer-to-peer data mesh over local network",  duration: 800  },
  { step: 5, title: "Distribute Model Shards",  desc: "Streaming chunks directly into browser contexts — $0 cost",       duration: 1600 },
  { step: 6, title: "Confirm Local Aggregation", desc: "Verifying local FedAvg parameters against consensus keys",     duration: 1000 },
];

const NODE_COLORS: Record<NodeType, string> = {
  "Government":   "#60a5fa", // Blue
  "Data Centre":  "#10b981", // Emerald
  "University":   "#8b5cf6", // Purple
  "Hospital":     "#ec4899", // Pink
  "Edge Gateway": "#f59e0b", // Amber
  "Research Lab": "#14b8a6", // Teal
};

const STATUS_GLOWS: Record<NodeStatus, string> = {
  active:     "#10b981",
  training:   "#3b82f6",
  idle:       "#4b5563",
  failed:     "#ef4444",
  recovering: "#f59e0b",
};

// ─── GEOGRAPHIC PROJECTION ───────────────────────────────────────────────────

// Precise mapping of longitude (68°E to 97°E) and latitude (8°N to 37°N)
// onto an SVG canvas of 420px width and 500px height.
const project = (lat: number, lon: number) => {
  const x = ((lon - 68) / 29) * (398 - 25) + 25;
  const y = 30 + ((37 - lat) / 29) * (470 - 30);
  return { x, y };
};

// SVG Path for an accurate boundary of India (scaled to fit 420x500 viewport)
const INDIA_SVG_PATH = [
  "M 170,30",
  "L 182,32 L 188,40 L 195,45",
  "L 192,60 L 205,75",
  "L 220,85 L 228,95",
  "L 255,102 L 285,115",
  "L 310,118 L 320,122 L 325,112",
  "L 345,112 L 355,118",
  "L 380,115 L 398,122 L 398,135",
  "L 388,145 L 375,160 L 372,185",
  "L 362,198 L 358,185",
  "L 340,188 L 330,175 L 328,198",
  "L 310,210 L 305,225 L 300,238",
  "L 278,252 L 255,270 L 235,302",
  "L 220,325 L 210,345",
  "L 190,380 L 180,410 L 175,432",
  "L 165,455 L 158,470",
  "L 150,460 L 140,430 L 132,390 L 128,360",
  "L 115,310 L 105,270 L 100,230",
  "L 92,205 L 85,190",
  "L 68,208 L 52,215 L 42,208 L 35,198",
  "L 25,178 L 32,165",
  "L 55,165 L 75,152",
  "L 82,130 L 90,105 L 115,85",
  "L 130,70 L 140,55 L 155,42",
  "Z"
].join(" ");

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmtTime = () => new Date().toTimeString().slice(0, 8);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function StatRow({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.03]">
      <span className="font-mono text-[9px] tracking-wider uppercase text-zinc-500">{label}</span>
      <div className="text-right">
        <span className={`font-mono text-[11px] font-bold ${accent ?? "text-zinc-300"}`}>{value}</span>
        {sub && <span className="font-mono text-[9px] text-zinc-500 ml-0.5">{sub}</span>}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function CommandCenter() {
  const [nodes, setNodes] = useState<InfraNode[]>(INITIAL_NODES);
  const [events, setEvents] = useState<StreamEvent[]>(INITIAL_EVENTS);
  const [selectedNode, setSelectedNode] = useState<InfraNode | null>(null);
  
  // Simulation States
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [failureActive, setFailureActive] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [activeConsoleLog, setActiveConsoleLog] = useState<string>("SYSTEM INITIALIZED. WEBGPU DETECTED.");
  
  const [time, setTime] = useState(fmtTime());
  const [round, setRound] = useState(41);
  const [flows, setFlows] = useState<DataFlow[]>([]);
  const logCounter = useRef(100);

  // Sparkline state for selected node (simulate dynamic chart)
  const [sparkData, setSparkData] = useState<number[]>([40, 50, 45, 60, 55, 70, 65, 80]);

  // Live Timer
  useEffect(() => {
    const t = setInterval(() => setTime(fmtTime()), 1000);
    return () => clearInterval(t);
  }, []);

  // Update Sparkline chart of the selected node
  useEffect(() => {
    if (!selectedNode) return;
    const t = setInterval(() => {
      setSparkData(prev => {
        const next = [...prev.slice(1)];
        const nextVal = clamp(prev[prev.length - 1] + (Math.random() - 0.5) * 15, 10, 100);
        next.push(Math.round(nextVal));
        return next;
      });
    }, 1500);
    return () => clearInterval(t);
  }, [selectedNode]);

  // Jitter active nodes stats to simulate live telemetry
  useEffect(() => {
    const t = setInterval(() => {
      setNodes(prev => prev.map(n => {
        if (n.status === "idle" || n.status === "failed") return n;
        const j = (v: number) => clamp(v + Math.round((Math.random() - 0.5) * 6), 10, 99);
        return {
          ...n,
          cpu: j(n.cpu),
          gpu: j(n.gpu),
          memory: j(n.memory),
          trainingProgress: n.status === "training" ? Math.min(100, n.trainingProgress + 0.5) : n.trainingProgress
        };
      }));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  // Generate telemetry traffic flow events
  useEffect(() => {
    const t = setInterval(() => {
      setNodes(curr => {
        const live = curr.filter(n => n.status === "active" || n.status === "training");
        if (live.length < 2) return curr;
        const from = live[Math.floor(Math.random() * live.length)];
        const to = live[Math.floor(Math.random() * live.length)];
        if (from.id === to.id) return curr;

        const flowId = `${from.id}-${to.id}-${Date.now()}`;
        setFlows(prev => [...prev.slice(-4), { id: flowId, from: from.id, to: to.id }]);
        setTimeout(() => setFlows(prev => prev.filter(f => f.id !== flowId)), 2800);
        return curr;
      });
    }, 3200);
    return () => clearInterval(t);
  }, []);

  // Random telemetry log streams
  useEffect(() => {
    const MESSAGES = [
      "WebGPU tensor core allocation optimized on Node #%N%",
      "Local FedAvg aggregation calculated locally",
      "Model weights quantized via Int8 logic in 1.4ms",
      "WebRTC channel quality verified: packet loss 0.00%",
      "Local cache verified in OPFS framework (0s load)",
      "Swarm alignment: loss delta verified locally",
      "Gradients aggregated: Laplace DP noise injected successfully"
    ];

    const t = setInterval(() => {
      const idx = Math.floor(Math.random() * MESSAGES.length);
      const targetNode = Math.floor(Math.random() * 25) + 1;
      const text = MESSAGES[idx].replace("%N%", String(targetNode));
      
      logCounter.current += 1;
      setEvents(prev => [
        { id: logCounter.current, time: fmtTime(), message: text, type: "info", nodeId: targetNode },
        ...prev.slice(0, 15)
      ]);
      setActiveConsoleLog(`[TELEMETRY] ${text}`);
    }, 5000);

    return () => clearInterval(t);
  }, []);

  // Orchestrated Deployment Simulator
  const handleDeployWorkload = async () => {
    if (deploying) return;
    setDeploying(true);
    setDeployStep(0);
    setActiveConsoleLog("[ORCHESTRATOR] Starting global model deploy...");

    for (let i = 0; i < DEPLOY_STEPS.length; i++) {
      setDeployStep(i + 1);
      setActiveConsoleLog(`[ORCHESTRATOR] Step ${i + 1}/${DEPLOY_STEPS.length}: ${DEPLOY_STEPS[i].title}...`);
      
      // Update nodes dynamically during deploy steps
      if (i === 1) {
        // Shift some idle nodes to training
        setNodes(prev => prev.map(n => n.id % 4 === 0 ? { ...n, status: "training", trainingProgress: 0 } : n));
      }

      await new Promise(res => setTimeout(res, DEPLOY_STEPS[i].duration));
    }

    setRound(prev => prev + 1);
    logCounter.current += 1;
    setEvents(prev => [
      { id: logCounter.current, time: fmtTime(), message: "Distributed model v3.2.2 deployed globally on 18 edge hosts", type: "success" },
      ...prev.slice(0, 15)
    ]);
    setActiveConsoleLog("[ORCHESTRATOR] Deployment successful. Global model synchronized.");
    setDeploying(false);
  };

  // Simulate Swarm Failure & Automatic Redundancy Recovery
  const handleFailureSimulation = () => {
    if (failureActive) return;
    setFailureActive(true);
    setActiveConsoleLog("[CRITICAL] SIMULATING MULTI-NODE SWARM FAILURES...");

    setNodes(curr => {
      // Intentionally crash 5 nodes
      const targetIds = [2, 5, 11, 16, 25];
      setNodes(prev => prev.map(n => 
        targetIds.includes(n.id) ? { ...n, status: "failed", cpu: 0, gpu: 0 } : n
      ));

      targetIds.forEach(id => {
        logCounter.current += 1;
        setEvents(prev => [
          { id: logCounter.current, time: fmtTime(), message: `ALERT: Node #${id} disconnected (Network partition)`, type: "error", nodeId: id },
          ...prev.slice(0, 15)
        ]);
      });

      // Scheduler migration phase
      setTimeout(() => {
        setActiveConsoleLog("[SCHEDULER] Failure detected. Re-allocating model shards...");
        logCounter.current += 1;
        setEvents(prev => [
          { id: logCounter.current, time: fmtTime(), message: "Scheduler migrating WebGPU workloads to healthy nodes", type: "warning" },
          ...prev.slice(0, 15)
        ]);
      }, 2500);

      // Node re-verification & WASM recovery setup
      setTimeout(() => {
        setActiveConsoleLog("[RECOVERY] Nodes re-registering via WebAssembly worker thread recovery...");
        setNodes(prev => prev.map(n => 
          targetIds.includes(n.id) ? { ...n, status: "recovering", cpu: 15, gpu: 5 } : n
        ));
      }, 6000);

      // Final complete recovery
      setTimeout(() => {
        setNodes(prev => prev.map(n => 
          targetIds.includes(n.id) ? { ...n, status: "active", cpu: 45, gpu: 50 } : n
        ));
        logCounter.current += 1;
        setEvents(prev => [
          { id: logCounter.current, time: fmtTime(), message: "Swarm fully recovered. Workload resumed without gradient loss.", type: "success" },
          ...prev.slice(0, 15)
        ]);
        setActiveConsoleLog("[RECOVERY] All systems clear. Fault tolerance verification verified.");
        setFailureActive(false);
      }, 12000);

      return curr;
    });
  };

  // Derive global metrics
  const globalStats = useMemo(() => {
    const active = nodes.filter(n => n.status === "active").length;
    const training = nodes.filter(n => n.status === "training").length;
    const idle = nodes.filter(n => n.status === "idle").length;
    const failed = nodes.filter(n => n.status === "failed").length;
    const recovering = nodes.filter(n => n.status === "recovering").length;
    const healthy = nodes.filter(n => n.status !== "failed" && n.status !== "idle");
    const avgCpu = Math.round(healthy.reduce((acc, curr) => acc + curr.cpu, 0) / (healthy.length || 1));
    const avgGpu = Math.round(healthy.reduce((acc, curr) => acc + curr.gpu, 0) / (healthy.length || 1));
    const avgMem = Math.round(healthy.reduce((acc, curr) => acc + curr.memory, 0) / (healthy.length || 1));
    const systemUptime = "99.98%";
    const totalTflops = ((avgGpu * (active + training) * 0.45) / 10).toFixed(1);

    return { active, training, idle, failed, recovering, avgCpu, avgGpu, avgMem, systemUptime, totalTflops };
  }, [nodes]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#050609] text-zinc-100 font-sans select-none overflow-hidden animate-fade-in">
      
      {/* ── METRIC GLOW DECORATIONS ───────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-950/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── TOP HUD HEADER ────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-6 h-14 border-b border-white/[0.06] bg-[#07090e]/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <Link href="/flock-ml" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors">
            <ArrowLeft size={14} />
            <span className="font-mono text-[9px] tracking-widest uppercase">BACK</span>
          </Link>
          <div className="w-px h-5 bg-white/[0.08]" />
          <div className="flex items-center gap-2.5">
            <Globe size={18} className="text-blue-500 animate-pulse" />
            <div>
              <div className="text-[12px] font-bold tracking-tight text-white flex items-center gap-2">
                FLOCKML COMMAND CONSOLE
                <span className="font-mono text-[9px] bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800/30">SOVEREIGN NETWORK</span>
              </div>
              <div className="font-mono text-[8px] text-zinc-500 tracking-[0.2em] uppercase">National Compute Grid Administration</div>
            </div>
          </div>
        </div>

        {/* Console status ticker */}
        <div className="hidden lg:flex items-center gap-8 font-mono text-[10px]">
          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[8px]">AGGREGATION ROUND</span>
            <span className="text-blue-400 font-bold">ROUND #{round}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[8px]">CAPACITY RATING</span>
            <span className="text-zinc-300 font-bold">{globalStats.totalTflops} TFLOPS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[8px]">UPTIME SLA</span>
            <span className="text-emerald-400 font-bold">{globalStats.systemUptime}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[8px]">ACTIVE TRAINING</span>
            <span className="text-blue-500 font-bold">{globalStats.training} SHARDS</span>
          </div>
        </div>

        {/* Dynamic status clock */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="font-mono text-[8px] text-zinc-600 uppercase tracking-wider">LOCAL TIME</div>
            <div className="font-mono text-xs font-bold text-zinc-300 mt-0.5">{time}</div>
          </div>
          <div className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-1 rounded">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[9px] tracking-widest uppercase text-emerald-400 font-bold">GRID ONLINE</span>
          </div>
        </div>
      </header>

      {/* ── CORE PANEL LAYOUT ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 1. LEFT SIDEBAR: GRID TELEMETRY */}
        <aside className="hidden xl:flex flex-col w-64 shrink-0 border-r border-white/[0.05] bg-[#07090e]/45 overflow-y-auto">
          {/* Panel corner design marks */}
          <div className="p-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-zinc-700" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-zinc-700" />
            
            <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-500 mb-3.5">Grid Telemetry</p>
            
            {/* Status indicators */}
            <div className="grid grid-cols-2 gap-1.5 mb-6">
              {[
                { label: "Active Swarm", val: globalStats.active + globalStats.training, color: "text-emerald-400" },
                { label: "Offline", val: globalStats.failed, color: "text-red-400" },
                { label: "Standby", val: globalStats.idle, color: "text-zinc-600" },
                { label: "Quantized", val: "Int8", color: "text-blue-400" },
              ].map((s, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/[0.04] p-2 rounded">
                  <div className="font-mono text-[8px] tracking-wider text-zinc-600 uppercase">{s.label}</div>
                  <div className={`font-mono text-lg font-bold mt-0.5 ${s.color}`}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Performance Stats */}
            <div className="space-y-1 mb-6">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-600 mb-2">Metrics</p>
              <StatRow label="CPU Utilization" value={`${globalStats.avgCpu}%`} accent={globalStats.avgCpu > 80 ? "text-amber-500" : "text-zinc-300"} />
              <StatRow label="GPU Utilization" value={`${globalStats.avgGpu}%`} accent="text-blue-400" />
              <StatRow label="VRAM Allocation" value={`${globalStats.avgMem}%`} accent="text-purple-400" />
              <StatRow label="Compute Nodes" value={nodes.length} />
              <StatRow label="Active Shards" value={globalStats.training} accent="text-blue-400" />
              <StatRow label="Local WebGPU" value="Enabled" accent="text-emerald-400" />
              <StatRow label="Local WASM" value="Fallback Active" accent="text-zinc-400" />
              <StatRow label="Network Loss" value="0.000%" accent="text-emerald-400" />
            </div>

            {/* Swarm Node Map Legend */}
            <div className="space-y-2">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-600">Swarm Registry Types</p>
              <div className="grid grid-cols-1 gap-1.5">
                {Object.entries(NODE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.01] border border-white/[0.03]">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-mono text-[9px] text-zinc-400">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 2. CENTER PANEL: LIVE VECTOR MAP */}
        <div className="flex-1 flex flex-col border-r border-white/[0.05] relative overflow-hidden bg-[#030407]">
          {/* Coordinate system corner markers */}
          <div className="absolute top-2 left-2 font-mono text-[8px] text-zinc-700 pointer-events-none">GRID REF: IN-SVRG-41</div>
          <div className="absolute top-2 right-2 font-mono text-[8px] text-zinc-700 pointer-events-none">SCALE: GEO-REDUNDANT</div>

          {/* Interactive Map Viewport */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            
            {/* SVG India Map Frame */}
            <svg 
              viewBox="0 0 420 500" 
              className="h-full max-h-[85vh] w-auto drop-shadow-[0_0_30px_rgba(30,58,138,0.15)]"
            >
              <defs>
                <radialGradient id="mapBgGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0a1224" />
                  <stop offset="100%" stopColor="#03050a" />
                </radialGradient>
                <filter id="svgGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Background */}
              <rect width="420" height="500" fill="none" />
              
              {/* Detailed India Boundary Outline */}
              <path 
                d={INDIA_SVG_PATH} 
                fill="url(#mapBgGrad)" 
                stroke="rgba(59,130,246,0.3)" 
                strokeWidth="1.2" 
                strokeLinejoin="round" 
              />
              
              {/* Subtle mesh background grid lines for tactical HUD aesthetic */}
              <path d="M 0,100 L 420,100 M 0,200 L 420,200 M 0,300 L 420,300 M 0,400 L 420,400 M 100,0 L 100,500 M 200,0 L 200,500 M 300,0 L 300,500" 
                stroke="rgba(255,255,255,0.015)" 
                strokeWidth="0.8" 
              />

              {/* Draw Data Transfer Paths */}
              {flows.map(flow => {
                const fNode = nodes.find(n => n.id === flow.from);
                const tNode = nodes.find(n => n.id === flow.to);
                if (!fNode || !tNode) return null;
                
                const start = project(fNode.lat, fNode.lon);
                const end = project(tNode.lat, tNode.lon);

                return (
                  <g key={flow.id}>
                    {/* Glowing link line */}
                    <motion.line 
                      x1={start.x} y1={start.y} 
                      x2={end.x} y2={end.y} 
                      stroke="rgba(59,130,246,0.25)" 
                      strokeWidth="0.8" 
                      strokeDasharray="3 6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0] }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                    {/* Traveling telemetry vector packet */}
                    <motion.circle
                      r="2"
                      fill="#60a5fa"
                      filter="url(#svgGlow)"
                      initial={{ cx: start.x, cy: start.y, opacity: 0 }}
                      animate={{ cx: [start.x, end.x], cy: [start.y, end.y], opacity: [0, 1, 0] }}
                      transition={{ duration: 2.2, ease: "linear" }}
                    />
                  </g>
                );
              })}

              {/* Geographic Nodes */}
              {nodes.map(node => {
                const { x, y } = project(node.lat, node.lon);
                const color = NODE_COLORS[node.type];
                const statusGlow = STATUS_GLOWS[node.status];
                const isSelected = selectedNode?.id === node.id;
                const isSwarmed = node.status === "active" || node.status === "training";

                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedNode(node);
                      setSparkData([35, 50, 42, 60, 58, 75, 70, node.cpu]);
                    }}
                  >
                    {/* Ring Pulse for active nodes */}
                    {isSwarmed && (
                      <motion.circle
                        cx={x} cy={y}
                        r={4.5}
                        fill="none"
                        stroke={statusGlow}
                        strokeWidth="0.8"
                        initial={{ r: 4, opacity: 0.8 }}
                        animate={{ r: 12, opacity: 0 }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: (node.id * 0.12) % 2.5
                        }}
                      />
                    )}

                    {/* Selection highlight ring */}
                    {isSelected && (
                      <circle cx={x} cy={y} r={9} fill="none" stroke="#ffffff" strokeWidth="0.8" className="animate-pulse" />
                    )}

                    {/* Node base point */}
                    <circle
                      cx={x} cy={y}
                      r={node.status === "failed" ? 2 : 3}
                      fill={node.status === "failed" ? "#ef4444" : color}
                      opacity={node.status === "idle" ? 0.3 : 1}
                      filter={isSwarmed ? "url(#svgGlow)" : undefined}
                    />

                    {/* Status dot overlay */}
                    <circle cx={x + 3.2} cy={y - 3.2} r={0.9} fill={statusGlow} />

                    {/* Hover text label */}
                    <text
                      x={x + 7} y={y + 3}
                      fill="#a1a1aa"
                      fontSize="5"
                      fontFamily="monospace"
                      opacity="0"
                      className="group-hover:opacity-100 transition-opacity pointer-events-none"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Tactical Action Bar */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 flex-wrap justify-center w-[90%] max-w-xl z-10 p-2.5 rounded-lg border border-white/[0.06] bg-[#07090e]/95 backdrop-blur-md">
            
            <motion.button 
              id="deploy-btn"
              onClick={handleDeployWorkload}
              disabled={deploying}
              whileHover={{ scale: deploying ? 1 : 1.02 }}
              whileTap={{ scale: deploying ? 1 : 0.98 }}
              className={`flex items-center gap-2 px-5 py-2 rounded text-[10px] font-mono tracking-widest uppercase font-bold transition-all ${
                deploying 
                  ? "bg-zinc-800 text-zinc-500 border border-transparent cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              }`}
            >
              <Play size={10} fill="currentColor" />
              {deploying ? `ORCHESTRATING (${deployStep}/6)...` : "DEPLOY SWARM WORKLOAD"}
            </motion.button>

            <motion.button
              id="failure-btn"
              onClick={handleFailureSimulation}
              disabled={failureActive}
              whileHover={{ scale: failureActive ? 1 : 1.02 }}
              whileTap={{ scale: failureActive ? 1 : 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-mono tracking-widest uppercase border transition-all ${
                failureActive
                  ? "border-amber-500/30 text-amber-500 bg-amber-950/20"
                  : "border-red-500/40 text-red-400 bg-red-950/10 hover:bg-red-950/30 hover:border-red-500/70"
              }`}
            >
              <AlertTriangle size={10} />
              {failureActive ? "AUTONOMIC RECOVERY ACTIVE" : "SIMULATE SWARM FAILURE"}
            </motion.button>

            <motion.button
              id="compare-btn"
              onClick={() => setShowCompare(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded text-[10px] font-mono tracking-widest uppercase border border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.2] transition-colors"
            >
              <Shield size={10} />
              COMPARE SYSTEM
            </motion.button>
          </div>
        </div>

        {/* 3. RIGHT SIDEBAR: REAL-TIME CONSOLE & INSPECTION */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-[#07090e]/40 overflow-hidden">
          
          {/* Dynamic Node Inspection */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-white/[0.05] p-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-zinc-700" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-zinc-700" />
            
            <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Swarm Inspector</p>
            
            {selectedNode ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Node info header */}
                <div className="mb-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-white leading-tight">{selectedNode.name}</span>
                    <span 
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded border"
                      style={{ 
                        borderColor: `${STATUS_GLOWS[selectedNode.status]}40`, 
                        color: STATUS_GLOWS[selectedNode.status],
                        backgroundColor: `${STATUS_GLOWS[selectedNode.status]}10`
                      }}
                    >
                      {selectedNode.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-mono text-[9px] text-zinc-500 mt-1">
                    {selectedNode.city} · Lat {selectedNode.lat}°N · Lon {selectedNode.lon}°E
                  </div>
                </div>

                {/* Telemetry charts / status bars */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {[
                    { label: "CPU Load", val: selectedNode.cpu, color: selectedNode.cpu > 80 ? "bg-amber-500" : "bg-emerald-500" },
                    { label: "WebGPU Capacity", val: selectedNode.gpu, color: "bg-blue-500" },
                    { label: "WASM Heap Memory", val: selectedNode.memory, color: "bg-purple-500" },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-mono text-[8px] text-zinc-500 uppercase">{stat.label}</span>
                        <span className="font-mono text-[10px] text-zinc-300 font-bold">{stat.val}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${stat.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.val}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Dynamic mini telemetry sparkline */}
                  <div className="mt-4 pt-4 border-t border-white/[0.04]">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-[8px] text-zinc-500 uppercase">SWARM LOAD TELEMETRY (LIVE)</span>
                      <span className="font-mono text-[8px] text-emerald-400">ACTIVE COMPUTE</span>
                    </div>
                    {/* SVG Sparkline */}
                    <div className="h-12 bg-white/[0.01] border border-white/[0.03] p-1.5 rounded">
                      <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="1.2"
                          points={sparkData.map((v, i) => `${(i / (sparkData.length - 1)) * 100},${30 - (v / 100) * 26 - 2}`).join(" ")}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="pt-2.5">
                    <StatRow label="QUANTIZATION TYPE" value="1.58-Bit Ternary" accent="text-blue-400" />
                    <StatRow label="LOCAL WEB STORAGE" value="OPFS Swarm Cache" />
                    <StatRow label="BANDWIDTH ASSIGNED" value={`${selectedNode.bandwidth} Mbps`} />
                    <StatRow label="CORE TEMP" value={`${selectedNode.temperature}°C`} accent={selectedNode.temperature > 75 ? "text-amber-500" : "text-zinc-300"} />
                    <StatRow label="RUNTIME UPTIME" value={selectedNode.uptime} />
                  </div>

                  {/* Node Logs */}
                  <div className="pt-3 border-t border-white/[0.04]">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase block mb-2">Node Runtimes Logs</span>
                    <div className="font-mono text-[9px] bg-black/40 border border-white/[0.03] p-2 rounded text-zinc-400 space-y-1">
                      {selectedNode.logs.map((log, i) => (
                        <div key={i} className="truncate">{log}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-white/[0.04] rounded bg-white/[0.01]">
                <Cpu size={24} className="text-zinc-700 mb-2" />
                <p className="font-mono text-[10px] text-zinc-600">INSPECT NODE</p>
                <p className="font-mono text-[8px] text-zinc-700 mt-1 max-w-xs">Select any network coordinate on the India infrastructure map to inspect live metrics</p>
              </div>
            )}
          </div>

          {/* Event Stream Log */}
          <div className="h-64 shrink-0 flex flex-col p-4 bg-[#07090e]/60">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.04]">
              <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-500">Live Infrastructure Feed</span>
              <span className="font-mono text-[8.5px] text-emerald-500 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                STREAM
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pt-2.5 pr-1">
              <AnimatePresence initial={false}>
                {events.map(ev => (
                  <motion.div 
                    key={ev.id} 
                    initial={{ opacity: 0, x: 8 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="p-2 border border-white/[0.03] bg-white/[0.01] rounded"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full" 
                        style={{ 
                          backgroundColor: ev.type === "error" ? "#ef4444" : ev.type === "warning" ? "#f59e0b" : ev.type === "success" ? "#10b981" : "#4b5563" 
                        }} 
                      />
                      <span className="font-mono text-[8px] text-zinc-600">{ev.time}</span>
                      {ev.nodeId && <span className="font-mono text-[8px] text-blue-500">NODE #{ev.nodeId}</span>}
                    </div>
                    <p className="font-mono text-[9px] text-zinc-400 leading-snug">{ev.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </aside>
      </div>

      {/* ── FOOTER DOCK TERMINAL BAR ───────────────────────────────────────────── */}
      <footer className="shrink-0 h-10 border-t border-white/[0.06] bg-[#07090e]/95 px-6 flex items-center justify-between font-mono text-[10px]">
        <div className="flex items-center gap-2 text-zinc-500">
          <Terminal size={12} className="text-zinc-600" />
          <span className="uppercase text-[9px] tracking-wider text-zinc-600">CLI TUBE:</span>
          <span className="text-zinc-400 font-bold">{activeConsoleLog}</span>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-zinc-600">
          <span>LATENCY: 14MS</span>
          <span>DP BUDGET: ε = 0.30</span>
          <span>WGSL INTEGRITY: SECURE</span>
        </div>
      </footer>

      {/* ── COMPARE ARCHITECTURE MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showCompare && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setShowCompare(false)}
          >
            <motion.div 
              initial={{ scale: 0.96 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.96 }}
              className="w-full max-w-2xl border border-white/[0.08] bg-[#080a10] rounded-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06] bg-[#0a0d16]">
                <div>
                  <span className="font-mono text-[8px] tracking-[0.25em] text-zinc-500 uppercase">SYSTEM ARCHITECTURE MATRIX</span>
                  <h3 className="text-sm font-bold text-white mt-1">SOVEREIGN FLOCKML VS CENTRALIZED DATA CENTRE</h3>
                </div>
                <button onClick={() => setShowCompare(false)} className="text-zinc-600 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">
                {/* Traditional */}
                <div className="p-6">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-zinc-600 uppercase block mb-4">Centralized Server Farms</span>
                  <div className="space-y-4">
                    {[
                      { l: "Single Data Center Cluster", d: "Compute resides within localized clusters, bound by localized physical infrastructure limits." },
                      { l: "Single Point of SWARM Partition", d: "A hardware crash or localized link cut brings down the entire pipeline or server cluster." },
                      { l: "Static Virtual VM Scaling", d: "Scaling workloads requires manual hypervisor provisioning, taking days or weeks." },
                      { l: "Data Routing Risk", d: "Sensitive local information must be processed, decapsulated, and routed over centralized backend databases." },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="font-mono text-red-500 mt-0.5">✕</span>
                        <div>
                          <div className="text-[11px] font-bold text-zinc-400">{item.l}</div>
                          <div className="font-mono text-[9px] text-zinc-600 mt-0.5 leading-relaxed">{item.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FlockML */}
                <div className="p-6">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-emerald-500 uppercase block mb-4">Sovereign Distributed Swarm</span>
                  <div className="space-y-4">
                    {[
                      { l: "Distributed Border Mesh", d: "Uses thousands of heterogeneous edge gateways and user browsers concurrently across 25 regional coordinate sites." },
                      { l: "Autonomic Redundancy Recovery", d: "Swarm scheduler detects link cuts in milliseconds, dynamically migrating training matrices with zero data loss." },
                      { l: "Instant Web GPU Scaling", d: "Workloads scale instantly as users click into browser interfaces, providing on-demand aggregate compute." },
                      { l: "Privacy-Preserving Local FedAvg", d: "Grids train directly inside WebWorkers; only local delta weight matrices are shared, secured with Laplacian noise." },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="font-mono text-emerald-400 mt-0.5">✓</span>
                        <div>
                          <div className="text-[11px] font-bold text-emerald-400">{item.l}</div>
                          <div className="font-mono text-[9px] text-zinc-500 mt-0.5 leading-relaxed">{item.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-950/40 border-t border-white/[0.05] flex items-center gap-2">
                <Activity size={12} className="text-emerald-400" />
                <span className="font-mono text-[9px] text-zinc-500">
                  Grid Status: Orchestrating {globalStats.active + globalStats.training} nodes over sovereign network links. Real-time encryption active.
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
