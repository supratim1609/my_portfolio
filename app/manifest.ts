import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Supratim Dhara',
    short_name: 'Supratim',
    description: 'I build scalable digital infrastructure, AI-powered systems, commerce ecosystems, and operational technology products for the next era.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
