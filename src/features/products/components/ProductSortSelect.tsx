"use client";

import { Select } from "@/components/ui/Select";
import type { ProductSort } from "@/features/products/types/product.types";

export type ProductSortSelectProps = {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
};

const options = [
  { label: "Most popular", value: "popular" },
  { label: "Price: low to high", value: "price_asc" },
  { label: "Price: high to low", value: "price_desc" },
  { label: "Top rated", value: "rating" },
  { label: "Newest", value: "newest" },
] satisfies { label: string; value: ProductSort }[];

export function ProductSortSelect({ value, onChange }: ProductSortSelectProps) {
  return (
    <Select
      name="sort"
      value={value}
      options={options}
      onChange={(event) => onChange(event.target.value as ProductSort)}
    />
  );
}
