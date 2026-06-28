import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticlesByCategory } from '@/lib/articles';
import { BlogContent } from '@/components/BlogContent';
import type { Locale } from '@/lib/i18n';
import type { Category } from '@/lib/types';
import { categories, categoryLabels, categoryDescriptions } from '@/lib/types';

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  const catParams = categories.map((cat) => ({ category: cat }));
  return catParams.flatMap((p) => [
    { locale: 'ar', category: p.category },
    { locale: 'en', category: p.category },
  ]);
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const label = categoryLabels[category];
  const desc = categoryDescriptions[category];

  if (!label) {
    return {
      title: locale === 'ar' ? 'الصفحة غير موجودة' : '404 Not Found',
      description: '',
    };
  }

  const title = `${locale === 'ar' ? label.ar : label.en} | Proklinik-One`;
  const description = locale === 'ar' ? desc.ar : desc.en;

  const ogLocale = locale === 'ar' ? 'ar_SA' : 'en_US';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/${category}/`,
      siteName: 'Proklinik-One Blog',
      locale: ogLocale,
      type: 'website',
      images: [
        {
          url: '/og-default.png',
          width: 1200,
          height: 630,
          alt: locale === 'ar' ? label.ar : label.en,
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;

  if (!categories.includes(category as Category)) {
    notFound();
  }

  const articles = getArticlesByCategory(category);
  const label = categoryLabels[category];
  const desc = categoryDescriptions[category];

  const siteUrl = process.env.APP_URL || 'https://blog.proklinik.app';
  const categoryName = locale === 'ar' ? label.ar : label.en;
  const categoryDesc = locale === 'ar' ? desc.ar : desc.en;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'ar' ? 'المدونة' : 'Blog',
        item: `${siteUrl}/${locale}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: `${siteUrl}/${locale}/${category}/`,
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description: categoryDesc,
    url: `${siteUrl}/${locale}/${category}/`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-12">
        <header className="mb-16 relative">
          <h1 className="text-headline-lg-mobile md:text-display-lg text-on-surface mb-4 font-bold text-glow">
            {locale === 'ar' ? label.ar : label.en}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            {locale === 'ar' ? desc.ar : desc.en}
          </p>
        </header>

        <BlogContent articles={articles} locale={locale as Locale} />
      </div>
    </>
  );
}