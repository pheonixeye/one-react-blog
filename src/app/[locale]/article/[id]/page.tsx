import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleDetail } from '@/components/ArticleDetail';
import { getArticleById, getRelatedArticles, getAllArticleIds } from '@/lib/articles';
import type { Locale } from '@/lib/i18n';

interface ArticlePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  const ids = getAllArticleIds();
  return ids.flatMap((id) => [
    { locale: 'ar', id },
    { locale: 'en', id },
  ]);
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const article = getArticleById(id);

  if (!article) {
    return {
      title: locale === 'ar' ? 'المقال غير موجود' : 'Article Not Found',
      description: locale === 'ar' ? 'المقال غير موجود' : 'Article not found',
    };
  }

  const title = locale === 'ar' ? article.title.ar : article.title.en;
  const summary = locale === 'ar' ? article.summary.ar : article.summary.en;
  const authorName = locale === 'ar' ? article.author.name.ar : article.author.name.en;

  return {
    title: `${title} | Proklinik-One`,
    description: summary,
    openGraph: {
      title,
      description: summary,
      url: `/${locale}/article/${id}/`,
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      publishedTime: article.date,
      authors: [authorName],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: summary,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, id } = await params;

  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(id, article);

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <ArticleDetail
        article={article}
        locale={locale as Locale}
        relatedArticles={relatedArticles}
      />
    </div>
  );
}