'use client';

import { useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Overlay from './Overlay';
import Preloader from './Preloader';

const FRAME_COUNT = 105;

export default function ScrollyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Track scroll progress of the main container
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Map scroll progress (0 to 1) to frame index (0 to FRAME_COUNT - 1)
    const currentIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        // Preload images
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises: Promise<void>[] = [];

            for (let i = 0; i < FRAME_COUNT; i++) {
                const promise = new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    // Pad number with leading zeros (e.g., frame_000.webp)
                    const paddedIndex = i.toString().padStart(3, '0');
                    img.src = `/sequence/frame_${paddedIndex}.webp`;
                    img.onload = () => {
                        loadedImages[i] = img;
                        resolve();
                    };
                    img.onerror = (e) => {
                        console.error(`Failed to load frame ${i}`, e);
                        // Resolve anyway to avoid hanging, though you might want a placeholder
                        resolve();
                    };
                });
                promises.push(promise);
            }

            // Enforce minimum loading time of 2.5 seconds for proper preloader display
            const minLoadTime = new Promise(resolve => setTimeout(resolve, 2500));

            await Promise.all([Promise.all(promises), minLoadTime]);

            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !images[index]) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;

        // Check if canvas size matches window size (handling resize)
        if (canvas.width !== window.innerWidth * dpr || canvas.height !== window.innerHeight * dpr) {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            // Reset scale because we are managing drawing dimensions manually below? 
            // Actually standard pattern is verify CSS size vs Attribute size
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        }

        // Isolate scaling to drawing only if we want specific control, 
        // but easier to just use the viewport size for calculations
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const img = images[index];

        // "object-fit: cover" logic
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            // Canvas is wider than image -> fit to width
            drawWidth = width;
            drawHeight = width / imgRatio;
            offsetX = 0;
            offsetY = (height - drawHeight) / 2;
        } else {
            // Canvas is taller than image -> fit to height
            drawHeight = height;
            drawWidth = height * imgRatio;
            offsetY = 0;
            offsetX = (width - drawWidth) / 2;
        }

        // Draw image
        // Note: If using `ctx.scale(dpr, dpr)`, operation units are logical CSS pixels
        // But setting canvas.width to physical pixels resets context state usually
        // It's safer to rely on physical pixels or reset transform

        // Let's stick to a robust approach:
        // Reset transform to identity to use physical pixels directly, simpler for full control
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Re-calculate draw dimensions for PHYSICAL pixels
        const physWidth = canvas.width;
        const physHeight = canvas.height;

        const physImgRatio = img.width / img.height;
        const physCanvasRatio = physWidth / physHeight;

        let physDrawWidth, physDrawHeight, physOffsetX, physOffsetY;

        const SCALE_FACTOR = 1.05; // Zoom slightly to hide watermark

        if (physCanvasRatio > physImgRatio) {
            physDrawWidth = physWidth * SCALE_FACTOR;
            physDrawHeight = (physWidth / physImgRatio) * SCALE_FACTOR;
            physOffsetX = (physWidth - physDrawWidth) / 2;
            physOffsetY = (physHeight - physDrawHeight) / 2;
        } else {
            physDrawHeight = physHeight * SCALE_FACTOR;
            physDrawWidth = (physHeight * physImgRatio) * SCALE_FACTOR;
            physOffsetY = (physHeight - physDrawHeight) / 2;
            physOffsetX = (physWidth - physDrawWidth) / 2;
        }

        ctx.drawImage(img, physOffsetX, physOffsetY, physDrawWidth, physDrawHeight);
    };

    // Render loop reacting to scroll
    useMotionValueEvent(currentIndex, "change", (latest) => {
        if (!isLoaded) return;
        const frameIndex = Math.round(latest);
        requestAnimationFrame(() => renderFrame(frameIndex));
    });

    // Initial render when loaded
    useEffect(() => {
        if (isLoaded) {
            renderFrame(0);
        }
    }, [isLoaded]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (isLoaded) {
                renderFrame(Math.round(currentIndex.get()));
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isLoaded, currentIndex]);

    return (
        <div ref={containerRef} className="h-[500vh] relative">
            <div className="sticky top-0 h-screen w-full overflow-hidden will-change-transform">
                <AnimatePresence mode="wait">
                    {!isLoaded && <Preloader key="preloader" />}
                </AnimatePresence>
                <canvas ref={canvasRef} className="block w-full h-full" />
                <Overlay scrollYProgress={scrollYProgress} />
                {/* Gradient Fade to seamless transition */}
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-[#121212] z-10 pointer-events-none" />
            </div>

        </div>
    );
}
