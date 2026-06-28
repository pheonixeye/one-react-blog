import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { LocaleProvider } from '@/components/LocaleProvider';

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <LocaleProvider locale={locale}>
      <Nav locale={locale as Locale} />
      <main className="flex-grow w-full pt-20 md:pt-24">
        {children}
      </main>
      <Footer locale={locale as Locale} />
    </LocaleProvider>
  );
}