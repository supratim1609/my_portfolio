import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "FlockML | Run AI In Your Browser. $0.",
  description: "FlockML turns every browser into a sovereign GPU node using BitNet 1.58-bit WGSL shaders. Run frontier AI models natively in React with zero Python, zero CUDA, zero server bills.",
  keywords: [
    "Decentralized AI",
    "Edge Machine Learning",
    "Browser Federated Learning",
    "WebAssembly Neural Network",
    "BitNet WGSL",
    "Local Differential Privacy",
    "Int8 Quantization",
    "Collaborative Machine Learning",
    "Serverless AI",
    "Open-source AI infrastructure"
  ],
  openGraph: {
    title: "FlockML | Run AI In Your Browser. $0.",
    description: "FlockML turns every browser into a sovereign GPU node. Run frontier AI models natively in React with zero server bills.",
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
    title: "FlockML | Run AI In Your Browser. $0.",
    description: "FlockML turns every browser into a sovereign GPU node. $0 per query. BitNet 1.58-bit WGSL shaders.",
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
    "description": "An open-source JavaScript runtime that executes quantized large language models in the browser using BitNet 1.58-bit WGSL compute shaders.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "softwareVersion": "2.0.0",
    "programmingLanguage": "TypeScript, WGSL"
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white selection:bg-white selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </div>
  );
}
