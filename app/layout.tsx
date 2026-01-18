import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supratim Dhara | Systems Engineer",
  description: "Portfolio of Supratim Dhara - CTO, Architect, and Creator of Rivet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased`}
      >
        <SmoothScroll />
        <ScrollToTop />
        {children}
        <GoogleAnalytics gaId="MEASUREMENT-ID-HERE" />
      </body>
    </html>
  );
}
