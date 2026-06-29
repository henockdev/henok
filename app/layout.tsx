import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { AIAssistantWidget } from '@/components/ai/AIAssistantWidget';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AnalyticsBootstrap } from '@/components/layout/AnalyticsBootstrap';
import { store } from '@/lib/data/store';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await store.getSettings();
  const { profile, seo } = settings;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://henok.dev'),
    title: {
      default: seo.title,
      template: `%s · ${profile.name}`,
    },
    description: seo.description,
    keywords: [
      profile.name,
      'Software Engineer',
      'AI Developer',
      'Mobile Developer',
      'ITSM',
      'Addis Ababa',
      'Ethiopia',
      'Portfolio',
    ],
    authors: [{ name: profile.name }],
    creator: profile.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: '/',
      title: seo.title,
      description: seo.description,
      siteName: profile.name,
      images: [{ url: '/og/og-default.svg', width: 1200, height: 630, alt: profile.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      creator: '@henok_endeshaw',
      images: ['/og/og-default.svg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    alternates: {
      canonical: '/',
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050816' },
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate" type="application/rss+xml" title="Henok's Blog" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Henok Amdiye Endeshaw',
              jobTitle: 'Software Engineer',
              address: { '@type': 'PostalAddress', addressLocality: 'Addis Ababa', addressCountry: 'ET' },
              url: 'https://henok.dev',
              sameAs: [
                'https://github.com/Henok-Endeshaw',
                'https://linkedin.com/in/henok-endeshaw',
              ],
              knowsAbout: ['Software Engineering', 'AI', 'Machine Learning', 'Mobile Development', 'ITSM', 'Banking Technology'],
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navigation />
          <main id="main">{children}</main>
          <Footer />
          <AIAssistantWidget />
          <AnalyticsBootstrap />
        </ThemeProvider>
      </body>
    </html>
  );
}
