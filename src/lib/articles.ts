import fs from 'fs';
import path from 'path';
import type { Article, ArticleSummary } from '@/lib/types';

const dataDirectory = path.join(process.cwd(), 'src/data');

export function getArticles(): ArticleSummary[] {
  const filePath = path.join(dataDirectory, 'articles.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as ArticleSummary[];
}

export function getArticleById(id: string): Article | null {
  const filePath = path.join(dataDirectory, `article${id}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as Article;
}

export function getArticlesByCategory(category: string): ArticleSummary[] {
  const articles = getArticles();

  if (!category) {
    return articles;
  }

  return articles.filter((article) => {
    const articleCategory = article.category.en.toLowerCase();
    return articleCategory === category.toLowerCase();
  });
}

export function getAllArticleIds(): string[] {
  const articles = getArticles();
  return articles.map((article) => article.id);
}

export function getRelatedArticles(articleId: string, currentArticle: Article, limit = 3): ArticleSummary[] {
  const articles = getArticles();
  const allArticles = articles.filter((a) => a.id !== articleId);

  const scored = allArticles.map((article) => ({
    article,
    sharedTags: article.tags.filter((tag) =>
      currentArticle.tags.some((myTag) => myTag.en === tag.en),
    ).length,
  }));

  const sorted = scored
    .filter((s) => s.sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .map((s) => s.article)
    .slice(0, limit);

  if (sorted.length < limit) {
    const existingIds = new Set([articleId, ...sorted.map((a) => a.id)]);
    const more = allArticles
      .filter((a) => !existingIds.has(a.id))
      .slice(0, limit - sorted.length);
    sorted.push(...more);
  }

  return sorted;
}