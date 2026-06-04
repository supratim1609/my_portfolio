"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPostMetadata } from "@/lib/blog";

export default function BlogList({ posts }: { posts: BlogPostMetadata[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="flex flex-col gap-8 relative z-10"
    >
      {posts.map((post) => (
        <motion.div key={post.slug} variants={item}>
          <Link href={`/blog/${post.slug}`} className="group block outline-none">
            <article className="relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 overflow-hidden group-hover:bg-white/[0.04] group-hover:border-white/20 group-focus-visible:border-[#FF3B30]">
              
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B30]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4 sm:gap-0">
                <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#FF3B30] transition-colors duration-300">
                  {post.title}
                </h2>
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <time className="text-xs font-mono text-[#555] uppercase tracking-widest">
                    {new Date(post.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap sm:justify-end">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-mono text-[#A1A1A1] bg-black/50 border border-white/10 px-2 py-0.5 rounded-full uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className="relative z-10 text-[#A1A1A1] text-sm sm:text-base leading-relaxed mb-6 line-clamp-2">
                {post.description}
              </p>

              <div className="relative z-10 flex items-center text-xs font-mono text-[#555] uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                Read Article <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </article>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
