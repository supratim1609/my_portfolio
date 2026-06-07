"use client";

import { motion, useScroll } from "framer-motion";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-[#FF3B30] origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
