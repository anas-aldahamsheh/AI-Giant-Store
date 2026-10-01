"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Pagination } from "@/components/ui/Pagination";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCompare } from "@/features/compare/store/compare.store";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductQuickView } from "@/features/products/components/ProductQuickView";
import { ProductSortSelect } from "@/features/products/components/ProductSortSelect";
import { productService } from "@/features/products/services/productService";
import type {
  ProductFilters as ProductFiltersValue,
  ProductSort,
  ProductViewMode,
} from "@/features/products/types/product.types";
import type { Product } from "@/features/products/types/product.types";
import {
  parseProductFilters,
  parseProductSort,
} from "@/features/products/validation/product.schemas";

const pageSize = 6;

export function ProductListingShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(
    () => parseProductFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const [filters, setFiltersState] = useState<ProductFiltersValue>(initialFilters);
  const [sort, setSortState] = useState<ProductSort>(
    parseProductSort(searchParams.get("sort")),
  );
  const [viewMode, setViewMode] = useState<ProductViewMode>(
    searchParams.get("view") === "list" ? "list" : "grid",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { items: compareItems, clearCompare, removeFromCompare } = useCompare();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const products = useMemo(() => mounted ? productService.list(filters, sort) : [], [filters, sort, mounted]);
  const catalogCount = useMemo(() => mounted ? productService.list().length : 0, [mounted]);
  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const visibleProducts = products.slice((safePage - 1) * pageSize, safePage * pageSize);
  const activeFilterEntries = Object.entries(filters).filter(([, value]) => Boolean(value));

  function syncUrl(
    nextFilters = filters,
    nextSort = sort,
    nextViewMode = viewMode,
    nextPage = page,
  ) {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      }
    });
    params.set("sort", nextSort);
    params.set("view", nextViewMode);
    params.set("page", String(nextPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setFilters(nextFilters: ProductFiltersValue) {
    setFiltersState(nextFilters);
    setPage(1);
    syncUrl(nextFilters, sort, viewMode, 1);
  }

  function setSort(nextSort: ProductSort) {
    setSortState(nextSort);
    setPage(1);
    syncUrl(filters, nextSort, viewMode, 1);
  }

  function setView(nextViewMode: ProductViewMode) {
    setViewMode(nextViewMode);
    syncUrl(filters, sort, nextViewMode, page);
  }

  function setListingPage(nextPage: number) {
    setPage(nextPage);
    syncUrl(filters, sort, viewMode, nextPage);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <div className="hidden lg:block">
        <ProductFilters value={filters} onChange={setFilters} onClear={() => setFilters({})} />
      </div>
      <section>
        <div className="relative z-10 mb-5 rounded-panel border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-600">
              {products.length} products found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Ask the AI assistant for help comparing products, then check their details.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" onClick={() => setFiltersOpen(true)}>
              Filters
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">Sort</span>
              <div className="min-w-48">
                <ProductSortSelect value={sort} onChange={setSort} />
              </div>
            </div>
            <div className="flex rounded-button border border-border bg-surface p-1">
              <Button
                type="button"
                size="sm"
                variant={viewMode === "grid" ? "primary" : "ghost"}
                onClick={() => setView("grid")}
              >
                Grid
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === "list" ? "primary" : "ghost"}
                onClick={() => setView("list")}
              >
                List
              </Button>
            </div>
          </div>
          </div>
          {activeFilterEntries.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeFilterEntries.map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
                  onClick={() => setFilters({ ...filters, [key]: undefined })}
                >
                  {key}: {String(value)}
                </button>
              ))}
              <Button type="button" size="sm" variant="ghost" onClick={() => setFilters({})}>
                Clear all
              </Button>
            </div>
          ) : null}
        </div>
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_18rem]">
          <div className="dark-mesh-bg rounded-panel p-5 text-white shadow-premium">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
              Shopping help
            </p>
            <h2 className="mt-2 text-2xl font-black">Not sure what to buy?</h2>
            <p className="mt-2 text-sm text-white/70">
              Use Ask AI in the mobile navigation or the assistant button on desktop.
            </p>
          </div>
          <div className="premium-card p-5">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">
              Local catalog
            </p>
            <p className="mt-2 text-sm text-slate-500">
              These products are saved in this browser and may differ on another device.
            </p>
          </div>
        </div>
        {mounted && catalogCount === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-white p-8 text-center text-sm text-slate-600">
            No products are saved in this browser yet.
          </div>
        ) : (
          <ProductGrid
            products={visibleProducts}
            viewMode={viewMode}
            onQuickView={setQuickViewProduct}
          />
        )}
        <div className="mt-8">
          <Pagination page={safePage} pageCount={pageCount} onPageChange={setListingPage} />
        </div>
        {compareItems.length > 0 ? (
          <div className="sticky bottom-20 z-20 mt-8 rounded-panel border border-white/70 bg-white/90 p-3 text-sm font-bold text-slate-700 shadow-glow backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-black text-white">
                  {compareItems.length}/3 comparing
                </span>
                {compareItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex max-w-[13rem] items-center gap-2 rounded-full bg-slate-100 py-1 pl-1 pr-2"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-white">
                      <ProductImage src={product.imageUrl} alt={product.title} />
                    </div>
                    <span className="truncate text-xs">{product.title}</span>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-red-600"
                      onClick={() => removeFromCompare(product.id)}
                      aria-label={`Remove ${product.title} from compare`}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="ghost" onClick={clearCompare}>
                  Clear
                </Button>
                <Button type="button" size="sm">
                  <Link href="/compare">Compare now</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
      <Drawer
        isOpen={filtersOpen}
        title="Product filters"
        onClose={() => setFiltersOpen(false)}
        side="bottom"
      >
        <ProductFilters value={filters} onChange={setFilters} onClear={() => setFilters({})} />
      </Drawer>
      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
