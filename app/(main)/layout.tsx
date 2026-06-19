import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowRight } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Global Announcement Banner */}
      <Link href="/scatterjs" className="fixed top-0 left-0 w-full z-50 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors border-b border-emerald-500/20 backdrop-blur-md flex items-center justify-center py-2.5 px-4 group cursor-pointer">
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono text-emerald-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block"></span>
          <span><strong className="text-white">Scatter.js:</strong> Decentralizing AI in the browser.</span>
          <span className="text-[#A1A1A1] pl-2 hidden sm:inline">Dropping in 48 hours.</span>
          <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
      
      <Navbar />
      {/* Add top padding so content doesn't get hidden behind the fixed banner */}
      <div className="pt-10">
        {children}
      </div>
    </>
  );
}
