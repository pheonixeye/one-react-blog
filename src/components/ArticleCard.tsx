import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { t, getLocalized } from '@/lib/i18n';
import type { ArticleSummary } from '@/lib/types';
import type { Locale } from '@/lib/i18n';

interface ArticleCardProps {
  article: ArticleSummary;
  locale: Locale;
}

export function ArticleCard({ article, locale }: ArticleCardProps) {
  return (
    <article className="glass-surface rounded-xl group hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 flex flex-col h-full shadow-sm overflow-hidden border border-outline-variant/10">
      <Link 
        href={`/${locale}/article/${article.id}`}
        className="block h-full"
      >
        <div className="h-48 w-full bg-surface-container-highest relative overflow-hidden rounded-t-xl flex items-center justify-center">
          {article.coverImage ? (
            <img 
              src={article.coverImage} 
              alt={getLocalized(locale, article.title)}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105 transform" 
            />
          ) : (
            <span className="material-symbols-outlined text-6xl text-outline-variant opacity-50">developer_board</span>
          )}
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex gap-2 mb-4 flex-wrap">
            {article.tags.slice(0, 3).map((tagObj, index) => (
              <span key={index} className="bg-primary/10 text-primary border border-primary/20 text-mono-sm px-2 py-1 rounded-full">
                {getLocalized(locale, tagObj)}
              </span>
            ))}
          </div>
          <h2 className="text-body-lg font-semibold text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
            {getLocalized(locale, article.title)}
          </h2>
          <p className="text-body-md text-on-surface-variant flex-grow line-clamp-3">
            {getLocalized(locale, article.summary)}
          </p>
          <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant text-mono-sm">
            <div className="flex items-center gap-2">
              <Clock className="text-sm" size={16} />
              {article.readTime} {t(locale, 'readTime')}
            </div>
            <span className="text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              {t(locale, 'readArticle')} <ArrowRight className="text-[16px]" size={16} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}