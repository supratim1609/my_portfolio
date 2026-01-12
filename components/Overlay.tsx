'use client';

import { MotionValue, motion, useTransform } from 'framer-motion';

interface OverlayProps {
    scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {

    // Section 1: "My Name. Creative Developer."
    // Fade in at start (0), fade out by 20%
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    // Section 2: "I build digital experiences."
    // Fade in at 25%, visible till 40%, out by 50%
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.5], [50, -50]);

    // Section 3: "Bridging design and engineering."
    // Fade in at 55%, visible till 75%, out by 90%
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.55, 0.85], [50, -50]);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10 flex flex-col items-center justify-center">

            {/* Section 1 - Center */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className="absolute inset-0 flex items-center justify-center text-center p-8"
            >
                <div>
                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-4 text-white font-sans uppercase">
                        Supratim<br />Dhara
                    </h1>
                    <p className="text-xl md:text-2xl text-[#CCFF00] font-mono tracking-widest uppercase">
                        // Systems Engineer & Architect
                    </p>
                </div>
            </motion.div>

            {/* Section 2 - Left Aligned */}
            <motion.div
                style={{ opacity: opacity2, y: y2 }}
                className="absolute inset-0 flex items-center justify-start p-12 md:p-24"
            >
                <div className="max-w-xl">
                    <p className="font-mono text-[#CCFF00] mb-4 text-sm tracking-wider">001_CREATION</p>
                    <h2 className="text-5xl md:text-7xl font-bold leading-none text-white mb-6 font-sans uppercase">
                        Rivet<br />
                        Framework
                    </h2>
                    <p className="text-lg text-gray-400 font-mono border-l-2 border-[#CCFF00] pl-4">
                        High-performance distributed systems in Dart.
                    </p>
                </div>
            </motion.div>

            {/* Section 3 - Right Aligned */}
            <motion.div
                style={{ opacity: opacity3, y: y3 }}
                className="absolute inset-0 flex items-center justify-end p-12 md:p-24"
            >
                <div className="max-w-xl text-right">
                    <p className="font-mono text-[#CCFF00] mb-4 text-sm tracking-wider">002_LEADERSHIP</p>
                    <h2 className="text-5xl md:text-7xl font-bold leading-none text-white mb-6 font-sans uppercase">
                        CTO @<br />
                        Calvert
                    </h2>
                    <p className="text-lg text-gray-400 font-mono border-r-2 border-[#CCFF00] pr-4">
                        Bridging vision and scale for 200k+ users.
                    </p>
                </div>
            </motion.div>

        </div>
    );
}
