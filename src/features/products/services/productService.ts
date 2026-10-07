import { demoProducts } from "@/features/products/data/demo-products.data";
import type {
  Product,
  ProductFilters,
  ProductSort,
} from "@/features/products/types/product.types";

const storageKeyProducts = "giant-store-custom-products";

function getProducts(): Product[] {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(storageKeyProducts);
    if (stored === null) {
      // First visit: start with the sample catalog so there is something to try.
      window.localStorage.setItem(storageKeyProducts, JSON.stringify(demoProducts));
      return [...demoProducts];
    }
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Product[];
        // Purge legacy mock products (prod_001 to prod_060) so ONLY user-added products exist
        const customOnly = parsed.filter((p) => !/^prod_\d{3}$/.test(p.id));
        if (customOnly.length !== parsed.length) {
          window.localStorage.setItem(storageKeyProducts, JSON.stringify(customOnly));
        }
        return customOnly;
      } catch (e) {
        console.error("Failed to parse custom products", e);
      }
    }
  }
  return [];
}

function matchesFilters(product: Product, filters: ProductFilters) {
  if (filters.category && product.category !== filters.category) {
    return false;
  }

  if (filters.brand && product.brand !== filters.brand) {
    return false;
  }

  if (filters.minPrice && product.price < filters.minPrice) {
    return false;
  }

  if (filters.maxPrice && product.price > filters.maxPrice) {
    return false;
  }

  if (filters.rating && product.ratingAverage < filters.rating) {
    return false;
  }

  if (filters.stockStatus && product.stockStatus !== filters.stockStatus) {
    return false;
  }

  if (filters.tag && !product.tags.includes(filters.tag)) {
    return false;
  }

  return true;
}

function sortProducts(productList: Product[], sort: ProductSort) {
  return [...productList].sort((left, right) => {
    if (sort === "price_asc") {
      return left.price - right.price;
    }

    if (sort === "price_desc") {
      return right.price - left.price;
    }

    if (sort === "rating") {
      return right.ratingAverage - left.ratingAverage;
    }

    if (sort === "newest") {
      return Date.parse(right.createdAt) - Date.parse(left.createdAt);
    }

    return right.ratingCount - left.ratingCount;
  });
}

export const productService = {
  list(filters: ProductFilters = {}, sort: ProductSort = "popular") {
    const baseProducts = getProducts();
    return sortProducts(
      baseProducts.filter((product) => matchesFilters(product, filters)),
      sort,
    );
  },
  getBySlug(slug: string) {
    if (!slug) return null;
    let decoded = slug;
    try {
      decoded = decodeURIComponent(slug);
    } catch {
      // Ignore URI decode errors
    }
    const cleanSlug = slug.toLowerCase().trim();
    const cleanDecoded = decoded.toLowerCase().trim();

    const all = getProducts();
    return (
      all.find((product) => {
        const pSlug = (product.slug || "").toLowerCase().trim();
        const pId = (product.id || "").toLowerCase().trim();
        const pTitleSlug = (product.title || "")
          .toLowerCase()
          .trim()
          .replace(/[^\p{L}\p{N}]+/u, "-")
          .replace(/(^-|-$)/g, "");

        return (
          pSlug === cleanSlug ||
          pSlug === cleanDecoded ||
          pId === cleanSlug ||
          pId === cleanDecoded ||
          pTitleSlug === cleanSlug ||
          pTitleSlug === cleanDecoded
        );
      }) ?? null
    );
  },
  related(product: Product) {
    const slugs = product.relatedProductSlugs || [];
    return slugs
      .map((slug) => this.getBySlug(slug))
      .filter((item): item is Product => Boolean(item));
  },
  // Admin CRUD helper methods
  saveAll(customProducts: Product[]) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKeyProducts, JSON.stringify(customProducts));
    }
  },
  create(product: Product) {
    const list = getProducts();
    list.unshift(product);
    this.saveAll(list);
    return product;
  },
  update(product: Product) {
    const list = getProducts();
    const updated = list.map((item) => (item.id === product.id ? product : item));
    this.saveAll(updated);
    return product;
  },
  delete(id: string) {
    const list = getProducts();
    const filtered = list.filter((item) => item.id !== id);
    this.saveAll(filtered);
    return true;
  },
  resetToDefault() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKeyProducts);
    }
  },
};

