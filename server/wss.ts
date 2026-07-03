import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('[FlockML Coordinator] WebSocket Server running on ws://localhost:8080');

interface EdgeNode {
  id: string;
  ws: WebSocket;
  status: 'JOINING' | 'TRAINING' | 'UPLOADING' | 'IDLE';
  cpu: number;
  mem: number;
  lat: number;
  lng: number;
  joinedAt: number;
  gradientsContributed: number;
}

const activeNodes = new Map<string, EdgeNode>();
let globalRound = 1;
let globalAccuracy = 0.4215;
let totalTFlops = 0.542;
let serverCostAvoided = 1.25;
const eventLog: string[] = [];

function addLog(msg: string) {
  const t = new Date().toISOString().split('T')[1].slice(0, -1);
  eventLog.unshift(`[${t}] ${msg}`);
  if (eventLog.length > 50) eventLog.pop();
}

function randomLat() { return (Math.random() - 0.5) * 140; }
function randomLng() { return (Math.random() - 0.5) * 280; }

wss.on('connection', (ws) => {
  const nodeId = 'node-' + Math.random().toString(36).substr(2, 6);
  
  const node: EdgeNode = {
    id: nodeId,
    ws,
    status: 'JOINING',
    cpu: Math.random() * 20,
    mem: Math.random() * 100,
    lat: randomLat(),
    lng: randomLng(),
    joinedAt: Date.now(),
    gradientsContributed: 0
  };
  
  activeNodes.set(nodeId, node);
  addLog(`New edge device securely joined: ${nodeId}`);

  ws.send(JSON.stringify({
    type: 'WELCOME',
    payload: { nodeId, globalRound }
  }));

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === 'HEARTBEAT') {
        node.cpu = data.payload.cpu;
        node.status = data.payload.status || 'TRAINING';
      }
      if (data.type === 'GRADIENT_UPDATE') {
        node.gradientsContributed += 1;
        totalTFlops += Math.random() * 0.005 + 0.001;
        serverCostAvoided += 0.05;
        node.status = 'UPLOADING';
        
        setTimeout(() => { if (activeNodes.has(nodeId)) node.status = 'TRAINING'; }, 800);
      }
    } catch(e) {}
  });

  ws.on('close', () => {
    activeNodes.delete(nodeId);
    addLog(`Device offline: ${nodeId} (connection dropped)`);
  });
});

// Periodic Aggregation Sim
setInterval(() => {
  if (activeNodes.size > 0) {
    globalRound++;
    // Diminishing returns accuracy boost
    const boost = (0.999 - globalAccuracy) * 0.02 * (Math.max(1, activeNodes.size / 2));
    globalAccuracy += boost;
    if (globalAccuracy > 0.9999) globalAccuracy = 0.9999;
    
    addLog(`FedAvg Cycle Complete [Round ${globalRound}]. Global Model synchronized.`);
  }
}, 6000);

// Broadcast state to all clients at 10Hz
setInterval(() => {
  const nodesPayload = Array.from(activeNodes.values()).map(n => ({
    id: n.id,
    status: n.status,
    cpu: n.cpu,
    lat: n.lat,
    lng: n.lng,
    uptime: Math.floor((Date.now() - n.joinedAt) / 1000),
    contributions: n.gradientsContributed
  }));

  const state = JSON.stringify({
    type: 'GRID_STATE',
    payload: {
      nodes: nodesPayload,
      metrics: {
        activeNodes: activeNodes.size,
        globalRound,
        globalAccuracy: globalAccuracy.toFixed(4),
        totalTFlops: totalTFlops.toFixed(3),
        serverCostAvoided: serverCostAvoided.toFixed(2),
        bandwidthSavedMB: (totalTFlops * 420).toFixed(1)
      },
      logs: eventLog.slice(0, 15)
    }
  });

  for (const client of activeNodes.values()) {
    if (client.ws.readyState === 1) { // OPEN
      client.ws.send(state);
    }
  }
}, 100);
