import { Badge } from "@/components/ui/Badge";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type StockBadgeProps = {
  status: StockStatus;
};

const stockLabels: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

const stockVariants: Record<StockStatus, "success" | "warning" | "danger"> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "danger",
};

export function StockBadge({ status }: StockBadgeProps) {
  return <Badge variant={stockVariants[status]}>{stockLabels[status]}</Badge>;
}
