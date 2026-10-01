"use client";

import type { ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/features/products/types/product.types";

type WishlistState = {
  items: Product[];
  lastMessage: string | null;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  clearMessage: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      lastMessage: null,
      toggleWishlist(product) {
        const exists = get().items.some((item) => item.id === product.id);

        if (exists) {
          get().removeFromWishlist(product.id);
          return;
        }

        get().addToWishlist(product);
      },
      addToWishlist(product) {
        if (get().items.some((item) => item.id === product.id)) {
          set({ lastMessage: `${product.title} is already saved.` });
          return;
        }

        set((state) => ({
          items: [...state.items, product],
          lastMessage: `${product.title} saved to wishlist.`,
        }));
      },
      removeFromWishlist(productId) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
          lastMessage: "Product removed from wishlist.",
        }));
      },
      isInWishlist(id) {
        return get().items.some((item) => item.id === id);
      },
      clearWishlist() {
        set({ items: [], lastMessage: "Wishlist cleared." });
      },
      clearMessage() {
        set({ lastMessage: null });
      },
    }),
    {
      name: "giant-store-wishlist",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useWishlist() {
  return useWishlistStore();
}
