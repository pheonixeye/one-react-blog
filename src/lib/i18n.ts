import { translations, type Locale, type TranslationKey } from '@/messages/index';

export function t(locale: string, key: TranslationKey): string {
  const l = (locale === 'ar' || locale === 'en' ? locale : 'ar') as Locale;
  return translations[l][key] || key;
}

export type { Locale, TranslationKey };

export const locales: Locale[] = ['ar', 'en'];

export function getLocalized(locale: Locale, obj: { en: string; ar: string } | undefined | null): string {
  if (!obj) return '';
  return locale === 'ar' ? obj.ar : obj.en;
}

export function formatDate(locale: Locale, dateStr: string): string {
  const locales_map = { ar: 'ar-EG', en: 'en-US' };
  return new Date(dateStr).toLocaleDateString(locales_map[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}