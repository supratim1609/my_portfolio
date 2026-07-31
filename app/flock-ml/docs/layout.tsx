"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Menu, X, ChevronRight } from 'lucide-react';
import { ModeProvider } from './ModeContext';
import { DocsHeaderToggle } from './DocsHeaderToggle';

const NAV = [
  {
    group: 'Getting Started',
    items: [
      { slug: '01-quickstart', label: 'Quickstart' },
      { slug: '02-architecture', label: 'Architecture' },
    ],
  },
  {
    group: 'Core Engine',
    items: [
      { slug: '03-rust-wasm-engine', label: 'WGSL Compute Shaders' },
      { slug: '04-differential-privacy', label: 'OPFS & Streaming' },
    ],
  },
  {
    group: 'Reference',
    items: [
      { slug: '05-api-reference', label: 'API Reference' },
    ],
  },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full pt-6 pb-10">
      {/* Logo row */}
      <div className="flex items-center justify-between px-6 mb-10">
        <Link href="/flock-ml" className="flex items-center gap-2 group">
          <ArrowLeft size={13} className="text-zinc-600 group-hover:text-white transition-colors" />
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-zinc-500 group-hover:text-white transition-colors">FlockML</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-6 space-y-8">
        {NAV.map((group) => (
          <div key={group.group}>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-3">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === `/flock-ml/docs/${item.slug}`;
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/flock-ml/docs/${item.slug}`}
                      onClick={onClose}
                      className={`flex items-center justify-between w-full px-3 py-2 text-[13px] rounded-sm transition-all group ${
                        active
                          ? 'text-white bg-white/[0.06] font-medium'
                          : 'text-zinc-500 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {active && <ChevronRight size={12} className="text-zinc-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 pt-8 border-t border-white/[0.06]">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-700 mb-3">v2.0.0</p>
        <a
          href="https://github.com/supratim1609/flockML"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-mono text-[11px] text-zinc-600 hover:text-white transition-colors"
        >
          GitHub ↗
        </a>
      </div>
    </div>
  );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  const pathname = usePathname();
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">

      {/* ── DESKTOP SIDEBAR ─────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-white/[0.06] sticky top-0 h-screen overflow-hidden">
        <Sidebar />
      </aside>

      {/* ── MOBILE OVERLAY ──────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/[0.06] z-50 lg:hidden flex flex-col"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#080808]/90 backdrop-blur-xl z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-zinc-500">FlockML Docs</span>
        </div>

        <ModeProvider>
          <div className="sticky top-0 bg-[#080808]/90 backdrop-blur-xl z-20 border-b border-white/[0.04] hidden lg:block">
            <div className="max-w-3xl mx-auto px-6 sm:px-10 py-3">
              <DocsHeaderToggle />
            </div>
          </div>
          <main className="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </main>
        </ModeProvider>
      </div>

    </div>
  );
}
