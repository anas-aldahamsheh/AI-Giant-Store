"use client";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { productBrands, productCategories } from "@/features/products/data/products.data";
import type { ProductFilters as ProductFiltersValue } from "@/features/products/types/product.types";

export type ProductFiltersProps = {
  value: ProductFiltersValue;
  onChange: (value: ProductFiltersValue) => void;
  onClear: () => void;
};

export function ProductFilters({ value, onChange, onClear }: ProductFiltersProps) {
  return (
    <aside className="premium-card sticky top-32 space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-slate-950">Filters</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>
      <Select
        label="Category"
        name="category"
        placeholder="All categories"
        value={value.category ?? ""}
        options={productCategories.map((category) => ({ label: category, value: category }))}
        onChange={(event) =>
          onChange({ ...value, category: event.target.value || undefined })
        }
      />
      <Select
        label="Brand"
        name="brand"
        placeholder="All brands"
        value={value.brand ?? ""}
        options={productBrands.map((brand) => ({ label: brand, value: brand }))}
        onChange={(event) => onChange({ ...value, brand: event.target.value || undefined })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min price"
          name="minPrice"
          type="number"
          value={value.minPrice ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              minPrice: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        />
        <Input
          label="Max price"
          name="maxPrice"
          type="number"
          value={value.maxPrice ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              maxPrice: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        />
      </div>
      <Select
        label="Rating"
        name="rating"
        placeholder="Any rating"
        value={value.rating?.toString() ?? ""}
        options={[
          { label: "4 stars and up", value: "4" },
          { label: "4.5 stars and up", value: "4.5" },
        ]}
        onChange={(event) =>
          onChange({
            ...value,
            rating: event.target.value ? Number(event.target.value) : undefined,
          })
        }
      />
      <Checkbox
        label="In stock only"
        checked={value.stockStatus === "in_stock"}
        onChange={(event) =>
          onChange({
            ...value,
            stockStatus: event.target.checked ? "in_stock" : undefined,
          })
        }
      />
      <Select
        label="Attribute"
        name="tag"
        placeholder="Any attribute"
        value={value.tag ?? ""}
        options={[
          { label: "Audio", value: "audio" },
          { label: "Wearable", value: "wearable" },
          { label: "Creator", value: "creator" },
          { label: "Travel", value: "travel" },
          { label: "Best value", value: "best-value" },
          { label: "Premium", value: "premium" },
          { label: "Gift", value: "gift" },
          { label: "Bundle ready", value: "bundle-ready" },
        ]}
        onChange={(event) => onChange({ ...value, tag: event.target.value || undefined })}
      />
    </aside>
  );
}
