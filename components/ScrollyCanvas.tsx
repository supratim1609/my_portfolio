'use client';

import { useScroll, useTransform, useMotionValueEvent, AnimatePresence, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Overlay from './Overlay';
import Preloader from './Preloader';

const FRAME_COUNT = 105;

export default function ScrollyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // Store as CanvasImageSource (ImageBitmap | HTMLImageElement)
    const [images, setImages] = useState<CanvasImageSource[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Track scroll progress of the main container
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Add physics-based smoothing to the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Map smoothed progress (0 to 1) to frame index (0 to FRAME_COUNT - 1)
    const currentIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        // Preload images
        const loadImages = async () => {
            const loadedImages: CanvasImageSource[] = [];
            const promises: Promise<void>[] = [];

            for (let i = 0; i < FRAME_COUNT; i++) {
                const promise = new Promise<void>(async (resolve, reject) => {
                    const img = new Image();
                    // Pad number with leading zeros (e.g., frame_000.webp)
                    const paddedIndex = i.toString().padStart(3, '0');
                    img.src = `/sequence/frame_${paddedIndex}.webp`;

                    try {
                        // Force decode the image first
                        await img.decode();

                        // Try to convert to ImageBitmap for GPU-optimized rendering
                        // This handles the transfer to GPU memory upfront
                        if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
                            const bitmap = await createImageBitmap(img);
                            loadedImages[i] = bitmap;
                        } else {
                            loadedImages[i] = img;
                        }
                        resolve();
                    } catch (e) {
                        console.error(`Failed to load/decode frame ${i}`, e);
                        // Fallback - just resolve to keep going
                        resolve();
                    }
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

        const ctx = canvas.getContext('2d', {
            alpha: false, // Optimization: canvas doesn't need transparency
            desynchronized: true // Optimization: allow faster, potentially tearing updates (often smoother)
        });
        if (!ctx) return;

        // OPTIMIZATION: Cap DPR at 2. 
        // 3x rendering for moving video is unnecessary overhead.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Check if canvas size matches window size (handling resize)
        if (canvas.width !== window.innerWidth * dpr || canvas.height !== window.innerHeight * dpr) {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            // Explicitly set style width/height to match CSS pixels
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        }

        const width = canvas.width;
        const height = canvas.height;

        // No clearRect needed if we cover the whole screen, but good practice if aspect ratio differs significantly
        // However, since we object-fit cover, we usually draw over everything. 
        // Removing clearRect can verify if it helps, but let's keep it safe or just fill black?
        // ctx.clearRect(0, 0, width, height); // Optionally remove this if we always cover

        // Use a fast fill for the background to avoid alpha blending cost?
        // Actually, since alpha: false is set, the browser knows it's opaque.

        const img = images[index];

        // "object-fit: cover" logic
        // Use 'any' cast for width/height property access as CanvasImageSource is a union
        const imgWidth = (img as any).width;
        const imgHeight = (img as any).height;

        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = width / height;

        let drawWidth, drawHeight, offsetX, offsetY;

        const SCALE_FACTOR = 1.05; // Zoom slightly to hide watermark

        if (canvasRatio > imgRatio) {
            // Canvas is wider -> fit to width
            drawWidth = width * SCALE_FACTOR;
            drawHeight = (width / imgRatio) * SCALE_FACTOR;
            offsetX = (width - drawWidth) / 2;
            offsetY = (height - drawHeight) / 2;
        } else {
            // Canvas is taller -> fit to height
            drawHeight = height * SCALE_FACTOR;
            drawWidth = (height * imgRatio) * SCALE_FACTOR;
            offsetY = (height - drawHeight) / 2;
            offsetX = (width - drawWidth) / 2;
        }

        // Draw image directly with physical coordinates
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform ensures 1:1 pixel mapping
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
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

                {/* 
                  Optimize canvas element:
                  - opaque-canvas used in conjunction with getContext('2d', { alpha: false }) 
                */}
                <canvas
                    ref={canvasRef}
                    className="block w-full h-full bg-[#121212]"
                />

                <Overlay scrollYProgress={scrollYProgress} />
                {/* Gradient Fade to seamless transition */}
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-[#121212] z-10 pointer-events-none" />
            </div>

        </div>
    );
}
