"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Address } from "@/features/auth/store/auth.store";

export type OrderItem = {
  productId: string;
  slug: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

type OrdersContextValue = {
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "createdAt" | "status">) => Promise<Order>;
  getOrderById: (id: string) => Order | null;
  cancelOrder: (id: string) => Promise<boolean>;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);
const storageKeyOrders = "giant-store-orders";

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // Initial load
  useEffect(() => {
    const stored = window.localStorage.getItem(storageKeyOrders);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Order[];
        // Filter out legacy mock orders referencing fake products
        const customOrders = parsed.filter(
          (o) =>
            o.id !== "ord_1001" &&
            !o.items.some(
              (i) =>
                i.productId === "prod_headphones_001" ||
                /^prod_\d{3}$/.test(i.productId),
            ),
        );
        if (customOrders.length !== parsed.length) {
          window.localStorage.setItem(storageKeyOrders, JSON.stringify(customOrders));
        }
        setOrders(customOrders);
      } catch (e) {
        console.error("Failed to parse orders", e);
        setOrders([]);
      }
    } else {
      setOrders([]);
    }
  }, []);

  const value = useMemo<OrdersContextValue>(() => {
    return {
      orders,
      async createOrder(orderData) {
        await new Promise((r) => setTimeout(r, 1000)); // Simulate payment/order processing delay
        const newOrder: Order = {
          ...orderData,
          id: `ord_${crypto.randomUUID()}`,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        setOrders((prev) => {
          const updated = [newOrder, ...prev];
          window.localStorage.setItem(storageKeyOrders, JSON.stringify(updated));
          return updated;
        });

        return newOrder;
      },
      getOrderById(id) {
        return orders.find((o) => o.id === id) ?? null;
      },
      async cancelOrder(id) {
        await new Promise((r) => setTimeout(r, 500));
        let success = false;
        setOrders((prev) => {
          const order = prev.find((o) => o.id === id);
          if (order && (order.status === "pending" || order.status === "processing")) {
            success = true;
            const updated = prev.map((o) =>
              o.id === id ? { ...o, status: "cancelled" as const } : o
            );
            window.localStorage.setItem(storageKeyOrders, JSON.stringify(updated));
            return updated;
          }
          return prev;
        });
        return success;
      },
    };
  }, [orders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const value = useContext(OrdersContext);
  if (!value) {
    throw new Error("useOrders must be used inside OrdersProvider");
  }
  return value;
}
