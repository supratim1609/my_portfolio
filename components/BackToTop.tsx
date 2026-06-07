"use client";

import { motion, useScroll, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const { scrollY } = useScroll();
  const controls = useAnimationControls();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      if (latest > 500 && !isVisible) {
        setIsVisible(true);
        controls.start({ opacity: 1, y: 0, pointerEvents: "auto" });
      } else if (latest <= 500 && isVisible) {
        setIsVisible(false);
        controls.start({ opacity: 0, y: 20, pointerEvents: "none" });
      }
    });
  }, [scrollY, isVisible, controls]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, pointerEvents: "none" }}
      animate={controls}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:bg-[#FF3B30] hover:text-white transition-colors"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
}
