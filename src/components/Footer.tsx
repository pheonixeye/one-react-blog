'use client';

import { useState } from 'react';
import { getPocketBase } from '@/lib/pocketbase';
import { t } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const pb = getPocketBase();
      await pb.collection('quote_requests').create(data);
      alert(t(locale, 'copiedToClipboard'));
      e.currentTarget.reset();
    } catch (error) {
      console.error('PocketBase error:', error);
      alert(t(locale, 'error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <footer className="bg-surface-container-lowest w-full py-16 border-t border-outline-variant/10 mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col gap-6 justify-between">
          <div>
            <span className="text-headline-md font-bold text-on-surface">{t(locale, 'brand')}</span>
            <p className="text-body-md text-on-surface-variant max-w-sm mt-4">
              {t(locale, 'descHome')}
            </p>
          </div>
          <span className="text-mono-sm text-outline mt-8">&copy; 2026 {t(locale, 'brand')}. {t(locale, 'footerRights')}</span>
        </div>
        
        <div className="flex flex-col gap-4 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
          <span className="text-title-lg text-on-surface font-bold mb-2">{t(locale, 'requestQuote')}</span>
          <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              name="name"
              placeholder={t(locale, 'namePlaceholder')} 
              className="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full" 
              required 
            />
            <input 
              type="email" 
              name="email"
              placeholder={t(locale, 'emailPlaceholder')} 
              className="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full" 
              required 
            />
            <textarea 
              name="message"
              placeholder={t(locale, 'messagePlaceholder')} 
              rows={3} 
              className="bg-surface border border-outline-variant/50 rounded-lg px-4 py-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface w-full resize-none" 
              required
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary text-on-primary py-3 px-6 rounded-lg font-label-lg uppercase tracking-wider hover:bg-primary-fixed transition-colors mt-2 self-start md:self-auto w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : t(locale, 'submitForm')}
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}