import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { LocaleProvider } from '@/components/LocaleProvider';

const baseUrl = process.env.APP_URL || 'https://blog.proklinik.app';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    description: locale === 'ar'
      ? 'اكتشف أحدث المقالات والرؤى حول إدارة العيادات والتكنولوجيا.'
      : 'Discover the latest articles and insights on clinic management and tech.',
    openGraph: {
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      siteName: 'Proklinik-One Blog',
      url: `${baseUrl}/${locale}/`,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@proklinik',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/`,
      languages: {
        ar: `${baseUrl}/ar/`,
        en: `${baseUrl}/en/`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
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
