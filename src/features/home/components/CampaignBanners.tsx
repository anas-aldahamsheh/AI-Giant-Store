export function CampaignBanners() {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-6 py-8 md:grid-cols-2 lg:px-8">
      <div className="rounded-card border border-border bg-brand-50 p-6">
        <h2 className="text-xl font-bold text-foreground">Explore electronics</h2>
        <p className="mt-2 text-sm text-muted-foreground">Browse the electronics products in your local catalog.</p>
      </div>
      <div className="rounded-card border border-border bg-amber-50 p-6">
        <h2 className="text-xl font-bold text-foreground">Explore home products</h2>
        <p className="mt-2 text-sm text-muted-foreground">Find products for your space when they are added.</p>
      </div>
    </section>
  );
}
