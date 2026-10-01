"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { CartHeaderButton } from "@/components/layout/CartHeaderButton";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { TopAnnouncementBar } from "@/components/layout/TopAnnouncementBar";
import { siteConfig } from "@/config/site";
import { productCategories } from "@/features/products/data/products.data";
import { SearchOverlay } from "@/features/search/components/SearchOverlay";
import { routes } from "@/lib/constants/routes";

const navLinks = [
  { label: "Products", href: routes.products },
  { label: "Deals", href: "/deals" },
  { label: "Help", href: "/help" },
  { label: "Compare", href: "/compare" },
];

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/78 shadow-sm backdrop-blur-2xl">
      <TopAnnouncementBar />
      <div className="premium-container flex items-center gap-4 py-4">
        <Link href={routes.home} className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 via-violet-500 to-cyan-400 text-base font-black text-white shadow-glow transition group-hover:scale-105">
            GS
          </span>
          <span className="hidden sm:block">
            <span className="block text-lg font-black tracking-tight text-slate-950">
              {siteConfig.name}
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              AI Marketplace
            </span>
          </span>
        </Link>
        <nav
          className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/70 p-1 shadow-sm backdrop-blur md:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <div key={link.href} className="group relative">
              <Link
                href={link.href}
                className={`block rounded-full px-4 py-2 text-sm font-bold transition ${
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? "bg-gradient-to-r from-brand-600 to-violet-500 text-white shadow-glow"
                    : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {link.label}
              </Link>
              {link.href === routes.products ? (
                <div className="invisible absolute left-0 top-full z-40 pt-3 w-[32rem] opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="rounded-panel border border-white/70 bg-white p-4 shadow-premium">
                    <div className="grid grid-cols-2 gap-3">
                      {productCategories.map((category) => (
                        <Link
                          key={category}
                          href={`/products?category=${encodeURIComponent(category)}`}
                          className="rounded-card bg-slate-50 p-3 text-sm font-black text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <button
          type="button"
          className="ml-auto hidden h-11 w-full max-w-sm items-center justify-between rounded-button border border-white/70 bg-white/80 px-4 text-left text-sm font-semibold text-slate-500 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 lg:flex"
          onClick={() => setSearchOpen(true)}
        >
          <span>Search products, brands, AI ideas...</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">⌘K</span>
        </button>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/80 text-lg font-black text-brand-700 shadow-sm lg:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            ⌕
          </button>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <AccountMenu />
          <CartHeaderButton />
        </div>
      </div>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
