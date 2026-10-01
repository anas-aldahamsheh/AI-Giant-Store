"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { RatingStars } from "@/components/ui/RatingStars";
import { StockBadge } from "@/components/ui/StockBadge";
import { useCart } from "@/features/cart/store/cart.store";
import { useCompare } from "@/features/compare/store/compare.store";
import { useWishlist } from "@/features/wishlist/store/wishlist.store";
import type { Product } from "@/features/products/types/product.types";

export type ProductListItemProps = {
  product: Product;
  onQuickView?: (product: Product) => void;
};

export function ProductListItem({ product, onQuickView }: ProductListItemProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);

  return (
    <article className="group grid gap-4 rounded-panel border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur transition hover:shadow-glow sm:grid-cols-[14rem_1fr]">
      <Link href={`/products/${product.slug}`}>
        <ProductImage src={product.imageUrl} alt={product.title} />
      </Link>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              href={`/products/${product.slug}`}
              className="text-lg font-semibold text-foreground hover:text-brand-700"
            >
              {product.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{product.shortDescription}</p>
          </div>
          <StockBadge status={product.stockStatus} />
        </div>
        <RatingStars rating={product.ratingAverage} count={product.ratingCount} />
        <PriceDisplay
          amount={product.price}
          compareAtAmount={product.compareAtPrice}
          currency={product.currency}
        />
        <div className="mt-auto flex flex-wrap gap-2">
          <Button type="button" onClick={() => addItem(product)}>
            Add to cart
          </Button>
          <Button
            type="button"
            variant={wishlisted ? "primary" : "secondary"}
            onClick={() => toggleWishlist(product)}
          >
            {wishlisted ? "Saved" : "Wishlist"}
          </Button>
          <Button
            type="button"
            variant={compared ? "primary" : "secondary"}
            onClick={() => toggleCompare(product)}
          >
            {compared ? "Compared" : "Compare"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => onQuickView?.(product)}>
            Quick view
          </Button>
        </div>
      </div>
    </article>
  );
}
