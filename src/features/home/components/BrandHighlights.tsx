import { brandHighlights } from "@/features/home/data/home.data";

export function BrandHighlights() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <h2 className="text-2xl font-bold text-foreground">Brand highlights</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {brandHighlights.map((brand) => (
          <div key={brand} className="rounded-card border border-border bg-surface p-6 text-center shadow-soft">
            <p className="text-lg font-bold text-foreground">{brand}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
