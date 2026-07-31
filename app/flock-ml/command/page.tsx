"use client";
// Security: Purely client-side simulated dashboard. No user input used in DOM manipulation.
// All data from internal typed constants — XSS risk nil.
// TODO(security): When connecting real backend, validate API responses server-side and
// enforce auth via HttpOnly cookies before rendering sensitive infrastructure data.

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, X, Play, AlertTriangle, CheckCircle, Shield, Activity } from "lucide-react";

type NodeStatus = "active" | "idle" | "failed" | "recovering" | "training";
type NodeType   = "Government" | "Data Centre" | "University" | "Hospital" | "Edge Gateway" | "Research Lab";

interface InfraNode {
  id: number; name: string; city: string; type: NodeType;
  lat: number; lon: number; status: NodeStatus;
  cpu: number; gpu: number; memory: number; bandwidth: number;
  temperature: number; workload: string; modelVersion: string;
  trainingProgress: number; uptime: string;
}
interface StreamEvent { id: number; time: string; message: string; type: "info"|"success"|"warning"|"error"; }
interface DataFlow    { id: string; from: number; to: number; }

const INITIAL_NODES: InfraNode[] = [
  { id:1,  name:"NIC Delhi",             city:"New Delhi",   type:"Government",   lat:28.6, lon:77.2, status:"training",   cpu:87,gpu:92,memory:78,bandwidth:1240,temperature:72,workload:"Federated Training v3.2",    modelVersion:"v3.2.1",trainingProgress:67,  uptime:"14d 6h"  },
  { id:2,  name:"CtrlS Mumbai",          city:"Mumbai",      type:"Data Centre",  lat:19.1, lon:72.8, status:"active",     cpu:65,gpu:71,memory:58,bandwidth:2100,temperature:68,workload:"Inference Pipeline",          modelVersion:"v3.2.0",trainingProgress:100, uptime:"22d 14h" },
  { id:3,  name:"ISRO Bangalore",        city:"Bangalore",   type:"Research Lab", lat:12.9, lon:77.6, status:"training",   cpu:94,gpu:98,memory:88,bandwidth:890, temperature:79,workload:"Satellite Imagery Model",    modelVersion:"v3.2.1",trainingProgress:43,  uptime:"7d 2h"   },
  { id:4,  name:"CDAC Chennai",          city:"Chennai",     type:"Data Centre",  lat:13.1, lon:80.3, status:"active",     cpu:51,gpu:44,memory:62,bandwidth:760, temperature:65,workload:"NLP Tamil Corpus",            modelVersion:"v3.2.0",trainingProgress:100, uptime:"31d 8h"  },
  { id:5,  name:"IIIT Hyderabad",        city:"Hyderabad",   type:"University",   lat:17.5, lon:78.5, status:"training",   cpu:78,gpu:83,memory:71,bandwidth:650, temperature:74,workload:"Vision Transformer",          modelVersion:"v3.2.1",trainingProgress:81,  uptime:"5d 20h"  },
  { id:6,  name:"IIT Kharagpur",         city:"Kolkata",     type:"University",   lat:22.6, lon:88.4, status:"active",     cpu:43,gpu:38,memory:55,bandwidth:420, temperature:61,workload:"Gradient Aggregation",        modelVersion:"v3.2.0",trainingProgress:100, uptime:"18d 4h"  },
  { id:7,  name:"CoEP Pune",             city:"Pune",        type:"Research Lab", lat:18.5, lon:73.9, status:"idle",       cpu:12,gpu:8, memory:31,bandwidth:380, temperature:54,workload:"Standby",                    modelVersion:"v3.1.9",trainingProgress:0,   uptime:"11d 16h" },
  { id:8,  name:"ADIT Ahmedabad",        city:"Ahmedabad",   type:"Edge Gateway", lat:23.0, lon:72.6, status:"active",     cpu:38,gpu:29,memory:44,bandwidth:290, temperature:58,workload:"Gradient Aggregation",        modelVersion:"v3.2.0",trainingProgress:100, uptime:"9d 3h"   },
  { id:9,  name:"MNIT Jaipur",           city:"Jaipur",      type:"University",   lat:26.9, lon:75.8, status:"active",     cpu:55,gpu:61,memory:48,bandwidth:340, temperature:63,workload:"Federated Round 41",          modelVersion:"v3.2.0",trainingProgress:100, uptime:"6d 11h"  },
  { id:10, name:"AIIMS Lucknow",         city:"Lucknow",     type:"Hospital",     lat:26.8, lon:80.9, status:"idle",       cpu:8, gpu:3, memory:22,bandwidth:180, temperature:51,workload:"Standby",                    modelVersion:"v3.1.9",trainingProgress:0,   uptime:"4d 8h"   },
  { id:11, name:"PEC Chandigarh",        city:"Chandigarh",  type:"University",   lat:30.7, lon:76.8, status:"training",   cpu:71,gpu:67,memory:65,bandwidth:410, temperature:68,workload:"Language Model v3",           modelVersion:"v3.2.1",trainingProgress:29,  uptime:"3d 5h"   },
  { id:12, name:"MHRD Bhopal",           city:"Bhopal",      type:"Government",   lat:23.3, lon:77.4, status:"active",     cpu:34,gpu:28,memory:41,bandwidth:260, temperature:57,workload:"Policy Analytics",            modelVersion:"v3.2.0",trainingProgress:100, uptime:"8d 14h"  },
  { id:13, name:"DRDO Hyderabad",        city:"Hyderabad",   type:"Research Lab", lat:17.2, lon:78.3, status:"training",   cpu:91,gpu:95,memory:84,bandwidth:720, temperature:77,workload:"Defense Vision Model",         modelVersion:"v3.2.1",trainingProgress:55,  uptime:"2d 18h"  },
  { id:14, name:"IIT Guwahati",          city:"Guwahati",    type:"University",   lat:26.2, lon:91.7, status:"active",     cpu:47,gpu:41,memory:53,bandwidth:210, temperature:60,workload:"NER Northeast Languages",      modelVersion:"v3.2.0",trainingProgress:100, uptime:"13d 9h"  },
  { id:15, name:"C-DAC Trivandrum",      city:"Trivandrum",  type:"Government",   lat:8.5,  lon:76.9, status:"active",     cpu:62,gpu:58,memory:67,bandwidth:310, temperature:66,workload:"Malayalam NLP",               modelVersion:"v3.2.0",trainingProgress:100, uptime:"17d 22h" },
  { id:16, name:"Naval Base Vizag",      city:"Vizag",       type:"Government",   lat:17.7, lon:83.3, status:"training",   cpu:82,gpu:88,memory:74,bandwidth:580, temperature:73,workload:"Maritime Surveillance",        modelVersion:"v3.2.1",trainingProgress:72,  uptime:"1d 14h"  },
  { id:17, name:"Supernovah DC",         city:"Indore",      type:"Data Centre",  lat:22.7, lon:75.9, status:"active",     cpu:58,gpu:52,memory:61,bandwidth:490, temperature:64,workload:"Model Serving",               modelVersion:"v3.2.0",trainingProgress:100, uptime:"25d 6h"  },
  { id:18, name:"Nagpur Gateway",        city:"Nagpur",      type:"Edge Gateway", lat:21.1, lon:79.1, status:"recovering", cpu:22,gpu:18,memory:35,bandwidth:140, temperature:55,workload:"Recovery in Progress",        modelVersion:"v3.1.9",trainingProgress:15,  uptime:"0d 3h"   },
  { id:19, name:"SVNIT Surat",           city:"Surat",       type:"University",   lat:21.2, lon:72.6, status:"idle",       cpu:5, gpu:2, memory:18,bandwidth:120, temperature:49,workload:"Standby",                    modelVersion:"v3.1.9",trainingProgress:0,   uptime:"2d 1h"   },
  { id:20, name:"PSG Coimbatore",        city:"Coimbatore",  type:"University",   lat:11.0, lon:76.9, status:"active",     cpu:44,gpu:39,memory:50,bandwidth:280, temperature:62,workload:"Tamil ASR Model",             modelVersion:"v3.2.0",trainingProgress:100, uptime:"10d 7h"  },
  { id:21, name:"Startup Hub Kochi",     city:"Kochi",       type:"Edge Gateway", lat:9.9,  lon:76.3, status:"active",     cpu:33,gpu:27,memory:42,bandwidth:190, temperature:58,workload:"Inference Cache",             modelVersion:"v3.2.0",trainingProgress:100, uptime:"7d 19h"  },
  { id:22, name:"SOA Bhubaneswar",       city:"Bhubaneswar", type:"University",   lat:20.3, lon:85.8, status:"active",     cpu:49,gpu:44,memory:56,bandwidth:230, temperature:61,workload:"Odia Language Model",          modelVersion:"v3.2.0",trainingProgress:100, uptime:"12d 3h"  },
  { id:23, name:"NIT Raipur",            city:"Raipur",      type:"Edge Gateway", lat:21.3, lon:81.6, status:"idle",       cpu:7, gpu:4, memory:20,bandwidth:150, temperature:52,workload:"Standby",                    modelVersion:"v3.1.9",trainingProgress:0,   uptime:"5d 22h"  },
  { id:24, name:"IIIT Dehradun",         city:"Dehradun",    type:"Research Lab", lat:30.3, lon:78.0, status:"active",     cpu:52,gpu:47,memory:59,bandwidth:270, temperature:63,workload:"Hindi NLP",                   modelVersion:"v3.2.0",trainingProgress:100, uptime:"8d 11h"  },
  { id:25, name:"Border Compute Shimla", city:"Shimla",      type:"Government",   lat:31.1, lon:77.2, status:"training",   cpu:76,gpu:72,memory:68,bandwidth:320, temperature:67,workload:"Edge Intelligence",            modelVersion:"v3.2.1",trainingProgress:38,  uptime:"4d 6h"   },
];

