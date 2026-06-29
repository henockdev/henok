import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Henok Amdiye Endeshaw',
    short_name: 'Henok.dev',
    description: 'Software Engineer · AI Developer · Mobile Developer · ITSM Professional',
    start_url: '/',
    display: 'standalone',
    background_color: '#050816',
    theme_color: '#050816',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
