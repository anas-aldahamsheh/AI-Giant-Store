"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { StaggeredList } from "@/components/motion/StaggeredList";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductListItem } from "@/features/products/components/ProductListItem";
import type { Product, ProductViewMode } from "@/features/products/types/product.types";

export type ProductGridProps = {
  products: Product[];
  viewMode?: ProductViewMode;
  onQuickView?: (product: Product) => void;
};

export function ProductGrid({
  products,
  viewMode = "grid",
  onQuickView,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try clearing filters or searching another category."
      />
    );
  }

  if (viewMode === "list") {
    return (
    <StaggeredList className="grid gap-4">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </StaggeredList>
  );
  }

  return (
    <StaggeredList className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </StaggeredList>
  );
}
