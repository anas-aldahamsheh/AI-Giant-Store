import Link from "next/link";

export function NewsletterCta() {
  return (
    <section className="premium-section">
      <div className="premium-container premium-card grid gap-6 p-8 lg:grid-cols-[1fr_24rem] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">
            Explore the demo
          </p>
          <h2 className="mt-3 text-4xl font-black text-slate-950">
            Find what fits your needs.
          </h2>
        </div>
        <Link href="/products" className="inline-flex h-11 items-center justify-center rounded-button bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700">
          Browse products
        </Link>
      </div>
    </section>
  );
}
