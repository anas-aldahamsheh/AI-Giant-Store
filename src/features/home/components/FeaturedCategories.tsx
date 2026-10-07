import Link from "next/link";
import { featuredCategories } from "@/features/home/data/home.data";

export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Featured categories</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fast entry points for the most common shopping journeys.
          </p>
        </div>
        <Link className="text-sm font-semibold text-brand-700 hover:text-brand-600" href="/products">
          View all
        </Link>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {featuredCategories.map((category) => (
          <Link
            key={category}
            href={`/categories/${category.toLowerCase()}`}
            data-fx-tilt="14"
            className="fx-tilt relative rounded-card border border-border bg-surface p-5 shadow-soft transition hover:-translate-y-1 hover:bg-brand-50"
          >
            <span aria-hidden="true" className="fx-glare" />
            <span className="text-sm font-semibold text-foreground">{category}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
