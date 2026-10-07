"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import { CartItem } from "@/features/cart/components/CartItem";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { useCart } from "@/features/cart/store/cart.store";
import { productService } from "@/features/products/services/productService";

export function CartPageContent() {
  const {
    items,
    savedItems,
    removeItem,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeSavedItem,
    addItem,
  } = useCart();

  // Find suggested products that are not in the cart currently
  const suggestedProducts = productService
    .list()
    .filter((prod) => !items.some((item) => item.productId === prod.id))
    .slice(0, 3);

  return (
    <div className="space-y-12">
      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Products you add will stay here on this device."
          action={
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-button bg-gradient-to-r from-brand-600 to-violet-500 px-6 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5"
            >
              Browse products
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <section className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                style={{ animationDelay: `${idx * 75}ms` }}
                className="motion-safe:animate-[fade-in_800ms_cubic-bezier(0.16,1,0.3,1)_both]"
              >
                <CartItem
                  item={item}
                  onRemove={removeItem}
                  onQuantityChange={updateQuantity}
                />
                <div className="mt-2 flex gap-4 pl-24 text-xs">
                  <button
                    type="button"
                    onClick={() => saveForLater(item.id)}
                    className="text-muted-foreground underline hover:text-foreground"
                  >
                    Save for later
                  </button>
                </div>
              </div>
            ))}
          </section>
          <div>
            <CartSummary />
          </div>
        </div>
      )}

      {/* Save For Later Section */}
      {savedItems.length > 0 && (
        <section className="border-t border-border pt-10">
          <h2 className="text-xl font-bold text-foreground mb-6">Saved for later ({savedItems.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {savedItems.map((item) => (
              <Card key={item.id} className="relative overflow-hidden">
                <CardContent className="flex gap-4 p-4">
                  <div className="h-20 w-20 flex-shrink-0">
                    <ProductImage src={item.imageUrl} alt={item.title} />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 dir="auto" className="text-sm font-semibold text-foreground line-clamp-1 min-w-0">
                        {item.title}
                      </h3>
                      <div className="shrink-0 pl-2">
                        <PriceDisplay amount={item.price} currency={item.currency} />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => moveToCart(item.id)}
                      >
                        Move to cart
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSavedItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Add-ons (Cross-sell) */}
      {suggestedProducts.length > 0 && (
        <section className="border-t border-border pt-10">
          <h2 className="text-xl font-bold text-foreground mb-6">Suggested Add-ons</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden">
                <div className="relative aspect-video w-full overflow-hidden">
                  <ProductImage src={product.imageUrl} alt={product.title} />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h3 dir="auto" className="font-semibold text-foreground line-clamp-1 group-hover:text-brand-700 transition-colors">
                      {product.title}
                    </h3>
                    <div className="shrink-0 pl-2">
                      <PriceDisplay amount={product.price} currency={product.currency} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => addItem(product, 1)}
                  >
                    Add to cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