const INITIAL_EVENTS: StreamEvent[] = [
  { id:1,  time:"09:41:22", message:"WebGPU kernels compiled on Node #3 (ISRO Bangalore)",         type:"info"    },
  { id:2,  time:"09:41:19", message:"Gradient aggregation round 41 complete — FedAvg converged",   type:"success" },
  { id:3,  time:"09:41:15", message:"Node #18 (Nagpur Gateway) recovering after network timeout",  type:"warning" },
  { id:4,  time:"09:41:12", message:"Model v3.2.1 shard distributed to 18 workers",               type:"info"    },
  { id:5,  time:"09:41:08", message:"Scheduler migrated workload from Node #23 to Node #12",      type:"warning" },
  { id:6,  time:"09:41:04", message:"New training job submitted — NIC New Delhi",                 type:"info"    },
  { id:7,  time:"09:40:59", message:"Node #14 (IIT Guwahati) rejoined swarm",                    type:"success" },
  { id:8,  time:"09:40:55", message:"Differential privacy (epsilon=0.3) applied to gradient",    type:"info"    },
  { id:9,  time:"09:40:51", message:"Node #16 (Naval Vizag) running WGSL compute shaders",       type:"info"    },
  { id:10, time:"09:40:47", message:"FedAvg computed across 22 nodes — loss 0.0412",             type:"success" },
];

