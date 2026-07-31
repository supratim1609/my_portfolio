import { getDocBySlug, getSidebarNavigation } from '@/lib/docs';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { EngineerBlock, JuniorBlock } from '../MDXClientBlocks';

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const doc = getDocBySlug(resolvedParams.slug);

  if (!doc) notFound();

  // Build prev/next links
  const allDocs = getSidebarNavigation();
  const currentIdx = allDocs.findIndex(d => d.slug === resolvedParams.slug);
  const prev = currentIdx > 0 ? allDocs[currentIdx - 1] : null;
  const next = currentIdx < allDocs.length - 1 ? allDocs[currentIdx + 1] : null;

  const components = {
    h1: (props: any) => (
      <h1
        className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-3 leading-tight"
        {...props}
      />
    ),
    h2: (props: any) => (
      <h2
        className="text-xl font-bold text-white mt-14 mb-4 pb-3 border-b border-white/[0.06]"
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3
        className="font-mono text-[11px] tracking-[0.25em] uppercase text-zinc-500 mt-10 mb-3"
        {...props}
      />
    ),
    p: (props: any) => (
      <p className="text-zinc-400 leading-relaxed text-[15px] mb-5" {...props} />
    ),
    ul: (props: any) => (
      <ul className="space-y-2 mb-6 pl-0" {...props} />
    ),
    li: (props: any) => (
      <li className="flex gap-3 text-[15px] text-zinc-400 leading-relaxed before:content-['—'] before:text-zinc-700 before:shrink-0" {...props} />
    ),
    strong: (props: any) => (
      <strong className="text-white font-semibold" {...props} />
    ),
    a: (props: any) => (
      <a className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all" {...props} />
    ),
    blockquote: (props: any) => (
      <blockquote
        className="border-l-2 border-white/20 pl-5 my-6 text-zinc-500 italic text-[15px] leading-relaxed"
        {...props}
      />
    ),
    pre: (props: any) => (
      <div className="my-8 rounded-none border border-white/10 overflow-hidden bg-[#0d0d0d]">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-[#0a0a0a]">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
        <pre className="p-5 overflow-x-auto text-[13px] font-mono text-zinc-300 leading-relaxed" {...props} />
      </div>
    ),
    code: (props: any) => {
      // Inline code only — block code is handled by pre
      if (typeof props.children === 'string') {
        return (
          <code
            className="bg-white/[0.06] text-zinc-300 px-1.5 py-0.5 font-mono text-[0.85em] rounded-sm"
            {...props}
          />
        );
      }
      return <code {...props} />;
    },
    table: (props: any) => (
      <div className="overflow-x-auto my-8 border border-white/[0.08] rounded-none">
        <table className="w-full text-left text-[13px] font-mono" {...props} />
      </div>
    ),
    th: (props: any) => (
      <th
        className="px-5 py-3 bg-white/[0.03] border-b border-white/[0.08] text-zinc-400 font-mono text-[10px] tracking-[0.2em] uppercase"
        {...props}
      />
    ),
    td: (props: any) => (
      <td className="px-5 py-3 border-b border-white/[0.05] text-zinc-500" {...props} />
    ),
    hr: () => <hr className="border-white/[0.06] my-10" />,
    EngineerBlock,
    JuniorBlock,
  };

  return (
    <article className="max-w-3xl">

      {/* Breadcrumb */}
      <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-zinc-700 mb-8">
        FlockML / Docs / {doc.meta.title}
      </div>

      {/* Content */}
      <div className="prose-custom">
        <MDXRemote
          source={doc.content}
          components={components}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      {/* Prev / Next nav */}
      <div className="mt-16 pt-8 border-t border-white/[0.06] flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/flock-ml/docs/${prev.slug}`}
            className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-700 mb-0.5">Previous</p>
              <p className="text-[13px]">{prev.title}</p>
            </div>
          </Link>
        ) : <div />}

        {next ? (
          <Link
            href={`/flock-ml/docs/${next.slug}`}
            className="group flex items-center gap-3 text-right text-zinc-500 hover:text-white transition-colors"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-700 mb-0.5">Next</p>
              <p className="text-[13px]">{next.title}</p>
            </div>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : <div />}
      </div>

    </article>
  );
}
