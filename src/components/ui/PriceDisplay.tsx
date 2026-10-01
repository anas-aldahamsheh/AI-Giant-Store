import { cn } from "@/lib/utils/cn";

export type PriceDisplayProps = {
  amount: number;
  currency?: string;
  compareAtAmount?: number;
  locale?: string;
  className?: string;
};

export function PriceDisplay({
  amount,
  currency = "USD",
  compareAtAmount,
  locale = "en-US",
  className,
}: PriceDisplayProps) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="text-lg font-bold text-foreground">{formatter.format(amount)}</span>
      {compareAtAmount && compareAtAmount > amount ? (
        <span className="text-sm text-muted-foreground line-through">
          {formatter.format(compareAtAmount)}
        </span>
      ) : null}
    </span>
  );
}
