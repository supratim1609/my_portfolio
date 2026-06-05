import { getPostData, getSortedPostsData } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.metadata.title} | Notes`,
    description: post.metadata.description,
  };
}

const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold mt-12 mb-6 tracking-tighter" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-10 mb-4 tracking-tight" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-8 mb-4 tracking-tight" {...props} />,
  p: (props: any) => <p className="text-[#A1A1A1] leading-relaxed mb-6" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside text-[#A1A1A1] mb-6 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside text-[#A1A1A1] mb-6 space-y-2" {...props} />,
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  a: (props: any) => <a className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-2 border-[#FF3B30] pl-6 my-8 italic text-[#A1A1A1]" {...props} />,
  code: (props: any) => <code className="bg-white/5 text-[#E5E5E5] px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
  pre: (props: any) => <pre className="bg-[#111] p-6 rounded-lg overflow-x-auto border border-white/5 mb-8" {...props} />,
  strong: (props: any) => <strong className="font-semibold text-white" {...props} />,
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.metadata.title,
    "description": post.metadata.description,
    "datePublished": new Date(post.metadata.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": "Supratim Dhara",
      "url": "https://supratimdev.qzz.io/"
    }
  };

  return (
    <article className="min-h-screen bg-black text-white pt-32 pb-20 px-6 sm:px-12 md:px-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="inline-flex items-center text-xs font-mono text-[#A1A1A1] uppercase tracking-widest hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Notes
        </Link>
        
        <header className="mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tighter mb-4 leading-tight">
            {post.metadata.title}
          </h1>
          <div className="flex flex-wrap items-center text-xs font-mono text-[#555] uppercase tracking-widest gap-2">
            <time dateTime={post.metadata.date}>
              {new Date(post.metadata.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            {post.metadata.tags && post.metadata.tags.length > 0 && (
              <>
                <span>•</span>
                <span>{post.metadata.tags.join(", ")}</span>
              </>
            )}
          </div>
        </header>

        <div className="text-lg">
          <MDXRemote source={post.content} components={components} />
        </div>
      </div>
    </article>
  );
}
