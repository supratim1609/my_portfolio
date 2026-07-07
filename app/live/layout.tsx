import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FlockML Sovereign AI Grid | Live Enterprise Telemetry',
  description: 'Audit and monitor the West Bengal Sovereign AI compute grid. Real-time telemetry tracking of decentralized A100 GPU nodes executing backpropagation inside client Web Workers with Local Differential Privacy and Wasm-native quantization.',
  keywords: [
    'Sovereign AI',
    'Federated Learning',
    'WebAssembly Machine Learning',
    'Wasm ML',
    'Decentralized AI',
    'DPDP Act 2023 Compliance',
    'Data Localization',
    'Enterprise Compute Grid',
    'Calcutta Electric Supply Corporation',
    'Webel AI Pilot'
  ],
  openGraph: {
    title: 'FlockML Sovereign AI Grid | Live Enterprise Telemetry',
    description: 'Live audit dashboard tracking distributed edge GPU racks training models under strict data localization paradigms.',
    url: 'https://supratimdev.qzz.io/live',
    type: 'website',
    images: [
      {
        url: 'https://supratimdev.qzz.io/flockml_v1_2_tombstone_1783062600907.png', // Using one of your generated graphics
        width: 1200,
        height: 630,
        alt: 'FlockML Sovereign AI Grid Telemetry'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlockML Sovereign AI Grid | Live Telemetry',
    description: 'Collaborative model training directly inside regional hardware, keeping raw citizen records 100% local.',
    images: ['https://supratimdev.qzz.io/flockml_v1_2_tombstone_1783062600907.png']
  }
};

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
