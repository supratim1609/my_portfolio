import FlockNavbar from "@/components/FlockNavbar";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FlockML | Decentralized Edge AI & Wasm Federated Learning",
  description: "Train machine learning models for free by crowdsourcing CPU/GPU compute from website visitors. Written in Rust WebAssembly, featuring Wasm-native Int8 quantization, Local Differential Privacy, and decentralized AD-SGD.",
  keywords: [
    "Decentralized AI",
    "Edge Machine Learning",
    "Browser Federated Learning",
    "WebAssembly Neural Network",
    "Wasm AI Training",
    "Local Differential Privacy",
    "Int8 Quantization",
    "Collaborative Machine Learning",
    "Serverless AI training",
    "Open-source AI infrastructure"
  ],
  openGraph: {
    title: "FlockML | Decentralized Edge AI & Wasm Federated Learning",
    description: "Crowdsource model training directly in the browser sandbox. Zero-latency Int8 quantization, Wasm performance, and Differential Privacy.",
    url: "https://supratimdev.qzz.io/flock-ml",
    type: "website",
    images: [
      {
        url: "https://supratimdev.qzz.io/flockml_v1_2_tombstone_1783062600907.png",
        width: 1200,
        height: 630,
        alt: "FlockML Infrastructure"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FlockML | Decentralized Edge AI",
    description: "Train machine learning models natively in browser Web Workers. 100% data privacy, 97% native C++ speeds.",
    images: ["https://supratimdev.qzz.io/flockml_v1_2_tombstone_1783062600907.png"]
  }
};

export default function FlockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FlockML",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "An open-source, web-native federated learning framework compiled in Rust WebAssembly. Train models for free by crowdsourcing CPU/GPU compute from website visitors using symmetric Int8 quantization and Local Differential Privacy.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "softwareVersion": "1.2.1",
    "programmingLanguage": "Rust, TypeScript"
  };

  return (
    <div className="bg-[#050505] min-h-screen text-[#E5E5E5] font-sans selection:bg-[#FF3B30] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FlockNavbar />
      {children}
    </div>
  );
}
