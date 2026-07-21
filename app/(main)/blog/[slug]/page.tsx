import { getPostData, getSortedPostsData } from "@/lib/blog";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SystemDiagram from "@/components/mdx/SystemDiagram";
import Readout from "@/components/mdx/Readout";
import ReadingProgress from "@/components/ReadingProgress";
import BackToTop from "@/components/BackToTop";
import Mermaid from "@/components/mdx/Mermaid";

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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* Hallmark · genre: editorial · macrostructure: 02-long-document · design-system: none */
const components = {
  h1: (props: any) => <h1 className="text-3xl font-normal mt-16 mb-6 tracking-tight text-white" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-normal mt-12 mb-4 tracking-tight text-white" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-normal mt-8 mb-4 tracking-tight text-white" {...props} />,
  p: (props: any) => <p className="text-[#A1A1A1] leading-relaxed mb-6" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside text-[#A1A1A1] mb-6 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside text-[#A1A1A1] mb-6 space-y-2" {...props} />,
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  a: (props: any) => <a className="text-white underline decoration-white/20 underline-offset-4 hover:decoration-white transition-colors" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l border-white/20 pl-6 my-8 italic text-[#888]" {...props} />,
  code: (props: any) => {
    if (props.className === 'language-mermaid') {
      return <Mermaid chart={props.children} />;
    }
    return <code className="bg-white/5 text-[#E5E5E5] px-1.5 py-0.5 rounded-md text-[0.8em] font-mono" {...props} />;
  },
  pre: (props: any) => {
    // If the only child is our mermaid code block, strip the pre wrapper
    if (props.children?.props?.className === 'language-mermaid') {
      return <Mermaid chart={props.children.props.children} />;
    }
    return <pre className="bg-[#0A0A0A] p-6 rounded-xl overflow-x-auto border border-white/5 mb-8 text-[0.85em]" {...props} />;
  },
  strong: (props: any) => <strong className="font-semibold text-white" {...props} />,
  SystemDiagram: (props: any) => <SystemDiagram {...props} />,
  Readout: (props: any) => <Readout {...props} />,
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
    <>
      <ReadingProgress />
      <article className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-black text-white pt-32 pb-32 px-5 sm:px-12 md:px-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="max-w-2xl mx-auto">
          
          {/* Minimal Back Button */}
          <Link href="/blog" className="inline-flex items-center text-[#777] hover:text-white mb-16 transition-colors text-sm font-mono uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Index
          </Link>
          
          <header className="mb-16 pb-8 border-b border-white/10">
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight mb-6 leading-tight">
              {post.metadata.title}
            </h1>
            <div className="flex items-center text-xs font-mono text-[#777] uppercase tracking-widest gap-2">
              <time dateTime={post.metadata.date}>
                {new Date(post.metadata.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
              </time>
              {post.metadata.tags && post.metadata.tags.length > 0 && (
                <>
                  <span className="opacity-50">/</span>
                  <span>{post.metadata.tags.join(", ")}</span>
                </>
              )}
            </div>
          </header>

          <div className="prose prose-invert prose-sm sm:prose-base max-w-none font-sans w-full break-words">
            <MDXRemote source={post.content} components={components} />
          </div>
          
        </div>
      </article>
      <BackToTop />
    </>
  );
}
