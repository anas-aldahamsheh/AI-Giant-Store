"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartItem } from "@/features/cart/components/CartItem";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { useCart } from "@/features/cart/store/cart.store";

export type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCart();

  return (
    <Drawer
      isOpen={isOpen}
      title="Your cart"
      description="Review items, apply offers, and continue to checkout."
      onClose={onClose}
    >
      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add products to start building your order."
        />
      ) : (
        <div className="space-y-4">
          <div className="rounded-panel bg-brand-50 p-4 text-sm font-semibold text-brand-700">
            Add a few more eligible items to unlock stronger bundle recommendations.
          </div>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={removeItem}
              onQuantityChange={updateQuantity}
            />
          ))}
          <CartSummary />
          <Link
            href="/cart"
            onClick={onClose}
            className="inline-flex h-11 w-full items-center justify-center rounded-button border border-border bg-surface text-foreground font-semibold hover:bg-brand-50 transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 text-center"
          >
            Open cart page
          </Link>
        </div>
      )}
    </Drawer>
  );
}
