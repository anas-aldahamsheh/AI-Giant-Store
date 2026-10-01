"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { RatingStars } from "@/components/ui/RatingStars";
import { StockBadge } from "@/components/ui/StockBadge";
import { Accordion } from "@/components/ui/Accordion";
import { ProductDetailsActions } from "@/features/products/components/ProductDetailsActions";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductReviews } from "@/features/products/components/ProductReviews";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product.types";

type ProductDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const p = productService.getBySlug(slug);
    setProduct(p);
    setIsLoading(false);
    if (p) {
      document.title = `${p.title} | Giant Store`;
    }
  }, [slug]);

  if (isLoading) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-32 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  const relatedProducts = productService.related(product);

  const reviewsList = product.reviews || [];
  const reviewBuckets = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviewsList.filter((review) => Math.round(review.rating) === rating).length,
  }));

  return (
    <main className="min-h-screen bg-background">
      <section className="mesh-bg relative overflow-hidden">
        <div className="noise-overlay absolute inset-0 opacity-20" />
        <div className="premium-container relative grid gap-10 py-14 lg:grid-cols-[1fr_28rem]">
          <section className="grid gap-3">
            <div className="premium-card p-3">
              <ProductImage src={product.imageUrl} alt={product.title} priority className="rounded-panel" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {(product.gallery || []).map((imageUrl) => (
                <ProductImage key={imageUrl} src={imageUrl} alt={product.title} className="shadow-soft" />
              ))}
            </div>
            {product.videoUrl ? (
              <div className="premium-card p-4 text-sm font-semibold text-slate-600">
                Product video placeholder ready for hosted media.
              </div>
            ) : null}
          </section>
          <aside className="premium-card h-fit p-6 lg:sticky lg:top-32">
            <p dir="auto" className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">
              {product.brand}
            </p>
            <h1 dir="auto" className="mt-4 text-4xl font-black tracking-tight text-slate-950">
              {product.title}
            </h1>
            <p dir="auto" className="mt-4 leading-7 text-slate-600">{product.description}</p>
            <div className="mt-5">
              <PriceDisplay
                amount={product.price}
                compareAtAmount={product.compareAtPrice}
                currency={product.currency}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <RatingStars rating={product.ratingAverage} count={product.ratingCount} />
              <StockBadge status={product.stockStatus} />
            </div>
            <div className="mt-6 rounded-panel border border-border bg-surface-2 p-4">
              <ProductDetailsActions product={product} />
            </div>
            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white p-4">
                Delivery estimate: 2-5 business days.
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                Return policy: 30-day eligible returns.
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                Demo checkout saves your order in this browser. No payment is collected.
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                Verified reviews and grounded AI recommendations.
              </div>
            </div>
            <div className="mt-6 dark-mesh-bg rounded-panel p-5 text-white">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
                AI product advisor
              </p>
              <h2 className="mt-2 text-xl font-black">Ask if this fits your use case.</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Try: compare this product, find a cheaper alternative, or build a bundle.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="premium-container mt-12 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          <section className="premium-card p-6">
            <h2 className="text-3xl font-black text-slate-950">Description</h2>
            <p dir="auto" className="mt-3 leading-7 text-slate-600">{product.description}</p>
          </section>
          <section className="premium-card p-6">
            <h2 className="text-3xl font-black text-slate-950">Specifications</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {(product.attributes || []).map((attribute) => (
                <div key={attribute.name} className="rounded-2xl border border-border bg-white p-4">
                  <dt className="text-sm font-black text-slate-950">{attribute.name}</dt>
                  <dd className="mt-1 text-sm text-slate-600">{attribute.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="premium-card p-6">
            <h2 className="mb-4 text-3xl font-black text-slate-950">FAQs</h2>
            <Accordion
              items={(product.faqs || []).map((faq) => ({
                id: faq.question,
                title: faq.question,
                content: faq.answer,
              }))}
            />
          </section>
        </div>
        <aside className="premium-card h-fit p-5">
          <h2 className="mb-4 text-xl font-black text-slate-950">Reviews</h2>
          <div className="mb-5 space-y-2">
            {reviewBuckets.map((bucket) => (
              <div key={bucket.rating} className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2 text-xs">
                <span>{bucket.rating}★</span>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400"
                    style={{
                      width: `${Math.max(8, (bucket.count / Math.max(1, product.reviews.length)) * 100)}%`,
                    }}
                  />
                </div>
                <span>{bucket.count}</span>
              </div>
            ))}
          </div>
          <ProductReviews initialProduct={product} />
        </aside>
      </section>
      <section className="premium-container mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">
              Frequently bought together
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Similar products</h2>
          </div>
        </div>
        <div className="mt-5">
          <ProductGrid products={relatedProducts} />
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-white/70 bg-white/90 p-3 shadow-glow backdrop-blur md:hidden">
        <ProductDetailsActions product={product} />
      </div>
    </main>
  );
}
