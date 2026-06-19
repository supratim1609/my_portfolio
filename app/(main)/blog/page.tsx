import { getSortedPostsData } from "@/lib/blog";
import BlogList from "@/components/BlogList";

export const metadata = {
  title: "Notes | Blog",
  description: "Writing about design, engineering, and minimalism.",
};

export default function Blog() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-black text-white pt-32 pb-20 px-5 pr-16 sm:px-12 md:px-24 relative">
      
      {/* Background glowing orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF3B30]/10 blur-[120px] rounded-[100%] pointer-events-none opacity-50 mix-blend-screen" />
      
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#A1A1A1] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
            LATEST ARTICLES
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            Articles
          </h1>
          <p className="text-[#A1A1A1] text-lg sm:text-xl max-w-xl leading-relaxed">
            Deep dives into software engineering, system architecture, and building high-performance apps.
          </p>
        </header>

        <BlogList posts={posts} />
      </div>
    </div>
  );
}
