"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { RatingStars } from "@/components/ui/RatingStars";
import { useCart } from "@/features/cart/store/cart.store";
import { recommendationService } from "@/features/products/services/recommendationService";
import type { Product } from "@/features/products/types/product.types";

type Rail = {
  title: string;
  description: string;
  products: Product[];
};

function RecommendationRail({ rail }: { rail: Rail }) {
  const { addItem } = useCart();

  if (rail.products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-slate-950">{rail.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{rail.description}</p>
      </div>
      <div className="flex snap-x gap-4 overflow-x-auto pb-3">
        {rail.products.map((product, index) => (
          <m.article
            key={product.id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
            className="w-64 shrink-0 snap-start rounded-panel border border-white/70 bg-white p-3 shadow-soft"
          >
            <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-[1rem] bg-slate-100">
              <ProductImage src={product.imageUrl} alt={product.title} />
            </Link>
            <div className="mt-3 space-y-2">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-600">{product.brand}</p>
              <Link href={`/products/${product.slug}`} className="line-clamp-2 text-sm font-black text-slate-950 hover:text-brand-700">
                {product.title}
              </Link>
              <RatingStars rating={product.ratingAverage} count={product.ratingCount} />
              <div className="flex items-center justify-between gap-2">
                <PriceDisplay amount={product.price} currency={product.currency} />
                <Button type="button" size="sm" onClick={() => addItem(product)}>
                  Add
                </Button>
              </div>
            </div>
          </m.article>
        ))}
      </div>
    </section>
  );
}

export function RecommendationRails() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const rails: Rail[] = [
    {
      title: "Trending now",
      description: "High-signal products with strong catalog traction.",
      products: recommendationService.getTrending(6),
    },
    {
      title: "Best sellers",
      description: "Popular and highly reviewed picks shoppers keep choosing.",
      products: recommendationService.getBestSellers(6),
    },
    {
      title: "New arrivals",
      description: "Fresh inventory and recently updated products.",
      products: recommendationService.getNewArrivals(6),
    },
    {
      title: "AI recommended for you",
      description: "A safe fallback rail powered by the same grounded catalog logic.",
      products: recommendationService.getAiRecommendedForYou(4),
    },
  ];

  const hasProducts = rails.some((rail) => rail.products.length > 0);
  if (!hasProducts) return null;

  return (
    <div className="premium-section bg-slate-50">
      <div className="premium-container space-y-10">
        {rails.map((rail) => (
          <RecommendationRail key={rail.title} rail={rail} />
        ))}
      </div>
    </div>
  );
}
