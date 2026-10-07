"use client";

import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/features/cart/store/cart.store";

export type CartHeaderButtonProps = {
  itemCount?: number;
};

export function CartHeaderButton({ itemCount: fallbackItemCount = 0 }: CartHeaderButtonProps) {
  const { itemCount } = useCart();
  const visibleItemCount = itemCount || fallbackItemCount;

  return (
    <Link
      href="/cart"
      data-cart-target
      aria-label={`Cart with ${visibleItemCount} items`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-900 shadow-glow backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      <span aria-hidden="true" className="hidden sm:inline">Cart</span>
      <span className="sm:hidden" aria-hidden="true">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </span>
      <AnimatePresence>
        {visibleItemCount > 0 ? (
          <m.span
            key={visibleItemCount}
            initial={{ scale: 0, rotate: -40, y: 6 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 14 }}
            className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-brand-600 to-cyan-400 px-1.5 py-0.5 text-xs font-bold text-white shadow-glow"
          >
            {visibleItemCount}
          </m.span>
        ) : null}
      </AnimatePresence>
    </Link>
  );
}
