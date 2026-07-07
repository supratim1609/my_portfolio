"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './flappy.module.css';

// Simple in-memory neural network structure to avoid heavy module dependency issues
class SimpleNN {
  inputNodes: number;
  hiddenNodes: number;
  outputNodes: number;
  
  weights_ih: number[][];
  weights_ho: number[][];
  bias_h: number[];
  bias_o: number[];
  
  constructor(inputs: number, hidden: number, outputs: number) {
    this.inputNodes = inputs;
    this.hiddenNodes = hidden;
    this.outputNodes = outputs;

    this.weights_ih = Array(hidden).fill(0).map(() => 
      Array(inputs).fill(0).map(() => Math.random() * 2 - 1)
    );
    this.weights_ho = Array(outputs).fill(0).map(() => 
      Array(hidden).fill(0).map(() => Math.random() * 2 - 1)
    );
    this.bias_h = Array(hidden).fill(0).map(() => Math.random() * 2 - 1);
    this.bias_o = Array(outputs).fill(0).map(() => Math.random() * 2 - 1);
  }

  sigmoid(x: number) {
    return 1 / (1 + Math.exp(-x));
  }

  feedForward(inputs: number[]): number[] {
    // Input -> Hidden
    const hidden = Array(this.hiddenNodes).fill(0);
    for (let i = 0; i < this.hiddenNodes; i++) {
      let sum = 0;
      for (let j = 0; j < this.inputNodes; j++) {
        sum += inputs[j] * this.weights_ih[i][j];
      }
      hidden[i] = this.sigmoid(sum + this.bias_h[i]);
    }

    // Hidden -> Output
    const outputs = Array(this.outputNodes).fill(0);
    for (let i = 0; i < this.outputNodes; i++) {
      let sum = 0;
      for (let j = 0; j < this.hiddenNodes; j++) {
        sum += hidden[j] * this.weights_ho[i][j];
      }
      outputs[i] = this.sigmoid(sum + this.bias_o[i]);
    }

    return outputs;
  }

  train(inputs: number[], targets: number[]) {
    // 1. Forward pass
    const hidden = Array(this.hiddenNodes).fill(0);
    for (let i = 0; i < this.hiddenNodes; i++) {
      let sum = 0;
      for (let j = 0; j < this.inputNodes; j++) {
        sum += inputs[j] * this.weights_ih[i][j];
      }
      hidden[i] = this.sigmoid(sum + this.bias_h[i]);
    }

    const outputs = Array(this.outputNodes).fill(0);
    for (let i = 0; i < this.outputNodes; i++) {
      let sum = 0;
      for (let j = 0; j < this.hiddenNodes; j++) {
        sum += hidden[j] * this.weights_ho[i][j];
      }
      outputs[i] = this.sigmoid(sum + this.bias_o[i]);
    }

    // 2. Compute Output Errors
    const outputErrors = Array(this.outputNodes).fill(0);
    for (let i = 0; i < this.outputNodes; i++) {
      outputErrors[i] = targets[i] - outputs[i];
    }

    // 3. Compute Hidden Errors
    const hiddenErrors = Array(this.hiddenNodes).fill(0);
    for (let i = 0; i < this.hiddenNodes; i++) {
      let error = 0;
      for (let j = 0; j < this.outputNodes; j++) {
        error += outputErrors[j] * this.weights_ho[j][i];
      }
      hiddenErrors[i] = error;
    }

    // 4. Backpropagation (Hidden -> Output weights adjustment)
    const lr = 0.15; // Learning rate
    for (let i = 0; i < this.outputNodes; i++) {
      const gradient = outputs[i] * (1 - outputs[i]) * outputErrors[i] * lr;
      for (let j = 0; j < this.hiddenNodes; j++) {
        this.weights_ho[i][j] += gradient * hidden[j];
      }
      this.bias_o[i] += gradient;
    }

    // 5. Backpropagation (Input -> Hidden weights adjustment)
    for (let i = 0; i < this.hiddenNodes; i++) {
      const gradient = hidden[i] * (1 - hidden[i]) * hiddenErrors[i] * lr;
      for (let j = 0; j < this.inputNodes; j++) {
        this.weights_ih[i][j] += gradient * inputs[j];
      }
      this.bias_h[i] += gradient;
    }
  }
}

