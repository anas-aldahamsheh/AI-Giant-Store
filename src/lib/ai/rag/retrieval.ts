import type { Product } from "@/features/products/types/product.types";
import {
  generateLocalEmbedding,
  getVectorStore,
  type EmbeddedProductChunk,
} from "@/lib/ai/rag/embedding-service";
import { normalizeProductText } from "@/lib/ai/rag/product-chunks";

type RetrievalFilters = {
  category?: string;
  brand?: string;
  maxPrice?: number;
};

export type RetrievalResult = {
  chunk: EmbeddedProductChunk;
  score: number;
  keywordScore: number;
  vectorScore: number;
};

export const BILINGUAL_SYNONYMS: Record<string, string[]> = {
  سماعة: ["headphone", "headphones", "earbuds", "buds", "earphones", "headset"],
  سماعات: ["headphone", "headphones", "earbuds", "buds", "earphones", "headset"],
  صوتيات: ["audio", "sound", "speaker", "headphones", "headphone"],
  بلوتوث: ["bluetooth", "wireless"],
  لاسلكي: ["wireless", "bluetooth"],
  لاسلكية: ["wireless", "bluetooth"],
  عزل: ["noise", "cancelling", "anc"],
  هاتف: ["phone", "smartphone", "iphone", "mobile"],
  هواتف: ["phone", "smartphone", "iphone", "mobile"],
  جوال: ["phone", "smartphone", "iphone", "mobile"],
  موبايل: ["phone", "smartphone", "iphone", "mobile"],
  ايفون: ["iphone", "apple", "phone"],
  آيفون: ["iphone", "apple", "phone"],
  ابل: ["apple"],
  أبل: ["apple"],
  ساعة: ["watch", "smartwatch", "wearable"],
  ساعات: ["watch", "smartwatch", "wearable"],
  شاحن: ["charger", "cable", "powerbank"],
  شواحن: ["charger", "cable", "powerbank"],
  لابتوب: ["laptop", "computer", "pc", "macbook"],
  كمبيوتر: ["laptop", "computer", "pc", "macbook"],
  حاسوب: ["laptop", "computer", "pc", "macbook"],
  كاميرا: ["camera", "dslr"],
  كاميرات: ["camera", "dslr"],
  تلفزيون: ["tv", "screen", "monitor"],
  شاشة: ["screen", "monitor", "display"],
  العاب: ["gaming", "game", "console"],
  ألعاب: ["gaming", "game", "console"],
  جيمنج: ["gaming", "game"],
  ماوس: ["mouse"],
  فارة: ["mouse"],
  كيبورد: ["keyboard"],
  لوحة: ["keyboard", "tablet"],
  مفاتيح: ["keyboard"],
  سبيكر: ["speaker"],
  مكبر: ["speaker"],
  ايربودز: ["earbuds", "wireless"],
  اذن: ["earbuds", "earphones"],
  خاتم: ["ring", "smart ring"],
  سوار: ["band", "fitness"],
  اسوارة: ["band", "fitness"],
  لياقة: ["fitness", "health", "gym"],
  رياضة: ["fitness", "gym", "outdoor"],
  نوم: ["sleep"],
  صحة: ["health", "fitness"],
  تصوير: ["camera", "photography", "creator"],
  مغامرات: ["action camera", "outdoor"],
  يد: ["controller"],
  جويستيك: ["controller", "gaming"],
  دراعة: ["controller", "gaming"],
  تحكم: ["controller"],
  بلايستيشن: ["console", "controller", "gaming"],
  اباجورة: ["lamp", "lighting", "desk"],
  لمبة: ["lamp", "lighting"],
  ضوء: ["lamp", "lighting"],
  اضاءة: ["lamp", "lighting"],
  إضاءة: ["lamp", "lighting"],
  مكتب: ["desk", "office", "home office"],
  هواء: ["air purifier"],
  منقي: ["air purifier"],
  تنقية: ["air purifier"],
  حساسية: ["allergy", "air purifier"],
  بيت: ["home", "smart home"],
  منزل: ["home", "smart home"],
  شاشات: ["monitor", "display"],
  تابلت: ["tablet"],
  ايباد: ["tablet"],
  لوحي: ["tablet"],
  رسم: ["drawing", "tablet"],
  دراسة: ["study", "student"],
  طالب: ["student", "study"],
  طلاب: ["student", "study"],
  شنطة: ["backpack", "bag"],
  شنط: ["backpack", "bag"],
  حقيبة: ["backpack", "bag"],
  سفر: ["travel"],
  باور: ["power bank", "charging"],
  بنك: ["power bank"],
  بطارية: ["battery", "power bank"],
  شحن: ["charging", "power bank", "charger"],
  موزع: ["hub", "usb-c"],
  وصلة: ["hub", "usb-c"],
  هب: ["hub"],
  هدية: ["gift"],
  هدايا: ["gift"],
  شغل: ["work", "office"],
  اندرويد: ["android", "smartphone"],
  // English to Arabic reverse synonyms
  speaker: ["سبيكر", "مكبر"],
  ring: ["خاتم"],
  tablet: ["تابلت", "لوحي"],
  backpack: ["شنطة", "حقيبة"],
  lamp: ["اباجورة", "اضاءة"],
  controller: ["جويستيك", "تحكم"],
  gamepad: ["controller", "gaming"],
  earphones: ["earbuds"],
  powerbank: ["power bank"],
  purifier: ["air purifier"],
  smartwatch: ["smart watch", "watch"],
  headphone: ["سماعة", "سماعات", "صوتيات", "earbuds", "buds", "earphones"],
  headphones: ["سماعة", "سماعات", "صوتيات", "earbuds", "buds", "earphones"],
  earbuds: ["سماعة", "سماعات"],
  phone: ["هاتف", "هواتف", "جوال", "موبايل"],
  smartphone: ["هاتف", "هواتف", "جوال"],
  iphone: ["ايفون", "آيفون", "هاتف"],
  watch: ["ساعة", "ساعات"],
  laptop: ["لابتوب", "كمبيوتر", "حاسوب"],
  camera: ["كاميرا", "كاميرات"],
  charger: ["شاحن", "شواحن"],
};

