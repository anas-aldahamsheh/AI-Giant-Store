"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DiscountBadge } from "@/components/ui/DiscountBadge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { RatingStars } from "@/components/ui/RatingStars";
import { StockBadge } from "@/components/ui/StockBadge";
import { useCart } from "@/features/cart/store/cart.store";
import { useCompare } from "@/features/compare/store/compare.store";
import { useWishlist } from "@/features/wishlist/store/wishlist.store";
import type { Product } from "@/features/products/types/product.types";

export type ProductCardProps = {
  product: Product;
  onQuickView?: (product: Product) => void;
};

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);

  function handleAddToCart() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article
      data-fx-tilt="8"
      className="fx-tilt group relative overflow-hidden rounded-panel border border-white/70 bg-white/90 p-3 shadow-soft backdrop-blur transition hover:shadow-premium"
    >
      <span aria-hidden="true" className="fx-glare" />
      <div className="pointer-events-none absolute inset-0 rounded-panel bg-gradient-to-br from-brand-600/0 via-cyan-400/0 to-violet-500/0 opacity-0 transition group-hover:from-brand-600/10 group-hover:via-cyan-400/10 group-hover:to-violet-500/10 group-hover:opacity-100" />
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.title}`}>
        <ProductImage src={product.imageUrl} alt={product.title} className="rounded-[1.15rem]" />
      </Link>
      <div className="relative mt-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p dir="auto" className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-brand-600">
              {product.brand}
            </p>
            <Link
              href={`/products/${product.slug}`}
              dir="auto"
              className="line-clamp-2 text-base font-black text-slate-950 hover:text-brand-700"
            >
              {product.title}
            </Link>
          </div>
          {product.compareAtPrice ? (
            <DiscountBadge amount={product.price} compareAtAmount={product.compareAtPrice} />
          ) : null}
        </div>
        <PriceDisplay
          amount={product.price}
          compareAtAmount={product.compareAtPrice}
          currency={product.currency}
        />
        <div className="flex items-center justify-between gap-3">
          <RatingStars rating={product.ratingAverage} count={product.ratingCount} />
          <StockBadge status={product.stockStatus} />
        </div>
        <div className="grid grid-cols-3 gap-2 opacity-100 transition sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <Button type="button" className="fx-shine relative col-span-3 overflow-hidden shadow-glow" onClick={handleAddToCart}>
            {added ? "Added" : "Add to cart"}
          </Button>
          <Button
            type="button"
            variant={wishlisted ? "primary" : "secondary"}
            size="sm"
            onClick={() => toggleWishlist(product)}
          >
            {wishlisted ? "Saved" : "Wish"}
          </Button>
          <Button
            type="button"
            variant={compared ? "primary" : "secondary"}
            size="sm"
            onClick={() => toggleCompare(product)}
          >
            {compared ? "Added" : "Compare"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onQuickView?.(product)}
          >
            View
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <article className="rounded-panel border border-white/70 bg-white/80 p-3 shadow-soft">
      <div className="fx-shimmer aspect-square rounded-[1.15rem] bg-muted" />
      <div className="mt-4 space-y-3">
        <div className="fx-shimmer h-4 w-24 rounded-full bg-muted" />
        <div className="fx-shimmer h-5 w-4/5 rounded-full bg-muted" />
        <div className="fx-shimmer h-5 w-32 rounded-full bg-muted" />
        <div className="fx-shimmer h-11 rounded-button bg-muted" />
      </div>
    </article>
  );
}

export function FeaturedProductCard({ product, onQuickView }: ProductCardProps) {
  return (
    <div className="dark-mesh-bg rounded-panel p-1 shadow-premium">
      <div className="rounded-[1.35rem] bg-white/95 p-3">
        <ProductCard product={product} onQuickView={onQuickView} />
      </div>
    </div>
  );
}
