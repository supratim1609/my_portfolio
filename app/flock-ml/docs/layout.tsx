"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hash } from 'lucide-react';

import { ModeProvider } from './ModeContext';
import { DocsHeaderToggle } from './DocsHeaderToggle';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<{slug: string, title: string}[]>([]);

  useEffect(() => {
    setNavItems([
      { slug: '01-quickstart', title: 'Quickstart' },
      { slug: '02-architecture', title: 'Architecture Overview' },
      { slug: '03-rust-wasm-engine', title: 'The Rust Wasm Engine' },
      { slug: '04-differential-privacy', title: 'Differential Privacy' },
      { slug: '05-api-reference', title: 'API Reference' }
    ]);
  }, []);

  return (
    <ModeProvider>
      <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-[#FF3B30] selection:text-white pt-24 pb-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-start gap-16 min-w-0">
          
          <aside className="hidden lg:block sticky top-24 w-64 shrink-0 space-y-8 overflow-y-auto max-h-[calc(100vh-6rem)] custom-scrollbar pb-10">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center">
                <Hash size={14} className="mr-2 text-emerald-500" /> FlockML Docs
              </h4>
              <div className="flex flex-col space-y-3 text-sm font-medium">
                {navItems.map((item) => {
                  const isActive = pathname === `/flock-ml/docs/${item.slug}`;
                  return (
                    <Link 
                      key={item.slug} 
                      href={`/flock-ml/docs/${item.slug}`}
                      className={`transition-colors border-l-2 pl-4 py-1 ${isActive ? 'border-emerald-500 text-white font-bold' : 'border-white/10 text-[#888] hover:text-white hover:border-white/30'}`}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <DocsHeaderToggle />
            {children}
          </main>
        </div>
      </div>
    </ModeProvider>
  );
}
