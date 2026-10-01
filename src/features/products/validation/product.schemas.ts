import type { ProductFilters, ProductSort } from "@/features/products/types/product.types";

const sortValues: ProductSort[] = ["popular", "price_asc", "price_desc", "rating", "newest"];

export function parseProductSort(value: string | null): ProductSort {
  if (value && sortValues.includes(value as ProductSort)) {
    return value as ProductSort;
  }

  return "popular";
}

export function parseProductFilters(searchParams: URLSearchParams): ProductFilters {
  const minPrice = Number(searchParams.get("minPrice"));
  const maxPrice = Number(searchParams.get("maxPrice"));
  const rating = Number(searchParams.get("rating"));

  return {
    category: searchParams.get("category") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    minPrice: Number.isFinite(minPrice) && minPrice > 0 ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined,
    rating: Number.isFinite(rating) && rating > 0 ? rating : undefined,
    tag: searchParams.get("tag") ?? undefined,
  };
}
