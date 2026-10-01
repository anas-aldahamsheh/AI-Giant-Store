import type { Product } from "@/features/products/types/product.types";

const categories = [
  "Electronics",
  "Audio",
  "Wearables",
  "Cameras",
  "Gaming",
  "Home",
  "Office",
  "Accessories",
] as const;

const brands = [
  "Aster",
  "Pulse",
  "Northline",
  "Kinetic",
  "Vanta",
  "Luma",
  "Orbit",
  "Nexa",
  "Modo",
  "Crest",
  "Sora",
  "Helio",
] as const;

// Clean slate: No hardcoded or static mock products.
// Only products created dynamically by the user exist in the store.
export const products: Product[] = [];

export const productCategories = categories;
export const productBrands = brands;
