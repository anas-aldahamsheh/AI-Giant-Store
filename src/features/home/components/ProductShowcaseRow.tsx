import { Card, CardContent } from "@/components/ui/Card";
import { DiscountBadge } from "@/components/ui/DiscountBadge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { RatingStars } from "@/components/ui/RatingStars";

export type ShowcaseProduct = {
  name: string;
  price: number;
  compareAt: number;
  rating: number;
};

export type ProductShowcaseRowProps = {
  title: string;
  products: readonly ShowcaseProduct[];
};

export function ProductShowcaseRow({ title, products }: ProductShowcaseRowProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <Card key={product.name} className="shadow-none transition hover:shadow-soft">
            <CardContent>
              <div className="mb-4 h-28 rounded-card bg-gradient-to-br from-brand-50 to-amber-50" />
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
                {product.compareAt > 0 ? (
                  <DiscountBadge amount={product.price} compareAtAmount={product.compareAt} />
                ) : null}
              </div>
              <div className="mt-3">
                <PriceDisplay
                  amount={product.price}
                  compareAtAmount={product.compareAt || undefined}
                />
              </div>
              <div className="mt-2">
                <RatingStars rating={product.rating} count={128} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
