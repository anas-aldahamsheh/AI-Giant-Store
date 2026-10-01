"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { useOrders } from "@/features/checkout/store/orders.store";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { getOrderById } = useOrders();

  const order = useMemo(() => {
    if (orderId) {
      return getOrderById(orderId);
    }
    return null;
  }, [orderId, getOrderById]);

  return (
    <main className="mesh-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div className="noise-overlay absolute inset-0 opacity-20" />
      {/* Animated Checkmark Circle */}
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-700 motion-safe:animate-[bounce_1s_ease-out_1]">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="relative mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Demo order saved
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          This order exists only in this browser. No payment, email, shipment, or delivery has been initiated.
        </p>
      </div>

      {order ? (
        <Card className="relative w-full max-w-3xl divide-y divide-border border border-white/70 bg-white/90 shadow-glow backdrop-blur">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Order Details</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <span className="block text-muted-foreground">Order Number</span>
                <span className="font-semibold font-mono text-foreground uppercase">{order.id}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Status</span>
                <span className="font-bold text-green-700">Local demo</span>
              </div>
            </div>
          </CardContent>

          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-foreground">Shipping To</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold text-foreground">{order.shippingAddress.name}</p>
              <p className="text-muted-foreground">{order.shippingAddress.street}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress.country}</p>
              <p className="text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
            </div>
          </CardContent>

          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <PriceDisplay amount={order.subtotal} />
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Discount</span>
                <span className="inline-flex items-baseline gap-1">- <PriceDisplay amount={order.discount} /></span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <PriceDisplay amount={order.shipping} />
            </div>
            <div className="flex justify-between text-sm border-t border-border pt-3 font-bold">
              <span>Demo total (not paid)</span>
              <PriceDisplay amount={order.total} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative w-full max-w-3xl p-6 text-center text-sm text-muted-foreground">
          This demo order could not be found in this browser.
        </Card>
      )}

      <div className="relative mt-8 flex gap-4">
        <Link
          href="/products"
          className="inline-flex h-11 items-center justify-center rounded-button font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 px-4 text-sm shadow"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="inline-flex h-11 items-center justify-center rounded-button font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 border border-border bg-surface text-foreground hover:bg-brand-50 focus:ring-brand-500 px-4 text-sm"
        >
          View demo order history
        </Link>
      </div>
    </main>
  );
}
