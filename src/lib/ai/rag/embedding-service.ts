import type { Product } from "@/features/products/types/product.types";
import { buildAllProductChunks, buildProductChunks, type ProductChunk } from "@/lib/ai/rag/product-chunks";

const vectorDimensions = 64;

export type EmbeddedProductChunk = ProductChunk & {
  embedding: number[];
};

let vectorStore: EmbeddedProductChunk[] = [];
let lastIndexedAt: string | null = null;
let failedChunkIds: string[] = [];

function hashToken(token: string) {
  let hash = 0;
  for (let index = 0; index < token.length; index += 1) {
    hash = (hash * 31 + token.charCodeAt(index)) % vectorDimensions;
  }
  return hash;
}

export function generateLocalEmbedding(text: string) {
  const vector = Array.from({ length: vectorDimensions }, () => 0);
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .forEach((token) => {
      vector[hashToken(token)] += 1;
    });

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / magnitude);
}

export function reindexProduct(product: Product) {
  const chunks = buildProductChunks(product).map((chunk) => ({
    ...chunk,
    embedding: generateLocalEmbedding(chunk.text),
  }));
  vectorStore = [...vectorStore.filter((chunk) => chunk.productId !== product.id), ...chunks];
  lastIndexedAt = new Date().toISOString();
  return chunks;
}

export function reindexAllProducts(products: Product[]) {
  failedChunkIds = [];
  vectorStore = buildAllProductChunks(products).map((chunk) => ({
    ...chunk,
    embedding: generateLocalEmbedding(chunk.text),
  }));
  lastIndexedAt = new Date().toISOString();
  return vectorStore;
}

export function retryFailedEmbeddings(products: Product[]) {
  if (failedChunkIds.length === 0) {
    return vectorStore;
  }

  return reindexAllProducts(products);
}

export function getEmbeddingStatus() {
  return {
    provider: "local-hashing-embedding",
    vectorStore: "in-memory-pgvector-qdrant-placeholder",
    dimensions: vectorDimensions,
    indexedChunks: vectorStore.length,
    failedChunks: failedChunkIds.length,
    lastIndexedAt,
  };
}

export function getVectorStore(products: Product[]) {
  // Product catalogs currently come from each browser. Never reuse a module-level
  // index between requests: it can contain another shopper's products or stale data.
  return buildAllProductChunks(products).map((chunk) => ({
    ...chunk,
    embedding: generateLocalEmbedding(chunk.text),
  }));
}
