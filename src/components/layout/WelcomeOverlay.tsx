'use client';

import { AnimatePresence, m } from 'framer-motion';
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

  const close = () => {
    window.localStorage.setItem('giantstore-intro-dismissed', 'true');
    setIsOpen(false);
  };

  const toggleLanguage = () => {
    setCurrentLocale((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <AnimatePresence>
    {isOpen ? (
    <m.div
      key="welcome"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.25, ease: [0.65, 0, 0.35, 1] } }}
    >
      <m.div
        role="dialog"
        aria-modal="true"
        aria-label="Giant Store introduction"
        className="grid max-h-[calc(100dvh-2rem)] w-full max-w-6xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl lg:h-[720px] lg:grid-cols-[0.86fr_1.14fr]"
        initial={{ opacity: 0, scale: 0.9, y: 40, clipPath: 'inset(45% 45% 45% 45% round 2rem)' }}
        animate={{ opacity: 1, scale: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 1rem)' }}
        exit={{ opacity: 0, scale: 1.12, filter: 'blur(16px)', transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left Column: Creator Profile */}
        <m.div
          className="relative isolate flex flex-col justify-between overflow-hidden bg-primary p-8 text-primary-foreground"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } } }}
        >
          <span aria-hidden="true" className="fx-aurora fx-aurora-a -z-10 -left-20 -top-20 h-72 w-72 bg-cyan-400/30" />
          <span aria-hidden="true" className="fx-aurora fx-aurora-b -z-10 -bottom-24 -right-16 h-80 w-80 bg-violet-500/40" />
          <span aria-hidden="true" className="fx-beam -z-10" />
          <m.div variants={introItem}>
            <div className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
              {currentLocale === 'ar' ? 'تم التطوير بواسطة' : 'Built by'}
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Anas Al Dahamsheh</h2>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/90">
              {currentLocale === 'ar'
                ? 'نموذج متجر تجريبي مع بحث ومساعد ذكي يعمل على منتجات هذا المتصفح.'
                : 'A shopping demo with search and AI help for products saved in this browser.'}
            </p>
          </m.div>

          <m.div className="space-y-3.5 text-sm font-medium" variants={introItem}>
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
          </m.div>
        </m.div>

        {/* Right Column: Platform Overview & Typewriter */}
        <m.div
          className="flex min-h-0 flex-col p-8"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.6 } } }}
        >
          <m.div className="flex items-center justify-between" variants={introItem}>
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
          </m.div>

          <m.h1 className="mt-3 text-2xl font-black text-foreground sm:text-3xl" variants={introItem}>
            {currentLocale === 'ar' ? 'منصة التجارة الإلكترونية الذكية' : 'AI-Powered Ecommerce Platform'}
          </m.h1>

          <m.div
            className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            <IntroPill label={currentLocale === 'ar' ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'} />
            <IntroPill label={currentLocale === 'ar' ? 'كتالوج المنتجات' : 'Product Catalog'} />
            <IntroPill label={currentLocale === 'ar' ? 'البحث الفوري' : 'Instant Search'} />
            <IntroPill label={currentLocale === 'ar' ? 'سلة وتسوق' : 'Cart & Checkout'} />
            <IntroPill label={currentLocale === 'ar' ? 'لوحة الإدارة' : 'Admin Console'} />
            <IntroPill label={currentLocale === 'ar' ? 'دفع تجريبي' : 'Demo Checkout'} />
          </m.div>

          <m.pre
            variants={introItem}
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
            className="mt-6 h-40 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-background p-4 font-sans text-sm leading-7 text-muted-foreground sm:h-64"
          >
            {text}
            <span className="text-primary font-bold animate-pulse">▌</span>
          </m.pre>

          <m.button
            type="button"
            onClick={close}
            variants={introItem}
            className="fx-shine group relative mt-6 inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 active:scale-[0.98]"
          >
            <span>{currentLocale === 'ar' ? 'الدخول إلى المتجر' : 'Enter Store'}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </m.button>
        </m.div>
      </m.div>
    </m.div>
    ) : null}
    </AnimatePresence>
  );
}

const introItem = {
  hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

function IntroPill({ label }: { label: string }) {
  return (
    <m.div
      variants={{
        hidden: { opacity: 0, scale: 0.6, y: 12 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 420, damping: 22 } },
      }}
      whileHover={{ y: -3, scale: 1.04 }}
      className="rounded-lg border border-border bg-background px-3 py-2 text-center text-xs font-semibold text-muted-foreground"
    >
      {label}
    </m.div>
  );
}