export function expandQuery(query: string): string[] {
  const normalized = normalizeProductText(query);
  const words = normalized.split(/\s+/).filter((w) => w.length >= 2);
  const expanded = new Set<string>(words);

  words.forEach((word) => {
    const directSyns = BILINGUAL_SYNONYMS[word];
    if (directSyns) {
      directSyns.forEach((s) => expanded.add(s));
    }
    Object.entries(BILINGUAL_SYNONYMS).forEach(([key, values]) => {
      // Catch attached forms ("السماعات", "headphones") without letting short
      // words such as "in" pull in "ring".
      if ((key.length >= 3 && word.includes(key)) || (word.length >= 4 && key.includes(word))) {
        values.forEach((v) => expanded.add(v));
      }
    });
  });

  return Array.from(expanded);
}

function cosineSimilarity(left: number[], right: number[]) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function keywordScore(text: string, query: string) {
  const normalizedText = normalizeProductText(text);
  const searchTerms = expandQuery(query);
  return searchTerms
    .filter((word) => word.length >= 2)
    .reduce((score, word) => score + (normalizedText.includes(word) ? 0.35 : 0), 0);
}

function matchesFilters(chunk: EmbeddedProductChunk, filters: RetrievalFilters) {
  if (filters.category && chunk.metadata.category !== filters.category) return false;
  if (filters.brand && chunk.metadata.brand !== filters.brand) return false;
  if (filters.maxPrice && chunk.metadata.price > filters.maxPrice) return false;
  return true;
}

export function vectorSearch(products: Product[], query: string, filters: RetrievalFilters = {}) {
  const expandedQueryText = expandQuery(query).join(" ");
  const queryEmbedding = generateLocalEmbedding(expandedQueryText || query);
  return getVectorStore(products)
    .filter((chunk) => matchesFilters(chunk, filters))
    .map((chunk) => ({
      chunk,
      vectorScore: cosineSimilarity(queryEmbedding, chunk.embedding),
      keywordScore: 0,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));
}

export function keywordSearch(products: Product[], query: string, filters: RetrievalFilters = {}) {
  return getVectorStore(products)
    .filter((chunk) => matchesFilters(chunk, filters))
    .map((chunk) => {
      const score = keywordScore(`${chunk.text} ${chunk.metadata.tags.join(" ")}`, query);
      return {
        chunk,
        vectorScore: 0,
        keywordScore: score,
        score,
      };
    });
}

export function hybridSearch(products: Product[], query: string, filters: RetrievalFilters = {}) {
  const vectorResults = vectorSearch(products, query, filters);
  const keywordResults = keywordSearch(products, query, filters);
  const byChunkId = new Map<string, RetrievalResult>();

  vectorResults.forEach((result) => {
    byChunkId.set(result.chunk.id, result);
  });

  keywordResults.forEach((result) => {
    const existing = byChunkId.get(result.chunk.id);
    if (existing) {
      existing.keywordScore = result.keywordScore;
      existing.score = existing.vectorScore * 0.4 + result.keywordScore * 0.6;
    } else {
      byChunkId.set(result.chunk.id, result);
    }
  });

  return Array.from(byChunkId.values())
    .map((result) => {
      // If a chunk has 0 keyword match (no semantic cross-language keyword overlap), penalize accidental hash collisions
      if (result.keywordScore === 0) {
        return { ...result, score: result.vectorScore * 0.15 };
      }
      return result;
    })
    .filter((result) => result.score >= 0.08)
    .sort((left, right) => right.score - left.score)
    .slice(0, 12);
}

export function buildRagContext(results: RetrievalResult[]) {
  return results
    .map((result) => {
      return `[${result.chunk.productId}] ${result.chunk.metadata.title} (${result.chunk.type}) score ${result.score.toFixed(3)}: ${result.chunk.text}`;
    })
    .join("\n");
}

export function retrieveRelevantProducts(products: Product[], query: string) {
  const results = hybridSearch(products, query);
  const productIds = Array.from(new Set(results.map((result) => result.chunk.productId)));
  const groundedProducts = productIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  return {
    results,
    products: groundedProducts,
    context: buildRagContext(results),
    sources: productIds,
    grounded: groundedProducts.length > 0,
  };
}
