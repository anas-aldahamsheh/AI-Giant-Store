"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { RatingStars } from "@/components/ui/RatingStars";
import { EmptyState } from "@/components/ui/EmptyState";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product.types";

// Simple Levenshtein distance for typo tolerance
function levenshteinDistance(a: string, b: string): number {
  const tmp = [];
  let i, j;
  for (i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

// Synonym dictionary
const SYNONYMS: Record<string, string[]> = {
  phone: ["mobile", "cellphone", "smartphone", "iphone"],
  headphone: ["headphones", "earphones", "earbuds", "audio"],
  audio: ["headphone", "headphones", "speaker", "sound"],
  watch: ["smartwatch", "wearable", "clock"],
  charge: ["charger", "cable", "powerbank", "charging"],
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") || "";

  const [searchVal, setSearchVal] = useState(rawQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("popular");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load search value
  useEffect(() => {
    setSearchVal(rawQuery);
  }, [rawQuery]);

  // Load and save recent searches
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("giant-recent-searches");
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 5);
      localStorage.setItem("giant-recent-searches", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      saveRecentSearch(searchVal.trim());
      router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchVal(tag);
    saveRecentSearch(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  // Perform search matching
  const searchResults = useMemo(() => {
    if (!mounted || !rawQuery.trim()) return [];

    const allProducts = productService.list({}, "popular");
    const queryLower = rawQuery.toLowerCase().trim();

    // Find synonyms
    const searchTerms = [queryLower];
    Object.entries(SYNONYMS).forEach(([key, values]) => {
      if (key.includes(queryLower) || queryLower.includes(key)) {
        searchTerms.push(...values);
      }
      values.forEach((v) => {
        if (v.includes(queryLower) || queryLower.includes(v)) {
          searchTerms.push(key, ...values);
        }
      });
    });

    const uniqueTerms = Array.from(new Set(searchTerms));

    return allProducts.filter((product) => {
      const titleLower = product.title.toLowerCase();
      const descLower = product.description.toLowerCase();
      const brandLower = product.brand.toLowerCase();
      const catLower = product.category.toLowerCase();

      // Direct substring match with terms
      const matchesText = uniqueTerms.some(
        (term) =>
          titleLower.includes(term) ||
          descLower.includes(term) ||
          brandLower.includes(term) ||
          catLower.includes(term)
      );

      if (matchesText) return true;

      // Typo tolerance Levenshtein distance match
      const titleWords = titleLower.split(/\s+/);
      const queryWords = queryLower.split(/\s+/);

      return queryWords.some((qw) => {
        if (qw.length < 3) return false;
        return titleWords.some((tw) => {
          if (tw.length < 3) return false;
          const dist = levenshteinDistance(qw, tw);
          return dist <= 2; // Allow up to 2 typos
        });
      });
    });
  }, [rawQuery, mounted]);

  // Apply filters and sorting
  const processedResults = useMemo(() => {
    let list = [...searchResults];

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortOrder === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "rating") {
      list.sort((a, b) => b.ratingAverage - a.ratingAverage);
    }

    return list;
  }, [searchResults, selectedCategory, sortOrder]);

  const categories = useMemo(() => {
    const list = searchResults.map((p) => p.category);
    return Array.from(new Set(list));
  }, [searchResults]);

  // Highlight helper
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-100 text-amber-900 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const popularSearches = ["Headphones", "Charger", "Laptop", "Watch", "Phone"];

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-16">
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              name="search"
              placeholder="Search products, brands, or categories..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Popular searches tags */}
        <div className="mt-4 flex flex-wrap gap-2 items-center text-xs">
          <span className="text-muted-foreground font-semibold">Popular Searches:</span>
          {popularSearches.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-2 py-1 bg-surface border border-border rounded-button text-muted-foreground hover:text-foreground transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 items-center text-xs">
            <span className="text-muted-foreground font-semibold">Recent Searches:</span>
            {recentSearches.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-2 py-1 bg-brand-50/50 border border-brand-100 text-brand-700 hover:text-brand-900 rounded-button transition"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {rawQuery && (
        <div className="relative z-10 mb-6 flex justify-between items-center text-sm border-b border-border pb-4">
          <p className="text-muted-foreground">
            Found <span className="font-bold text-foreground">{processedResults.length}</span> results for &ldquo;{rawQuery}&rdquo;
          </p>
          <div className="flex gap-3">
            {categories.length > 0 && (
              <Select
                name="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { label: "All Categories", value: "" },
                  ...categories.map((c) => ({ label: c, value: c })),
                ]}
              />
            )}
            <Select
              name="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              options={[
                { label: "Most Popular", value: "popular" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" },
                { label: "Top Rated", value: "rating" },
              ]}
            />
          </div>
        </div>
      )}

      {processedResults.length === 0 ? (
        <EmptyState
          title={rawQuery ? `No results found for "${rawQuery}"` : "Search Giant Store"}
          description={rawQuery ? "Check the spelling or try searching for another keyword." : "Type a keyword above to find products."}
          action={
            !rawQuery ? (
              <Button type="button" onClick={() => handleTagClick("Headphones")}>
                Try searching &quot;Headphones&quot;
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {processedResults.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition">
              <CardContent className="p-4 space-y-3">
                <div className="h-44 w-full relative">
                  <ProductImage src={product.imageUrl} alt={product.title} />
                </div>
                <div>
                  <span className="text-xs uppercase text-brand-600 font-bold block">{product.brand}</span>
                  <Link href={`/products/${product.slug}`} className="font-semibold text-foreground hover:underline line-clamp-1 block text-sm">
                    {highlightText(product.title, rawQuery)}
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {highlightText(product.shortDescription || "", rawQuery)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <PriceDisplay amount={product.price} />
                  <RatingStars rating={product.ratingAverage} count={product.ratingCount} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
