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
  Terminal, Globe, Zap, Settings, RefreshCw, Upload, Sparkles, Pause, Sliders
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

// ─── BORDER COORDINATES OF INDIA (GEOGRAPHICALLY ACCURATE) ─────────────────────

const INDIA_BORDER_COORDS = [
  { lat: 37.1, lon: 74.8 },  // Kashmir North
  { lat: 35.5, lon: 77.8 },  // Karakoram
  { lat: 34.2, lon: 79.2 },  // Ladakh / China
  { lat: 32.7, lon: 79.5 },  // Demchok
  { lat: 31.8, lon: 78.7 },  // Shipki La
  { lat: 30.2, lon: 81.0 },  // Lipulekh
  { lat: 28.8, lon: 80.2 },  // Nepal West
  { lat: 27.4, lon: 83.0 },  // Nepal Central
  { lat: 26.5, lon: 85.0 },  // Nepal East
  { lat: 26.5, lon: 88.0 },  // Sikkim West
  { lat: 28.1, lon: 88.6 },  // Sikkim North
  { lat: 27.3, lon: 88.9 },  // Sikkim East
  { lat: 26.9, lon: 89.0 },  // Bhutan West
  { lat: 27.3, lon: 91.5 },  // Bhutan East
  { lat: 28.3, lon: 91.8 },  // Arunachal West
  { lat: 28.0, lon: 97.4 },  // Kibithu (Arunachal East)
  { lat: 26.0, lon: 95.2 },  // Nagaland
  { lat: 24.0, lon: 94.3 },  // Manipur
  { lat: 22.0, lon: 93.5 },  // Mizoram South
  { lat: 23.0, lon: 92.5 },  // Bangladesh East
  { lat: 24.5, lon: 92.0 },  // Tripura
  { lat: 25.2, lon: 89.8 },  // Meghalaya / Bangladesh
  { lat: 22.0, lon: 89.0 },  // Sundarbans
  { lat: 21.6, lon: 88.2 },  // West Bengal Coast
  { lat: 21.5, lon: 87.0 },  // Balasore
  { lat: 20.3, lon: 86.7 },  // Paradip
  { lat: 17.7, lon: 83.3 },  // Vizag
  { lat: 17.0, lon: 82.2 },  // Kakinada
  { lat: 14.4, lon: 80.2 },  // Nellore
  { lat: 13.1, lon: 80.3 },  // Chennai
  { lat: 10.3, lon: 79.8 },  // Point Calimere
  { lat: 9.2,  lon: 79.3 },  // Rameshwaram
  { lat: 8.08, lon: 77.55 }, // Kanyakumari (Southern Tip)
  { lat: 8.5,  lon: 76.9 },  // Trivandrum
  { lat: 9.9,  lon: 76.2 },  // Kochi
  { lat: 11.25,lon: 75.77 }, // Kozhikode
  { lat: 12.9, lon: 74.8 },  // Mangalore
  { lat: 15.4, lon: 73.8 },  // Goa
  { lat: 17.0, lon: 73.3 },  // Ratnagiri
  { lat: 19.0, lon: 72.8 },  // Mumbai
  { lat: 20.4, lon: 72.8 },  // Daman
  { lat: 21.17,lon: 72.83 }, // Surat
  { lat: 20.7, lon: 71.0 },  // Diu
  { lat: 22.25,lon: 68.9 },  // Dwarka
  { lat: 23.8, lon: 68.1 },  // Kutch West
  { lat: 25.8, lon: 70.2 },  // Barmer
  { lat: 26.9, lon: 70.9 },  // Jaisalmer
  { lat: 30.0, lon: 73.8 },  // Sri Ganganagar
  { lat: 30.9, lon: 74.6 },  // Firozpur
  { lat: 31.6, lon: 74.8 },  // Amritsar
  { lat: 32.7, lon: 74.8 },  // Jammu
  { lat: 34.5, lon: 74.0 },  // Kargil
  { lat: 36.5, lon: 73.5 },  // Gilgit-Baltistan
];

// ─── GEOGRAPHIC PROJECTION ───────────────────────────────────────────────────

// Preserves correct relative aspect ratio of India (approx 1.077 tall/wide scale)
const project = (lat: number, lon: number) => {
  const x = 30 + ((lon - 68) / 30) * 360;
  const y = 30 + ((38 - lat) / 30) * 400;
  return { x, y };
};

const NODE_COLORS: Record<NodeType, string> = {
  "Government":   "#60a5fa",
  "Data Centre":  "#10b981",
  "University":   "#8b5cf6",
  "Hospital":     "#ec4899",
  "Edge Gateway": "#f59e0b",
  "Research Lab": "#14b8a6",
};

const STATUS_GLOWS: Record<NodeStatus, string> = {
  active:     "#10b981",
  training:   "#3b82f6",
  idle:       "#4b5563",
  failed:     "#ef4444",
  recovering: "#f59e0b",
};

