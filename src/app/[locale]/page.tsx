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
  const title = locale === 'ar'
    ? 'المدونة | Proklinik-One - رؤى وحلول إدارة العيادات'
    : 'Blog | Proklinik-One - Clinic Management Insights & Solutions';
  const description = locale === 'ar'
    ? 'اكتشف أحدث المقالات والرؤى حول إدارة العيادات والتكنولوجيا الصحية. نقدم لك نصائح وحلولاً عملية لتطوير عيادتك وزيادة كفاءتها.'
    : 'Discover the latest articles and insights on clinic management and healthcare technology. Get practical tips and solutions to grow your clinic and boost efficiency.';

  const ogLocale = locale === 'ar' ? 'ar_SA' : 'en_US';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/`,
      siteName: 'Proklinik-One Blog',
      locale: ogLocale,
      type: 'website',
      images: [
        {
          url: '/og-default.png',
          width: 1200,
          height: 630,
          alt: 'Proklinik-One Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-default.png'],
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const articles = getArticles();

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Proklinik-One Blog',
    url: `${process.env.APP_URL || 'https://blog.proklinik.app'}/${locale}/`,
    description: locale === 'ar'
      ? 'اكتشف أحدث المقالات والرؤى حول إدارة العيادات والتكنولوجيا الصحية.'
      : 'Discover the latest articles and insights on clinic management and healthcare technology.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
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
    </>
  );
}