"use client";

import type { ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/features/products/types/product.types";

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  title: string;
  imageUrl: string;
  price: number;
  currency: string;
  quantity: number;
  stockStatus: Product["stockStatus"];
};

type CartState = {
  items: CartItem[];
  savedItems: CartItem[];
  couponCode: string | null;
  couponError: string | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSavedItem: (id: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  mergeCart: (itemsToMerge: CartItem[]) => void;
};

const validCoupons: Record<string, number> = {
  GIANT10: 0.1,
  SAVE20: 0.2,
  FREESHIP: 0,
};

function toCartItem(product: Product, quantity: number): CartItem {
  return {
    id: `${product.id}_${crypto.randomUUID()}`,
    productId: product.id,
    slug: product.slug,
    title: product.title,
    imageUrl: product.imageUrl,
    price: product.price,
    currency: product.currency,
    quantity,
    stockStatus: product.stockStatus,
  };
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      savedItems: [],
      couponCode: null,
      couponError: null,
      addItem(product, quantity = 1) {
        if (product.stockStatus === "out_of_stock" || !Number.isInteger(quantity) || quantity < 1) {
          return;
        }

        set((state) => {
          const existingItem = state.items.find((item) => item.productId === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, toCartItem(product, Math.min(99, quantity))],
          };
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("fx:cart-add"));
        }
      },
      removeItem(id) {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },
      updateQuantity(id, quantity) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Number.isFinite(quantity) ? Math.min(99, Math.max(1, Math.floor(quantity))) : item.quantity } : item,
          ),
        }));
      },
      saveForLater(id) {
        set((state) => {
          const itemToSave = state.items.find((item) => item.id === id);

          if (!itemToSave) {
            return state;
          }

          const alreadySaved = state.savedItems.some(
            (item) => item.productId === itemToSave.productId,
          );

          return {
            items: state.items.filter((item) => item.id !== id),
            savedItems: alreadySaved
              ? state.savedItems
              : [...state.savedItems, itemToSave],
          };
        });
      },
      moveToCart(id) {
        set((state) => {
          const itemToMove = state.savedItems.find((item) => item.id === id);

          if (!itemToMove) {
            return state;
          }

          const existingItem = state.items.find(
            (item) => item.productId === itemToMove.productId,
          );

          return {
            savedItems: state.savedItems.filter((item) => item.id !== id),
            items: existingItem
              ? state.items.map((item) =>
                  item.id === existingItem.id
                    ? { ...item, quantity: item.quantity + itemToMove.quantity }
                    : item,
                )
              : [...state.items, itemToMove],
          };
        });
      },
      removeSavedItem(id) {
        set((state) => ({
          savedItems: state.savedItems.filter((item) => item.id !== id),
        }));
      },
      applyCoupon(code) {
        const cleanCode = code.trim().toUpperCase();

        if (validCoupons[cleanCode] !== undefined) {
          set({ couponCode: cleanCode, couponError: null });
          return true;
        }

        set({ couponError: "Invalid coupon code. Try GIANT10 or SAVE20." });
        return false;
      },
      removeCoupon() {
        set({ couponCode: null, couponError: null });
      },
      clearCart() {
        set({ items: [], couponCode: null, couponError: null });
      },
      mergeCart(itemsToMerge) {
        set((state) => {
          const updated = [...state.items];

          itemsToMerge.forEach((mergeItem) => {
            const index = updated.findIndex(
              (item) => item.productId === mergeItem.productId,
            );

            if (index > -1) {
              updated[index] = {
                ...updated[index],
                quantity: updated[index].quantity + mergeItem.quantity,
              };
            } else {
              updated.push(mergeItem);
            }
          });

          return { items: updated };
        });
      },
    }),
    {
      name: "giant-store-cart",
      partialize: (state) => ({
        items: state.items,
        savedItems: state.savedItems,
        couponCode: state.couponCode,
      }),
    },
  ),
);

export function CartProvider({ children }: { children: ReactNode }) {
  return children;
}

export function calculateCartTotals(items: CartItem[], couponCode: string | null) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const couponRate = couponCode ? validCoupons[couponCode] ?? 0 : 0;
  const discount = Number((subtotal * couponRate).toFixed(2));
  const netTotal = subtotal - discount;
  const shippingEstimate =
    subtotal > 0 && netTotal < 100 && couponCode !== "FREESHIP" ? 12 : 0;
  const total = Math.max(0, Number((netTotal + shippingEstimate).toFixed(2)));

  return { subtotal, itemCount, shippingEstimate, discount, total };
}

export function useCart() {
  const state = useCartStore();
  return {
    ...state,
    ...calculateCartTotals(state.items, state.couponCode),
  };
}
