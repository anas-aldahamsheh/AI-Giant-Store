"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { RatingStars } from "@/components/ui/RatingStars";
import { StockBadge } from "@/components/ui/StockBadge";
import { useCart } from "@/features/cart/store/cart.store";
import { useCompare } from "@/features/compare/store/compare.store";
import type { Product } from "@/features/products/types/product.types";

const highlightedAttributes = ["Battery Life", "Display", "Connectivity", "Warranty"];

function hasDifference(items: Product[], getter: (item: Product) => string | number) {
  if (items.length <= 1) return false;
  const firstValue = getter(items[0]);
  return items.some((item) => getter(item) !== firstValue);
}

function getAttribute(product: Product, name: string) {
  return product.attributes.find((attribute) => attribute.name === name)?.value ?? "Not listed";
}

function getBestValue(items: Product[]) {
  return [...items].sort((a, b) => {
    const scoreA = a.ratingAverage / Math.max(a.price, 1);
    const scoreB = b.ratingAverage / Math.max(b.price, 1);
    return scoreB - scoreA;
  })[0];
}

export default function ComparePage() {
  const { items, toggleCompare, clearCompare, lastMessage } = useCompare();
  const { addItem } = useCart();

  const hasPriceDiff = hasDifference(items, (item) => item.price);
  const hasBrandDiff = hasDifference(items, (item) => item.brand);
  const hasRatingDiff = hasDifference(items, (item) => item.ratingAverage);
  const bestValue = getBestValue(items);
  const premiumPick = [...items].sort((a, b) => b.price - a.price)[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mesh-bg relative overflow-hidden border-b border-white/70">
        <div className="premium-container py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">
                Compare Lab
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black text-slate-950 sm:text-5xl">
                Compare products with price, rating, specs, and AI-ready context.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Add up to 3 products from the catalog, spot differences instantly, and move the strongest option into your cart.
              </p>
            </div>
            <div className="rounded-panel border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur">
              <p className="text-sm font-black text-slate-950">Quick comparison</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {items.length >= 2
                  ? `${bestValue.title} has the highest listed rating per dollar. ${premiumPick.title} has the highest listed price. Compare the specifications below before deciding.`
                  : "Add at least 2 products to compare their listed prices and specifications."}
              </p>
              {lastMessage ? (
                <p className="mt-3 rounded-card bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700">
                  {lastMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-container py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Comparison board</h2>
            <p className="mt-1 text-sm text-slate-600">{items.length}/3 products selected</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary">
              <Link href="/products">Add products</Link>
            </Button>
            {items.length > 0 ? (
              <Button type="button" variant="ghost" onClick={clearCompare}>
                Clear all
              </Button>
            ) : null}
          </div>
        </div>

        {items.length < 2 ? (
          <EmptyState
            title="Build a comparison first"
            description="Add at least 2 products from the catalog to unlock a full specs, price, and rating comparison."
            action={
              <Button type="button">
                <Link href="/products">Browse products</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-panel border border-white/70 bg-white p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">Highest rating per dollar</p>
                <h3 className="mt-2 text-lg font-black text-slate-950">{bestValue.title}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Strongest rating-to-price balance among selected products.
                </p>
              </div>
              <div className="rounded-panel border border-white/70 bg-white p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">Highest listed price</p>
                <h3 className="mt-2 text-lg font-black text-slate-950">{premiumPick.title}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  This label reflects price only; review features and condition separately.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-panel border border-white/70 bg-white shadow-premium">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-52 p-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Feature
                    </th>
                    {items.map((product) => (
                      <th key={product.id} className="relative w-72 border-l border-slate-200 p-4 align-top">
                        <button
                          type="button"
                          onClick={() => toggleCompare(product)}
                          className="absolute right-3 top-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                        >
                          Remove
                        </button>
                        <div className="space-y-3 pr-14">
                          <div className="h-28 w-28 overflow-hidden rounded-card bg-slate-100">
                            <ProductImage src={product.imageUrl} alt={product.title} />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-600">
                              {product.brand}
                            </p>
                            <Link
                              href={`/products/${product.slug}`}
                              className="mt-1 block text-base font-black text-slate-950 hover:text-brand-700"
                            >
                              {product.title}
                            </Link>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className={hasPriceDiff ? "bg-brand-50/50" : ""}>
                    <td className="p-4 font-black text-slate-950">Price</td>
                    {items.map((product) => (
                      <td key={product.id} className="border-l border-slate-200 p-4 font-black">
                        <PriceDisplay amount={product.price} currency={product.currency} />
                      </td>
                    ))}
                  </tr>
                  <tr className={hasBrandDiff ? "bg-brand-50/50" : ""}>
                    <td className="p-4 font-black text-slate-950">Brand</td>
                    {items.map((product) => (
                      <td key={product.id} className="border-l border-slate-200 p-4 text-slate-700">
                        {product.brand}
                      </td>
                    ))}
                  </tr>
                  <tr className={hasRatingDiff ? "bg-brand-50/50" : ""}>
                    <td className="p-4 font-black text-slate-950">Rating</td>
                    {items.map((product) => (
                      <td key={product.id} className="border-l border-slate-200 p-4">
                        <RatingStars rating={product.ratingAverage} count={product.ratingCount} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-black text-slate-950">Availability</td>
                    {items.map((product) => (
                      <td key={product.id} className="border-l border-slate-200 p-4">
                        <StockBadge status={product.stockStatus} />
                      </td>
                    ))}
                  </tr>
                  {highlightedAttributes.map((attributeName) => (
                    <tr key={attributeName}>
                      <td className="p-4 font-black text-slate-950">{attributeName}</td>
                      {items.map((product) => (
                        <td key={product.id} className="border-l border-slate-200 p-4 text-slate-700">
                          {getAttribute(product, attributeName)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4 font-black text-slate-950">Best for</td>
                    {items.map((product) => (
                      <td key={product.id} className="border-l border-slate-200 p-4">
                        <div className="flex flex-wrap gap-2">
                          {product.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-black text-slate-950">Action</td>
                    {items.map((product) => (
                      <td key={product.id} className="border-l border-slate-200 p-4">
                        <Button type="button" className="w-full shadow-glow" onClick={() => addItem(product)}>
                          Add to cart
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
