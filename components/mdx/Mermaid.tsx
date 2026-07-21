"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function Mermaid({ chart }: { chart: string }) {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "monospace",
    });

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div 
      className="mermaid-diagram my-10 p-6 bg-[#0A0A0A] border border-white/5 rounded-xl flex justify-center w-full overflow-x-auto" 
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
