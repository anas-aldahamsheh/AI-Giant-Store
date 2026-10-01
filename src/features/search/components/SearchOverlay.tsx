"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { productCategories } from "@/features/products/data/products.data";
import { productService } from "@/features/products/services/productService";

type SearchProduct = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  imageUrl: string;
  price: number;
  currency: string;
  ratingAverage: number;
  tags: string[];
};

type SearchResponse = {
  products: SearchProduct[];
  categories: string[];
  popularSearches: string[];
};

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const storageKey = "giant-store-recent-searches";
const defaultPopular = ["wireless headphones", "gaming laptop", "smart watch", "camera kit"];

function highlightMatch(text: string, query: string) {
  const term = query.trim();
  if (!term) return text;

  const index = text.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-cyan-100 px-0.5 text-slate-950">{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length)}
    </>
  );
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResponse>({
    products: [],
    categories: productCategories.slice(0, 6),
    popularSearches: defaultPopular,
  });
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = useMemo(() => {
    const productItems = results.products.map((product) => ({
      type: "product" as const,
      label: product.title,
      href: `/products/${product.slug}`,
      product,
    }));
    const categoryItems = results.categories.map((category) => ({
      type: "category" as const,
      label: category,
      href: `/products?category=${encodeURIComponent(category)}`,
    }));
    return [...productItems, ...categoryItems];
  }, [results]);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored) as string[]);
      } catch {
        setRecentSearches([]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      try {
        const queryNorm = query.trim().toLowerCase();
        if (!queryNorm) {
          setResults({
            products: [],
            categories: productCategories.slice(0, 6),
            popularSearches: defaultPopular,
          });
          return;
        }

        const allProducts = productService.list();
        const matched = allProducts
          .filter((p) => {
            return (
              p.title.toLowerCase().includes(queryNorm) ||
              p.brand.toLowerCase().includes(queryNorm) ||
              p.category.toLowerCase().includes(queryNorm) ||
              (p.shortDescription && p.shortDescription.toLowerCase().includes(queryNorm)) ||
              p.tags.some((t) => t.toLowerCase().includes(queryNorm))
            );
          })
          .slice(0, 6)
          .map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            brand: p.brand,
            category: p.category,
            imageUrl: p.imageUrl,
            price: p.price,
            currency: p.currency,
            ratingAverage: p.ratingAverage,
            tags: p.tags.slice(0, 3),
          }));

        const categories = Array.from(new Set(allProducts.map((p) => p.category)))
          .filter((c) => c.toLowerCase().includes(queryNorm))
          .slice(0, 6);

        setResults({
          products: matched,
          categories: categories.length > 0 ? categories : productCategories.filter((c) => c.toLowerCase().includes(queryNorm)).slice(0, 6),
          popularSearches: defaultPopular,
        });
        setActiveIndex(0);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    }, 120);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isOpen, query]);

  function rememberSearch(value: string) {
    const term = value.trim();
    if (!term) return;
    const nextSearches = [term, ...recentSearches.filter((item) => item !== term)].slice(0, 5);
    setRecentSearches(nextSearches);
    window.localStorage.setItem(storageKey, JSON.stringify(nextSearches));
  }

  function submitSearch(value = query) {
    const term = value.trim();
    if (!term) return;
    rememberSearch(term);
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  function openSuggestion(index: number) {
    const suggestion = suggestions[index];
    if (!suggestion) return;
    rememberSearch(suggestion.label);
    onClose();
    router.push(suggestion.href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, Math.max(suggestions.length - 1, 0)));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (suggestions.length > 0) {
        openSuggestion(activeIndex);
        return;
      }
      submitSearch();
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <m.div
          className="fixed inset-0 z-50 bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-panel border border-white/70 bg-white shadow-premium"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-200 p-4">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                <span className="text-xl text-brand-600" aria-hidden="true">⌕</span>
                <input
                  ref={inputRef}
                  dir="auto"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products, brands, categories, or use cases..."
                  className="h-14 min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  className="rounded-full px-3 py-1 text-xs font-black text-slate-500 hover:bg-white"
                  onClick={onClose}
                >
                  Esc
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4">
              <div className="mb-4 flex flex-wrap gap-2">
                {(recentSearches.length > 0 ? recentSearches : results.popularSearches).map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                    onClick={() => {
                      setQuery(term);
                      submitSearch(term);
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="rounded-card bg-slate-50 p-5 text-sm font-bold text-slate-500">
                  Searching catalog...
                </div>
              ) : suggestions.length === 0 && query.trim() ? (
                <div className="rounded-panel border border-dashed border-slate-300 bg-slate-50 p-6">
                  <h3 className="text-lg font-black text-slate-950">No exact matches</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Try a brand, category, or ask the AI assistant for a broader recommendation.
                  </p>
                  <Button type="button" className="mt-4" onClick={() => submitSearch(query)}>
                    Search anyway
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <Link
                      key={`${suggestion.type}-${suggestion.label}`}
                      href={suggestion.href}
                      onClick={() => {
                        rememberSearch(suggestion.label);
                        onClose();
                      }}
                      className={`block rounded-card p-3 transition ${
                        activeIndex === index ? "bg-brand-50 ring-1 ring-brand-200" : "hover:bg-slate-50"
                      }`}
                    >
                      {suggestion.type === "product" ? (
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-card bg-slate-100">
                            <ProductImage src={suggestion.product.imageUrl} alt={suggestion.product.title} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p dir="auto" className="truncate text-sm font-black text-slate-950">
                              {highlightMatch(suggestion.product.title, query)}
                            </p>
                            <p dir="auto" className="text-xs font-semibold text-slate-500">
                              {highlightMatch(suggestion.product.brand, query)} · {suggestion.product.category}
                            </p>
                          </div>
                          <PriceDisplay amount={suggestion.product.price} currency={suggestion.product.currency} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <span dir="auto" className="text-sm font-black text-slate-950">
                            {highlightMatch(suggestion.label, query)}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-700">
                            Category
                          </span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-panel bg-slate-950 p-4 text-white">
                <p className="text-sm font-black">AI search assist</p>
                <p className="mt-1 text-sm text-white/70">
                  Need fuzzy matching, gift ideas, or bundle logic? Open the assistant and describe the job to be done.
                </p>
              </div>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
