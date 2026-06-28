import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';

const baseUrl = process.env.APP_URL || 'https://blog.proklinik.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Proklinik-One Blog',
  description: 'Discover the latest articles and insights on clinic management and tech.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    siteName: 'Proklinik-One Blog',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col bg-background text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
