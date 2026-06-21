"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowLeft, GitBranch, Terminal } from 'lucide-react';

export default function FlockNavbar() {
  const pathname = usePathname();
  const isTeaser = pathname === '/flock-ml';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Branding & Back Link */}
        <div className="flex items-center space-x-6">
          <Link href="/flock-ml" className="flex items-center space-x-2 group">
            <Terminal size={20} className="text-emerald-500 group-hover:text-white transition-colors" />
            <span className="text-white font-bold tracking-tight text-lg">FlockML</span>
          </Link>
          
          {!isTeaser && (
            <div className="hidden md:flex items-center space-x-1 text-[13px] font-medium text-[#888]">
              <Link href="/flock-ml/docs" className="px-3 py-1.5 hover:text-white transition-colors rounded-md hover:bg-white/5">Docs</Link>
              <Link href="/flock-ml/docs#flocknode" className="px-3 py-1.5 hover:text-white transition-colors rounded-md hover:bg-white/5">API Reference</Link>
              <Link href="/flock-ml/math" className="px-3 py-1.5 hover:text-white transition-colors rounded-md hover:bg-white/5">Architecture</Link>
            </div>
          )}
        </div>

        {/* Right: GitHub / Action */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="flex items-center space-x-1 text-[#888] hover:text-white transition-colors text-xs font-mono mr-4"
          >
            <ArrowLeft size={14} />
            <span>Portfolio</span>
          </Link>

          {!isTeaser && (
            <a 
              href="https://github.com/supratim1609/flock-ml" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-[#888] hover:text-white transition-colors text-sm font-mono"
            >
              <GitBranch size={16} />
              <span className="hidden sm:inline">v1.0.0</span>
            </a>
          )}
        </div>

      </div>
    </nav>
  );
}
