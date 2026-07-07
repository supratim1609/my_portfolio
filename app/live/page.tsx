"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './live.module.css';

type NodeName = 'Howrah' | 'Salt Lake' | 'Rajarhat' | 'Jadavpur';

export default function EnterpriseDashboard() {
  const [tflops, setTflops] = useState(79.8);
  const [powerDraw, setPowerDraw] = useState(0.17);
  const [syncLatency, setSyncLatency] = useState(14);
  const [isDeploying, setIsDeploying] = useState(false);
  const [offlineNodes, setOfflineNodes] = useState<NodeName[]>([]);
  
  const activeGPUs = isDeploying ? (4 - offlineNodes.length) * 64 : 256;
  const [logs, setLogs] = useState<string[]>([]);
  const [tensorMatrix, setTensorMatrix] = useState<string[][]>(
    Array(4).fill(Array(4).fill("0.0000"))
  );
  const terminalRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    return () => workerRef.current?.terminate();
  }, []);

  // Simulate Telemetry Fluctuations based on active nodes
  useEffect(() => {
    if (!isDeploying) return;
    
    const interval = setInterval(() => {
      const activeCount = 4 - offlineNodes.length;
      const baseTflops = activeCount * 19.95;
      const basePower = activeCount * 0.0425;
      
      setTflops((prev) => parseFloat((baseTflops + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      setPowerDraw((prev) => parseFloat((basePower + (Math.random() * 0.01 - 0.005)).toFixed(3)));
      setSyncLatency((prev) => Math.max(8, prev + Math.floor(Math.random() * 5) - 2 + (offlineNodes.length * 12)));
    }, 1500);
    return () => clearInterval(interval);
  }, [isDeploying, offlineNodes]);

  // Simulate Tensor Matrix Fluctuations (Rapid)
  useEffect(() => {
    if (!isDeploying) return;
    
    const tensorInterval = setInterval(() => {
      // If a node is offline, slightly increase stutter chance
      if (offlineNodes.length > 0 && Math.random() > 0.8) return; 

      setTensorMatrix(
        Array(4).fill(0).map(() => 
          Array(4).fill(0).map(() => {
            const val = (Math.random() * 2 - 1).toFixed(4);
            return val.startsWith("-") ? val : `+${val}`;
          })
        )
      );
    }, 250);
    return () => clearInterval(tensorInterval);
  }, [isDeploying, offlineNodes]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setLogs([
      "[SYSTEM] Initiating Pipeline Parallelism across Substations...",
      "[ALLOCATION] Salt Lake: Layers 1-8 (Self-Attention) -> ALLOCATED",
      "[ALLOCATION] Rajarhat: Layers 9-16 (Feed Forward) -> ALLOCATED",
      "[ALLOCATION] Jadavpur: Layers 17-24 (Self-Attention) -> ALLOCATED",
      "[ALLOCATION] Howrah: Layers 25-32 (Logits) -> ALLOCATED",
      "[AD-SGD] Booting Local Wasm Engine...",
      "[AD-SGD] Central Parameter Server Online. W_global initialized."
    ]);
    setOfflineNodes([]);
    
    fetch('/flock.worker.js')
      .then(res => res.text())
      .then(code => {
        const blob = new Blob([code], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);
        workerRef.current = worker;

        worker.onmessage = (e) => {
          if (e.data.type === 'TELEMETRY') {
            if (e.data.epoch % 1200 === 0 || e.data.epoch === 10000) {
              const fakeLoss = (2.5 * Math.exp(-e.data.epoch / 3000) + 0.15).toFixed(4);
              setLogs(prev => [...prev, `>>> EVAL: W_t+1 = W_t - η * ∇L | Epoch: ${e.data.epoch} | Loss: ${fakeLoss}`]);
            }
          } else if (e.data.type === 'TRAINING_COMPLETE') {
            setLogs(prev => [
              ...prev, 
              "[DPDP] Injecting Laplacian Cryptographic Noise (ε=0.5)...",
              "[QUANT] Compressing Float32 Gradients -> Int8...",
              `[SECURE PAYLOAD] ΔW Size: ${e.data.payload.dataLength} bytes.`,
              "[STATUS] Transmitting Asynchronous Update to Central Server.",
              "[STATUS] Grid Synchronization Complete."
            ]);
            URL.revokeObjectURL(workerUrl);
          }
        };

        worker.postMessage({ type: 'START_TRAINING' });
      });
  };

  const toggleNodePower = (node: NodeName, layers: string) => {
    if (!isDeploying) return;

    setOfflineNodes((prev) => {
      const isOffline = prev.includes(node);
      let newOffline;
      if (isOffline) {
        newOffline = prev.filter(n => n !== node);
        addLogs([
          "",
          `[RECOVERY] Power Restored at ${node} Substation.`,
          `[NETWORK] ${node} Node (64x A100) ONLINE.`,
          `[AD-SGD] Re-integrating ${layers} into distributed pipeline...`,
          `[STATUS] Grid Capacity Expanded.`
        ]);
      } else {
        newOffline = [...prev, node];
        addLogs([
          "",
          "--------------------------------------------------",
          `[CRITICAL ALERT] Power Grid Failure at ${node} Substation.`,
          `[NETWORK] ${node} Node (64x A100) OFFLINE.`,
          `[AD-SGD] Fault Tolerance Protocol Initiated...`,
          `[AD-SGD] Dynamic Re-routing... Shifting ${layers} to surviving nodes.`,
          `>>> EVAL: W_t+1 = W_t - η * ∇L [Rerouted successfully]`,
          `[STATUS] Grid Recovered. ZERO Data Loss. Training Resumed.`,
          "--------------------------------------------------"
        ]);
      }
      return newOffline;
    });
  };

  const addLogs = (newLogs: string[]) => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < newLogs.length) {
        setLogs((prev) => [...prev, newLogs[step]]);
        step++;
      } else {
        clearInterval(interval);
      }
    }, 400);
  };

  const isOffline = (node: NodeName) => offlineNodes.includes(node);

  return (
    <div className={styles.dashboardContainer}>
      
      {/* Premium Header */}
      <header className={styles.header}>
        <div className={styles.logoGroup}>
          <div className={styles.pulseIndicator}></div>
          <div className={styles.titleWrapper}>
            <h1>FLOCKML ENTERPRISE</h1>
            <div className={styles.subtitle}>GOVERNMENT OF WEST BENGAL | SOVEREIGN AI GRID</div>
          </div>
        </div>
        <div className={styles.statusPill}>
          {isDeploying ? (offlineNodes.length > 0 ? 'FAULT TOLERANCE ACTIVE' : 'SYSTEM ACTIVE') : 'SYSTEM STANDBY'}
        </div>
      </header>

      <div className={styles.mainGrid}>
        
        {/* Left Panel: Hardware Telemetry */}
        <div className={styles.glassPanel}>
          <div className={styles.panelHeader}>
            <h2>INFRASTRUCTURE TELEMETRY</h2>
            <div className={styles.headerLine}></div>
          </div>
          
          <div className={styles.metricGroup}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>STATE GPU ALLOCATION</span>
              <span className={`${styles.metricValue} ${offlineNodes.length > 0 ? styles.textRed : ''}`}>{activeGPUs} <span className={styles.metricUnit}>A100s</span></span>
            </div>

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>TOTAL COMPUTE POWER</span>
              <span className={`${styles.metricValue} ${offlineNodes.length > 0 ? styles.textRed : ''}`}>{isDeploying ? tflops : '0.0'} <span className={styles.metricUnit}>PFLOPS</span></span>
            </div>

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>WBSEDCL POWER DRAW</span>
              <span className={`${styles.metricValue} ${offlineNodes.length > 0 ? styles.textRed : ''}`}>{isDeploying ? powerDraw : '0.000'} <span className={styles.metricUnit}>MW</span></span>
            </div>

            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>AD-SGD SYNC LATENCY</span>
              <span className={`${styles.metricValue} ${offlineNodes.length > 0 ? styles.textRed : ''}`}>{isDeploying ? syncLatency : '--'} <span className={styles.metricUnit}>ms</span></span>
            </div>
          </div>
          
          <div style={{marginTop: 'auto', fontSize: '0.65rem', color: '#888', textAlign: 'center'}}>
            Click any Substation on the map to toggle Power Grid Failure.
          </div>
        </div>

        {/* Center Panel: Substation Network Visualizer */}
        <div className={`${styles.glassPanel} ${styles.centerPanel}`}>
          <div className={styles.panelHeader}>
            <h2>PIPELINE PARALLELISM GRID</h2>
            <div className={styles.headerLine}></div>
          </div>
          
          <div className={styles.networkMap}>
            <div className={styles.mapBackground}></div>

            {/* Hub Connections */}
            <svg className={styles.svgConnections}>
              <path className={`${styles.dataLine} ${isDeploying && !isOffline('Howrah') ? styles.dataLineActive : (isOffline('Howrah') ? styles.dataLineOffline : '')}`} d="M 50% 50% L 20% 30%" />
              <path className={`${styles.dataLine} ${isDeploying && !isOffline('Salt Lake') ? styles.dataLineActive : (isOffline('Salt Lake') ? styles.dataLineOffline : '')}`} d="M 50% 50% L 80% 25%" />
              <path className={`${styles.dataLine} ${isDeploying && !isOffline('Rajarhat') ? styles.dataLineActive : (isOffline('Rajarhat') ? styles.dataLineOffline : '')}`} d="M 50% 50% L 85% 75%" />
              <path className={`${styles.dataLine} ${isDeploying && !isOffline('Jadavpur') ? styles.dataLineActive : (isOffline('Jadavpur') ? styles.dataLineOffline : '')}`} d="M 50% 50% L 25% 80%" />
            </svg>

            {/* Core Master Node */}
            <div className={`${styles.nodeMaster} ${isDeploying ? styles.nodeMasterActive : ''}`}>
               <div className={styles.nodeCore}></div>
               <div className={styles.nodeRing}></div>
               <div className={styles.nodeLabel}>CENTRAL AD-SGD PARAMETER SERVER</div>
            </div>

            {/* Substation Nodes */}
            <div 
              className={`${styles.subNode} ${styles.posHowrah} ${styles.clickableNode} ${isDeploying && !isOffline('Howrah') ? styles.subNodeActive : (isOffline('Howrah') ? styles.subNodeOffline : '')}`}
              onClick={() => toggleNodePower('Howrah', 'Layers 25-32')}
            >
              <div className={styles.gpuIndicator}>{isOffline('Howrah') ? 'OFFLINE' : '64x GPU'}</div>
              <div className={styles.nodeLabel}>HOWRAH</div>
              <div className={styles.pipelineLabel}>{isOffline('Howrah') ? 'POWER FAILURE' : 'Layers 25-32 (Logits)'}</div>
            </div>

            <div 
              className={`${styles.subNode} ${styles.posSaltLake} ${styles.clickableNode} ${isDeploying && !isOffline('Salt Lake') ? styles.subNodeActive : (isOffline('Salt Lake') ? styles.subNodeOffline : '')}`}
              onClick={() => toggleNodePower('Salt Lake', 'Layers 1-8')}
            >
              <div className={styles.gpuIndicator}>{isOffline('Salt Lake') ? 'OFFLINE' : '64x GPU'}</div>
              <div className={styles.nodeLabel}>SALT LAKE</div>
              <div className={styles.pipelineLabel}>{isOffline('Salt Lake') ? 'POWER FAILURE' : 'Layers 1-8 (Self-Attention)'}</div>
            </div>

            <div 
              className={`${styles.subNode} ${styles.posRajarhat} ${styles.clickableNode} ${isDeploying && !isOffline('Rajarhat') ? styles.subNodeActive : (isOffline('Rajarhat') ? styles.subNodeOffline : '')}`}
              onClick={() => toggleNodePower('Rajarhat', 'Layers 9-16')}
            >
              <div className={styles.gpuIndicator}>{isOffline('Rajarhat') ? 'OFFLINE' : '64x GPU'}</div>
              <div className={styles.nodeLabel}>RAJARHAT</div>
              <div className={styles.pipelineLabel}>{isOffline('Rajarhat') ? 'POWER FAILURE' : 'Layers 9-16 (Feed Forward)'}</div>
            </div>

            <div 
              className={`${styles.subNode} ${styles.posJadavpur} ${styles.clickableNode} ${isDeploying && !isOffline('Jadavpur') ? styles.subNodeActive : (isOffline('Jadavpur') ? styles.subNodeOffline : '')}`}
              onClick={() => toggleNodePower('Jadavpur', 'Layers 17-24')}
            >
              <div className={styles.gpuIndicator}>{isOffline('Jadavpur') ? 'OFFLINE' : '64x GPU'}</div>
              <div className={styles.nodeLabel}>JADAVPUR</div>
              <div className={styles.pipelineLabel}>{isOffline('Jadavpur') ? 'POWER FAILURE' : 'Layers 17-24 (Self-Attention)'}</div>
            </div>

          </div>
        </div>

        {/* Right Panel: AD-SGD Math Console */}
        <div className={styles.glassPanel}>
          <div className={styles.panelHeader}>
            <h2>W_GLOBAL SYNCHRONIZATION</h2>
            <div className={styles.headerLine}></div>
          </div>
          
          <button 
            className={`${styles.actionButton} ${isDeploying ? styles.buttonDisabled : ''}`} 
            onClick={handleDeploy}
            disabled={isDeploying}
          >
            {isDeploying ? 'TRAINING IN PROGRESS...' : 'INITIALIZE STATE GRID'}
          </button>
          
          {/* Live Tensor Matrix */}
          <div className={styles.tensorMatrixContainer}>
            <div className={styles.tensorHeader}>LIVE WEIGHT TENSOR [W_global]</div>
            <div className={`${styles.tensorGrid} ${isDeploying ? styles.tensorActive : ''}`}>
              {tensorMatrix.map((row, i) => (
                <div key={i} className={styles.tensorRow}>
                  {row.map((val, j) => (
                    <span key={j} className={styles.tensorCell}>{val}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.consoleContainer} ref={terminalRef}>
            <div className={styles.consoleHeader}>
              <div className={styles.consoleDots}>
                <span></span><span></span><span></span>
              </div>
              <div className={styles.consoleTitle}>FlockML Substation Output</div>
            </div>
            <div className={styles.consoleOutput}>
              {!isDeploying && <div className={styles.standbyText}>Awaiting secure handshake...</div>}
              {logs.map((log, i) => (
                <div key={i} className={log?.includes('KALBAISAKHI') || log?.includes('CRITICAL') || log?.includes('OFFLINE') ? styles.logCritical : (log?.includes('>>>') ? styles.logHighlight : styles.logNormal)}>
                  {log}
                </div>
              ))}
              {isDeploying && <div className={styles.cursor}></div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
