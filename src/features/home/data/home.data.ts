export const heroProducts: readonly { name: string; price: number; imageUrl: string }[] = [];

export const featuredCategories = [
  "Electronics",
  "Home",
  "Beauty",
  "Sports",
  "Gaming",
  "Office",
] as const;

export const productRows: readonly {
  title: string;
  products: readonly { name: string; price: number; compareAt: number; rating: number }[];
}[] = [];

export const brandHighlights = ["Northline", "Aster", "Pulse", "Kinetic"] as const;
