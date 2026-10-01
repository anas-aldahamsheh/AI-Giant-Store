"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product.types";

export default function DealsPage() {
  const [deals, setDeals] = useState<Product[]>([]);

  useEffect(() => {
    setDeals(productService.list().filter((product) =>
      product.compareAtPrice !== undefined && product.compareAtPrice > product.price,
    ));
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="dark-mesh-bg relative overflow-hidden text-white">
        <div className="noise-overlay absolute inset-0 opacity-15" />
        <div className="premium-container relative py-20">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">Catalog offers</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-tight sm:text-7xl">Products with a listed discount.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Discounts shown here come from products saved in this browser. Check each product before deciding.
          </p>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-black text-slate-950">Current local offers</h2>
            <Link className="font-bold text-brand-700" href="/products">View full catalog</Link>
          </div>
          {deals.length === 0 ? (
            <p className="mt-8 rounded-card border border-border bg-white p-6 text-slate-600">
              No discounted products are saved in this browser yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((product) => (
                <Card key={product.id} className="group overflow-hidden border-white/70 shadow-soft">
                  <CardContent className="space-y-4">
                    <ProductImage src={product.imageUrl} alt={product.title} />
                    <Link href={`/products/${product.slug}`} className="block font-black text-slate-950 hover:text-brand-700">
                      {product.title}
                    </Link>
                    <p className="text-sm text-slate-500">{product.brand}</p>
                    <PriceDisplay amount={product.price} compareAtAmount={product.compareAtPrice} currency={product.currency} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
