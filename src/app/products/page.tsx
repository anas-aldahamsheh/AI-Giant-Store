import { ProductListingShell } from "@/features/products/components/ProductListingShell";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mesh-bg relative overflow-hidden">
        <div className="noise-overlay absolute inset-0 opacity-20" />
        <section className="premium-container relative py-16">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">
            Product discovery
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-7xl">
            Browse your product catalog.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Filter by brand, category, price, rating, stock, and product attributes.
            Use quick view or ask the AI assistant when the choice gets fuzzy.
          </p>
        </section>
      </div>
      <section className="premium-container py-12">
        <ProductListingShell />
      </section>
    </main>
  );
}
