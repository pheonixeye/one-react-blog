import { Metadata } from 'next';
import { getArticles } from '@/lib/articles';
import { BlogContent } from '@/components/BlogContent';
import type { Locale } from '@/lib/i18n';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Proklinik-One Blog',
    description: locale === 'ar'
      ? 'اكتشف أحدث المقالات والرؤى حول إدارة العيادات والتكنولوجيا.'
      : 'Discover the latest articles and insights on clinic management and tech.',
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const articles = getArticles();

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-12">
      <header className="mb-16 relative">
        <h1 className="text-headline-lg-mobile md:text-display-lg text-on-surface mb-4 font-bold text-glow">
          {locale === 'ar' ? 'مرحباً بك في مدونة Proklinik-One' : 'Welcome to Proklinik-One Blog'}
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          {locale === 'ar'
            ? 'اكتشف أحدث المقالات والرؤى حول إدارة العيادات والتكنولوجيا.'
            : 'Discover the latest articles and insights on clinic management and tech.'}
        </p>
      </header>

      <BlogContent articles={articles} locale={locale as Locale} />
    </div>
  );
}