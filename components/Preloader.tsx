'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Simulated progress
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Random increment for realistic feel
                const increment = Math.floor(Math.random() * 5) + 1;
                return Math.min(prev + increment, 100);
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white"
        >
            {/* Center Content */}
            <div className="relative w-full max-w-md px-6">

                {/* Counter */}
                <div className="flex justify-between items-end mb-4 font-mono">
                    <span className="text-sm text-gray-500 uppercase tracking-widest">// SYSTEM_BOOT</span>
                    <span className="text-6xl md:text-8xl font-bold leading-none tracking-tighter">
                        {count.toString().padStart(3, '0')}
                    </span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                    {/* Animated Progress Line */}
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-[#CCFF00]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${count}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>

                {/* Bottom Metadata */}
                <div className="flex justify-between mt-4 font-mono text-[10px] md:text-xs text-gray-600 uppercase">
                    <span>ESTABLISHING_CONNECTION...</span>
                    <span>V1.0.4 [STABLE]</span>
                </div>
            </div>

            {/* Background Grid (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        </motion.div>
    );
}
