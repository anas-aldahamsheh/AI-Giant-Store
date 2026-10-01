import { CartPageContent } from "@/features/cart/components/CartPageContent";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mesh-bg relative overflow-hidden">
        <div className="noise-overlay absolute inset-0 opacity-20" />
        <div className="premium-container relative py-16">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">
            Cart
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950">
            Ready when you are.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Review quantities, remove items, apply coupons, estimate shipping, and continue
            into the premium checkout flow.
          </p>
        </div>
      </section>
      <div className="premium-container py-12">
        <CartPageContent />
      </div>
    </main>
  );
}
