// Security: Purely client-side rendered Awwwards landing page.
// Force-triggering Vercel edge cache invalidation cache-buster: 1.0.1
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────────────────── */
/*  Grain overlay rendered on a canvas        */
/* ─────────────────────────────────────────── */
function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let af: number;
    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = v;
        imageData.data[i + 3] = 18;
      }
      ctx.putImageData(imageData, 0, 0);
      af = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(af);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
}

/* ─────────────────────────────────────────── */
/*  Scrolling marquee                         */
/* ─────────────────────────────────────────── */
function Marquee({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-white/[0.06] py-3">
      <motion.div
        className="inline-flex gap-10 sm:gap-16"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase text-zinc-500">
            {item}
            <span className="mx-5 sm:mx-8 text-zinc-700">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  Animated counter                          */
/* ─────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.floor(start));
      if (start >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{val.toLocaleString()}{suffix}</>;
}

/* ─────────────────────────────────────────── */
/*  Main page                                 */
/* ─────────────────────────────────────────── */
export default function FlockHomePage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'react' | 'ts' | 'next'>('react');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], ['0%', '-12%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const snippets = {
    react: `import { FlockProvider, useFlock } from 'flockml';

export default function App() {
  const { node } = useFlock();
  return (
    <FlockProvider>
      <button onClick={() => node.generate("Hello")}>
        Run Locally — $0
      </button>
    </FlockProvider>
  );
}`,
    ts: `import { Flock } from 'flockml';

const node = new Flock.Node({ mode: 'inference' });
await node.start(); // WebGPU → WASM auto-fallback

await node.loadFromHuggingFace('microsoft/bitnet-b1.58-3B');
const res = await node.generate("Hello world");
console.log(res); // 100% client. $0.`,
    next: `// app/api/flock/route.ts
import { Flock } from 'flockml';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const node = new Flock.Node({ mode: 'inference' });
  await node.start();
  return Response.json({
    output: await node.generate(prompt)
  });
}`,
  };

  const marqueeItems = [
    'BitNet 1.58-bit WGSL Shaders',
    'WebGPU Inference',
    'OPFS Model Streaming',
    'WebRTC Peer Swarm',
    'React + Next.js Native',
    'Zero Python',
    'Zero CUDA',
    'Zero Server Bills',
    '$0.00 Per Query',
    'Federated Learning',
  ];

  const features = [
    {
      index: '01',
      title: 'BitNet 1.58-bit',
      sub: 'WGSL Shader Engine',
      desc: 'Replaces GPU float multiplications with ternary additions {-1, 0, 1}. 80% VRAM reduction. Runs on a MacBook Air.',
      stat: '80%',
      statLabel: 'VRAM saved',
    },
    {
      index: '02',
      title: 'OPFS Streaming',
      sub: 'Origin Private File System',
      desc: "Models cached directly to your local SSD via the browser's private filesystem. Zero-second reloads after first download.",
      stat: '0s',
      statLabel: 'reload time',
    },
    {
      index: '03',
      title: 'WebRTC Swarm',
      sub: 'Peer-to-Peer Mesh',
      desc: 'Multiple browser tabs pool their VRAM over WebRTC DataChannels to run 100B parameter models that no single device could hold.',
      stat: '100B',
      statLabel: 'param models',
    },
    {
      index: '04',
      title: 'React Hooks',
      sub: 'useFlock() + FlockProvider',
      desc: 'Drop-in React context that manages model lifecycle, OPFS caching, and streaming output. One import, full local AI.',
      stat: '1',
      statLabel: 'line of code',
    },
  ];

  return (
    <div ref={containerRef} className="bg-[#080808] text-white selection:bg-white selection:text-black overflow-x-hidden">
      <GrainOverlay />

      {/* ── BACKGROUND LAYERS ────────────────── */}
      {/* Dot grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Top-right warm glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.04) 0%, transparent 65%)' }}
      />
      {/* Bottom-left cool tint */}
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(16,185,129,0.04) 0%, transparent 65%)' }}
      />

      {/* ── HERO ────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end pb-12 sm:pb-16 px-5 sm:px-8 overflow-hidden">

        {/* Giant background text */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <div
            className="text-[28vw] sm:text-[22vw] font-black tracking-tighter leading-none text-transparent"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.04)' }}
          >
            FLOCK
          </div>
        </motion.div>

        {/* GitHub Star badge — spinning comet border */}
        <motion.a
          href="https://github.com/supratim1609/flockML"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="self-start w-fit mb-6 sm:mb-8 relative rounded-full p-px overflow-hidden"
          style={{ background: '#161616' }}
        >
          {/* Spinning comet gradient that sweeps around the border */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-[-100%]"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'conic-gradient(transparent 0deg, transparent 240deg, rgba(255,255,255,0.9) 300deg, rgba(255,255,255,0.2) 330deg, transparent 360deg)',
              }}
            />
          </div>

          {/* Inner content */}
          <span className="relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0d0d0d]">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 fill-zinc-300" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
            <span className="font-mono text-[11px] tracking-[0.1em] text-zinc-300 whitespace-nowrap">
              Star on GitHub
            </span>
            <span className="w-px h-3 bg-white/10 shrink-0" />
            <motion.svg
              viewBox="0 0 24 24"
              className="w-3 h-3 shrink-0"
              aria-hidden="true"
              animate={{ fill: ['rgba(251,191,36,0.4)', 'rgba(251,191,36,1)', 'rgba(251,191,36,0.4)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </motion.svg>
          </span>
        </motion.a>

        {/* Version label */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
          className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-zinc-500 mb-5 sm:mb-6 flex items-center gap-2 flex-wrap"
        >
          v2.0.0 — BitNet 1.58-bit WGSL Engine
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>

        {/* Main heading */}
        <div className="relative z-10 w-full max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[15vw] sm:text-[11vw] lg:text-[8vw] font-black tracking-tighter leading-[0.88] text-white"
          >
            Your users<br />
            <span className="text-zinc-500">are the GPU cluster.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mt-6 gap-5 sm:gap-6"
          >
            <p className="text-zinc-400 text-sm sm:text-base lg:text-lg max-w-sm leading-relaxed">
              FlockML crowdsources model training across your users' browsers — then runs inference locally with BitNet 1.58-bit WGSL shaders. No servers. No API keys. OpenAI never gets a cent.
            </p>
            <Link
              href="/flock-ml/docs"
              className="group inline-flex items-center justify-center gap-3 border border-white/20 hover:border-white transition-all px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-mono tracking-wider uppercase text-white shrink-0 w-full sm:w-auto"
            >
              Get Started
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint — hidden on small screens */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="hidden sm:flex absolute right-8 bottom-8 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 flex-col items-center gap-3"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-zinc-600" />
          Scroll
        </motion.div>
      </section>

      {/* ── MARQUEE ─────────────────────────── */}
      <Marquee items={marqueeItems} />

      {/* ── MANIFESTO ───────────────────────── */}
      <section className="px-5 sm:px-8 py-16 sm:py-24 lg:py-28 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 border-b border-white/[0.06]">
        <div>
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-zinc-500 mb-6 sm:mb-8">Manifesto</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
            Intelligence shouldn't be<br />rented from a data center<br />
            <span className="text-zinc-500">3,000 miles away.</span>
          </p>
        </div>
        <div className="flex flex-col justify-center gap-5 sm:gap-6 text-zinc-400 text-sm leading-relaxed">
          <p>
            FlockML is the first JavaScript runtime that executes quantized large language models entirely in the browser—using BitNet 1.58-bit WGSL compute shaders that replace every floating-point GPU multiplication with a ternary integer addition.
          </p>
          <p>
            Your users' devices become the inference cluster. Your OpenAI bill becomes zero. Your model runs faster, locally, with no latency, no privacy risk, and no monthly invoice.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] tracking-widest uppercase pt-2">
            <span className="w-6 sm:w-8 h-px bg-emerald-400" />
            Zero cost. Infinite scale.
          </div>
        </div>
      </section>

      {/* ── STATS ROW ───────────────────────── */}
      <section className="px-5 sm:px-8 py-12 sm:py-16 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {[
            { val: 0, suffix: '.00', pre: '$', label: 'Per million tokens' },
            { val: 80, suffix: '%', pre: '', label: 'Less VRAM via BitNet' },
            { val: 0, suffix: 's', pre: '', label: 'Model reload (OPFS)' },
            { val: 100, suffix: 'B', pre: '', label: 'Param models via swarm' },
          ].map((s, i) => (
            <div key={i} className="px-4 sm:px-8 py-8 sm:py-10 first:pl-0 last:pr-0">
              <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter">
                {s.pre}<Counter target={s.val} suffix={s.suffix} />
              </div>
              <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-zinc-500 mt-2 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────── */}
      <section className="px-5 sm:px-8 py-16 sm:py-24 lg:py-28 max-w-6xl mx-auto border-b border-white/[0.06]">
        <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-zinc-500 mb-10 sm:mb-16">Architecture</p>
        <div className="space-y-0">
          {features.map((f, i) => (
            <div
              key={i}
              className="border-t border-white/[0.06] last:border-b py-7 sm:py-10"
            >
              {/* Mobile: stacked layout */}
              <div className="flex items-start gap-4 sm:hidden">
                <span className="font-mono text-[11px] text-zinc-600 pt-0.5 shrink-0">{f.index}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black tracking-tight text-white">{f.title}</h3>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 mt-0.5 mb-3">{f.sub}</div>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">{f.desc}</p>
                  <div>
                    <div className="font-mono text-xl font-black text-white">{f.stat}</div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600">{f.statLabel}</div>
                  </div>
                </div>
              </div>

              {/* Desktop: grid layout */}
              <div className="hidden sm:grid grid-cols-12 gap-8">
                <div className="col-span-1 font-mono text-[11px] text-zinc-600 pt-1">{f.index}</div>
                <div className="col-span-4">
                  <h3 className="text-xl font-black tracking-tight text-white">{f.title}</h3>
                  <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 mt-1">{f.sub}</div>
                </div>
                <div className="col-span-5 text-sm text-zinc-400 leading-relaxed flex items-center">
                  {f.desc}
                </div>
                <div className="col-span-2 flex flex-col items-end justify-center">
                  <div className="font-mono text-2xl font-black text-white">{f.stat}</div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600">{f.statLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CODE BLOCK ──────────────────────── */}
      <section className="px-5 sm:px-8 py-16 sm:py-24 lg:py-28 max-w-6xl mx-auto border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-zinc-500 mb-5 sm:mb-6">Integration</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-tight text-white mb-5 sm:mb-6">
              One import.<br />Full local AI.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 sm:mb-10">
              FlockML works in React, Next.js, vanilla TypeScript, or any JavaScript environment. WebGPU detected automatically, falls back to WASM.
            </p>
            <div className="flex flex-wrap gap-1 font-mono text-[11px] tracking-wider uppercase">
              {(['react', 'ts', 'next'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 sm:px-4 py-2 border transition-all ${activeTab === t ? 'bg-white text-black border-white font-bold' : 'border-white/10 text-zinc-500 hover:text-white hover:border-white/30'}`}
                >
                  {t === 'react' ? 'React' : t === 'ts' ? 'TypeScript' : 'API Route'}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="absolute -inset-px bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="bg-[#0d0d0d] border border-white/10 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <button
                  onClick={() => handleCopy(snippets[activeTab])}
                  className="text-zinc-600 hover:text-white transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-[11px] sm:text-[12px] leading-relaxed text-zinc-300 overflow-x-auto"
                >
                  {snippets[activeTab]}
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ──────────────────────── */}
      <section className="px-5 sm:px-8 py-20 sm:py-32 max-w-6xl mx-auto flex flex-col items-center text-center gap-6 sm:gap-8">
        <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-zinc-500">Open Source · MIT License</p>
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-white max-w-3xl leading-tight">
          Your browser is already<br />
          <span className="text-zinc-500">a supercomputer.</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-2 sm:mt-4 w-full sm:w-auto">
          <div
            onClick={() => handleCopy('npm i flockml@latest')}
            className="flex items-center justify-center gap-3 bg-white text-black px-6 sm:px-8 py-4 font-mono text-xs sm:text-sm tracking-wider uppercase cursor-pointer hover:bg-zinc-200 transition-colors font-bold w-full sm:w-auto"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : null}
            npm i flockml@latest
          </div>
          <Link
            href="/flock-ml/docs"
            className="flex items-center justify-center gap-2 border border-white/20 hover:border-white transition-all px-6 sm:px-8 py-4 font-mono text-xs sm:text-sm tracking-wider uppercase text-white group w-full sm:w-auto"
          >
            Read Docs
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  );
}