const DEPLOY_STEPS = [
  { step:1, title:"Package Model",          desc:"Serializing weights to Safetensors format",                 duration:1200 },
  { step:2, title:"Chunk Model",            desc:"Splitting into 128 MB gradient shards",                    duration:900  },
  { step:3, title:"Compress Weights",       desc:"BitNet 1.58-bit quantization — 80% VRAM reduction",       duration:1500 },
  { step:4, title:"Select Nodes",           desc:"Scheduler evaluating 25 candidates — 18 selected",        duration:800  },
  { step:5, title:"Spawn WASM Workers",     desc:"Initializing Rust/WASM runtime on each node",             duration:1100 },
  { step:6, title:"Initialize WebGPU",     desc:"Compiling WGSL compute shaders on device GPUs",           duration:1400 },
  { step:7, title:"Begin Training",         desc:"Local forward/backward pass on all 18 nodes in parallel", duration:2200 },
  { step:8, title:"Federated Aggregation",  desc:"FedAvg across 18 gradient vectors with DP noise",         duration:1300 },
  { step:9, title:"Publish Global Model",   desc:"Model v3.2.2 committed to distributed registry",          duration:700  },
];

const TIMELINE = [
  { time:"09:41:02", label:"Submitted",  done:true,  active:false },
  { time:"09:41:04", label:"Chunking",   done:true,  active:false },
  { time:"09:41:07", label:"Compressed", done:true,  active:false },
  { time:"09:41:12", label:"18 nodes",   done:true,  active:false },
  { time:"09:41:15", label:"WASM init",  done:true,  active:false },
  { time:"09:41:19", label:"WebGPU",     done:false, active:true  },
  { time:"09:41:24", label:"Training",   done:false, active:false },
  { time:"09:41:45", label:"FedAvg",     done:false, active:false },
  { time:"09:42:10", label:"v3.2.2",     done:false, active:false },
];

const NODE_COLOR: Record<NodeType, string> = {
  "Government":"#93c5fd","Data Centre":"#6ee7b7","University":"#c4b5fd",
  "Hospital":"#f9a8d4","Edge Gateway":"#fdba74","Research Lab":"#fde68a",
};
const STATUS_GLOW: Record<NodeStatus, string> = {
  active:"#34d399",training:"#60a5fa",idle:"#374151",failed:"#f87171",recovering:"#fb923c",
};
const EV_COLOR: Record<string,string> = {
  info:"#52525b",success:"#34d399",warning:"#fb923c",error:"#f87171",
};

const project = (lat: number, lon: number) => ({
  x: ((lon - 67) / 32) * 276 + 12,
  y: ((37.5 - lat) / 30) * 370 + 15,
});
const fmtTime = () => new Date().toTimeString().slice(0,8);
const clamp   = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Approximate India outline — clockwise from NW Kashmir, coordinates via project()
const INDIA_D = "M63,33 L78,57 L95,80 L122,93 L122,112 L182,126 L199,128 L268,131 L243,156 L232,198 L216,205 L191,205 L183,217 L183,232 L149,258 L126,292 L124,315 L105,347 L100,376 L95,371 L87,337 L79,318 L69,285 L64,267 L61,241 L61,218 L54,205 L27,202 L37,181 L37,131 L63,93 Z";

function StatRow({ label, value, sub, accent }: { label:string; value:string|number; sub?:string; accent?:string }) {
  return (
    <div className="flex items-baseline justify-between py-[6px] border-b border-white/[0.04]">
      <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-zinc-700">{label}</span>
      <div className="text-right">
        <span className={`font-mono text-[11px] font-semibold ${accent ?? "text-zinc-300"}`}>{value}</span>
        {sub && <span className="font-mono text-[9px] text-zinc-700 ml-1">{sub}</span>}
      </div>
    </div>
  );
}

function MiniBar({ value, color="#34d399" }: { value:number; color?:string }) {
  return (
    <div className="h-[2px] rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
      <motion.div className="h-full rounded-full"
        initial={{ width:0 }} animate={{ width:`${value}%` }}
        transition={{ duration:0.8, ease:"easeOut" }} style={{ background:color }} />
    </div>
  );
}

