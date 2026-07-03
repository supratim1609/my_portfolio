"use client";

import React from 'react';
import { useMode } from './ModeContext';
import { motion } from 'framer-motion';
import { Code2, GraduationCap } from 'lucide-react';

export function DocsHeaderToggle() {
  const { isJuniorMode, setIsJuniorMode } = useMode();

  return (
    <div className="mb-12 border-b border-white/10 pb-8">
      <div className="flex flex-col sm:flex-row sm:inline-flex items-center w-full sm:w-auto bg-[#111] border border-white/10 rounded-2xl sm:rounded-full p-1.5 relative z-10 shadow-xl">
        <button 
          onClick={() => setIsJuniorMode(false)}
          className={`relative px-4 sm:px-6 py-3 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold flex justify-center items-center space-x-2 transition-colors ${!isJuniorMode ? 'text-white' : 'text-[#888] hover:text-white'}`}
        >
          {!isJuniorMode && <motion.div layoutId="docToggle" className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-full border border-white/5" />}
          <Code2 size={16} className="relative z-10 shrink-0" />
          <span className="relative z-10 whitespace-nowrap">Engineer Mode</span>
        </button>
        <button 
          onClick={() => setIsJuniorMode(true)}
          className={`relative px-4 sm:px-6 py-3 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold flex justify-center items-center space-x-2 transition-colors ${isJuniorMode ? 'text-blue-400' : 'text-[#888] hover:text-white'}`}
        >
          {isJuniorMode && <motion.div layoutId="docToggle" className="absolute inset-0 bg-blue-500/10 rounded-xl sm:rounded-full border border-blue-500/20" />}
          <GraduationCap size={16} className="relative z-10 shrink-0" />
          <span className="relative z-10 whitespace-nowrap">Junior Dev Mode</span>
        </button>
      </div>
    </div>
  );
}
