'use client';
import { useEffect, useRef } from 'react';

interface NodeData {
  id: string;
  status: string;
}

export function NetworkGraph({ nodes }: { nodes: NodeData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Physics state
    const center = { x: width / 2, y: height / 2 };
    const particles = new Map<string, {x: number, y: number, vx: number, vy: number}>();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Add missing particles
      nodes.forEach(n => {
        if (!particles.has(n.id)) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 100 + Math.random() * 200;
          particles.set(n.id, {
            x: center.x + Math.cos(angle) * dist,
            y: center.y + Math.sin(angle) * dist,
            vx: 0, vy: 0
          });
        }
      });

      // Remove stale particles
      const currentIds = new Set(nodes.map(n => n.id));
      for (const id of particles.keys()) {
        if (!currentIds.has(id)) particles.delete(id);
      }

      // Physics loop
      particles.forEach((p, id) => {
        // Pull towards center
        const dx = center.x - p.x;
        const dy = center.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const targetDist = 180;
        const force = (dist - targetDist) * 0.01;
        
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;

        // Repel from others
        particles.forEach((otherP, otherId) => {
          if (id === otherId) return;
          const ox = p.x - otherP.x;
          const oy = p.y - otherP.y;
          const odist = Math.sqrt(ox*ox + oy*oy) || 1;
          if (odist < 50) {
            p.vx += (ox / odist) * 0.5;
            p.vy += (oy / odist) * 0.5;
          }
        });

        // Friction
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;
      });

      // Draw connections
      ctx.lineWidth = 1;
      particles.forEach((p, id) => {
        const node = nodes.find(n => n.id === id);
        if (!node) return;
        
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(p.x, p.y);
        
        if (node.status === 'UPLOADING') {
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)'; // fuchsia
          ctx.lineWidth = 2;
        } else if (node.status === 'JOINING') {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'; // light blue
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        }
        ctx.stroke();
        ctx.lineWidth = 1;
      });

      // Draw nodes
      particles.forEach((p, id) => {
        const node = nodes.find(n => n.id === id);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        if (node?.status === 'UPLOADING') ctx.fillStyle = '#ec4899';
        else if (node?.status === 'JOINING') ctx.fillStyle = '#38bdf8';
        else ctx.fillStyle = '#10b981'; // emerald
        ctx.fill();
      });

      // Draw Center Coordinator
      ctx.beginPath();
      ctx.arc(center.x, center.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#fff';
      ctx.arc(center.x, center.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes]);

  return (
    <div className="w-full h-full min-h-[400px] relative bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden">
      <div className="absolute top-4 left-4 z-10 text-xs font-mono text-[#888] uppercase tracking-widest">Global Network Topology</div>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
    </div>
  );
}
