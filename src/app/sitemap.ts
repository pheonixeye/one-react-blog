import { getArticles } from '@/lib/articles';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const baseUrl = process.env.APP_URL || 'https://blog.proklinik.app';
  const entries: MetadataRoute.Sitemap = [];

  const locales = ['ar', 'en'] as const;
  const categories = ['product', 'engineering', 'operations', 'culture'] as const;

  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    });

    for (const category of categories) {
      entries.push({
        url: `${baseUrl}/${locale}/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    for (const article of articles) {
      entries.push({
        url: `${baseUrl}/${locale}/article/${article.id}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}