const INITIAL_NODES: InfraNode[] = [
  { id: 1,  name: "NIC Delhi",             city: "New Delhi",   type: "Government",   lat: 28.6, lon: 77.2, status: "active",     cpu: 45, gpu: 50, memory: 52, bandwidth: 1240, temperature: 62, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "14d 6h", logs: ["[system] WGSL initialized", "[system] Local port open", "[system] WebGPU online"] },
  { id: 2,  name: "CtrlS Mumbai",          city: "Mumbai",      type: "Data Centre",  lat: 19.0, lon: 72.8, status: "active",     cpu: 55, gpu: 61, memory: 58, bandwidth: 2100, temperature: 64, workload: "Inference Cache",              modelVersion: "v3.2.0", trainingProgress: 0, uptime: "22d 14h", logs: ["[system] Port 443 active", "[webrtc] Connection ok", "[system] WebGPU online"] },
  { id: 3,  name: "ISRO Bangalore",        city: "Bangalore",   type: "Research Lab", lat: 12.9, lon: 77.6, status: "active",     cpu: 62, gpu: 68, memory: 61, bandwidth: 890,  temperature: 65, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "7d 2h", logs: ["[system] Target ready", "[learning] Shard verified", "[webrtc] Channel open"] },
  { id: 4,  name: "CDAC Chennai",          city: "Chennai",     type: "Data Centre",  lat: 13.1, lon: 80.3, status: "active",     cpu: 42, gpu: 38, memory: 45, bandwidth: 760,  temperature: 60, workload: "Inference Cache",              modelVersion: "v3.2.0", trainingProgress: 0, uptime: "31d 8h", logs: ["[opfs] Cache verified", "[system] Uptime confirmed", "[webrtc] Connected to Kochi"] },
  { id: 5,  name: "IIIT Hyderabad",        city: "Hyderabad",   type: "University",   lat: 17.5, lon: 78.5, status: "active",     cpu: 48, gpu: 52, memory: 50, bandwidth: 650,  temperature: 63, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "5d 20h", logs: ["[learning] Idle", "[opfs] Storage ok", "[system] Thread pool size 16"] },
  { id: 6,  name: "IIT Kharagpur",         city: "Kolkata",     type: "University",   lat: 22.6, lon: 88.4, status: "active",     cpu: 38, gpu: 32, memory: 41, bandwidth: 420,  temperature: 59, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "18d 4h", logs: ["[webrtc] Link up", "[system] Int8 Quant active", "[learning] Cache status ok"] },
  { id: 7,  name: "CoEP Pune",             city: "Pune",        type: "Research Lab", lat: 18.5, lon: 73.9, status: "idle",       cpu: 10, gpu: 6,  memory: 28, bandwidth: 380,  temperature: 52, workload: "Standby",                     modelVersion: "v3.1.9", trainingProgress: 0,   uptime: "11d 16h", logs: ["[system] Standby status", "[webrtc] Channel open", "[system] CPU temp normal"] },
  { id: 8,  name: "ADIT Ahmedabad",        city: "Ahmedabad",   type: "Edge Gateway", lat: 23.0, lon: 72.6, status: "active",     cpu: 31, gpu: 24, memory: 38, bandwidth: 290,  temperature: 55, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "9d 3h", logs: ["[system] Router config active", "[learning] Shard verified", "[system] WebGPU ok"] },
  { id: 9,  name: "MNIT Jaipur",           city: "Jaipur",      type: "University",   lat: 26.9, lon: 75.8, status: "active",     cpu: 41, gpu: 35, memory: 44, bandwidth: 340,  temperature: 58, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "6d 11h", logs: ["[system] Link online", "[webrtc] Swarm update complete", "[system] Local port open"] },
  { id: 10, name: "AIIMS Lucknow",         city: "Lucknow",     type: "Hospital",     lat: 26.8, lon: 80.9, status: "idle",       cpu: 5,  gpu: 1,  memory: 18, bandwidth: 180,  temperature: 49, workload: "Standby",                     modelVersion: "v3.1.9", trainingProgress: 0,   uptime: "4d 8h", logs: ["[system] Standby active", "[learning] Cache status clear", "[system] CPU Idle"] },
  { id: 11, name: "PEC Chandigarh",        city: "Chandigarh",  type: "University",   lat: 30.7, lon: 76.8, status: "active",     cpu: 35, gpu: 28, memory: 39, bandwidth: 410,  temperature: 57, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "3d 5h", logs: ["[system] Compiler initialized", "[webrtc] Connected to Delhi", "[opfs] Storage ok"] },
  { id: 12, name: "MHRD Bhopal",           city: "Bhopal",      type: "Government",   lat: 23.3, lon: 77.4, status: "active",     cpu: 28, gpu: 22, memory: 35, bandwidth: 260,  temperature: 54, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "8d 14h", logs: ["[system] Data query processed", "[webrtc] Shard routed", "[system] Uptime confirmed"] },
  { id: 13, name: "DRDO Hyderabad",        city: "Hyderabad",   type: "Research Lab", lat: 17.2, lon: 78.3, status: "active",     cpu: 58, gpu: 62, memory: 59, bandwidth: 720,  temperature: 63, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "2d 18h", logs: ["[system] Target ready", "[learning] Shard verified", "[system] Int8 Quant active"] },
  { id: 14, name: "IIT Guwahati",          city: "Guwahati",    type: "University",   lat: 26.2, lon: 91.7, status: "active",     cpu: 34, gpu: 28, memory: 40, bandwidth: 210,  temperature: 56, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "13d 9h", logs: ["[system] Link up", "[webrtc] Sync ok", "[learning] Cache status ok"] },
  { id: 15, name: "C-DAC Trivandrum",      city: "Trivandrum",  type: "Government",   lat: 8.5,  lon: 76.9, status: "active",     cpu: 45, gpu: 38, memory: 48, bandwidth: 310,  temperature: 59, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "17d 22h", logs: ["[opfs] Model loaded", "[system] Cache status OK", "[learning] Swarm linked"] },
  { id: 16, name: "Naval Base Vizag",      city: "Vizag",       type: "Government",   lat: 17.7, lon: 83.3, status: "active",     cpu: 51, gpu: 48, memory: 53, bandwidth: 580,  temperature: 61, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "1d 14h", logs: ["[system] Link open", "[webrtc] Dynamic sync active", "[system] Port active"] },
  { id: 17, name: "Supernovah DC",         city: "Indore",      type: "Data Centre",  lat: 22.7, lon: 75.9, status: "active",     cpu: 48, gpu: 40, memory: 46, bandwidth: 490,  temperature: 58, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "25d 6h", logs: ["[system] Host operational", "[webrtc] Client link established", "[opfs] Storage clean"] },
  { id: 18, name: "Nagpur Gateway",        city: "Nagpur",      type: "Edge Gateway", lat: 21.1, lon: 79.1, status: "active",     cpu: 25, gpu: 20, memory: 33, bandwidth: 140,  temperature: 53, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "0d 3h", logs: ["[system] Online", "[webrtc] Channel open", "[learning] Cache status ok"] },
  { id: 19, name: "SVNIT Surat",           city: "Surat",       type: "University",   lat: 21.2, lon: 72.6, status: "idle",       cpu: 4,  gpu: 1,  memory: 15, bandwidth: 120,  temperature: 47, workload: "Standby",                     modelVersion: "v3.1.9", trainingProgress: 0,   uptime: "2d 1h", logs: ["[system] Standby active", "[webrtc] Channel closed", "[system] CPU Idle"] },
  { id: 20, name: "PSG Coimbatore",        city: "Coimbatore",  type: "University",   lat: 11.0, lon: 76.9, status: "active",     cpu: 39, gpu: 31, memory: 42, bandwidth: 280,  temperature: 57, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "10d 7h", logs: ["[learning] Shard cached", "[webrtc] Connected to Kochi", "[system] Uptime confirmed"] },
  { id: 21, name: "Startup Hub Kochi",     city: "Kochi",       type: "Edge Gateway", lat: 9.9,  lon: 76.3, status: "active",     cpu: 28, gpu: 22, memory: 36, bandwidth: 190,  temperature: 54, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "7d 19h", logs: ["[system] Port operational", "[webrtc] Connected to Coimbatore", "[system] Cache hit 100%"] },
  { id: 22, name: "SOA Bhubaneswar",       city: "Bhubaneswar", type: "University",   lat: 20.3, lon: 85.8, status: "active",     cpu: 41, gpu: 38, memory: 45, bandwidth: 230,  temperature: 58, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "12d 3h", logs: ["[system] Network sync confirmed", "[learning] Shard verified", "[webrtc] Connection ok"] },
  { id: 23, name: "NIT Raipur",            city: "Raipur",      type: "Edge Gateway", lat: 21.3, lon: 81.6, status: "idle",       cpu: 6,  gpu: 2,  memory: 19, bandwidth: 150,  temperature: 50, workload: "Standby",                     modelVersion: "v3.1.9", trainingProgress: 0,   uptime: "5d 22h", logs: ["[system] Standby status", "[webrtc] Channel open", "[system] CPU temp normal"] },
  { id: 24, name: "IIIT Dehradun",         city: "Dehradun",    type: "Research Lab", lat: 30.3, lon: 78.0, status: "active",     cpu: 44, gpu: 38, memory: 48, bandwidth: 270,  temperature: 58, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "8d 11h", logs: ["[system] Host active", "[learning] Shard verified", "[webrtc] Link quality 98%"] },
  { id: 25, name: "Border Compute Shimla", city: "Shimla",      type: "Government",   lat: 31.1, lon: 77.2, status: "active",     cpu: 48, gpu: 42, memory: 47, bandwidth: 320,  temperature: 59, workload: "Standby",                     modelVersion: "v3.2.0", trainingProgress: 0, uptime: "4d 6h", logs: ["[system] WGSL success", "[webrtc] Link to Delhi established", "[learning] Loss status normal"] },
];

