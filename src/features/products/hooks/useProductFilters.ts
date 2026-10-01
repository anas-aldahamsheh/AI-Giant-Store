"use client";

import { useState } from "react";
import type {
  ProductFilters,
  ProductSort,
} from "@/features/products/types/product.types";

export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<ProductSort>("popular");

  return {
    filters,
    setFilters,
    sort,
    setSort,
    clearFilters: () => setFilters({}),
  };
}
