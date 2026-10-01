import type { StockStatus } from "@/components/ui/StockBadge";

export type ProductAttribute = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  price: number;
  attributes: ProductAttribute[];
  stockStatus: StockStatus;
};

export type ProductReview = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  brand: string;
  imageUrl: string;
  gallery: string[];
  videoUrl?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  ratingAverage: number;
  ratingCount: number;
  stockStatus: StockStatus;
  tags: string[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  reviews: ProductReview[];
  faqs: ProductFaq[];
  relatedProductSlugs: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductSort = "popular" | "price_asc" | "price_desc" | "rating" | "newest";

export type ProductFilters = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  stockStatus?: StockStatus;
  tag?: string;
};

export type ProductViewMode = "grid" | "list";
