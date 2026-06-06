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
  title: "Supratim Dhara",
  description: "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.",
  keywords: ["Supratim Dhara", "Systems Architect", "CTO", "Founder", "Rivet Framework", "Software Infrastructure", "AI Systems", "Civic Tech", "Mobile Engineer"],
  authors: [{ name: "Supratim Dhara", url: "https://supratimdev.qzz.io" }],
  creator: "Supratim Dhara",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Supratim Dhara",
    description: "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.",
    url: "https://supratimdev.qzz.io",
    siteName: "Supratim Dhara Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supratim Dhara",
    description: "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.",
    creator: "@supratimtwt",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Supratim Dhara",
    "jobTitle": "Systems Architect & Founder",
    "url": "https://supratimdev.qzz.io",
    "sameAs": [
      "https://www.linkedin.com/in/supratimdhara/",
      "https://x.com/supratimtwt",
      "https://github.com/supratim1609",
      "https://medium.com/@supratimdhara0"
    ],
    "knowsAbout": ["Systems Architecture", "Software Engineering", "AI Systems", "React", "Next.js", "TypeScript", "Node.js", "Infrastructure"],
    "description": "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era."
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
