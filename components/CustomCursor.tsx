"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfigOuter = { damping: 25, stiffness: 400 };
  const cursorXSpringOuter = useSpring(cursorX, springConfigOuter);
  const cursorYSpringOuter = useSpring(cursorY, springConfigOuter);

  const springConfigInner = { damping: 40, stiffness: 800 };
  const cursorXSpringInner = useSpring(cursorX, springConfigInner);
  const cursorYSpringInner = useSpring(cursorY, springConfigInner);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the outer circle
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };
    
    document.body.style.cursor = "none";
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(styleElement);

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = "auto";
      document.head.removeChild(styleElement);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-8 w-8 rounded-full border border-[#888888]/50 mix-blend-difference"
        style={{ x: cursorXSpringOuter, y: cursorYSpringOuter }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-white mix-blend-difference translate-x-[12px] translate-y-[12px]"
        style={{ x: cursorXSpringInner, y: cursorYSpringInner }}
      />
    </>
  );
}
