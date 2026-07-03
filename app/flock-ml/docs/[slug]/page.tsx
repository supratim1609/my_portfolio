import { getDocBySlug } from '@/lib/docs';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import remarkGfm from 'remark-gfm';
import { EngineerBlock, JuniorBlock } from '../MDXClientBlocks';
export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const doc = getDocBySlug(resolvedParams.slug);

  if (!doc) {
    notFound();
  }

  // Custom components for the MDX renderer to make it look incredibly sleek
  const components = {
    h1: (props: any) => <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-8 border-b border-white/10 pb-6" {...props} />,
    h2: (props: any) => <h2 className="text-2xl sm:text-3xl font-bold text-white mt-16 mb-6" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-bold text-emerald-400 mt-10 mb-4 font-mono" {...props} />,
    p: (props: any) => <p className="text-[#A1A1A1] leading-relaxed text-lg mb-6" {...props} />,
    ul: (props: any) => <ul className="text-[#A1A1A1] text-lg space-y-3 list-disc pl-6 mb-6" {...props} />,
    li: (props: any) => <li className="leading-relaxed" {...props} />,
    strong: (props: any) => <strong className="text-white font-bold" {...props} />,
    pre: (props: any) => (
      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden my-8 shadow-2xl">
        <div className="px-4 py-3 border-b border-white/5 bg-[#1A1A1A] flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <pre className="p-6 overflow-x-auto text-sm font-mono text-[#E5E5E5] leading-relaxed" {...props} />
      </div>
    ),
    code: (props: any) => <code className="bg-white/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-[0.9em]" {...props} />,
    table: (props: any) => (
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0A0A0A] my-8">
        <table className="w-full text-left text-sm" {...props} />
      </div>
    ),
    th: (props: any) => <th className="px-6 py-4 bg-[#111] border-b border-white/10 text-white font-bold" {...props} />,
    td: (props: any) => <td className="px-6 py-4 border-b border-white/5 text-[#A1A1A1]" {...props} />,
    EngineerBlock,
    JuniorBlock,
  };

  return (
    <article className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <MDXRemote source={doc.content} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </article>
  );
}
