const badges = ["Browser-based demo", "Product discovery", "AI shopping help", "No payment collected"];

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-surface px-6 py-6">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <div key={badge} data-fx-tilt="12" className="fx-tilt relative rounded-card bg-background p-4 text-center text-sm font-semibold text-foreground">
            <span aria-hidden="true" className="fx-glare" />
            {badge}
          </div>
        ))}
      </div>
    </section>
  );
}
