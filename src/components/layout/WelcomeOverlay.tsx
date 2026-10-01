'use client';

import { ArrowRight, Globe, Phone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Github, Linkedin } from '@/components/layout/SocialIcons';
import type { DashboardLocale } from '@/types/locale';

const englishLines = [
  'Giant Store is a browser-based shopping demo. Products, accounts, reviews, and orders are saved on this device.',
  'The AI assistant can suggest products from your browser catalog. Verify its answers against product details.',
  'Checkout is a demonstration: no card data is requested and no payment or delivery takes place.'
];

const arabicLines = [
  'Giant Store نموذج تسوق يعمل داخل المتصفح. تُحفظ المنتجات والحسابات والمراجعات والطلبات على هذا الجهاز.',
  'يقترح المساعد الذكي منتجات من القائمة المحفوظة في متصفحك. تحقق من التفاصيل قبل اتخاذ القرار.',
  'الدفع هنا تجريبي: لا تُطلب بيانات بطاقة ولا تجري عملية دفع أو توصيل.'
];

export function WelcomeOverlay({ locale: initialLocale = 'en' }: { locale?: DashboardLocale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<DashboardLocale>(initialLocale);
  const [text, setText] = useState('');
  const lines = useMemo(() => (currentLocale === 'ar' ? arabicLines : englishLines), [currentLocale]);
  const fullText = lines.join('\n\n');

  useEffect(() => {
    const dismissed = window.localStorage.getItem('giantstore-intro-dismissed');
    setIsOpen(dismissed !== 'true');
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setText('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setText(fullText.slice(0, index));
      if (index >= fullText.length) {
        window.clearInterval(timer);
      }
    }, 16);
    return () => window.clearInterval(timer);
  }, [fullText, isOpen]);

  if (!isOpen) {
    return null;
  }

  const close = () => {
    window.localStorage.setItem('giantstore-intro-dismissed', 'true');
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setCurrentLocale((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur">
      <div role="dialog" aria-modal="true" aria-label="Giant Store introduction" className="grid max-h-[calc(100dvh-2rem)] w-full max-w-6xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl lg:h-[720px] lg:grid-cols-[0.86fr_1.14fr]">
        {/* Left Column: Creator Profile */}
        <div className="flex flex-col justify-between bg-primary p-8 text-primary-foreground">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
              {currentLocale === 'ar' ? 'تم التطوير بواسطة' : 'Built by'}
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Anas Al Dahamsheh</h2>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/90">
              {currentLocale === 'ar'
                ? 'نموذج متجر تجريبي مع بحث ومساعد ذكي يعمل على منتجات هذا المتصفح.'
                : 'A shopping demo with search and AI help for products saved in this browser.'}
            </p>
          </div>

          <div className="space-y-3.5 text-sm font-medium">
            <a
              className="flex items-center gap-3 transition hover:opacity-80"
              href="tel:+962789495167"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span dir="ltr" className="font-mono text-xs">+962 789 495 167</span>
            </a>
            <a
              className="flex items-center gap-3 transition hover:opacity-80"
              href="https://github.com/anas-aldahamsheh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 shrink-0" />
              <span dir="ltr" className="font-mono text-xs">github.com/anas-aldahamsheh</span>
            </a>
            <a
              className="flex items-center gap-3 transition hover:opacity-80"
              href="https://www.linkedin.com/in/anas-aldahamsheh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-4 w-4 shrink-0" />
              <span dir="ltr" className="font-mono text-xs">linkedin.com/in/anas-aldahamsheh</span>
            </a>
          </div>
        </div>

        {/* Right Column: Platform Overview & Typewriter */}
        <div className="flex min-h-0 flex-col p-8">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Giant Store
            </div>
            {/* Interactive Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm transition hover:text-foreground hover:border-primary/40"
              aria-label="Toggle language"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{currentLocale === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>

          <h1 className="mt-3 text-2xl font-black text-foreground sm:text-3xl">
            {currentLocale === 'ar' ? 'منصة التجارة الإلكترونية الذكية' : 'AI-Powered Ecommerce Platform'}
          </h1>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <IntroPill label={currentLocale === 'ar' ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'} />
            <IntroPill label={currentLocale === 'ar' ? 'كتالوج المنتجات' : 'Product Catalog'} />
            <IntroPill label={currentLocale === 'ar' ? 'البحث الفوري' : 'Instant Search'} />
            <IntroPill label={currentLocale === 'ar' ? 'سلة وتسوق' : 'Cart & Checkout'} />
            <IntroPill label={currentLocale === 'ar' ? 'لوحة الإدارة' : 'Admin Console'} />
            <IntroPill label={currentLocale === 'ar' ? 'دفع تجريبي' : 'Demo Checkout'} />
          </div>

          <pre
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
            className="mt-6 h-40 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-background p-4 font-sans text-sm leading-7 text-muted-foreground sm:h-64"
          >
            {text}
            <span className="text-primary font-bold animate-pulse">▌</span>
          </pre>

          <button
            type="button"
            onClick={close}
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 active:scale-[0.98]"
          >
            <span>{currentLocale === 'ar' ? 'الدخول إلى المتجر' : 'Enter Store'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IntroPill({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
      {label}
    </div>
  );
}