const INITIAL_EVENTS: StreamEvent[] = [
  { id: 1, time: "12:53:10", message: "Infrastructure online. Swarm coordinator listening on secure WS channel.", type: "success" },
  { id: 2, time: "12:52:45", message: "WebGPU pipeline checks completed successfully.", type: "info" },
  { id: 3, time: "12:51:20", message: "Node #18 initialized successfully via Rust WASM worker fallback.", type: "info" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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

const fmtTime = () => new Date().toTimeString().slice(0, 8);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function CommandCenter() {
  const [nodes, setNodes] = useState<InfraNode[]>(INITIAL_NODES);
  const [events, setEvents] = useState<StreamEvent[]>(INITIAL_EVENTS);
  const [selectedNode, setSelectedNode] = useState<InfraNode | null>(null);
  
  // Left Panel Active Tab: "overview" | "training"
  const [activeTab, setActiveTab] = useState<"overview" | "training">("training");

  // Model Upload & Configuration Form States
  const [hfModelId, setHfModelId] = useState("microsoft/bitnet-b1.58-3B");
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [quantPrecision, setQuantPrecision] = useState("1.58-bit");
  const [dpEpsilon, setDpEpsilon] = useState(0.3);
  const [swarmTarget, setSwarmTarget] = useState("all");

  // Training Swarm Simulation States
  const [trainingActive, setTrainingActive] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStepDesc, setTrainingStepDesc] = useState("");
  const [lossHistory, setLossHistory] = useState<{ epoch: number; loss: number }[]>([]);
  const [currentLoss, setCurrentLoss] = useState<number | null>(null);
  
  // Other Simulation States
  const [failureActive, setFailureActive] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [activeConsoleLog, setActiveConsoleLog] = useState<string>("SYSTEM INITIALIZED. STANDBY.");
  
  const [time, setTime] = useState(fmtTime());
  const [round, setRound] = useState(41);
  const [flows, setFlows] = useState<DataFlow[]>([]);
  const logCounter = useRef(100);
  const trainingTimer = useRef<NodeJS.Timeout | null>(null);

  // Sparkline data for node inspector
  const [sparkData, setSparkData] = useState<number[]>([30, 45, 35, 50, 42, 60, 55, 62]);

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
        const nextVal = clamp(prev[prev.length - 1] + (Math.random() - 0.5) * 12, 10, 100);
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
          cpu: n.status === "training" ? clamp(n.cpu + Math.round((Math.random() - 0.5) * 4), 70, 99) : j(n.cpu),
          gpu: n.status === "training" ? clamp(n.gpu + Math.round((Math.random() - 0.5) * 4), 75, 99) : j(n.gpu),
          memory: j(n.memory)
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
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Programmatically generate India Map SVG path data using the projection function
  const generatedMapPath = useMemo(() => {
    return "M " + INDIA_BORDER_COORDS.map(c => {
      const p = project(c.lat, c.lon);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" L ") + " Z";
  }, []);

  // ── MODEL TRAINING ORCHESTRATION ──────────────────────────────────────────

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCustomFile(e.dataTransfer.files[0]);
      setHfModelId(""); // Clear HF model if file is loaded
      setActiveConsoleLog(`[ORCHESTRATOR] Local Safetensors weights loaded: ${e.dataTransfer.files[0].name}`);
    }
  };

  const startFederatedTraining = async () => {
    if (trainingActive) return;
    setTrainingActive(true);
    setTrainingProgress(0);
    setLossHistory([]);
    setCurrentLoss(1.68);

    // Filter target nodes based on selection
    setNodes(prev => prev.map(n => {
      if (n.status === "failed") return n;
      if (swarmTarget === "all") {
        return { ...n, status: "training", trainingProgress: 0, workload: `FedAvg: ${hfModelId || customFile?.name || "Custom Model"}` };
      } else if (swarmTarget === "gov" && (n.type === "Government" || n.type === "Research Lab")) {
        return { ...n, status: "training", trainingProgress: 0, workload: `FedAvg: ${hfModelId || customFile?.name || "Custom Model"}` };
      } else if (swarmTarget === "high" && n.bandwidth >= 500) {
        return { ...n, status: "training", trainingProgress: 0, workload: `FedAvg: ${hfModelId || customFile?.name || "Custom Model"}` };
      }
      return { ...n, status: "active", trainingProgress: 0, workload: "Inference Mode" };
    }));

    const STEPS = [
      { p: 10, desc: "Quantizing weights to 1.58-bit ternary matrix..." },
      { p: 25, desc: "Injecting Laplacian noise (epsilon = 0.3) for differential privacy..." },
      { p: 40, desc: "Broadcasting gradient chunks to 18 peer nodes via WebRTC..." },
      { p: 60, desc: "Compiling local WGSL compute shaders on device GPUs..." },
      { p: 80, desc: "Beginning parallel forward-backward passes across edge swarm..." },
      { p: 100, desc: "Training actively running on the local sovereign compute swarm." }
    ];

    for (const step of STEPS) {
      setTrainingProgress(step.p);
      setTrainingStepDesc(step.desc);
      setActiveConsoleLog(`[TRAINING] ${step.desc}`);
      await new Promise(res => setTimeout(res, 1200));
    }

    // Begin active loss convergence simulation
    let currentL = 1.68;
    let epoch = 1;

    trainingTimer.current = setInterval(() => {
      currentL = Math.max(0.04, currentL - Math.random() * 0.08);
      setCurrentLoss(Number(currentL.toFixed(4)));
      setLossHistory(prev => [...prev, { epoch, loss: currentL }]);
      
      setNodes(prev => prev.map(n => {
        if (n.status === "training") {
          return {
            ...n,
            trainingProgress: Math.min(100, n.trainingProgress + 5),
            logs: [`[learning] Epoch ${epoch} Loss: ${currentL.toFixed(4)}`, ...n.logs.slice(0, 2)]
          };
        }
        return n;
      }));

      logCounter.current += 1;
      setEvents(prev => [
        { id: logCounter.current, time: fmtTime(), message: `Epoch ${epoch} converged. Loss: ${currentL.toFixed(4)}. DP bounds checked.`, type: "success" },
        ...prev.slice(0, 15)
      ]);

      setActiveConsoleLog(`[TRAINING] Epoch ${epoch} completed. Converged Loss: ${currentL.toFixed(4)}`);

      epoch += 1;
      if (currentL <= 0.05) {
        if (trainingTimer.current) clearInterval(trainingTimer.current);
        setTrainingActive(false);
        setTrainingStepDesc("Training finished. Swarm idle.");
        setActiveConsoleLog("[TRAINING] Convergence complete. Final model weights synchronized.");
        setNodes(prev => prev.map(n => n.status === "training" ? { ...n, status: "active", workload: "Inference Mode" } : n));
      }
    }, 2500);
  };

  const haltTraining = () => {
    if (trainingTimer.current) {
      clearInterval(trainingTimer.current);
    }
    setTrainingActive(false);
    setTrainingProgress(0);
    setTrainingStepDesc("Halted by administration coordinator.");
    setActiveConsoleLog("[TRAINING] Halted. Swarm released.");
    setNodes(prev => prev.map(n => n.status === "training" ? { ...n, status: "active", workload: "Standby" } : n));
  };

  // Simulate Swarm Failure & Automatic Redundancy Recovery
  const handleFailureSimulation = () => {
    if (failureActive) return;
    setFailureActive(true);
    setActiveConsoleLog("[CRITICAL] SIMULATING MULTI-NODE SWARM FAILURES...");

    setNodes(curr => {
      // Intentionally crash 5 nodes
      const targetIds = [2, 5, 11, 16, 22];
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

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (trainingTimer.current) clearInterval(trainingTimer.current);
    };
  }, []);

  // Compute stats
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
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#040508] text-zinc-200 font-sans select-none overflow-hidden">
      
      {/* ── METRIC GLOW DECORATIONS ───────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-emerald-950/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ── TOP HUD HEADER ────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-6 h-14 border-b border-white/[0.06] bg-[#07090e]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <Link href="/flock-ml" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors">
            <ArrowLeft size={14} />
            <span className="font-mono text-[9px] tracking-widest uppercase">EXIT</span>
          </Link>
          <div className="w-px h-5 bg-white/[0.08]" />
          <div className="flex items-center gap-2.5">
            <Globe size={18} className="text-blue-500 animate-pulse" />
            <div>
              <div className="text-[12px] font-bold tracking-tight text-white flex items-center gap-2">
                FLOCKML COMMAND CONSOLE
                <span className="font-mono text-[9px] bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800/30">SOVEREIGN SWARM</span>
              </div>
              <div className="font-mono text-[8px] text-zinc-500 tracking-[0.2em] uppercase">National Compute Grid Administration</div>
            </div>
          </div>
        </div>

        {/* Status indicator values */}
        <div className="hidden lg:flex items-center gap-8 font-mono text-[10px]">
          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[8px]">AGGREGATION ROUND</span>
            <span className="text-blue-400 font-bold">ROUND #{round}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[8px]">ACTIVE TRAINING LOSS</span>
            <span className="text-emerald-400 font-bold">{currentLoss !== null ? currentLoss : "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[8px]">CAPACITY RATING</span>
            <span className="text-zinc-300 font-bold">{globalStats.totalTflops} TFLOPS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-600 uppercase tracking-wider text-[8px]">UPTIME SLA</span>
            <span className="text-emerald-400 font-bold">{globalStats.systemUptime}</span>
          </div>
        </div>

        {/* Live grid status indicator */}
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
        
        {/* 1. LEFT SIDEBAR: TAB SWITCHER BETWEEN OVERVIEW AND TRAINING CONTROLLER */}
        <aside className="hidden xl:flex flex-col w-72 shrink-0 border-r border-white/[0.05] bg-[#07090e]/45 overflow-hidden">
          
          {/* Tab buttons */}
          <div className="grid grid-cols-2 border-b border-white/[0.05] h-11 shrink-0 font-mono text-[10px] tracking-wider uppercase font-bold">
            <button 
              onClick={() => setActiveTab("training")}
              className={`flex items-center justify-center gap-2 border-r border-white/[0.05] transition-colors ${
                activeTab === "training" ? "bg-white/[0.02] text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Upload size={12} />
              Deploy & Train
            </button>
            <button 
              onClick={() => setActiveTab("overview")}
              className={`flex items-center justify-center gap-2 transition-colors ${
                activeTab === "overview" ? "bg-white/[0.02] text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Sliders size={12} />
              Swarm Metrics
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700 pointer-events-none" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700 pointer-events-none" />

            {/* TAB CONTENT: MODEL DEPLOY & TRAINING CONTROLLER */}
            {activeTab === "training" && (
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-500 mb-1">CONFIGURE WORKLOAD</p>
                  <p className="text-[11px] text-zinc-500 leading-snug">Upload a Safetensors model or enter Hugging Face ID to broadcast weights to the sovereign client-mesh.</p>
                </div>

                {/* Hugging Face Repo Input */}
                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Hugging Face Repository</label>
                  <input
                    type="text"
                    disabled={trainingActive}
                    value={hfModelId}
                    onChange={e => { setHfModelId(e.target.value); setCustomFile(null); }}
                    className="w-full bg-black/40 border border-white/[0.08] px-3 py-2 text-[11px] text-zinc-300 rounded focus:border-blue-500/50 outline-none font-mono"
                    placeholder="e.g., microsoft/bitnet-b1.58-3B"
                  />
                </div>

                {/* Local Safetensors Drag and Drop */}
                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block">Or Upload Local Weights</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border border-dashed rounded p-4 text-center cursor-pointer transition-colors ${
                      dragActive ? "border-blue-500 bg-blue-950/15" : "border-white/[0.08] bg-black/20 hover:border-white/[0.15]"
                    }`}
                  >
                    <Upload size={18} className="mx-auto text-zinc-600 mb-2" />
                    <span className="font-mono text-[9px] text-zinc-500 block">Drag & Drop Model Weights</span>
                    <span className="font-mono text-[8px] text-zinc-700 block mt-0.5">(.safetensors format up to 4GB)</span>
                    
                    {customFile && (
                      <div className="mt-2.5 p-1 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] rounded truncate">
                        {customFile.name} ({(customFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantization options */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">Swarm Quantization</label>
                  <div className="grid grid-cols-2 gap-1 font-mono text-[9px]">
                    {[
                      { value: "1.58-bit", label: "1.58-bit Ternary" },
                      { value: "2-bit", label: "2-bit Quantized" },
                      { value: "4-bit", label: "4-bit Quantized" },
                      { value: "8-bit", label: "8-bit Quantized" },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        disabled={trainingActive}
                        onClick={() => setQuantPrecision(opt.value)}
                        className={`py-1.5 px-2 text-left rounded border transition-colors ${
                          quantPrecision === opt.value
                            ? "bg-blue-600 border-blue-500 text-white font-bold"
                            : "bg-black/20 border-white/[0.06] text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Differential Privacy Budget Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline font-mono text-[8px] uppercase tracking-widest text-zinc-500">
                    <span>Privacy Budget (Laplace ε)</span>
                    <span className="text-purple-400 font-bold">ε = {dpEpsilon}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    disabled={trainingActive}
                    value={dpEpsilon}
                    onChange={e => setDpEpsilon(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 bg-white/[0.06] h-1 rounded"
                  />
                  <div className="flex justify-between font-mono text-[8px] text-zinc-700">
                    <span>ε=0.1 (High Noise)</span>
                    <span>ε=2.0 (Low Noise)</span>
                  </div>
                </div>

                {/* Node Target Strategy */}
                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">Compute Swarm Target</label>
                  <div className="space-y-1.5 font-mono text-[9px]">
                    {[
                      { id: "all", label: "All Swarm Nodes (25 sites)" },
                      { id: "gov", label: "Government & Research Centers Only" },
                      { id: "high", label: "High Bandwidth Nodes Only (>= 500Mbps)" },
                    ].map(strategy => (
                      <label key={strategy.id} className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200">
                        <input
                          type="radio"
                          name="target"
                          checked={swarmTarget === strategy.id}
                          disabled={trainingActive}
                          onChange={() => setSwarmTarget(strategy.id)}
                          className="accent-blue-500"
                        />
                        <span>{strategy.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Federated Training Activation Buttons */}
                <div className="pt-2">
                  {!trainingActive ? (
                    <button
                      onClick={startFederatedTraining}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                    >
                      <Sparkles size={12} fill="currentColor" />
                      Start Swarm Training
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-blue-950/20 border border-blue-500/20 p-3 rounded font-mono text-[9px] text-blue-400 space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>AGGREGATING GRADIENTS...</span>
                          <span>{trainingProgress}%</span>
                        </div>
                        <div className="h-1 rounded bg-blue-950 overflow-hidden mt-1">
                          <motion.div 
                            className="bg-blue-500 h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${trainingProgress}%` }}
                          />
                        </div>
                        <div className="text-[8px] text-zinc-500 mt-1 truncate">{trainingStepDesc}</div>
                      </div>
                      <button
                        onClick={haltTraining}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-red-950/20 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-red-950/40 transition-all"
                      >
                        <Pause size={12} />
                        Halt Swarm Training
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SWARM METRICS OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Node count grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "Total Nodes", value: nodes.length, color: "text-zinc-300" },
                    { label: "Active Shards", value: globalStats.training, color: "text-blue-400" },
                    { label: "Swarm Active", value: globalStats.active, color: "text-emerald-400" },
                    { label: "Offline Sites", value: globalStats.failed, color: "text-red-400" },
                  ].map(s => (
                    <div key={s.label} className="p-2.5 bg-white/[0.02] border border-white/[0.04] rounded">
                      <div className="font-mono text-[8px] tracking-wider uppercase text-zinc-600">{s.label}</div>
                      <div className={`font-mono text-lg font-bold mt-0.5 ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* System stats */}
                <div className="space-y-1">
                  <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-600 mb-2">Swarm Telemetry</p>
                  <StatRow label="Avg CPU Capacity" value={`${globalStats.avgCpu}%`} accent={globalStats.avgCpu > 80 ? "text-amber-500" : "text-zinc-300"} />
                  <StatRow label="Avg GPU Capacity" value={`${globalStats.avgGpu}%`} accent="text-blue-400" />
                  <StatRow label="Avg Memory" value={`${globalStats.avgMem}%`} accent="text-purple-400" />
                  <StatRow label="Grid Bandwidth" value="12.4 Gbps" accent="text-emerald-400" />
                  <StatRow label="Avg Latency SLA" value="14ms" accent="text-emerald-400" />
                  <StatRow label="Quantization Matrix" value={`${quantPrecision} Precision`} accent="text-blue-400" />
                  <StatRow label="DP Epsilon Status" value={`ε = ${dpEpsilon}`} accent="text-purple-400" />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* 2. CENTER PANEL: GEOGRAPHICALLY ACCURATE INDIA MAP & LOSS CHART */}
        <div className="flex-1 flex flex-col border-r border-white/[0.05] relative overflow-hidden bg-[#020306]">
          {/* Tactical map background grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

          {/* Interactive Proportional Vector Map */}
          <div className="flex-1 relative flex items-center justify-center p-6">
            <svg 
              viewBox="0 0 420 500" 
              className="h-full max-h-[75vh] w-auto drop-shadow-[0_0_40px_rgba(59,130,246,0.08)] z-10"
            >
              <defs>
                <radialGradient id="mapBgGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0b1326" />
                  <stop offset="100%" stopColor="#020306" />
                </radialGradient>
                <filter id="svgGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Detailed India Boundary Outline (programmatically aligned to projected coordinates) */}
              <path 
                d={generatedMapPath} 
                fill="url(#mapBgGrad)" 
                stroke="rgba(59,130,246,0.3)" 
                strokeWidth="1.2" 
                strokeLinejoin="round" 
              />
              
              {/* Coordinates scale overlay lines */}
              <path d="M 0,100 L 420,100 M 0,200 L 420,200 M 0,300 L 420,300 M 0,400 L 420,400 M 100,0 L 100,500 M 200,0 L 200,500 M 300,0 L 300,500" 
                stroke="rgba(255,255,255,0.015)" 
                strokeWidth="0.8" 
              />

              {/* Glowing vector paths for local gradient routing */}
              {flows.map(flow => {
                const fNode = nodes.find(n => n.id === flow.from);
                const tNode = nodes.find(n => n.id === flow.to);
                if (!fNode || !tNode) return null;
                
                const start = project(fNode.lat, fNode.lon);
                const end = project(tNode.lat, tNode.lon);

                return (
                  <g key={flow.id}>
                    <motion.line 
                      x1={start.x} y1={start.y} 
                      x2={end.x} y2={end.y} 
                      stroke="rgba(59,130,246,0.22)" 
                      strokeWidth="0.8" 
                      strokeDasharray="4 6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0] }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                    <motion.circle
                      r="1.8"
                      fill="#60a5fa"
                      filter="url(#svgGlow)"
                      initial={{ cx: start.x, cy: start.y, opacity: 0 }}
                      animate={{ cx: [start.x, end.x], cy: [start.y, end.y], opacity: [0, 1, 0] }}
                      transition={{ duration: 2.2, ease: "linear" }}
                    />
                  </g>
                );
              })}

              {/* Geographic Nodes (Perfect alignment matching coastlines/borders) */}
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
                      setSparkData([25, 45, 30, 52, 48, 65, 58, node.cpu]);
                    }}
                  >
                    {/* Pulsing visual cues for active compute nodes */}
                    {isSwarmed && (
                      <motion.circle
                        cx={x} cy={y}
                        r={4}
                        fill="none"
                        stroke={statusGlow}
                        strokeWidth="0.8"
                        initial={{ r: 3, opacity: 0.8 }}
                        animate={{ r: 10, opacity: 0 }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: (node.id * 0.15) % 2.5
                        }}
                      />
                    )}

                    {/* Selection highlight ring */}
                    {isSelected && (
                      <circle cx={x} cy={y} r={7.5} fill="none" stroke="#ffffff" strokeWidth="0.8" className="animate-pulse" />
                    )}

                    {/* Base Node Point */}
                    <circle
                      cx={x} cy={y}
                      r={node.status === "failed" ? 2 : 2.5}
                      fill={node.status === "failed" ? "#ef4444" : color}
                      opacity={node.status === "idle" ? 0.35 : 1}
                      filter={isSwarmed ? "url(#svgGlow)" : undefined}
                    />

                    {/* Status Dot */}
                    <circle cx={x + 2.5} cy={y - 2.5} r={0.8} fill={statusGlow} />

                    {/* Text Label on hover */}
                    <text
                      x={x + 6} y={y + 2}
                      fill="#a1a1aa"
                      fontSize="4.5"
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

            {/* Simulated Critical swarming alerts overlay */}
            <AnimatePresence>
              {failureActive && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-950/70 border border-red-500/40 px-4 py-2 rounded flex items-center gap-2.5 z-20 backdrop-blur"
                >
                  <AlertTriangle size={14} className="text-red-400 animate-bounce" />
                  <span className="font-mono text-[9px] text-red-300 font-bold tracking-widest">
                    SWARM FAILURE ALERT: 5 CODES DISCONNECTED. SCHEDULER RE-ROUTING...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LOWER SECTION: LOSS CONVERGENCE REAL-TIME CHART (ONLY VISIBLE ON ACTIVE TRAINING) */}
          <AnimatePresence>
            {lossHistory.length > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 110, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="shrink-0 border-t border-white/[0.05] bg-[#07090e]/70 p-4 font-mono z-10 flex flex-col"
              >
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Federated Swarm Loss Curve</span>
                  <span className="text-[9px] text-emerald-400">Current Epoch: #{lossHistory.length} · Convergence Target: 0.05</span>
                </div>
                {/* Simulated Chart Container */}
                <div className="flex-1 bg-black/40 border border-white/[0.03] p-1.5 rounded relative">
                  <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
                    {/* Grid lines inside chart */}
                    <line x1="0" y1="15" x2="400" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    <line x1="0" y1="45" x2="400" y2="45" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    {/* Line Plot */}
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      points={lossHistory.map((h, idx) => {
                        const xPos = (idx / Math.max(1, lossHistory.length - 1)) * 400;
                        const yPos = 55 - (h.loss / 1.7) * 45;
                        return `${xPos},${yPos}`;
                      }).join(" ")}
                    />
                    {/* Plot coordinates pointers */}
                    {lossHistory.map((h, idx) => {
                      if (idx % Math.max(1, Math.round(lossHistory.length / 5)) !== 0 && idx !== lossHistory.length - 1) return null;
                      const xPos = (idx / Math.max(1, lossHistory.length - 1)) * 400;
                      const yPos = 55 - (h.loss / 1.7) * 45;
                      return (
                        <g key={idx}>
                          <circle cx={xPos} cy={yPos} r="2.5" fill="#10b981" />
                          <text x={xPos + 4} y={yPos - 2} fill="#71717a" fontSize="5" fontFamily="monospace">
                            L:{h.loss.toFixed(2)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. RIGHT SIDEBAR: SWARM NODE INSPECTOR & REAL-TIME EVENT STREAM */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-[#07090e]/40 overflow-hidden">
          
          {/* Swarm Node Inspector */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-white/[0.05] p-4 relative bg-[#07090e]/40">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700 pointer-events-none" />
            
            <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Swarm Inspector</p>
            
            {selectedNode ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Inspector Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-white leading-tight">{selectedNode.name}</span>
                    <span 
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded border font-bold"
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

                {/* Progress parameters and sparkline load charts */}
                <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                  {[
                    { label: "CPU Compute Load", val: selectedNode.cpu, color: selectedNode.cpu > 80 ? "bg-amber-500" : "bg-emerald-500" },
                    { label: "WebGPU Capacity", val: selectedNode.gpu, color: "bg-blue-500" },
                    { label: "WASM Heap Memory", val: selectedNode.memory, color: "bg-purple-500" },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between mb-1">
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

                  {/* Node Load Sparkline */}
                  <div className="mt-4 pt-4 border-t border-white/[0.04]">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-[8px] text-zinc-500 uppercase">SWARM TELEMETRY CHARTS</span>
                      <span className="font-mono text-[8px] text-emerald-400 font-bold">GRID SYNC</span>
                    </div>
                    {/* SVG Sparkline */}
                    <div className="h-12 bg-black/40 border border-white/[0.03] p-1.5 rounded">
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

                  <div className="pt-2">
                    <StatRow label="QUANTIZATION TYPE" value="1.58-Bit Ternary" accent="text-blue-400" />
                    <StatRow label="LOCAL WEB STORAGE" value="OPFS Swarm Cache" />
                    <StatRow label="BANDWIDTH ASSIGNED" value={`${selectedNode.bandwidth} Mbps`} />
                    <StatRow label="CORE TEMP" value={`${selectedNode.temperature}°C`} accent={selectedNode.temperature > 75 ? "text-amber-500" : "text-zinc-300"} />
                    <StatRow label="RUNTIME UPTIME" value={selectedNode.uptime} />
                  </div>

                  {/* Node logs output */}
                  <div className="pt-3 border-t border-white/[0.04]">
                    <span className="font-mono text-[8px] text-zinc-500 uppercase block mb-1.5 font-bold">Node runtime logstream</span>
                    <div className="font-mono text-[9px] bg-black/40 border border-white/[0.03] p-2 rounded text-zinc-400 space-y-1.5">
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
                <p className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Inspect Swarm coordinate</p>
                <p className="font-mono text-[8px] text-zinc-600 mt-1 max-w-xs leading-normal">
                  Select any active compute point on the India map to inspect local GPU workload and Node.js worker logs.
                </p>
              </div>
            )}
          </div>

          {/* Real-time Infrastructure feed */}
          <div className="h-60 shrink-0 flex flex-col p-4 bg-[#07090e]/60">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-500">Live Infrastructure Feed</span>
              <span className="font-mono text-[8.5px] text-emerald-500 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                STREAM
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pt-2.5 pr-1">
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
          <span className="uppercase text-[9px] tracking-wider text-zinc-600">CLI STATUS TUBE:</span>
          <span className="text-zinc-400 font-bold">{activeConsoleLog}</span>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-zinc-600">
          <span>LATENCY: 14MS</span>
          <span>DP BUDGET: ε = {dpEpsilon}</span>
          <span>QUANTIZATION Precision: {quantPrecision}</span>
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
