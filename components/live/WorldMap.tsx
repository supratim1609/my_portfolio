import React from 'react';

interface NodeData {
  id: string;
  lat: number;
  lng: number;
  status: string;
}

export function WorldMap({ nodes }: { nodes: NodeData[] }) {
  // Convert lat (-90 to 90) and lng (-180 to 180) to percentage
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="w-full h-full relative bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden p-4 flex flex-col">
      <div className="text-xs font-mono text-[#888] uppercase tracking-widest mb-4">Geographic Distribution</div>
      <div className="relative flex-1 w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent rounded-lg">
        {/* Simple grid background to imply a map structure */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        {nodes.map(node => {
          const { x, y } = getCoordinates(node.lat, node.lng);
          return (
            <div
              key={node.id}
              className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full shadow-[0_0_8px_currentColor] transition-all duration-500"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: node.status === 'UPLOADING' ? '#ec4899' : '#10b981',
                color: node.status === 'UPLOADING' ? '#ec4899' : '#10b981',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
