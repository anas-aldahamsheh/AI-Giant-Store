"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/features/cart/store/cart.store";
import { useAuth, type Address } from "@/features/auth/store/auth.store";
import { useOrders } from "@/features/checkout/store/orders.store";

type CheckoutForm = {
  email: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

const INITIAL_FORM: CheckoutForm = {
  email: "",
  name: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "USA",
  phone: "",
};

const addressSchema = z.object({
  email: z.string().email("Valid email is required."),
  name: z.string().min(1, "Full name is required."),
  street: z.string().min(1, "Street address is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  postalCode: z.string().min(1, "Postal code is required."),
  phone: z.string().min(1, "Phone number is required."),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shippingEstimate, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrders();

  // Safety & Recovery State
  const [checkoutRestored, setCheckoutRestored] = useState(false);

  // Stepper State
  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Shipping Method, 3: Payment, 4: Review

  // Form State
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Payment Status
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "error">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Form Validation Errors
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});

  // Calculations
  const taxEstimate = useMemo(() => {
    return parseFloat(((subtotal - discount) * 0.08).toFixed(2));
  }, [subtotal, discount]);

  const shippingCost = useMemo(() => {
    if (shippingMethod === "express") return 20;
    return shippingEstimate;
  }, [shippingMethod, shippingEstimate]);

  const finalTotal = useMemo(() => {
    return parseFloat((subtotal - discount + shippingCost + taxEstimate).toFixed(2));
  }, [subtotal, discount, shippingCost, taxEstimate]);

  // Load from Abandoned Checkout
  useEffect(() => {
    const saved = localStorage.getItem("giant-abandoned-checkout");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
        setCheckoutRestored(true);
      } catch (e) {
        console.error("Failed to parse abandoned checkout data", e);
      }
    }
  }, []);

  // Sync to Abandoned Checkout
  useEffect(() => {
    if (step < 4) {
      localStorage.setItem("giant-abandoned-checkout", JSON.stringify(form));
    }
  }, [form, step]);

  // Handle Authed Addresses selection
  useEffect(() => {
    if (isAuthenticated && user && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr.id);
      setForm((prev) => ({
        ...prev,
        email: user.email,
        name: defaultAddr.name,
        street: defaultAddr.street,
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode,
        country: defaultAddr.country,
        phone: defaultAddr.phone,
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (user) {
      const addr = user.addresses.find((a) => a.id === addressId);
      if (addr) {
        setForm((prev) => ({
          ...prev,
          name: addr.name,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: addr.country,
          phone: addr.phone,
        }));
      }
    }
  };

  const validateAddress = () => {
    const result = addressSchema.safeParse(form);
    const newErrors: Partial<Record<keyof CheckoutForm, string>> = {};
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CheckoutForm;
        newErrors[field] = issue.message;
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateAddress()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setPaymentStatus("processing");
    setPaymentError(null);

    const shippingAddress: Address = {
      id: selectedAddressId || `guest_${Date.now()}`,
      name: form.name,
      street: form.street,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
      phone: form.phone,
      isDefault: false,
    };

    try {
      const order = await createOrder({
        userId: user ? user.id : "guest_checkout",
        items: items.map((item) => ({
          productId: item.productId,
          slug: item.slug,
          title: item.title,
          imageUrl: item.imageUrl,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: "Demo order — no payment collected",
        subtotal,
        shipping: shippingCost,
        discount,
        total: finalTotal,
      });

      // Clear checkout recovery storage
      localStorage.removeItem("giant-abandoned-checkout");
      clearCart();
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (e) {
      setPaymentStatus("error");
      setPaymentError("An error occurred during order submission. Please retry.");
    }
  };

  if (items.length === 0 && step < 4) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-32 text-center space-y-4">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Add items to your cart before proceeding to checkout.</p>
        <Button type="button">
          <Link href="/products">Browse products</Link>
        </Button>
      </main>
    );
  }

  const steps = ["Shipping", "Shipping Method", "Demo notice", "Review"];

  return (
    <main className="min-h-screen bg-background">
      <section className="mesh-bg relative overflow-hidden">
        <div className="noise-overlay absolute inset-0 opacity-20" />
        <div className="premium-container relative py-14">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">
            Demo checkout
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950">
            Finish with confidence.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            This is a local demo. No payment is collected and orders are saved only in this browser.
          </p>
        </div>
      </section>
      <div className="premium-container py-12">

      {/* Abandoned recovery toast */}
      {checkoutRestored && step === 1 && (
        <div className="mt-4 flex items-center justify-between rounded-button bg-brand-50 p-4 border border-brand-200 text-sm text-brand-900 motion-safe:animate-[slide-up_800ms_cubic-bezier(0.16,1,0.3,1)_both]">
          <div>
            <span className="font-bold">Welcome back!</span> We restored your shipping details from your previous visit.
          </div>
          <button
            type="button"
            onClick={() => setCheckoutRestored(false)}
            className="text-xs font-bold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stepper progress */}
      <div className="my-8 max-w-xl">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border -translate-y-1/2 -z-10"></div>
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${
                    isCompleted
                      ? "bg-success-500 border-success-500 text-white"
                      : isActive
                      ? "bg-brand-600 border-brand-600 text-white scale-110 shadow-glow"
                      : "bg-surface border-border text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "✓" : stepNum}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Step contents */}
        <div>
          {/* STEP 1: Address Shipping Details */}
          {step === 1 && (
            <Card className="motion-safe:animate-[fade-in_800ms_cubic-bezier(0.16,1,0.3,1)_both]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Shipping Address</h2>

                {/* Logged in address picker */}
                {isAuthenticated && user && user.addresses.length > 0 && (
                  <div className="space-y-3 pb-4 border-b border-border">
                    <span className="text-sm font-semibold text-muted-foreground">Select Saved Address:</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {user.addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-3 p-3 border rounded-card cursor-pointer transition ${
                            selectedAddressId === addr.id
                              ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                              : "border-border hover:bg-surface/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="checkout-address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => handleAddressChange(addr.id)}
                            className="mt-1"
                          />
                          <div className="text-xs">
                            <span className="font-bold block">{addr.name}</span>
                            <span className="text-muted-foreground block">{addr.street}</span>
                            <span className="text-muted-foreground block">{addr.city}, {addr.state}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form fields */}
                <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      error={errors.email}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Recipient Full Name"
                      name="name"
                      value={form.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      error={errors.name}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address"
                      name="street"
                      value={form.street}
                      onChange={(e) => handleInputChange("street", e.target.value)}
                      error={errors.street}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    error={errors.city}
                    required
                  />
                  <Input
                    label="State / Province"
                    name="state"
                    value={form.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    error={errors.state}
                    required
                  />
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    error={errors.postalCode}
                    required
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    error={errors.country}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      error={errors.phone}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end pt-4">
                    <Button type="submit">Continue to Shipping Method</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <Card className="motion-safe:animate-[fade-in_800ms_cubic-bezier(0.16,1,0.3,1)_both]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Select Shipping Method</h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 border rounded-card cursor-pointer transition ${
                      shippingMethod === "standard"
                        ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                        : "border-border hover:bg-surface/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping-method"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                      />
                      <div>
                        <span className="font-bold block text-sm">Standard Shipping</span>
                        <span className="text-xs text-muted-foreground">3-5 Business Days</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {shippingEstimate === 0 ? "Free" : <PriceDisplay amount={shippingEstimate} />}
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 border rounded-card cursor-pointer transition ${
                      shippingMethod === "express"
                        ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
                        : "border-border hover:bg-surface/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping-method"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                      />
                      <div>
                        <span className="font-bold block text-sm">Express Shipping</span>
                        <span className="text-xs text-muted-foreground">1-2 Business Days</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold"><PriceDisplay amount={20} /></span>
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
                  <Button type="button" onClick={nextStep}>Continue</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Demo notice */}
          {step === 3 && (
            <Card className="motion-safe:animate-[fade-in_800ms_cubic-bezier(0.16,1,0.3,1)_both]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Demo order</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  This checkout does not charge a card or send an order to the store. Your order is saved in this browser for demonstration only. Do not enter payment details anywhere in this demo.
                </p>
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>
                  <Button type="button" onClick={nextStep}>Continue to Review</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: Review and Place Order */}
          {step === 4 && (
            <Card className="motion-safe:animate-[fade-in_800ms_cubic-bezier(0.16,1,0.3,1)_both]">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Review Order Details</h2>

                {paymentError && (
                  <div className="rounded-button bg-red-50 p-4 border border-red-200 text-sm text-danger space-y-2">
                    <p className="font-semibold">{paymentError}</p>
                    <Button type="button" size="sm" variant="secondary" onClick={handlePlaceOrder}>
                      Retry demo order
                    </Button>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 text-sm">
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground">Shipping To</h3>
                    <p className="text-muted-foreground">{form.name}</p>
                    <p className="text-muted-foreground">{form.street}</p>
                    <p className="text-muted-foreground">{form.city}, {form.state} {form.postalCode}</p>
                    <p className="text-muted-foreground">Phone: {form.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground">Order type</h3>
                    <p className="text-muted-foreground">Demo only — no payment collected</p>
                    <p className="text-muted-foreground">Shipping Method: {shippingMethod === "express" ? "Express" : "Standard"}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between">
                  <Button type="button" variant="secondary" onClick={prevStep} disabled={paymentStatus === "processing"}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    isLoading={paymentStatus === "processing"}
                    onClick={handlePlaceOrder}
                  >
                    Save Demo Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center text-xs">
                    <div className="h-10 w-10 flex-shrink-0">
                      <ProductImage src={item.imageUrl} alt={item.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span dir="auto" className="font-semibold text-foreground block line-clamp-1">{item.title}</span>
                      <span className="text-muted-foreground flex items-baseline gap-1.5 mt-0.5">
                        Qty: {item.quantity} • <PriceDisplay amount={item.price} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <PriceDisplay amount={subtotal} />
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon Discount</span>
                    <span className="inline-flex items-baseline gap-1">- <PriceDisplay amount={discount} /></span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <PriceDisplay amount={shippingCost} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Tax (8%)</span>
                  <PriceDisplay amount={taxEstimate} />
                </div>
                <div className="flex justify-between border-t border-border pt-3 font-bold text-base">
                  <span>Total</span>
                  <PriceDisplay amount={finalTotal} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </main>
  );
}