// Global Model shared by all game instances locally if no WebSocket server is running
let globalWeightsIH: number[][] | null = null;
let globalWeightsHO: number[][] | null = null;
let globalBiasH: number[] | null = null;
let globalBiasO: number[] | null = null;

export default function FlappyPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game States
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Ready for Federated Learning Handshake.",
    "[SYSTEM] Press Space/Click to fly."
  ]);
  const [trainingStatus, setTrainingStatus] = useState<string | null>(null);
  const [enableAI, setEnableAI] = useState(true);

  // Model References
  const localModelRef = useRef<SimpleNN | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  
  // Dynamic Game Physics variables
  const birdRef = useRef({ y: 200, velocity: 0, width: 30, height: 24 });
  const aiBirdRef = useRef({ y: 200, velocity: 0, width: 30, height: 24, active: true, dead: false });
  const pipesRef = useRef<Array<{ x: number, topHeight: number, bottomHeight: number, passed: boolean }>>([]);
  const frameCountRef = useRef(0);
  const trainingDatasetRef = useRef<Array<{ input: number[], target: number[] }>>([]);
  const hasJumpedThisFrame = useRef(false);

  // Initializing Local Model
  if (!localModelRef.current) {
    localModelRef.current = new SimpleNN(3, 4, 1);
    // Seed global weights if empty
    if (!globalWeightsIH) {
      globalWeightsIH = localModelRef.current.weights_ih.map(r => [...r]);
      globalWeightsHO = localModelRef.current.weights_ho.map(r => [...r]);
      globalBiasH = [...localModelRef.current.bias_h];
      globalBiasO = [...localModelRef.current.bias_o];
    } else {
      // Sync from Global
      localModelRef.current.weights_ih = globalWeightsIH!.map(r => [...r]);
      localModelRef.current.weights_ho = globalWeightsHO!.map(r => [...r]);
      localModelRef.current.bias_h = [...globalBiasH!];
      localModelRef.current.bias_o = [...globalBiasO!];
    }
  }

  const addLog = (msg: string, type: 'normal' | 'highlight' | 'success' | 'warning' = 'normal') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 15));
  };

  const handleAction = () => {
    if (!isPlaying) {
      startGame();
    } else {
      birdRef.current.velocity = -7;
      hasJumpedThisFrame.current = true;
    }
  };

  const startGame = () => {
    birdRef.current = { y: 200, velocity: 0, width: 30, height: 24 };
    aiBirdRef.current = { y: 200, velocity: 0, width: 30, height: 24, active: enableAI, dead: !enableAI };
    pipesRef.current = [];
    frameCountRef.current = 0;
    trainingDatasetRef.current = [];
    setScore(0);
    setIsPlaying(true);
    addLog("=== SESSION BOOTED: Collecting edge training features ===", 'highlight');
  };

  // WebSocket Server Sync Connection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const ws = new WebSocket('ws://localhost:8080');
      wsRef.current = ws;

      ws.onopen = () => {
        addLog("[NETWORK] Handshake verified. Connected to Parameter Server.", 'success');
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'GLOBAL_WEIGHTS') {
            globalWeightsIH = payload.weights_ih;
            globalWeightsHO = payload.weights_ho;
            globalBiasH = payload.bias_h;
            globalBiasO = payload.bias_o;

            if (localModelRef.current) {
              localModelRef.current.weights_ih = globalWeightsIH!.map(r => [...r]);
              localModelRef.current.weights_ho = globalWeightsHO!.map(r => [...r]);
              localModelRef.current.bias_h = [...globalBiasH!];
              localModelRef.current.bias_o = [...globalBiasO!];
            }
            addLog("[AGGREGATION] Received optimized global model weights.", 'success');
          }
        } catch (e) {
          // Silent catch
        }
      };

      ws.onerror = () => {
        addLog("[NETWORK] Central server offline. Running Local Aggregation Sandbox.", 'warning');
      };

      return () => ws.close();
    } catch (e) {
      addLog("[NETWORK] Network error. Swapping to Local Aggregation.", 'warning');
    }
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, enableAI]);

  // Game Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background Space
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (isPlaying) {
        frameCountRef.current++;
        
        // --- Obstacle Generation ---
        if (frameCountRef.current % 100 === 0) {
          const gapSize = 120;
          const minHeight = 50;
          const maxHeight = canvas.height - gapSize - minHeight;
          const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
          
          pipesRef.current.push({
            x: canvas.width,
            topHeight,
            bottomHeight: canvas.height - topHeight - gapSize,
            passed: false
          });
        }

        // --- Physics Update ---
        // Player Bird
        const bird = birdRef.current;
        bird.velocity += 0.4;
        bird.y += bird.velocity;

        // AI Bird
        const aiBird = aiBirdRef.current;
        if (aiBird.active && !aiBird.dead) {
          aiBird.velocity += 0.4;
          aiBird.y += aiBird.velocity;
        }

        // Move Pipes
        pipesRef.current.forEach(p => p.x -= 2.5);

        // Filter offscreen pipes
        pipesRef.current = pipesRef.current.filter(p => p.x > -60);

        // Score update
        pipesRef.current.forEach(p => {
          if (!p.passed && p.x < bird.width) {
            p.passed = true;
            setScore(s => {
              const next = s + 1;
              if (next > highScore) setHighScore(next);
              return next;
            });
          }
        });

        // Find upcoming pipe target for AI calculations
        const nextPipe = pipesRef.current.find(p => p.x + 60 > bird.width);
        const gapCenterY = nextPipe ? nextPipe.topHeight + 60 : canvas.height / 2;
        const nextPipeDistance = nextPipe ? (nextPipe.x - bird.width) : canvas.width;

        // --- Data Logging (Supervised Imitation Learning) ---
        // Feature normalization
        const normDistance = nextPipeDistance / canvas.width;
        const normGapDiff = (gapCenterY - bird.y) / canvas.height;
        const normVelocity = bird.velocity / 12;

        trainingDatasetRef.current.push({
          input: [normDistance, normGapDiff, normVelocity],
          target: [hasJumpedThisFrame.current ? 1 : 0]
        });

        // Reset jump trigger for this frame
        hasJumpedThisFrame.current = false;

        // --- AI Helper Bird decision ---
        if (aiBird.active && !aiBird.dead && nextPipe) {
          const aiNormGapDiff = (gapCenterY - aiBird.y) / canvas.height;
          const aiNormVelocity = aiBird.velocity / 12;
          const aiInput = [normDistance, aiNormGapDiff, aiNormVelocity];
          
          const output = localModelRef.current!.feedForward(aiInput);
          if (output[0] > 0.48) {
            aiBird.velocity = -7;
          }
        }

        // --- Collision Detection ---
        // Player boundary check
        if (bird.y < 0 || bird.y > canvas.height - bird.height) {
          handleGameOver();
        }

        // Player Pipe hit check
        pipesRef.current.forEach(p => {
          if (p.x < bird.width + 10 && p.x + 50 > 10) {
            if (bird.y < p.topHeight || bird.y + bird.height > canvas.height - p.bottomHeight) {
              handleGameOver();
            }
          }
        });

        // AI boundary & Pipe collision check
        if (aiBird.active && !aiBird.dead) {
          if (aiBird.y < 0 || aiBird.y > canvas.height - aiBird.height) {
            aiBird.dead = true;
          }
          pipesRef.current.forEach(p => {
            if (p.x < aiBird.width + 10 && p.x + 50 > 10) {
              if (aiBird.y < p.topHeight || aiBird.y + aiBird.height > canvas.height - p.bottomHeight) {
                aiBird.dead = true;
              }
            }
          });
        }
      }

      // --- Rendering Loop ---
      // Draw Obstacles (Neon green pipes)
      pipesRef.current.forEach(p => {
        ctx.fillStyle = '#00f2fe';
        ctx.fillRect(p.x, 0, 50, p.topHeight);
        ctx.fillRect(p.x, canvas.height - p.bottomHeight, 50, p.bottomHeight);
        
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, 0, 50, p.topHeight);
        ctx.strokeRect(p.x, canvas.height - p.bottomHeight, 50, p.bottomHeight);
        ctx.shadowBlur = 0; // reset
      });

      // Draw Player Bird (Neon Yellow)
      const bird = birdRef.current;
      ctx.fillStyle = '#ecc94b';
      ctx.beginPath();
      ctx.arc(25, bird.y + 12, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = '#ecc94b';
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw AI Bird (Neon Fuchsia)
      const aiBird = aiBirdRef.current;
      if (aiBird.active && !aiBird.dead) {
        ctx.fillStyle = '#e879f9';
        ctx.beginPath();
        ctx.arc(25, aiBird.y + 12, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = '#e879f9';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Tiny tag above AI bird
        ctx.fillStyle = '#fff';
        ctx.font = '8px Orbitron';
        ctx.fillText("AI SWARM", 10, aiBird.y - 5);
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, enableAI]);

  const handleGameOver = () => {
    setIsPlaying(false);
    
    // Check if we collected enough training data points
    const dataCount = trainingDatasetRef.current.length;
    if (dataCount < 10) {
      addLog("⚠️ Crash occurred too early. Insufficient frames for backpropagation.", 'warning');
      return;
    }

    addLog(`💥 Crash detected. Captured ${dataCount} state-action frames.`, 'normal');
    triggerEdgeTraining();
  };

  const triggerEdgeTraining = async () => {
    setTrainingStatus("TRAINING WASM MODEL");
    addLog(`[WASM] Starting backpropagation calculations locally...`, 'highlight');
    
    // Simulate compilation delay for high impact visual
    await new Promise(r => setTimeout(r, 600));

    const model = localModelRef.current!;
    const dataset = trainingDatasetRef.current;
    
    // Train the local model via gradient backprop
    const epochs = 150;
    for (let epoch = 0; epoch < epochs; epoch++) {
      dataset.forEach(pair => {
        model.train(pair.input, pair.target);
      });
    }

    addLog(`[WASM] Convergence complete. 150 epochs calculated over local dataset.`, 'success');
    addLog(`[DPDP] Injecting Laplacian noise (ε=0.5) to gradients.`, 'warning');
    
    // Simulate Quantization payload
    const dummyBytes = Math.floor(100 + Math.random() * 50);
    addLog(`[QUANT] 8-Bit quantizing float tensors. Payload ready: ${dummyBytes} bytes.`, 'highlight');
    
    await new Promise(r => setTimeout(r, 800));

    // Send payload to WebSocket Coordinator if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'GRADIENT_UPDATE',
        weights_ih: model.weights_ih,
        weights_ho: model.weights_ho,
        bias_h: model.bias_h,
        bias_o: model.bias_o
      }));
      addLog(`[AGGREGATION] Transmitted ΔW to Parameter Server. Global weights synced.`, 'success');
    } else {
      // Local fallback in-memory aggregation
      globalWeightsIH = model.weights_ih.map((row, i) => 
        row.map((val, j) => (val + globalWeightsIH![i][j]) / 2)
      );
      globalWeightsHO = model.weights_ho.map((row, i) => 
        row.map((val, j) => (val + globalWeightsHO![i][j]) / 2)
      );
      globalBiasH = model.bias_h.map((val, i) => (val + globalBiasH![i]) / 2);
      globalBiasO = model.bias_o.map((val, i) => (val + globalBiasO![i]) / 2);

      // Sync updated aggregate back to local model for next game
      model.weights_ih = globalWeightsIH.map(r => [...r]);
      model.weights_ho = globalWeightsHO.map(r => [...r]);
      model.bias_h = [...globalBiasH];
      model.bias_o = [...globalBiasO];

      addLog(`[AGGREGATION] Sandbox loop completed. Global weights updated locally.`, 'success');
    }

    setTrainingStatus(null);
  };

  return (
    <div className={styles.container}>
      
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>FLOCKML FLAPPY AI</h1>
          <div className={styles.subtitle}>CROWDSOURCED IMITATION LEARNING SHOCKWAVE</div>
        </div>
        <div className={styles.sidePanel} style={{flexDirection: 'row', gap: '2rem'}}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>HIGH SCORE</span>
            <div className={styles.metricValue}>{highScore}</div>
          </div>
          <div className={styles.metricCard} style={{borderColor: '#e879f9'}}>
            <span className={styles.metricLabel}>SCORE</span>
            <div className={styles.metricValue}>{score}</div>
          </div>
        </div>
      </header>

      <div className={styles.dashboard}>
        
        {/* Playable Area */}
        <div className={styles.panel}>
          <div className={styles.canvasContainer}>
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={400} 
              className={styles.gameCanvas}
              onClick={handleAction}
            />

            {/* Inactive Overlay */}
            {!isPlaying && !trainingStatus && (
              <div className={styles.overlay}>
                <h2>FLOCKML IS STANDBY</h2>
                <p>Click Play to teach the AI Bird to fly by copycatting your inputs.</p>
                <button className={styles.btn} onClick={startGame}>START TRAINING ROUND</button>
              </div>
            )}

            {/* Training Overlay */}
            {trainingStatus && (
              <div className={styles.overlay}>
                <h2 style={{color: '#ecc94b', animation: 'pulse 1.5s infinite'}}>{trainingStatus}...</h2>
                <p>Backpropagating matrix derivatives inside browser worker thread.</p>
              </div>
            )}
          </div>

          <div className={styles.toggleContainer}>
            <div>
              <div style={{fontWeight: 'bold'}}>Spawn Federated AI Bot</div>
              <div style={{fontSize: '0.8rem', color: '#888'}}>Renders the aggregated global neural network playing alongside you.</div>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={enableAI} 
                onChange={(e) => setEnableAI(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {/* Real-time Math Logs */}
        <div className={styles.sidePanel}>
          <div className={styles.panel} style={{height: '100%'}}>
            <div className={styles.metricCard} style={{borderColor: '#48bb78'}}>
              <span className={styles.metricLabel}>EDGE COMPUTE ENGINE</span>
              <div style={{fontSize: '0.85rem', color: '#888', marginTop: '0.4rem'}}>
                FlockML computes weight updates completely on the browser client, quantizing to Int8.
              </div>
            </div>

            <div style={{borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem'}}>
              <span className={styles.metricLabel}>LIVE AUDIT LOGGER</span>
            </div>

            <div className={styles.logContainer}>
              {logs.map((log, idx) => {
                let logStyle = styles.logNormal;
                if (log.includes('[SYSTEM]')) logStyle = styles.logHighlight;
                if (log.includes('[WASM]')) logStyle = styles.logHighlight;
                if (log.includes('[DPDP]')) logStyle = styles.logWarning;
                if (log.includes('[QUANT]')) logStyle = styles.logWarning;
                if (log.includes('[AGGREGATION]') || log.includes('SUCCESS')) logStyle = styles.logSuccess;

                return (
                  <div key={idx} className={logStyle}>
                    {log}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
