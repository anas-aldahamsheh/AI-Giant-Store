"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import { SearchInput } from "@/components/ui/SearchInput";
import { ProductImage } from "@/components/ui/ProductImage";
import { fadeUp, staggerContainer } from "@/lib/motion/motion-presets";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product.types";

const promptChips = [
  "Find headphones under $250",
  "Build a creator kit",
  "Best value smart watch",
  "Gift ideas for gamers",
];

export function HeroSection() {
  const reduce = false;
  const [mounted, setMounted] = useState(false);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);
    setLiveProducts(productService.list().slice(0, 3));
  }, []);

  return (
    <section className="mesh-bg relative min-h-[calc(100vh-8rem)] overflow-hidden">
      <div className="noise-overlay absolute inset-0 opacity-25" />
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <m.div
        className="premium-container relative grid min-h-[calc(100vh-8rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_0.9fr]"
        initial={mounted && reduce ? "visible" : "hidden"}
        animate="visible"
        variants={staggerContainer}
      >
        <m.div className="w-full min-w-0" variants={fadeUp}>
          <p className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-brand-700 shadow-sm backdrop-blur">
            Premium AI-powered marketplace
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-7xl">
            Giant Store
            <span className="block bg-gradient-to-r from-brand-600 via-violet-500 to-cyan-400 bg-clip-text text-transparent">
              shops with you.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Explore products saved in your browser with search, comparisons, and an AI advisor.
            Check product details before making a decision.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("hero-search") as string;
              if (query?.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
              }
            }}
            className="mt-8 w-full max-w-2xl rounded-[1.35rem] border border-white/70 bg-white/78 p-2 sm:p-3 shadow-glow backdrop-blur flex items-center gap-2 sm:gap-3"
          >
            <div className="flex-1 min-w-0">
              <SearchInput
                name="hero-search"
                placeholder="Search products, brands, ideas..."
              />
            </div>
            <button
              type="submit"
              className="flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-violet-500 px-4 sm:px-6 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              Search
            </button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            {promptChips.map((chip) => (
              <Link
                key={chip}
                href={`/search?q=${encodeURIComponent(chip)}`}
                className="rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:text-brand-700"
              >
                {chip}
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-violet-500 px-6 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Shop products
            </Link>
            <Link
              href="/deals"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/70 bg-white/80 px-6 text-sm font-black text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Explore offers
            </Link>
          </div>
        </m.div>

        <m.div className="relative grid gap-5" variants={staggerContainer}>
          <div className="premium-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">
                  Browser catalog
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Recently added products</h2>
              </div>
              <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-bold text-cyan-700">
                Local preview
              </span>
            </div>
            <div className="grid gap-3">
              {liveProducts.length > 0 ? (
                liveProducts.map((product, index) => (
                  <m.article
                    key={product.id}
                    variants={fadeUp}
                    className="group grid grid-cols-[5.5rem_1fr] items-center gap-4 rounded-2xl border border-white/70 bg-white/76 p-3 shadow-sm backdrop-blur transition hover:shadow-glow"
                    style={{ rotate: index === 1 ? "-1deg" : index === 2 ? "1deg" : "0deg" }}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                      <ProductImage src={product.imageUrl} alt={product.title} priority />
                    </div>
                    <div>
                      <Link href={`/products/${product.slug}`} className="text-sm font-black text-slate-950 hover:text-brand-600 transition">
                        {product.title}
                      </Link>
                      <p className="mt-1 text-sm font-bold text-brand-700">${product.price}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {product.brand} · {product.category}
                      </p>
                    </div>
                  </m.article>
                ))
              ) : (
                <div className="rounded-2xl border border-white/70 bg-white/76 p-6 text-center shadow-sm backdrop-blur">
                  <p className="text-sm font-bold text-slate-800">No products yet</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Add products in the Admin dashboard to see them featured here.
                  </p>
                  <Link
                    href="/admin"
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-brand-700 transition"
                  >
                    Go to Admin
                  </Link>
                </div>
              )}
            </div>
          </div>
        </m.div>
      </m.div>
    </section>
  );
}
