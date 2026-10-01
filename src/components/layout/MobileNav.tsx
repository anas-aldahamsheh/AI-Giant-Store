"use client";

import Link from "next/link";
import { routes } from "@/lib/constants/routes";

const mobileLinks = [
  { label: "Home", href: routes.home },
  { label: "Products", href: routes.products },
  { label: "Cart", href: routes.cart },
  { label: "Account", href: routes.account },
];

export function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/85 px-2 py-2 shadow-glow backdrop-blur-2xl md:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-5 gap-1">
        {mobileLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex h-11 items-center justify-center rounded-full text-xs font-black text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-giant-ai"))}
            className="flex h-11 w-full items-center justify-center rounded-full text-xs font-black text-brand-700 transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Open AI Assistant"
          >
            Ask AI
          </button>
        </li>
      </ul>
    </nav>
  );
}
