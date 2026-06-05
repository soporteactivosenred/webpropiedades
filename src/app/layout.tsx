import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar, Footer } from '@/components/layout';
import { WhatsAppButton } from '@/components/ui';
import { DEFAULT_SETTINGS } from '@/types';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: DEFAULT_SETTINGS.seo.default_title,
    template: `%s | ${DEFAULT_SETTINGS.site_name}`,
  },
  description: DEFAULT_SETTINGS.seo.default_description,
  keywords: DEFAULT_SETTINGS.seo.default_keywords.split(', '),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://activosenred.cl'),
  openGraph: {
    type: 'website',
    siteName: DEFAULT_SETTINGS.site_name,
    title: DEFAULT_SETTINGS.seo.default_title,
    description: DEFAULT_SETTINGS.seo.default_description,
    images: [
      {
        url: DEFAULT_SETTINGS.seo.og_image,
        width: 1200,
        height: 630,
        alt: DEFAULT_SETTINGS.site_name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SETTINGS.seo.default_title,
    description: DEFAULT_SETTINGS.seo.default_description,
    images: [DEFAULT_SETTINGS.seo.og_image],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-[96px] md:pt-[112px]">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}