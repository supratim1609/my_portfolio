"use client";

import { useEffect, useRef } from "react";

export default function WarpingGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const spacing = 40; // Grid spacing
    const rows = Math.ceil(height / spacing) + 2;
    const cols = Math.ceil(width / spacing) + 2;

    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    const radius = 200; // Radius of influence
    const maxDisplacement = 40;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    
    // Support touch devices too
    const handleTouchMove = (e: TouchEvent) => {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);

    let animationFrameId: number;

    const render = () => {
      // Interpolate mouse for smooth movement
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);
      
      // We'll create the warped points dynamically every frame to avoid storing huge arrays,
      // since it's a simple pure math function.
      const getPoint = (i: number, j: number) => {
        const baseX = (i - 1) * spacing;
        const baseY = (j - 1) * spacing;
        
        const dx = baseX - mouse.x;
        const dy = baseY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let x = baseX;
        let y = baseY;

        if (dist < radius) {
          const force = Math.pow((radius - dist) / radius, 2); // easing
          x += (dx / dist) * force * maxDisplacement;
          y += (dy / dist) * force * maxDisplacement;
        }

        return { x, y };
      };

      ctx.lineWidth = 1;
      // Ultra-subtle, expensive looking grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";

      ctx.beginPath();
      
      // Draw horizontal lines
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const p = getPoint(i, j);
          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            // Bezier curves might be too slow for every point, lineTo with small spacing looks smooth enough
            ctx.lineTo(p.x, p.y);
          }
        }
      }

      // Draw vertical lines
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const p = getPoint(i, j);
          if (j === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
      }

      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
      style={{ opacity: 0.8 }}
    />
  );
}
