import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://supratimdev.qzz.io"),
  title: "Supratim Dhara | Systems Architect & Founder",
  description: "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.",
  keywords: ["Supratim Dhara", "Systems Architect", "CTO", "Founder", "Rivet Framework", "Software Infrastructure", "AI Systems", "Civic Tech", "Mobile Engineer"],
  authors: [{ name: "Supratim Dhara" }],
  openGraph: {
    title: "Supratim Dhara | Systems Architect & Founder",
    description: "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supratim Dhara | Systems Architect & Founder",
    description: "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#050505] text-[#E5E5E5] selection:bg-[#FF3B30] selection:text-white overflow-x-hidden`}
      >
        <CustomCursor />
        <Navbar />
        <SmoothScroll />
        {children}
        <GoogleAnalytics gaId="G-VCR0CSHJD6" />
        <Analytics />
      </body>
    </html>
  );
}
