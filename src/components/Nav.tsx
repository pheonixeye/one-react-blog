'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { getPocketBase } from '@/lib/pocketbase';
import { t } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface NavProps {
  locale: Locale;
}

export function Nav({ locale }: NavProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const otherLocale: Locale = locale === 'ar' ? 'en' : 'ar';

  const handleDemoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const pb = getPocketBase();
      await pb.collection('demo_requests').create(data);
      setIsModalOpen(false);
      alert(t(locale, 'copiedToClipboard'));
      e.currentTarget.reset();
    } catch (error) {
      console.error('PocketBase error:', error);
      alert(t(locale, 'error'));
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto w-full">
          <Link
            href={`/${locale}`}
            className="text-headline-md font-bold text-primary hover:text-primary-fixed transition-colors active:scale-95 duration-200"
          >
            {t(locale, 'brand')}
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href={`/${otherLocale}`}
              className="text-on-surface-variant hover:text-primary transition-colors font-mono-sm border border-outline-variant/30 px-3 py-1 rounded-full"
            >
              {otherLocale === 'ar' ? 'عربي' : 'EN'}
            </Link>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary text-white text-label-md font-medium px-4 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md"
            >
              {t(locale, 'bookDemo')}
            </button>
          </div>
        </nav>
      </header>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-overlay-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-xl mx-4 animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 md:p-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 end-4 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t(locale, 'bookDemo')}</h2>
              <p className="text-gray-600 mb-6">{t(locale, 'messagePlaceholder')}</p>
              <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder={t(locale, 'namePlaceholder')}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 w-full"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t(locale, 'emailPlaceholder')}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 w-full"
                  required
                />
                <input
                  type="text"
                  name="speciality"
                  placeholder={t(locale, 'medicalSpecialityPlaceholder')}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 w-full"
                  required
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-500 ms-1">{t(locale, 'timeForDemoPlaceholder')}</label>
                  <input
                    type="date"
                    name="date"
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 w-full"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold uppercase tracking-wider hover:brightness-110 transition-all mt-2 w-full shadow-md"
                >
                  {t(locale, 'submitForm')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}