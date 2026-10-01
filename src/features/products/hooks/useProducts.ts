"use client";

import { useMemo } from "react";
import { productService } from "@/features/products/services/productService";
import type {
  ProductFilters,
  ProductSort,
} from "@/features/products/types/product.types";

export function useProducts(filters: ProductFilters = {}, sort: ProductSort = "popular") {
  return useMemo(() => productService.list(filters, sort), [filters, sort]);
}
