export type RatingStarsProps = {
  rating: number;
  count?: number;
  max?: number;
};

export function RatingStars({ rating, count, max = 5 }: RatingStarsProps) {
  const safeRating = Math.max(0, Math.min(rating, max));

  return (
    <span
      className="inline-flex items-center gap-1 text-sm"
      aria-label={`${safeRating.toFixed(1)} out of ${max} stars${count ? ` from ${count} reviews` : ""}`}
    >
      <span aria-hidden="true" className="text-accent-500">
        {"★".repeat(Math.round(safeRating))}
        <span className="text-muted">{"★".repeat(max - Math.round(safeRating))}</span>
      </span>
      {count ? <span className="text-muted-foreground">({count})</span> : null}
    </span>
  );
}
