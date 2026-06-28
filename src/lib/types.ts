export interface LocalizedString {
  en: string;
  ar: string;
}

export interface LocalizedObject<T> {
  en: T;
  ar: T;
}

export interface Tag {
  en: string;
  ar: string;
}

export interface Author {
  name: LocalizedString;
  role: LocalizedString;
  avatar: string;
}

export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'quote';
  text: string;
  title?: string;
}

export interface Article {
  id: string;
  type: 'article';
  category: LocalizedString;
  tags: Tag[];
  title: LocalizedString;
  summary: LocalizedString;
  content: LocalizedObject<ContentBlock[]>;
  coverImage: string;
  readTime: number;
  date: string;
  author: Author;
}

export interface ArticleSummary {
  id: string;
  type: 'article';
  category: LocalizedString;
  tags: Tag[];
  title: LocalizedString;
  summary: LocalizedString;
  coverImage: string;
  readTime: number;
  date: string;
  author: Author;
}

export type Category = 'product' | 'engineering' | 'operations' | 'culture';

export const categories: Category[] = ['product', 'engineering', 'operations', 'culture'];

export const categoryLabels: Record<string, { en: string; ar: string }> = {
  product: { en: 'Product', ar: 'المنتج' },
  engineering: { en: 'Engineering', ar: 'الهندسة' },
  operations: { en: 'Operations', ar: 'العمليات' },
  culture: { en: 'Culture', ar: 'الثقافة' },
};

export const categoryDescriptions: Record<string, { en: string; ar: string }> = {
  product: {
    en: 'Discover our latest product updates and how we are improving the clinic experience for patients and staff.',
    ar: 'اكتشف أحدث تحديثات منتجاتنا وكيفية تحسين تجربة العيادة للمرضى والموظفين.',
  },
  engineering: {
    en: 'Deep dives into the technology powering the clinics of the future. System architecture, scaling, and innovation.',
    ar: 'نظرة عميقة على التكنولوجيا التي تشغل عيادات المستقبل. بنية النظام، التوسع، والابتكار.',
  },
  operations: {
    en: 'Master clinic efficiency. Technical insights and strategic workflows to optimize your daily administration, reduce bottlenecks, and maximize throughput.',
    ar: 'إتقان كفاءة العيادة. رؤى فنية وسير عمل استراتيجي لتحسين الإدارة اليومية، وتقليل الاختناقات، وزيادة الإنتاجية.',
  },
  culture: {
    en: 'Learn about our team culture, and how we build a sustainable and healthy work environment that supports creativity.',
    ar: 'تعرف على ثقافة فريقنا، وكيف نبني بيئة عمل مستدامة وصحية تدعم الإبداع.',
  },
};