"use client";

import Link from "next/link";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { RatingStars } from "@/components/ui/RatingStars";
import { useCart } from "@/features/cart/store/cart.store";
import type { Product } from "@/features/products/types/product.types";

export type ProductQuickViewProps = {
  product: Product | null;
  onClose: () => void;
};

export function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const { addItem } = useCart();

  return (
    <Modal
      isOpen={Boolean(product)}
      title={product?.title ?? "Product"}
      description={product?.shortDescription}
      onClose={onClose}
    >
      {product ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <ProductImage src={product.imageUrl} alt={product.title} />
          <div className="space-y-4">
            <PriceDisplay
              amount={product.price}
              compareAtAmount={product.compareAtPrice}
              currency={product.currency}
            />
            <RatingStars rating={product.ratingAverage} count={product.ratingCount} />
            {product.variants.length > 0 ? (
              <Select
                label="Variant"
                name="quick-view-variant"
                defaultValue={product.variants[0]?.id}
                options={product.variants.map((variant) => ({
                  label: variant.name,
                  value: variant.id,
                }))}
              />
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => addItem(product)}>
                Add to cart
              </Button>
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex h-11 items-center rounded-button border border-border px-4 text-sm font-semibold"
              >
                View details
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
