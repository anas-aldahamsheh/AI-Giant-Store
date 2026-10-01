"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { RatingStars } from "@/components/ui/RatingStars";
import { StockBadge } from "@/components/ui/StockBadge";
import { useCart } from "@/features/cart/store/cart.store";
import { useWishlist } from "@/features/wishlist/store/wishlist.store";

export default function WishlistPage() {
  const { items, toggleWishlist, clearWishlist, lastMessage } = useWishlist();
  const { addItem } = useCart();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mesh-bg border-b border-white/70">
        <div className="premium-container py-12">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">
                Saved picks
              </p>
              <h1 className="mt-3 text-4xl font-black text-slate-950">My Wishlist</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Keep a polished shortlist of products, watch for price drops, and move favorites to checkout when you are ready.
              </p>
              {lastMessage ? (
                <p className="mt-4 inline-flex rounded-full bg-white/85 px-4 py-2 text-xs font-black text-brand-700 shadow-soft">
                  {lastMessage}
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary">
                <Link href="/account">Dashboard</Link>
              </Button>
              {items.length > 0 ? (
                <Button type="button" variant="ghost" onClick={clearWishlist}>
                  Clear wishlist
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-container py-10">
        {items.length === 0 ? (
          <EmptyState
            title="Your wishlist is ready for great finds"
            description="Browse products and save anything you want to compare later, gift, or wait on for a better price."
            action={
              <Button type="button">
                <Link href="/products">Explore products</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            <div className="rounded-panel border border-white/70 bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">
                    Price drop watch
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">Monitoring {items.length} saved products</h2>
                </div>
                <span className="rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-cyan-700">
                  Alerts placeholder
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Price drop alerts will connect here when notification preferences are wired to account settings.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product, index) => (
                <m.article
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.25 }}
                  className="group overflow-hidden rounded-panel border border-white/70 bg-white p-3 shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
                >
                  <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-[1.15rem] bg-slate-100">
                    <ProductImage src={product.imageUrl} alt={product.title} />
                  </Link>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600">
                          {product.brand}
                        </p>
                        <Link
                          href={`/products/${product.slug}`}
                          className="mt-1 line-clamp-2 text-base font-black text-slate-950 hover:text-brand-700"
                        >
                          {product.title}
                        </Link>
                      </div>
                      <StockBadge status={product.stockStatus} />
                    </div>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                    <RatingStars rating={product.ratingAverage} count={product.ratingCount} />
                    <div className="flex items-center justify-between gap-3">
                      <PriceDisplay
                        amount={product.price}
                        compareAtAmount={product.compareAtPrice}
                        currency={product.currency}
                      />
                      {product.compareAtPrice ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          Watching
                        </span>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        className="shadow-glow"
                        onClick={() => {
                          addItem(product);
                          toggleWishlist(product);
                        }}
                      >
                        Add to cart
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => toggleWishlist(product)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </m.article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
