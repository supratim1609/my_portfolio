import { getSortedPostsData } from "@/lib/blog";
import BlogList from "@/components/BlogList";

export const metadata = {
  title: "Notes | Blog",
  description: "Writing about design, engineering, and minimalism.",
};

/* Hallmark · genre: editorial · macrostructure: 13-index-first · design-system: none */

export default function Blog() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-black text-white pt-32 pb-20 px-5 sm:px-12 md:px-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <p className="text-[#A1A1A1] text-sm font-mono uppercase tracking-widest">
            Writing · 2024 — 2026
          </p>
        </header>

        <BlogList posts={posts} />
      </div>
    </div>
  );
}
