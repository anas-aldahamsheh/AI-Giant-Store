import { Badge } from "@/components/ui/Badge";

export type DiscountBadgeProps = {
  amount: number;
  compareAtAmount: number;
};

export function DiscountBadge({ amount, compareAtAmount }: DiscountBadgeProps) {
  if (compareAtAmount <= amount) {
    return null;
  }

  const percent = Math.round(((compareAtAmount - amount) / compareAtAmount) * 100);

  return <Badge variant="warning">Save {percent}%</Badge>;
}
