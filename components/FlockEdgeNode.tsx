'use client';

import { useEffect, useRef, useState } from 'react';

export default function FlockEdgeNode() {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<string>('Booting...');
  const [epoch, setEpoch] = useState<number>(0);
  const [payloadSize, setPayloadSize] = useState<number | null>(null);

  useEffect(() => {
    // We only run this in the browser, not during SSR
    if (typeof window !== 'undefined') {
      // Fetch the pre-compiled worker code as text and spawn it via a Blob URL.
      // This is the ultimate bypass: it prevents Next.js or Webpack from intercepting 
      // the Worker constructor and forcing it onto the main thread.
      fetch('/flock.worker.js')
        .then(response => response.text())
        .then(code => {
          const blob = new Blob([code], { type: 'application/javascript' });
          const workerUrl = URL.createObjectURL(blob);
          
          workerRef.current = new Worker(workerUrl, { name: 'FlockMLEdgeWorker' });

          workerRef.current.onmessage = (event) => {
            if (event.data.type === 'TELEMETRY') {
              setStatus('Training Local AI Model...');
              setEpoch(event.data.epoch);
            } else if (event.data.type === 'TRAINING_COMPLETE') {
              setStatus('DPDP Encryption Complete');
              setPayloadSize(event.data.payload.dataLength);
              URL.revokeObjectURL(workerUrl); // Cleanup
            }
          };

          // Kick off the training silently
          setTimeout(() => {
            workerRef.current?.postMessage({ type: 'START_TRAINING' });
          }, 2000); // Wait 2 seconds so the UI has time to mount smoothly
        });
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div className="bg-black/90 backdrop-blur-md border border-slate-800 rounded-lg p-3 text-[10px] font-mono text-slate-400 shadow-2xl flex flex-col gap-1 w-64">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-slate-300">FlockML Edge Node</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>
        
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="text-cyan-400 truncate ml-2">{status}</span>
        </div>
        
        {epoch > 0 && !payloadSize && (
          <div className="flex justify-between">
            <span>Matrix Epoch:</span>
            <span className="text-amber-400">{epoch.toLocaleString()} / 10,000</span>
          </div>
        )}
        
        {payloadSize && (
          <div className="flex justify-between border-t border-slate-800 pt-1 mt-1">
            <span className="text-emerald-400">Int8 Payload Ready:</span>
            <span className="text-fuchsia-400 font-bold">{payloadSize} bytes</span>
          </div>
        )}
      </div>
    </div>
  );
}
