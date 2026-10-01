"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useCart } from "@/features/cart/store/cart.store";
import { useWishlist } from "@/features/wishlist/store/wishlist.store";
import { useCompare } from "@/features/compare/store/compare.store";
import type { Product } from "@/features/products/types/product.types";

export type ProductDetailsActionsProps = {
  product: Product;
};

export function ProductDetailsActions({ product }: ProductDetailsActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  const isWish = isInWishlist(product.id);
  const isComp = isInCompare(product.id);

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="space-y-4">
      {product.variants.length > 0 ? (
        <Select
          label="Variant"
          name="variant"
          defaultValue={product.variants[0]?.id}
          options={product.variants.map((variant) => ({
            label: `${variant.name} - ${variant.sku}`,
            value: variant.id,
          }))}
        />
      ) : null}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-slate-700">Quantity</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-button border border-border bg-white p-1 shadow-sm h-11">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-button text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
              </svg>
            </button>
            <span className="w-12 text-center text-sm font-semibold text-slate-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-button text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
              </svg>
            </button>
          </div>
          <Button type="button" className="flex-1 shadow-glow h-11" onClick={() => addItem(product, quantity)}>
            Add to cart
          </Button>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button type="button" variant="secondary" onClick={handleBuyNow}>
          Buy now
        </Button>
        <Button
          type="button"
          variant={isWish ? "primary" : "secondary"}
          onClick={() => toggleWishlist(product)}
        >
          {isWish ? "Wishlisted ♥" : "Wishlist"}
        </Button>
        <Button
          type="button"
          variant={isComp ? "primary" : "secondary"}
          onClick={() => toggleCompare(product)}
        >
          {isComp ? "Comparing ✓" : "Compare"}
        </Button>
      </div>
    </div>
  );
}
