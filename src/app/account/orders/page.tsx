"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { useAuth } from "@/features/auth/store/auth.store";
import { useOrders, type Order } from "@/features/checkout/store/orders.store";

export default function AccountOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { orders, cancelOrder } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <main className="mesh-bg min-h-screen px-6 py-24 text-center">
        <h1 className="text-3xl font-black text-slate-950">Sign in to view orders</h1>
        <p className="text-muted-foreground">You must be logged in to view your order history.</p>
        <Button type="button">
          <Link href="/login">Sign In</Link>
        </Button>
      </main>
    );
  }

  const userOrders = orders.filter((o) => o.userId === "user_default" || o.userId === user?.id);

  const getStatusVariant = (status: Order["status"]): "brand" | "neutral" | "success" | "warning" | "danger" => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "warning";
      case "processing":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "neutral";
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      setCancellingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mesh-bg border-b border-white/70">
        <div className="premium-container py-12">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">
                Account orders
              </p>
              <h1 className="mt-3 text-4xl font-black text-slate-950">Order History</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Review local demo orders saved in this browser. No payment or shipping takes place.
              </p>
            </div>
            <Button type="button" variant="secondary">
              <Link href="/account">Back to account</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="premium-container py-10">
        {userOrders.length === 0 ? (
        <Card className="border-white/70 p-12 text-center shadow-soft">
          <p className="text-muted-foreground mb-4">You have not placed any orders yet.</p>
          <Button type="button">
            <Link href="/products">Browse Products</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <Card key={order.id} className="overflow-hidden border-white/70 shadow-soft">
                <CardContent className="p-0">
                  {/* Order header information */}
                  <div className="grid grid-cols-2 gap-4 border-b border-slate-200 bg-white p-6 text-sm md:grid-cols-4">
                    <div>
                      <span className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Date Saved
                      </span>
                      <span className="text-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Demo Total
                      </span>
                      <span className="font-bold text-foreground">
                        <PriceDisplay amount={order.total} />
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Address Entered
                      </span>
                      <span className="text-foreground">{order.shippingAddress.name}</span>
                    </div>
                    <div className="flex flex-col items-end justify-center text-right">
                      <span className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                        Order ID
                      </span>
                      <span className="font-mono text-xs text-foreground uppercase">{order.id}</span>
                    </div>
                  </div>

                  {/* Order main items row */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Status:</span>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status === "cancelled" ? "CANCELLED IN DEMO" : "LOCAL DEMO"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        >
                          {isExpanded ? "Hide Details" : "View Details"}
                        </Button>
                        {(order.status === "pending" || order.status === "processing") && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            isLoading={cancellingId === order.id}
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex gap-4 items-center">
                          <div className="h-16 w-16 flex-shrink-0">
                            <ProductImage src={item.imageUrl} alt={item.title} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground">
                              <Link
                                href={`/products/${item.slug}`}
                                dir="auto"
                                className="font-semibold text-foreground hover:text-brand-600 transition"
                              >
                                {item.title}
                              </Link>
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-baseline gap-1.5">
                              <span>Quantity: {item.quantity}</span>
                              <span>•</span>
                              <span>Price:</span>
                              <PriceDisplay amount={item.price} />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expanded details block */}
                    {isExpanded && (
                      <div className="mt-6 border-t border-border pt-6 space-y-6 text-sm motion-safe:animate-[fade-in_250ms_ease-out_both]">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h5 className="font-bold text-foreground mb-2">Shipping Address</h5>
                            <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                            <p className="text-muted-foreground">
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                            <p className="text-muted-foreground mt-1">Phone: {order.shippingAddress.phone}</p>
                          </div>
                          <div>
                            <h5 className="font-bold text-foreground mb-2">Payment Summary</h5>
                            <div className="space-y-1.5 max-w-xs">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <PriceDisplay amount={order.subtotal} />
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-emerald-700">
                                  <span>Discount:</span>
                                  <span className="inline-flex items-baseline gap-1">- <PriceDisplay amount={order.discount} /></span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping:</span>
                                <PriceDisplay amount={order.shipping} />
                              </div>
                              <div className="flex justify-between border-t border-border pt-1.5 font-bold">
                                <span>Demo total (not paid):</span>
                                <PriceDisplay amount={order.total} />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      </section>
    </main>
  );
}