export default function CommandCenter() {
  const [nodes,          setNodes         ] = useState<InfraNode[]>(INITIAL_NODES);
  const [events,         setEvents        ] = useState<StreamEvent[]>(INITIAL_EVENTS);
  const [selectedNode,   setSelectedNode  ] = useState<InfraNode|null>(null);
  const [deployStep,     setDeployStep    ] = useState(-1);
  const [showDeploy,     setShowDeploy    ] = useState(false);
  const [failureActive,  setFailureActive ] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [clock,          setClock         ] = useState(fmtTime);
  const [dataFlows,      setDataFlows     ] = useState<DataFlow[]>([]);
  const [aggRound,       setAggRound      ] = useState(41);
  const evId = useRef(200);

  // Live clock
  useEffect(() => { const t = setInterval(() => setClock(fmtTime()), 1000); return () => clearInterval(t); }, []);

  // Jitter metrics — makes dashboard feel alive
  useEffect(() => {
    const t = setInterval(() => {
      setNodes(prev => prev.map(n => {
        if (n.status === "idle" || n.status === "failed") return n;
        const j = (v:number, lo=5, hi=99) => Math.round(clamp(v + (Math.random()-.5)*5, lo, hi));
        return { ...n, cpu:j(n.cpu), gpu:j(n.gpu), memory:j(n.memory,10,95),
          trainingProgress: n.status==="training" ? Math.min(100, n.trainingProgress + Math.random()*.4) : n.trainingProgress };
      }));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  // Live event stream
  useEffect(() => {
    const POOL = [
      { m:"Gradient shard received from Node #%n% — L2 norm verified",       t:"info"    as const },
      { m:"Node #%n% completed training epoch — loss improved",              t:"success" as const },
      { m:"Federated aggregation round %a% initiated across 22 nodes",      t:"info"    as const },
      { m:"Differential privacy noise applied — privacy budget maintained",  t:"info"    as const },
      { m:"Scheduler rebalanced workload — latency improved by 12%%",        t:"success" as const },
      { m:"Node #%n% WGSL shader compiled and verified",                    t:"info"    as const },
      { m:"Model shard checksum verified on Node #%n% (SHA-256 match)",     t:"success" as const },
      { m:"OPFS cache hit on Node #%n% — model reload skipped",             t:"info"    as const },
      { m:"WebRTC DataChannel established between Node #%n% and Node #%n2%", t:"info"    as const },
    ];
    const t = setInterval(() => {
      const tpl = POOL[Math.floor(Math.random()*POOL.length)];
      const msg = tpl.m
        .replace(/%n%/g,  String(Math.floor(Math.random()*25)+1))
        .replace(/%n2%/g, String(Math.floor(Math.random()*25)+1))
        .replace(/%a%/g,  String(aggRound));
      evId.current += 1;
      setEvents(prev => [{ id:evId.current, time:fmtTime(), message:msg, type:tpl.t }, ...prev.slice(0,29)]);
    }, 4500);
    return () => clearInterval(t);
  }, [aggRound]);

  // Aggregation round counter
  useEffect(() => { const t = setInterval(() => setAggRound(r=>r+1), 28000); return () => clearInterval(t); }, []);

  // Data flow particles between active nodes
  useEffect(() => {
    const t = setInterval(() => {
      setNodes(curr => {
        const live = curr.filter(n=>n.status==="active"||n.status==="training");
        if (live.length<2) return curr;
        const from = live[Math.floor(Math.random()*live.length)];
        const to   = live[Math.floor(Math.random()*live.length)];
        if (from.id===to.id) return curr;
        const fid = `${from.id}-${to.id}-${Date.now()}`;
        setDataFlows(prev=>[...prev.slice(-5),{id:fid,from:from.id,to:to.id}]);
        setTimeout(()=>setDataFlows(prev=>prev.filter(f=>f.id!==fid)), 2800);
        return curr;
      });
    }, 2800);
    return () => clearInterval(t);
  }, []);

  // Deploy — sequential steps with actual delays
  const handleDeploy = useCallback(async () => {
    setShowDeploy(true);
    for (let i=0; i<DEPLOY_STEPS.length; i++) {
      setDeployStep(i);
      await new Promise(r=>setTimeout(r, DEPLOY_STEPS[i].duration));
      evId.current += 1;
      setEvents(prev=>[{ id:evId.current, time:fmtTime(),
        message:`Orchestration step ${i+1}/${DEPLOY_STEPS.length}: ${DEPLOY_STEPS[i].title} — complete`,
        type:"success" }, ...prev.slice(0,29)]);
    }
    setDeployStep(DEPLOY_STEPS.length);
  }, []);

  // Failure simulation — 20% nodes fail, scheduler recovers
  const handleFailure = useCallback(() => {
    if (failureActive) return;
    setFailureActive(true);
    setNodes(curr => {
      const aIds = curr.filter(n=>n.status==="active"||n.status==="training").map(n=>n.id);
      const fIds = aIds.sort(()=>Math.random()-.5).slice(0,5);
      setNodes(prev=>prev.map(n=>fIds.includes(n.id)?{...n,status:"failed" as NodeStatus,cpu:0,gpu:0}:n));
      fIds.forEach(id=>{
        evId.current+=1;
        setEvents(prev=>[{id:evId.current,time:fmtTime(),
          message:`ALERT: Node #${id} disconnected — network partition detected`,type:"error"},...prev.slice(0,29)]);
      });
      setTimeout(()=>{
        evId.current+=1;
        setEvents(prev=>[{id:evId.current,time:fmtTime(),
          message:"Scheduler detected 5 failures — initiating workload migration to surviving nodes",type:"warning"},...prev.slice(0,29)]);
      },2000);
      setTimeout(()=>{
        setNodes(prev=>prev.map(n=>fIds.includes(n.id)?{...n,status:"recovering" as NodeStatus,cpu:12,gpu:9}:n));
        evId.current+=1;
        setEvents(prev=>[{id:evId.current,time:fmtTime(),
          message:"Recovery protocol initiated — 5 nodes rejoining swarm via WASM restart",type:"info"},...prev.slice(0,29)]);
      },5000);
      setTimeout(()=>{
        setNodes(prev=>prev.map(n=>fIds.includes(n.id)
          ?{...n,status:"active" as NodeStatus,cpu:35+Math.floor(Math.random()*30),gpu:30+Math.floor(Math.random()*25)}:n));
        evId.current+=1;
        setEvents(prev=>[{id:evId.current,time:fmtTime(),
          message:"All 5 nodes fully recovered — training resumed. Zero gradient loss.",type:"success"},...prev.slice(0,29)]);
        setFailureActive(false);
      },13000);
      return curr;
    });
  }, [failureActive]);

  // Aggregate stats
  const stats = useMemo(() => {
    const active    = nodes.filter(n=>n.status==="active").length;
    const training  = nodes.filter(n=>n.status==="training").length;
    const idle      = nodes.filter(n=>n.status==="idle").length;
    const failed    = nodes.filter(n=>n.status==="failed").length;
    const recovering= nodes.filter(n=>n.status==="recovering").length;
    const healthy   = nodes.filter(n=>n.status!=="failed"&&n.status!=="idle");
    const avgCpu    = Math.round(healthy.reduce((s,n)=>s+n.cpu,0)/(healthy.length||1));
    const avgGpu    = Math.round(healthy.reduce((s,n)=>s+n.gpu,0)/(healthy.length||1));
    const avgMem    = Math.round(healthy.reduce((s,n)=>s+n.memory,0)/(healthy.length||1));
    const totalBw   = nodes.reduce((s,n)=>s+n.bandwidth,0);
    const health    = Math.round(((nodes.length-failed)/nodes.length)*100);
    return { active, training, idle, failed, recovering, avgCpu, avgGpu, avgMem, totalBw, health };
  }, [nodes]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden select-none"
      style={{ background:"#06080c", fontFamily:"'SF Pro Display','Inter',system-ui,sans-serif" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-5 h-12 border-b border-white/[0.06] z-10"
        style={{ background:"rgba(6,8,12,0.97)", backdropFilter:"blur(20px)" }}>
        <div className="flex items-center gap-4">
          <Link href="/flock-ml" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 transition-colors">
            <ArrowLeft size={13}/>
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase">FlockML</span>
          </Link>
          <div className="w-px h-4 bg-white/[0.07]"/>
          <div>
            <div className="font-mono text-[8px] tracking-[0.35em] uppercase text-zinc-600 leading-none">FlockML</div>
            <div className="text-[12px] font-semibold text-zinc-200 tracking-tight leading-none mt-[3px]">
              Sovereign Compute Command Center
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-5">
          {([
            { label:"Active Nodes",   value:`${stats.active+stats.training}/${nodes.length}`, color:"#34d399" },
            { label:"Available CPU",  value:`${100-stats.avgCpu}%`,                            color:"#e5e7eb" },
            { label:"Available GPU",  value:`${100-stats.avgGpu}%`,                            color:"#60a5fa" },
            { label:"Network Health", value:`${stats.health}%`,                                color:stats.health>90?"#34d399":"#fb923c" },
            { label:"AI Workloads",   value:`${stats.training}`,                               color:"#60a5fa" },
            { label:"Throughput",     value:`${(stats.totalBw/1000).toFixed(1)} Gbps`,         color:"#c4b5fd" },
          ] as const).map(m=>(
            <div key={m.label} className="text-center">
              <div className="font-mono text-[8px] tracking-[0.18em] uppercase text-zinc-700">{m.label}</div>
              <div className="font-mono text-[13px] font-bold leading-none mt-[3px]" style={{color:m.color}}>{m.value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="font-mono text-[8px] tracking-[0.18em] uppercase text-zinc-700">IST</div>
            <div className="font-mono text-[13px] font-bold text-white leading-none mt-[3px]">{clock}</div>
          </div>
          <div className="flex items-center gap-1.5 border border-emerald-500/30 px-2 py-1">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{opacity:[1,0.3,1]}} transition={{duration:1.5,repeat:Infinity}}/>
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-emerald-500">Live</span>
          </div>
        </div>
      </header>

      {/* ── BODY ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT PANEL */}
        <aside className="hidden xl:flex flex-col w-56 shrink-0 border-r border-white/[0.05] overflow-y-auto"
          style={{background:"rgba(255,255,255,0.008)"}}>
          <div className="p-4">
            <p className="font-mono text-[8px] tracking-[0.35em] uppercase text-zinc-700 mb-3">Infrastructure Overview</p>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {[
                {label:"Total",      value:nodes.length,     color:"text-zinc-300"   },
                {label:"Training",   value:stats.training,   color:"text-blue-400"   },
                {label:"Active",     value:stats.active,     color:"text-emerald-400"},
                {label:"Idle",       value:stats.idle,       color:"text-zinc-600"   },
                {label:"Recovering", value:stats.recovering, color:"text-amber-400"  },
                {label:"Failed",     value:stats.failed,     color:"text-red-400"    },
              ].map(s=>(
                <div key={s.label} className="p-2" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)"}}>
                  <div className="font-mono text-[8px] tracking-widest uppercase text-zinc-700">{s.label}</div>
                  <div className={`font-mono text-[20px] font-bold leading-none mt-1 ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
            <div>
              <StatRow label="Avg CPU"         value={`${stats.avgCpu}%`}  accent={stats.avgCpu>80?"text-amber-400":"text-zinc-300"}/>
              <StatRow label="Avg GPU"         value={`${stats.avgGpu}%`}  accent="text-blue-400"/>
              <StatRow label="Avg Memory"      value={`${stats.avgMem}%`}  accent="text-purple-400"/>
              <StatRow label="Training Jobs"   value={stats.training}/>
              <StatRow label="Inference Jobs"  value={stats.active}/>
              <StatRow label="Throughput"      value={`${(stats.totalBw/1000).toFixed(1)}`} sub="Gbps" accent="text-emerald-400"/>
              <StatRow label="Avg Latency"     value="14ms" accent="text-emerald-400"/>
              <StatRow label="Fault Tolerance" value="Active" accent="text-emerald-400"/>
              <StatRow label="Privacy (DP)"    value="Active" accent="text-purple-400"/>
              <StatRow label="Quantization"    value="1.58-bit" accent="text-blue-400"/>
              <StatRow label="Scheduler"       value="Healthy" accent="text-emerald-400"/>
              <StatRow label="Model Version"   value="v3.2.1"/>
              <StatRow label="Agg. Round"      value={`#${aggRound}`}/>
            </div>
            <div className="mt-5">
              <p className="font-mono text-[8px] tracking-[0.35em] uppercase text-zinc-700 mb-2.5">Node Types</p>
              <div className="space-y-1.5">
                {(Object.entries(NODE_COLOR) as [NodeType,string][]).map(([type,color])=>(
                  <div key={type} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:color}}/>
                    <span className="font-mono text-[9px] text-zinc-600">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 300 410" className="h-full w-auto" style={{maxWidth:"100%"}}>
                <defs>
                  <pattern id="ccgrid" width="18" height="18" patternUnits="userSpaceOnUse">
                    <path d="M18 0L0 0 0 18" fill="none" stroke="rgba(255,255,255,0.022)" strokeWidth="0.5"/>
                  </pattern>
                  <radialGradient id="ccbg" cx="50%" cy="50%" r="55%">
                    <stop offset="0%"   stopColor="#0c1422"/>
                    <stop offset="100%" stopColor="#06080c"/>
                  </radialGradient>
                  <filter id="ccglow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <rect width="300" height="410" fill="url(#ccbg)"/>
                <rect width="300" height="410" fill="url(#ccgrid)"/>
                <path d={INDIA_D} fill="rgba(16,26,52,0.6)" stroke="rgba(99,140,220,0.25)" strokeWidth="0.8" strokeLinejoin="round"/>

                {dataFlows.map(flow=>{
                  const fn=nodes.find(n=>n.id===flow.from); const tn=nodes.find(n=>n.id===flow.to);
                  if(!fn||!tn) return null;
                  const p1=project(fn.lat,fn.lon); const p2=project(tn.lat,tn.lon);
                  return (
                    <g key={flow.id}>
                      <motion.line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                        stroke="rgba(96,165,250,0.25)" strokeWidth="0.6" strokeDasharray="2 4"
                        initial={{opacity:0}} animate={{opacity:[0,0.8,0.8,0]}} transition={{duration:2.6,ease:"easeInOut"}}/>
                      <motion.circle r="1.8" fill="#60a5fa" filter="url(#ccglow)"
                        initial={{cx:p1.x,cy:p1.y,opacity:0}}
                        animate={{cx:[p1.x,p2.x],cy:[p1.y,p2.y],opacity:[0,1,1,0]}}
                        transition={{duration:2.4,ease:"linear"}}/>
                    </g>
                  );
                })}

                {nodes.map(node=>{
                  const {x,y}=project(node.lat,node.lon);
                  const color=NODE_COLOR[node.type]; const glow=STATUS_GLOW[node.status];
                  const isSel=selectedNode?.id===node.id;
                  const isLive=node.status==="active"||node.status==="training";
                  return (
                    <g key={node.id} style={{cursor:"pointer"}} onClick={()=>setSelectedNode(isSel?null:node)}>
                      {isLive&&(
                        <motion.circle cx={x} cy={y} r={5} fill="none" stroke={glow} strokeWidth="0.7"
                          initial={{r:4,opacity:0.7}} animate={{r:13,opacity:0}}
                          transition={{duration:2.8,repeat:Infinity,ease:"easeOut",delay:(node.id*0.17)%2.5}}/>
                      )}
                      {isSel&&<circle cx={x} cy={y} r={8} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7"/>}
                      <circle cx={x} cy={y} r={node.status==="failed"?2:3}
                        fill={node.status==="failed"?"#f87171":color}
                        opacity={node.status==="idle"?0.35:1}
                        filter={isLive?"url(#ccglow)":undefined}/>
                      <circle cx={x+3} cy={y-3} r={1} fill={glow} opacity={0.9}/>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="absolute top-3 left-3 pointer-events-none">
              <div className="font-mono text-[8px] tracking-[0.3em] uppercase text-zinc-700">Infrastructure Map — Republic of India</div>
              <div className="font-mono text-[8px] text-zinc-800 mt-0.5">{nodes.filter(n=>n.status!=="failed").length} nodes online — Round #{aggRound}</div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 flex-wrap justify-center">
              <motion.button id="deploy-btn" onClick={handleDeploy} whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                className="flex items-center gap-2 px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-black"
                style={{background:"#e5e7eb"}}>
                <Play size={10} fill="currentColor"/>Deploy AI Workload
              </motion.button>
              <motion.button id="failure-btn" onClick={handleFailure} disabled={failureActive}
                whileHover={{scale:failureActive?1:1.02}} whileTap={{scale:failureActive?1:0.98}}
                className="flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase border transition-colors"
                style={{borderColor:failureActive?"rgba(251,146,60,0.3)":"rgba(248,113,113,0.35)",color:failureActive?"#fb923c":"#f87171"}}>
                <AlertTriangle size={10}/>{failureActive?"Recovering...":"Simulate Failure"}
              </motion.button>
              <motion.button id="compare-btn" onClick={()=>setShowComparison(true)}
                whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                className="flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase border border-white/[0.08] text-zinc-600 hover:text-zinc-300 hover:border-white/[0.18] transition-colors">
                <Shield size={10}/>Compare Mode
              </motion.button>
            </div>

            <AnimatePresence>
              {selectedNode&&(
                <motion.div initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:12}}
                  transition={{duration:0.18}}
                  className="absolute top-3 right-3 w-60 border border-white/[0.07] overflow-hidden"
                  style={{background:"rgba(5,7,11,0.97)",backdropFilter:"blur(24px)"}}>
                  <div className="flex items-start justify-between p-3 border-b border-white/[0.06]">
                    <div>
                      <div className="w-1.5 h-1.5 rounded-full mb-1" style={{background:STATUS_GLOW[selectedNode.status]}}/>
                      <div className="text-[12px] font-semibold text-white leading-tight">{selectedNode.name}</div>
                      <div className="font-mono text-[9px] text-zinc-600 mt-0.5">{selectedNode.city} — {selectedNode.type}</div>
                    </div>
                    <button onClick={()=>setSelectedNode(null)} className="text-zinc-700 hover:text-white transition-colors mt-0.5">
                      <X size={12}/>
                    </button>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {[
                      {label:"CPU",    value:selectedNode.cpu,    color:selectedNode.cpu>85?"#fb923c":"#34d399"},
                      {label:"GPU",    value:selectedNode.gpu,    color:"#60a5fa"},
                      {label:"Memory", value:selectedNode.memory, color:"#c4b5fd"},
                    ].map(m=>(
                      <div key={m.label}>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-[9px] text-zinc-700">{m.label}</span>
                          <span className="font-mono text-[9px]" style={{color:m.color}}>{m.value}%</span>
                        </div>
                        <MiniBar value={m.value} color={m.color}/>
                      </div>
                    ))}
                    {selectedNode.status==="training"&&(
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-[9px] text-zinc-700">Training</span>
                          <span className="font-mono text-[9px] text-blue-400">{Math.round(selectedNode.trainingProgress)}%</span>
                        </div>
                        <MiniBar value={selectedNode.trainingProgress} color="#60a5fa"/>
                      </div>
                    )}
                    <div className="pt-1 border-t border-white/[0.05] space-y-0">
                      <StatRow label="Bandwidth" value={selectedNode.bandwidth} sub="Mbps"/>
                      <StatRow label="Temp"      value={`${selectedNode.temperature}C`} accent={selectedNode.temperature>75?"text-amber-400":"text-zinc-300"}/>
                      <StatRow label="Uptime"    value={selectedNode.uptime}/>
                      <StatRow label="Model"     value={selectedNode.modelVersion}/>
                      <StatRow label="WebGPU"    value="Active" accent="text-emerald-400"/>
                      <StatRow label="WASM"      value="Active" accent="text-emerald-400"/>
                    </div>
                    <div className="pt-1 border-t border-white/[0.05]">
                      <div className="font-mono text-[8px] tracking-widest uppercase text-zinc-700 mb-1">Current Workload</div>
                      <div className="font-mono text-[10px] text-zinc-400 leading-snug">{selectedNode.workload}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TIMELINE */}
          <div className="shrink-0 border-t border-white/[0.05] px-5 py-3 overflow-x-auto"
            style={{background:"rgba(255,255,255,0.008)"}}>
            <div className="flex items-start gap-0 min-w-max">
              {TIMELINE.map((step,i)=>(
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="font-mono text-[8px] text-zinc-800 mb-1.5">{step.time}</div>
                    <div className="w-2 h-2 rounded-full border" style={{
                      background: step.active?"#60a5fa":step.done?"#34d399":"transparent",
                      borderColor:step.active?"#60a5fa":step.done?"#34d399":"#27272a",
                      boxShadow:  step.active?"0 0 8px rgba(96,165,250,0.5)":"none",
                    }}/>
                    <div className="font-mono text-[8px] text-zinc-700 mt-1.5 w-16 text-center leading-tight">{step.label}</div>
                  </div>
                  {i<TIMELINE.length-1&&(
                    <div className="w-10 h-px mx-0.5 mb-6" style={{background:step.done?"rgba(52,211,153,0.25)":"rgba(39,39,42,0.8)"}}/>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 border-l border-white/[0.05] overflow-hidden"
          style={{background:"rgba(255,255,255,0.008)"}}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
            <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-zinc-700">Event Stream</span>
            <div className="flex items-center gap-1">
              <motion.div className="w-1 h-1 rounded-full bg-emerald-500"
                animate={{opacity:[1,0.2,1]}} transition={{duration:1.4,repeat:Infinity}}/>
              <span className="font-mono text-[8px] text-emerald-700 tracking-widest">LIVE</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <AnimatePresence initial={false}>
              {events.map(ev=>(
                <motion.div key={ev.id} initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
                  exit={{opacity:0}} transition={{duration:0.2}}
                  className="p-2.5 border border-white/[0.04]" style={{background:"rgba(255,255,255,0.015)"}}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:EV_COLOR[ev.type]}}/>
                    <span className="font-mono text-[8px] text-zinc-700">{ev.time}</span>
                  </div>
                  <p className="font-mono text-[9px] text-zinc-500 leading-snug">{ev.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </aside>
      </div>

      {/* DEPLOY MODAL */}
      <AnimatePresence>
        {showDeploy&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{background:"rgba(0,0,0,0.75)",backdropFilter:"blur(10px)"}}>
            <motion.div initial={{scale:0.94,y:16}} animate={{scale:1,y:0}} exit={{scale:0.94,y:16}}
              transition={{duration:0.22,ease:[0.16,1,0.3,1]}}
              className="w-full max-w-lg border border-white/[0.08] overflow-hidden" style={{background:"#08090f"}}>
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div>
                  <div className="font-mono text-[8px] tracking-[0.3em] uppercase text-zinc-700 mb-1">FlockML Orchestration Engine</div>
                  <div className="text-[15px] font-semibold text-white">Deploy AI Workload</div>
                </div>
                <button id="close-deploy" onClick={()=>{setShowDeploy(false);setDeployStep(-1);}}
                  className="text-zinc-700 hover:text-white transition-colors"><X size={15}/></button>
              </div>
              <div className="p-5 space-y-1.5">
                {DEPLOY_STEPS.map((s,i)=>{
                  const done=deployStep>i; const active=deployStep===i;
                  return (
                    <div key={s.step} className="flex items-start gap-3 p-3 border transition-all duration-300"
                      style={{
                        borderColor:done?"rgba(52,211,153,0.15)":active?"rgba(96,165,250,0.2)":"rgba(255,255,255,0.04)",
                        background: done?"rgba(52,211,153,0.04)":active?"rgba(96,165,250,0.04)":"transparent",
                      }}>
                      <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center border mt-0.5"
                        style={{borderColor:done?"#34d399":active?"#60a5fa":"#27272a",
                          background:done?"rgba(52,211,153,0.12)":active?"rgba(96,165,250,0.12)":"transparent"}}>
                        {done?<CheckCircle size={10} color="#34d399"/>:
                         active?<motion.div className="w-1.5 h-1.5 rounded-full bg-blue-400"
                           animate={{opacity:[1,0.2,1]}} transition={{duration:0.7,repeat:Infinity}}/>:
                         <span className="font-mono text-[8px] text-zinc-700">{s.step}</span>}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[11px] leading-none mb-1"
                          style={{color:done?"#34d399":active?"#60a5fa":"#52525b"}}>{s.title}</div>
                        <div className="font-mono text-[9px] text-zinc-700 leading-snug">{s.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {deployStep>=DEPLOY_STEPS.length&&(
                <div className="p-4 border-t border-white/[0.06] flex items-center gap-2">
                  <CheckCircle size={13} color="#34d399"/>
                  <span className="font-mono text-[10px] text-emerald-500">Model v3.2.2 deployed — 18 nodes now running new weights</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPARISON MODAL */}
      <AnimatePresence>
        {showComparison&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            style={{background:"rgba(0,0,0,0.75)",backdropFilter:"blur(10px)"}}
            onClick={()=>setShowComparison(false)}>
            <motion.div initial={{scale:0.94}} animate={{scale:1}} exit={{scale:0.94}}
              transition={{duration:0.22,ease:[0.16,1,0.3,1]}}
              className="w-full max-w-2xl border border-white/[0.08] overflow-hidden" style={{background:"#08090f"}}
              onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div>
                  <div className="font-mono text-[8px] tracking-[0.3em] uppercase text-zinc-700 mb-1">Architecture Analysis</div>
                  <div className="text-[15px] font-semibold text-white">Infrastructure Comparison</div>
                </div>
                <button id="close-compare" onClick={()=>setShowComparison(false)}
                  className="text-zinc-700 hover:text-white transition-colors"><X size={15}/></button>
              </div>
              <div className="grid grid-cols-2 divide-x divide-white/[0.05]">
                <div className="p-6">
                  <div className="font-mono text-[8px] tracking-[0.25em] uppercase text-zinc-700 mb-5">Traditional Centralized</div>
                  <div className="space-y-4">
                    {[
                      {i:"◉",l:"One central cluster",     s:"All compute in a single data center"   },
                      {i:"!",l:"Single failure point",    s:"Entire system halts on hardware failure"},
                      {i:"◈",l:"Static allocation",       s:"Manual provisioning — weeks to scale"  },
                      {i:"↑",l:"Vertical scaling only",   s:"Bounded by hardware cost ceiling"      },
                      {i:"⊘",l:"Data leaves device",      s:"All training data routed through server"},
                    ].map(r=>(
                      <div key={r.l} className="flex gap-3">
                        <span className="font-mono text-zinc-700 text-[12px] shrink-0 w-4 mt-0.5">{r.i}</span>
                        <div>
                          <div className="text-[11px] text-zinc-500 font-medium">{r.l}</div>
                          <div className="font-mono text-[9px] text-zinc-800 mt-0.5 leading-snug">{r.s}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <div className="font-mono text-[8px] tracking-[0.25em] uppercase text-emerald-800 mb-5">FlockML Distributed</div>
                  <div className="space-y-4">
                    {[
                      {i:"⬡",l:"Distributed mesh",       s:"25+ edge nodes across every state"     },
                      {i:"⟳",l:"Fault tolerant",          s:"Scheduler auto-recovers — zero downtime"},
                      {i:"◈",l:"Elastic scheduling",      s:"Dynamic reallocation in milliseconds"  },
                      {i:"∞",l:"Horizontal scaling",      s:"Every browser tab is a compute node"   },
                      {i:"+",l:"Privacy preserving",      s:"Data never leaves the device — ever"   },
                    ].map(r=>(
                      <div key={r.l} className="flex gap-3">
                        <span className="font-mono text-emerald-700 text-[12px] shrink-0 w-4 mt-0.5">{r.i}</span>
                        <div>
                          <div className="text-[11px] text-emerald-500 font-medium">{r.l}</div>
                          <div className="font-mono text-[9px] text-zinc-700 mt-0.5 leading-snug">{r.s}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-white/[0.05] flex items-center gap-2">
                <Activity size={11} color="#34d399"/>
                <span className="font-mono text-[9px] text-zinc-700">
                  FlockML orchestrating {stats.active+stats.training} nodes across India — {(stats.totalBw/1000).toFixed(1)} Gbps aggregate throughput
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
