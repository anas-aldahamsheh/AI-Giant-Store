import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product.types";

export const recommendationService = {
  getTrending(limit = 6): Product[] {
    return productService.list({}, "popular").slice(0, limit);
  },
  getBestSellers(limit = 6): Product[] {
    return productService.list({}, "rating").slice(0, limit);
  },
  getNewArrivals(limit = 6): Product[] {
    return productService.list({}, "newest").slice(0, limit);
  },
  getRelatedProducts(product: Product, limit = 4): Product[] {
    const related = productService.related(product);
    if (related.length > 0) return related.slice(0, limit);

    // Fallback to same category
    const list = productService.list({ category: product.category });
    return list.filter((p) => p.id !== product.id).slice(0, limit);
  },
  getSimilarProducts(product: Product, limit = 4): Product[] {
    return productService
      .list({ category: product.category })
      .filter((item) => item.id !== product.id && item.brand === product.brand)
      .concat(productService.list({ category: product.category }).filter((item) => item.id !== product.id))
      .slice(0, limit);
  },

  getFrequentlyBoughtTogether(product: Product): Product[] {
    const list = productService.list();
    // Exclude current product and get products from different category to cross-sell
    return list
      .filter((p) => p.id !== product.id && p.category !== product.category)
      .slice(0, 2);
  },

  getCartRecommendations(cartItemsProductIds: string[], limit = 3): Product[] {
    const all = productService.list();
    // Return products not currently in the cart
    return all
      .filter((p) => !cartItemsProductIds.includes(p.id))
      .slice(0, limit);
  },
  getRecentlyViewedFallback(limit = 4): Product[] {
    return productService.list({}, "newest").slice(0, limit);
  },
  getAiRecommendedForYou(limit = 4): Product[] {
    return productService.list({}, "rating").slice(0, limit);
  },

  trackRecommendationClick(productId: string, algorithm: string) {
    console.log(`[Analytics] User clicked recommended product: ${productId} powered by ${algorithm}`);
  },
};
