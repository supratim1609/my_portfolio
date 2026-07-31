import { NextResponse } from 'next/server';

interface RealPeerNode {
  id: string;
  name: string;
  location: string;
  device: string;
  status: "idle" | "training" | "syncing";
  progress: number;
  lastActive: number;
}

// In-memory cache for live demo nodes.
// Perfect for short sessions and runs with zero external API key requirements.
let activeNodesCache: RealPeerNode[] = [];

export async function GET() {
  const now = Date.now();
  // Filter out nodes that haven't pinged in the last 15 seconds
  activeNodesCache = activeNodesCache.filter(n => (now - n.lastActive) < 15000);
  
  return NextResponse.json(activeNodesCache);
}

export async function POST(request: Request) {
  try {
    const nodeData: RealPeerNode = await request.json();
    const now = Date.now();
    
    // Set timestamp
    nodeData.lastActive = now;
    
    // Filter out stale nodes
    activeNodesCache = activeNodesCache.filter(n => (now - n.lastActive) < 15000);
    
    // Upsert the current node
    const index = activeNodesCache.findIndex(n => n.id === nodeData.id);
    if (index > -1) {
      activeNodesCache[index] = nodeData;
    } else {
      activeNodesCache.push(nodeData);
    }
    
    return NextResponse.json(activeNodesCache);
  } catch (err) {
    return NextResponse.json({ error: "Invalid node payload" }, { status: 400 });
  }
}
