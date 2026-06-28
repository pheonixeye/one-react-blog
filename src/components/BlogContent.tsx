'use client';

import { useState, useMemo } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import type { ArticleSummary } from '@/lib/types';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';

interface BlogContentProps {
  articles: ArticleSummary[];
  locale: Locale;
}

export function BlogContent({ articles, locale }: BlogContentProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach((article) => {
      article.tags.forEach((tag) => {
        tags.add(tag[locale as 'en' | 'ar'] || tag.en);
      });
    });
    return Array.from(tags).sort();
  }, [articles, locale]);
  
  const filteredArticles = useMemo(() => {
    if (selectedTags.length === 0) return articles;
    return articles.filter((article) =>
      article.tags.some((tag) => {
        const tagText = locale === 'ar' ? tag.ar : tag.en;
        return selectedTags.includes(tagText);
      })
    );
  }, [articles, selectedTags, locale]);
  
  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, tag] : prev.filter((t) => t !== tag)
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Desktop Filter Sidebar */}
      <aside className="hidden md:block w-full md:w-64 flex-shrink-0 mb-8 md:mb-0 relative">
        <div className="sticky top-24 glass-surface rounded-xl p-6">
          <h3 className="text-label-md text-primary mb-4 uppercase tracking-wider">{t(locale, 'subtopics')}</h3>
          <ul className="space-y-2">
            {uniqueTags.map((tag) => (
              <li key={tag}>
                <label className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-variant cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    value={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={(e) => handleTagChange(tag, e.target.checked)}
                    className="rounded border-outline-variant bg-surface text-primary focus:ring-primary focus:ring-offset-0 focus:ring-offset-surface"
                  />
                  <span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{tag}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      
      {/* Mobile Filter */}
      <div className="md:hidden w-full">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="flex items-center gap-2 text-primary mb-4 px-1"
        >
          <span>{t(locale, 'subtopics')}</span>
          <span>{isMobileFilterOpen ? '▲' : '▼'}</span>
        </button>
        
        {isMobileFilterOpen && (
          <div className="mb-4 p-4 glass-surface rounded-xl">
            <ul className="space-y-2">
              {uniqueTags.map((tag) => (
                <li key={tag}>
                  <label className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-variant cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      value={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={(e) => handleTagChange(tag, e.target.checked)}
                      className="rounded border-outline-variant bg-surface text-primary focus:ring-primary focus:ring-offset-0 focus:ring-offset-surface"
                    />
                    <span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{tag}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} locale={locale} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-body-lg text-on-surface-variant">
                {locale === 'ar' ? 'لا توجد مقالات تطابق التصنيف المحدد' : 'No articles match the selected filters.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}