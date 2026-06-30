'use client';

import { useState } from 'react';
import { Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { t, getLocalized, formatDate } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { Article, ArticleSummary } from '@/lib/types';

interface ArticleDetailProps {
  article: Article;
  locale: Locale;
  relatedArticles: ArticleSummary[];
}

export function ArticleDetail({ article, locale, relatedArticles }: ArticleDetailProps) {
  const [toastVisible, setToastVisible] = useState(false);
  
  const title = getLocalized(locale, article.title);
  const summary = getLocalized(locale, article.summary);
  const authorName = getLocalized(locale, article.author.name);
  const authorRole = getLocalized(locale, article.author.role);
  const contentBlocks = article.content[locale] || article.content.en;
  
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    
    if (typeof navigator !== 'undefined') {
      if (navigator.share) {
        try {
          await navigator.share({ title, text: summary, url });
          return;
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            await navigator.clipboard.writeText(url);
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 2000);
          }
        }
      } else {
        await navigator.clipboard.writeText(url);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2000);
      }
    }
  };
  
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blog.proklinik.app';

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
        name: title,
        item: `${siteUrl}/${locale}/article/${article.id}/`,
      },
    ],
  };

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    image: [article.coverImage],
    datePublished: article.date,
    dateModified: article.date,
    author: [{ '@type': 'Person', name: authorName }],
    description: summary,
    publisher: {
      '@type': 'Organization',
      name: 'Proklinik-One',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${locale}/article/${article.id}/`,
    },
  };
  
  const hasTOC = contentBlocks.some(
    (b) => b.type === 'heading' || (b.type === 'paragraph' && b.title)
  );
  
  return (
    <article className="max-w-4xl mx-auto mt-8 pb-24 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      
      <div className="w-full h-[300px] md:h-[400px] relative overflow-hidden bg-surface-dim rounded-2xl border border-outline-variant/20 shadow-lg">
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={title}
            className="w-full h-full object-cover scale-105 transform hover:scale-100 transition-transform duration-1000"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-margin-mobile start-margin-mobile flex gap-2">
          {article.tags.map((tagObj, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-mono-sm"
            >
              {getLocalized(locale, tagObj)}
            </span>
          ))}
        </div>
      </div>
      
      <div className="pt-8 pb-8 border-b border-outline-variant/10">
        <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4 leading-tight text-glow">{title}</h1>
        
        <div className="flex items-center gap-4 mt-6 pt-4">
          <div className="w-12 h-12 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30 flex-shrink-0">
            <img src={article.author.avatar} alt={authorName} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-label-md text-on-surface font-semibold">{authorName}</p>
            <p className="text-body-md text-[14px] text-on-surface-variant">
              {authorRole} &bull; {formatDate(locale, article.date)}
            </p>
          </div>
          <div className="ms-auto flex items-center gap-2">
            <div className="text-on-surface-variant text-mono-sm flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-md border border-outline-variant/20">
              <Clock size={16} />
              {article.readTime} {t(locale, 'readTime')}
            </div>
            <button
              onClick={handleShare}
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-md border border-outline-variant/20 hover:border-primary/50"
              aria-label="Share"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 pt-8">
        <div className={`flex-grow max-w-none space-y-6 ${hasTOC ? 'md:w-2/3' : 'w-full'}`}>
          {contentBlocks.map((block, index) => {
            if (block.type === 'heading') {
              return (
                <h2 key={index} id={`heading-${index}`} className="text-headline-sm font-bold text-on-surface mt-12 mb-4 scroll-mt-30">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'paragraph') {
              return (
                <div key={index}>
                  {block.title && (
                    <h3 id={`para-${index}`} className="text-title-lg font-semibold text-on-surface mt-8 mb-3 scroll-mt-30">
                      {block.title}
                    </h3>
                  )}
                  <p className="text-body-lg text-on-surface-variant leading-relaxed">{block.text}</p>
                </div>
              );
            }
            if (block.type === 'quote') {
              return (
                <div key={index} className="glass-surface p-6 rounded-xl border-s-4 border-s-secondary relative overflow-hidden my-12">
                  <p className="text-headline-md text-[20px] text-on-surface italic relative z-10">{block.text}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
        
        {hasTOC && (
          <aside className="md:w-1/3 flex-shrink-0 order-first md:order-last mb-8 md:mb-0">
            <div className="sticky top-24 bg-surface-container-low rounded-xl p-6 border border-outline-variant/20 shadow-sm">
              <h3 className="text-title-md font-bold mb-4 text-on-surface">{t(locale, 'tableOfContents')}</h3>
              <ul className="space-y-3">
                {contentBlocks.map((block, index) => {
                  if (block.type === 'heading') {
                    return (
                      <li key={index}>
                        <button onClick={() => handleScrollTo(`heading-${index}`)} className="text-body-md text-on-surface-variant hover:text-primary transition-colors block border-s-2 border-transparent hover:border-primary ps-3 text-left">
                          {block.text}
                        </button>
                      </li>
                    );
                  }
                  if (block.type === 'paragraph' && block.title) {
                    return (
                      <li key={index}>
                        <button onClick={() => handleScrollTo(`para-${index}`)} className="text-body-md text-on-surface-variant hover:text-primary transition-colors block border-s-2 border-transparent hover:border-primary ps-3 ml-4 text-left">
                          {block.title}
                        </button>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </aside>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-outline-variant/10">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tagObj, index) => (
            <span key={index} className="px-3 py-1 rounded-md bg-surface-container text-on-surface-variant text-mono-sm border border-outline-variant/10">
              {getLocalized(locale, tagObj)}
            </span>
          ))}
        </div>
      </div>
      
      {relatedArticles.length > 0 && (
        <div className="mt-24 pt-12 border-t border-outline-variant/20">
          <h2 className="text-headline-md text-on-surface mb-8 font-bold">{t(locale, 'relatedArticles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/${locale}/article/${rel.id}`}
                className="glass-surface rounded-xl overflow-hidden group border border-outline-variant/10 hover:border-primary/30 transition-all duration-300 flex flex-col h-full shadow-sm"
              >
                <div className="h-40 w-full bg-surface-container-highest relative overflow-hidden rounded-t-xl">
                  {rel.coverImage ? (
                    <img src={rel.coverImage} alt={getLocalized(locale, rel.title)} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105 transform" />
                  ) : (
                    <span className="text-4xl text-outline-variant opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">developer_board</span>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {rel.tags.slice(0, 2).map((tagObj, i) => (
                      <span key={i} className="bg-primary/10 text-primary border border-primary/20 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {getLocalized(locale, tagObj)}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-body-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {getLocalized(locale, rel.title)}
                  </h3>
                  <p className="text-body-md text-on-surface-variant flex-grow line-clamp-2 text-sm">
                    {getLocalized(locale, rel.summary)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {toastVisible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg shadow-lg text-label-md z-50">
          {t(locale, 'copiedToClipboard')}
        </div>
      )}
    </article>
  );
}