"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPostMetadata } from "@/lib/blog";

export default function BlogList({ posts }: { posts: BlogPostMetadata[] }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } },
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="flex flex-col border-t border-white/10"
    >
      {posts.map((post) => (
        <motion.div key={post.slug} variants={item}>
          <Link href={`/blog/${post.slug}`} className="group block outline-none border-b border-white/10 py-6 hover:bg-white/[0.02] transition-colors duration-300">
            <article className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 px-4">
              
              {/* Date column */}
              <time className="shrink-0 md:w-32 text-xs font-mono text-[#777] uppercase tracking-widest">
                {new Date(post.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
              </time>

              {/* Title & Description column */}
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-xl md:text-2xl font-normal tracking-tight text-white group-hover:text-[#FF3B30] transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-[#A1A1A1] text-sm leading-relaxed max-w-2xl">
                  {post.description}
                </p>
              </div>

              {/* Arrow column (visible on hover) */}
              <div className="hidden md:flex shrink-0 w-8 justify-end items-center text-[#FF3B30] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight size={16} />
              </div>

            </article>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
