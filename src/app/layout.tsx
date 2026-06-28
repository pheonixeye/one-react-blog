import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Proklinik-One Blog',
  description: 'Discover the latest articles and insights on clinic management and tech.',
  icons: { icon: '/favicon.svg' },
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