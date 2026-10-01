"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import type { CartItem as CartItemValue } from "@/features/cart/store/cart.store";

export type CartItemProps = {
  item: CartItemValue;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
};

export function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
  return (
    <article className="grid grid-cols-[5rem_1fr] gap-4 rounded-card border border-border bg-surface p-3 motion-safe:animate-[slide-up_220ms_ease-out_both]">
      <ProductImage src={item.imageUrl} alt={item.title} />
      <div className="flex flex-col justify-between gap-2.5 min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <Link
            dir="auto"
            className="text-sm font-semibold text-foreground hover:text-brand-600 transition min-w-0"
            href={`/products/${item.slug}`}
          >
            {item.title}
          </Link>
          <div className="shrink-0 pl-2">
            <PriceDisplay amount={item.price} currency={item.currency} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-button border border-border bg-white p-0.5 shadow-sm h-10">
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-button text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
              </svg>
            </button>
            <span className="w-10 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-button text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
              </svg>
            </button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-danger hover:bg-danger/5 hover:text-danger h-10 px-3"
          >
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}
