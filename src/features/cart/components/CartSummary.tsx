"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { useCart } from "@/features/cart/store/cart.store";

export type CartSummaryProps = {
  currency?: string;
};

export function CartSummary({ currency = "USD" }: CartSummaryProps) {
  const {
    subtotal,
    shippingEstimate,
    discount,
    couponCode,
    couponError,
    total,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [code, setCode] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      applyCoupon(code);
      setCode("");
    }
  };

  return (
    <Card className="h-fit border-white/70 bg-white/90 shadow-glow backdrop-blur">
      <CardContent className="space-y-5">
        <h2 className="text-lg font-black text-slate-950">Order summary</h2>
        
        {couponCode ? (
          <div className="flex items-center justify-between rounded-button bg-green-50 p-3 text-sm text-green-700">
            <div>
              <span className="font-semibold">Coupon applied:</span> {couponCode}
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              className="text-xs font-bold underline hover:no-underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-2">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  name="coupon"
                  label="Coupon Code"
                  placeholder="Enter code (e.g. GIANT10)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  error={couponError || undefined}
                />
              </div>
              <Button type="submit" variant="secondary" className="h-10">
                Apply
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Subtotal</span>
            <PriceDisplay amount={subtotal} currency={currency} />
          </div>

          {discount > 0 && (
            <div className="flex justify-between gap-3 text-green-700">
              <span>Discount</span>
              <span className="inline-flex items-baseline gap-1">- <PriceDisplay amount={discount} currency={currency} /></span>
            </div>
          )}

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Shipping estimate</span>
            <PriceDisplay amount={shippingEstimate} currency={currency} />
          </div>

          <div className="space-y-2 rounded-2xl bg-surface-2 p-3">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Shipping progress</span>
              <span>
                {subtotal >= 50 ? "Unlocked" : `$${Math.max(0, 50 - subtotal).toFixed(0)} away`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400"
                style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between gap-3 border-t border-border pt-3 font-bold text-base">
            <span>Total</span>
            <span className="motion-safe:animate-[pulse_1s_ease-in-out_infinite_alternate]">
              <PriceDisplay amount={total} currency={currency} />
            </span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="inline-flex h-11 w-full items-center justify-center rounded-button bg-brand-600 font-semibold text-white shadow transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 text-center"
        >
          Checkout
        </Link>
      </CardContent>
    </Card>
  );
}
