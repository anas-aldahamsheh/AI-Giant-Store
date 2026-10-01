import Link from 'next/link';
import { Phone, ShoppingBag } from 'lucide-react';
import { Github, Linkedin } from '@/components/layout/SocialIcons';
import type { DashboardLocale } from '@/types/locale';

export type { DashboardLocale };

export type FooterProps = {
  locale?: DashboardLocale;
  copy?: {
    navProducts?: string;
    navDeals?: string;
    navCart?: string;
    navAdmin?: string;
  };
};

export function Footer({ locale = 'en', copy }: FooterProps) {
  const navProductsLabel = copy?.navProducts || (locale === 'ar' ? 'كتالوج المنتجات' : 'Products Catalog');
  const navDealsLabel = copy?.navDeals || (locale === 'ar' ? 'العروض الحصرية' : 'Exclusive Deals');
  const navCartLabel = copy?.navCart || (locale === 'ar' ? 'عربة التسوق' : 'Shopping Cart');
  const navAdminLabel = copy?.navAdmin || (locale === 'ar' ? 'لوحة الإدارة' : 'Admin Console');

  return (
    <footer className="mt-auto border-t border-border bg-card/95 text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand & Creator Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold tracking-tight text-foreground">
                  Giant <span className="text-primary">Store</span>
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  {locale === 'ar' ? 'تطوير: أنس الدحامشة' : 'Engineered by Anas Aldahamsheh'}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {locale === 'ar'
                ? 'منظومة عملية متقدمة للتجارة الإلكترونية الذكية، كتالوج منتجات تفاعلي، ومساعد تسوق بالذكاء الاصطناعي، تعمل محلياً بالكامل.'
                : 'A modern AI-powered ecommerce platform featuring intelligent product exploration, smart search, and standalone local operation.'}
            </p>
          </div>

          {/* Developer Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {locale === 'ar' ? 'بيانات التواصل المباشر' : 'Contact Developer'}
            </h4>
            <div className="flex flex-col items-start gap-2.5 text-xs">
              {/* Phone */}
              <a
                href="tel:+962789495167"
                className="group inline-flex items-center gap-2.5 font-medium text-foreground transition-colors hover:text-primary"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary/20">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                </div>
                <span dir="ltr" className="font-mono text-xs">+962 789 495 167</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/anas-aldahamsheh"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 font-medium text-foreground transition-colors hover:text-primary"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary/20">
                  <Linkedin className="h-3.5 w-3.5 shrink-0" />
                </div>
                <span dir="ltr" className="font-mono text-xs">linkedin.com/in/anas-aldahamsheh</span>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/anas-aldahamsheh"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 font-medium text-foreground transition-colors hover:text-primary"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary/20">
                  <Github className="h-3.5 w-3.5 shrink-0" />
                </div>
                <span dir="ltr" className="font-mono text-xs">github.com/anas-aldahamsheh</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {locale === 'ar' ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <div className="flex flex-col gap-2 text-xs font-medium">
              <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                {navProductsLabel}
              </Link>
              <Link href="/deals" className="text-muted-foreground hover:text-primary transition-colors">
                {navDealsLabel}
              </Link>
              <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                {navCartLabel}
              </Link>
              <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                {navAdminLabel}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 border-t border-border pt-5 text-center text-xs text-muted-foreground sm:text-start">
          <p>
            © 2026 <strong>Anas Aldahamsheh</strong>. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
