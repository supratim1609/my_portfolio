import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://supratimdev.qzz.io"),
  alternates: {
    canonical: "https://supratimdev.qzz.io",
    types: {
      "application/rss+xml": "https://supratimdev.qzz.io/feed.xml",
    },
  },
  title: {
    default: "Supratim Dhara | Systems Architect & Founder",
    template: "%s | Supratim Dhara"
  },
  description: "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.",
  keywords: ["Supratim Dhara", "Systems Architect", "CTO", "Founder", "Rivet Framework", "Software Infrastructure", "AI Systems", "Civic Tech", "Mobile Engineer", "WebAssembly", "Rust", "Distributed Systems"],
  authors: [{ name: "Supratim Dhara", url: "https://supratimdev.qzz.io" }],
  creator: "Supratim Dhara",
  publisher: "Supratim Dhara",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: "Supratim Dhara",
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Supratim Dhara | Systems Architect",
    description: "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.",
    url: "https://supratimdev.qzz.io",
    siteName: "Supratim Dhara Portfolio",
    images: [
      {
        url: "https://supratimdev.qzz.io/og-image.png",
        width: 1200,
        height: 630,
        alt: "Supratim Dhara - Systems Architect",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supratim Dhara",
    description: "I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.",
    creator: "@supratimtwt",
    images: ["https://supratimdev.qzz.io/og-image.png"],
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
        <SmoothScroll />
        <Navbar />
        {children}
        <Footer />
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
