// Security: Purely client-side rendered landing page. No user input is rendered
// into the DOM — the intro and narrative are static scripted animation.
// Force-triggering Vercel edge cache invalidation cache-buster: 7.0.0
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Copy, Terminal } from "lucide-react";
import Link from "next/link";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EXIT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

/* ─────────────────────────────────────────── */
/*  Intro curtain                              */
/* ─────────────────────────────────────────── */
function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    const skip = () => onDone();
    window.addEventListener("click", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [onDone]);

  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: EXIT_EASE }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white select-none"
    >
      <div className="bg-grain absolute inset-0 pointer-events-none opacity-40" />

      <div className="relative overflow-hidden">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="flex text-[16vw] sm:text-[9vw] font-black tracking-tighter leading-none"
        >
          {"FLOCKML".split("").map((c, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { y: "110%", opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.7, ease: EASE },
                },
              }}
              className={i % 2 === 1 ? "text-zinc-600" : ""}
            >
              {c}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-5 font-mono text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-emerald-400"
      >
        Decentralizing AI in the browser
      </motion.p>

      {/* progress hairline */}
      <div className="absolute bottom-10 left-1/2 h-px w-40 -translate-x-1/2 bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-emerald-400"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          style={{ originX: 0 }}
        />
      </div>
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] uppercase text-zinc-700">
        click to skip
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────── */
/*  Animated counter                           */
/* ─────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(target / 60, 0.5);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.floor(start));
      if (start >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return (
    <>
      {val.toLocaleString()}
      {suffix}
    </>
  );
}

/* ─────────────────────────────────────────── */
/*  Scrolling marquee                          */
/* ─────────────────────────────────────────── */
function Marquee({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden whitespace-nowrap border-y border-white/[0.06] py-3.5 select-none">
      <motion.div
        className="inline-flex gap-10 sm:gap-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-zinc-600"
          >
            {item}
            <span className="mx-5 sm:mx-8 text-emerald-500/40">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  Hero                                       */
/* ─────────────────────────────────────────── */
function Hero({ started }: { started: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor-following emerald glow
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const glowX = useSpring(mx, { stiffness: 50, damping: 20, mass: 0.6 });
  const glowY = useSpring(my, { stiffness: 50, damping: 20, mass: 0.6 });

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
  };
  const line = {
    hidden: { y: "115%" },
    visible: { y: 0, transition: { duration: 1, ease: EASE } },
  };
  const fade = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={(e) => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set(e.clientX - rect.left - 350);
        my.set(e.clientY - rect.top - 350);
      }}
      className="relative flex min-h-screen flex-col justify-between overflow-hidden"
    >
      {/* unique floating nav pill */}
      <header className="fixed inset-x-0 top-4 sm:top-6 z-50 flex justify-center px-4">
        <motion.div
          initial={{ y: -28, opacity: 0 }}
          animate={started ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/[0.08] bg-[#0a0a0a]/85 backdrop-blur-xl py-1.5 pl-2 pr-1.5 sm:pr-2 shadow-[0_16px_50px_-16px_rgba(0,0,0,0.9)]"
        >
          <Link
            href="/flock-ml"
            className="flex items-center gap-2.5 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-emerald-400 text-black">
              <Terminal size={13} strokeWidth={2.5} />
            </span>
            <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-white">
              FlockML
            </span>
            <span className="hidden lg:inline-block font-mono text-[9px] tracking-[0.15em] text-zinc-500 border border-white/[0.08] rounded-full px-2 py-0.5">
              v2.0.0
            </span>
          </Link>

          <span className="hidden md:block h-5 w-px bg-white/[0.08]" />

          <nav className="hidden md:flex items-center gap-0.5 font-mono text-[10px] tracking-[0.18em] uppercase">
            {[
              { label: "Docs", href: "/flock-ml/docs" },
              { label: "Architecture", href: "/flock-ml/math" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative px-3 py-1.5 text-zinc-500 hover:text-white transition-colors"
              >
                {l.label}
                <span className="absolute left-3 right-3 bottom-1 h-px origin-left scale-x-0 bg-emerald-400 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <span className="hidden md:block h-5 w-px bg-white/[0.08]" />

          <a
            href="https://github.com/supratim1609/flock-ml"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FlockML on GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
          </a>
        </motion.div>
      </header>

      {/* cursor glow */}
      <motion.div
        className="pointer-events-none absolute z-0 h-[700px] w-[700px] rounded-full"
        style={{
          x: glowX,
          y: glowY,
          background:
            "radial-gradient(circle, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.03) 40%, transparent 65%)",
        }}
      />

      {/* headline */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={started ? "visible" : "hidden"}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center"
      >
        <div className="overflow-hidden pb-1">
          <motion.h1
            variants={line}
            className="text-[14vw] sm:text-[10vw] lg:text-[8.5vw] font-black tracking-tighter leading-[0.9] text-white"
          >
            Your users
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-1">
          <motion.h1
            variants={line}
            className="text-[14vw] sm:text-[10vw] lg:text-[8.5vw] font-black tracking-tighter leading-[0.9] text-zinc-500"
          >
            are the GPU cluster.
          </motion.h1>
        </div>

        <motion.p
          variants={fade}
          className="mt-8 max-w-md text-sm sm:text-[15px] leading-relaxed text-zinc-500"
        >
          Inference and federated training run entirely inside the browser —
          BitNet 1.58-bit WGSL shaders. No servers. No API keys. No per-token
          invoice.
        </motion.p>

        <motion.div variants={fade} className="mt-9">
          <Link
            href="/flock-ml/docs"
            className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-white"
          >
            <span className="border-b border-white/30 pb-0.5 group-hover:border-emerald-400 group-hover:text-emerald-400 transition-colors">
              Get Started
            </span>
            <ArrowRight
              size={13}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
        className="relative z-10 flex flex-col items-center gap-3 pb-9"
      >
        <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-zinc-700">
          Scroll
        </span>
        <div className="h-12 w-px overflow-hidden bg-white/10">
          <motion.div
            className="h-full w-full bg-emerald-400"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────── */
/*  Scroll-scrubbed narrative                  */
/* ─────────────────────────────────────────── */
const NARRATIVE_LINES = [
  "Intelligence shouldn't be rented from a data center 3,000 miles away.",
  "Every visitor's device becomes a sovereign GPU node.",
  "Float math collapses to ternary additions inside WGSL shaders.",
  "Tabs pool their VRAM over WebRTC into one federated swarm.",
  "No servers. No API keys. No per-token invoice.",
];

function Narrative() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Light spring — smooths the scrub without lagging behind the scroll.
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.3 });
  const activeIdx = useTransform(smooth, [0, 1], [0, NARRATIVE_LINES.length - 1]);
  // Fade the whole chapter out at the very end so it hands off cleanly.
  const fadeOut = useTransform(smooth, [0.88, 1], [1, 0]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const unsub = activeIdx.on("change", (v) => setIdx(Math.round(v)));
    return unsub;
  }, [activeIdx]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 sm:px-10">
        {/* counter + progress hairline */}
        <motion.div
          style={{ opacity: fadeOut }}
          className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
        >
          <span className="font-mono text-[11px] tracking-[0.2em] text-emerald-400 tabular-nums">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <div className="h-24 w-px bg-white/10 overflow-hidden">
            <motion.div
              className="w-full bg-emerald-400"
              style={{ scaleY: smooth, originY: 0 }}
            />
          </div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-zinc-700 tabular-nums">
            {String(NARRATIVE_LINES.length).padStart(2, "0")}
          </span>
        </motion.div>

        {/* all lines always rendered — crossfade only, no blank frames */}
        <div className="mx-auto w-full max-w-5xl">
          <motion.div
            style={{ opacity: fadeOut }}
            className="relative flex h-[42vh] w-full items-center justify-center text-center"
          >
            {NARRATIVE_LINES.map((text, i) => {
              const active = i === idx;
              return (
                <motion.h2
                  key={i}
                  initial={false}
                  animate={{
                    opacity: active ? 1 : 0,
                    y: active ? 0 : i < idx ? -36 : 36,
                    filter: active ? "blur(0px)" : "blur(6px)",
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0 flex items-center justify-center px-2 text-2xl sm:text-4xl lg:text-6xl font-black tracking-tighter leading-[1.08] text-white"
                >
                  {text}
                </motion.h2>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── */
/*  Stats strip                                */
/* ─────────────────────────────────────────── */
function StatsStrip() {
  const stats = [
    { pre: "$", val: 0, suffix: ".00", label: "per million tokens" },
    { val: 80, suffix: "%", label: "less VRAM via BitNet" },
    { val: 0, suffix: "s", label: "model reload · OPFS" },
    { val: 100, suffix: "B", label: "params via swarm" },
  ];

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] border-y border-white/[0.06]">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#050505] px-6 sm:px-10 py-12 sm:py-16">
            <div className="font-mono text-4xl sm:text-5xl font-black tracking-tighter text-white">
              {s.pre}
              <Counter target={s.val} suffix={s.suffix} />
            </div>
            <div className="mt-2.5 font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-zinc-600">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── */
/*  Editorial feature rows                     */
/* ─────────────────────────────────────────── */
const FEATURES = [
  {
    index: "01",
    title: "BitNet 1.58-bit",
    sub: "WGSL Shader Engine",
    desc: "Replaces GPU float multiplications with ternary additions {-1, 0, 1}. 80% VRAM reduction. Runs on a MacBook Air.",
    stat: "80%",
    statLabel: "VRAM saved",
  },
  {
    index: "02",
    title: "OPFS Streaming",
    sub: "Origin Private File System",
    desc: "Models cached directly to your local SSD via the browser's private filesystem. Zero-second reloads after first download.",
    stat: "0s",
    statLabel: "reload time",
  },
  {
    index: "03",
    title: "WebRTC Swarm",
    sub: "Peer-to-Peer Mesh",
    desc: "Multiple browser tabs pool their VRAM over WebRTC DataChannels to run 100B parameter models no single device could hold.",
    stat: "100B",
    statLabel: "param models",
  },
  {
    index: "04",
    title: "React Hooks",
    sub: "useFlock() + FlockProvider",
    desc: "Drop-in React context managing model lifecycle, OPFS caching, and streaming output. One import, full local AI.",
    stat: "1",
    statLabel: "line of code",
  },
];

function FeatureRow({
  f,
  last,
}: {
  f: (typeof FEATURES)[number];
  last: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      className={`group relative ${last ? "" : "border-b border-white/[0.06]"}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline px-6 sm:px-10 py-10 sm:py-14 transition-colors hover:bg-white/[0.015]">
        <span className="md:col-span-1 font-mono text-[11px] text-zinc-700 group-hover:text-emerald-400 transition-colors">
          {f.index}
        </span>
        <div className="md:col-span-5">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-white transition-transform duration-500 group-hover:translate-x-2 sm:group-hover:translate-x-4">
            {f.title}
          </h3>
          <div className="mt-1 font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-600">
            {f.sub}
          </div>
        </div>
        <p className="md:col-span-4 text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
          {f.desc}
        </p>
        <div className="md:col-span-2 md:text-right flex items-baseline gap-3 md:block">
          <span className="font-mono text-3xl font-black tracking-tighter text-emerald-400">
            {f.stat}
          </span>
          <span className="ml-2 md:ml-0 md:block font-mono text-[9px] tracking-[0.22em] uppercase text-zinc-600">
            {f.statLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Features() {
  return (
    <section className="py-24 sm:py-36">
      <div className="px-6 sm:px-10 mb-14 sm:mb-20">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-emerald-500/80 mb-5">
          Architecture
        </p>
        <h2 className="max-w-3xl text-3xl sm:text-5xl font-black tracking-tighter leading-[1.02]">
          Four primitives.
          <span className="text-zinc-500"> Zero infrastructure.</span>
        </h2>
      </div>

      <div className="border-t border-white/[0.06]">
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.index} f={f} last={i === FEATURES.length - 1} />
        ))}
      </div>

      <div className="px-6 sm:px-10 mt-10">
        <Link
          href="/flock-ml/math"
          className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-zinc-500 hover:text-white transition-colors"
        >
          <span className="border-b border-white/20 pb-0.5 group-hover:border-emerald-400 transition-colors">
            Read the math
          </span>
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────── */
/*  Final CTA                                  */
/* ─────────────────────────────────────────── */
function FinalCTA() {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
  };
  const line = {
    hidden: { y: "115%" },
    visible: { y: 0, transition: { duration: 1, ease: EASE } },
  };
  const fade = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i flockml@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden py-32 sm:py-48">
      {/* faint watermark */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <span className="text-[26vw] font-black tracking-tighter text-transparent leading-none"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.03)" }}
        >
          $0
        </span>
      </div>

      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative flex flex-col items-center px-6 text-center"
      >
        <motion.p
          variants={fade}
          className="mb-7 font-mono text-[10px] tracking-[0.35em] uppercase text-zinc-600"
        >
          Open Source · MIT License
        </motion.p>

        <div className="overflow-hidden pb-1">
          <motion.h2
            variants={line}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.98] text-white"
          >
            Your browser is already
          </motion.h2>
        </div>
        <div className="overflow-hidden pb-1">
          <motion.h2
            variants={line}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.98] text-zinc-500"
          >
            a supercomputer.
          </motion.h2>
        </div>

        <motion.div variants={fade} className="mt-11 flex flex-col sm:flex-row items-center gap-6">
          <button
            onClick={handleCopy}
            className="group flex items-center gap-3 border border-white/15 px-7 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase text-white hover:border-emerald-400 hover:text-emerald-400 transition-colors"
          >
            {copied ? (
              <Check size={13} className="text-emerald-400" />
            ) : (
              <Copy size={13} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            )}
            {copied ? "Copied to clipboard" : "npm i flockml@latest"}
          </button>
          <Link
            href="/flock-ml/docs"
            className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-zinc-500 hover:text-white transition-colors"
          >
            <span className="border-b border-white/20 pb-0.5 group-hover:border-emerald-400 transition-colors">
              Read Docs
            </span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────── */
/*  Page                                       */
/* ─────────────────────────────────────────── */
export default function FlockHomePage() {
  const [introDone, setIntroDone] = useState(false);

  const marqueeItems = [
    "BitNet 1.58-bit WGSL Shaders",
    "WebGPU Inference",
    "OPFS Model Streaming",
    "WebRTC Peer Swarm",
    "React + Next.js Native",
    "Zero Python",
    "Zero CUDA",
    "Zero Server Bills",
    "$0.00 Per Query",
    "Federated Learning",
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-emerald-400 selection:text-black overflow-x-clip">
      <AnimatePresence>
        {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      </AnimatePresence>

      {/* background layers */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="fixed top-[-15%] right-[-15%] h-[600px] w-[600px] rounded-full bg-emerald-500/[0.05] blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-25%] left-[-15%] h-[550px] w-[550px] rounded-full bg-blue-500/[0.04] blur-[130px] pointer-events-none z-0" />
      <div className="bg-grain fixed inset-0 z-0 pointer-events-none opacity-40" />

      <main className="relative z-10">
        <Hero started={introDone} />
        <Marquee items={marqueeItems} />
        <Narrative />
        <StatsStrip />
        <Features />
        <FinalCTA />
      </main>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-8">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-sm bg-emerald-400" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500">
              FlockML
            </span>
            <span className="font-mono text-[10px] text-zinc-700">© 2026 · MIT</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600">
            <Link href="/flock-ml/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/flock-ml/math" className="hover:text-white transition-colors">
              Architecture
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Portfolio
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
