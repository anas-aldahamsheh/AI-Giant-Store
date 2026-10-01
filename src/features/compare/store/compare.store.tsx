"use client";

import type { ReactNode } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/features/products/types/product.types";

const compareLimit = 3;

type CompareState = {
  items: Product[];
  lastMessage: string | null;
  toggleCompare: (product: Product) => void;
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  clearMessage: () => void;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      lastMessage: null,
      toggleCompare(product) {
        const exists = get().items.some((item) => item.id === product.id);

        if (exists) {
          get().removeFromCompare(product.id);
          return;
        }

        get().addToCompare(product);
      },
      addToCompare(product) {
        const currentItems = get().items;

        if (currentItems.some((item) => item.id === product.id)) {
          set({ lastMessage: `${product.title} is already in compare.` });
          return true;
        }

        if (currentItems.length >= compareLimit) {
          set({ lastMessage: "Compare is full. Remove one item to add another." });
          return false;
        }

        set({
          items: [...currentItems, product],
          lastMessage: `${product.title} added to compare.`,
        });
        return true;
      },
      removeFromCompare(productId) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
          lastMessage: "Product removed from compare.",
        }));
      },
      isInCompare(id) {
        return get().items.some((item) => item.id === id);
      },
      clearCompare() {
        set({ items: [], lastMessage: "Compare list cleared." });
      },
      clearMessage() {
        set({ lastMessage: null });
      },
    }),
    {
      name: "giant-store-compare",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function CompareProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useCompare() {
  return useCompareStore();
}
