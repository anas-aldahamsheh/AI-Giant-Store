import type { Product } from "@/features/products/types/product.types";

export type ProductChunk = {
  id: string;
  productId: string;
  productSlug: string;
  type: "description" | "specs" | "faq" | "reviews" | "use_cases";
  text: string;
  metadata: {
    title: string;
    brand: string;
    category: string;
    price: number;
    tags: string[];
  };
};

export function normalizeProductText(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

export function buildProductChunks(product: Product): ProductChunk[] {
  const baseMetadata = {
    title: product.title || "",
    brand: product.brand || "",
    category: product.category || "",
    price: product.price || 0,
    tags: product.tags || [],
  };

  return [
    {
      id: `${product.id}:description`,
      productId: product.id,
      productSlug: product.slug,
      type: "description",
      text: normalizeProductText(`${product.title || ""}. ${product.shortDescription || ""}. ${product.description || ""}`),
      metadata: baseMetadata,
    },
    {
      id: `${product.id}:specs`,
      productId: product.id,
      productSlug: product.slug,
      type: "specs",
      text: normalizeProductText(
        (product.attributes || []).map((attribute) => `${attribute.name}: ${attribute.value}`).join(". "),
      ),
      metadata: baseMetadata,
    },
    {
      id: `${product.id}:faq`,
      productId: product.id,
      productSlug: product.slug,
      type: "faq",
      text: normalizeProductText(
        (product.faqs || []).map((faq) => `${faq.question} ${faq.answer}`).join(". "),
      ),
      metadata: baseMetadata,
    },
    {
      id: `${product.id}:reviews`,
      productId: product.id,
      productSlug: product.slug,
      type: "reviews",
      text: normalizeProductText(
        (product.reviews || []).map((review) => `${review.rating} stars. ${review.title}. ${review.body}`).join(". "),
      ),
      metadata: baseMetadata,
    },
    {
      id: `${product.id}:use_cases`,
      productId: product.id,
      productSlug: product.slug,
      type: "use_cases",
      text: normalizeProductText(`${product.category || ""}. ${product.brand || ""}. ${(product.tags || []).join(". ")}`),
      metadata: baseMetadata,
    },
  ];
}

export function buildAllProductChunks(products: Product[]) {
  return products.flatMap(buildProductChunks);
}
