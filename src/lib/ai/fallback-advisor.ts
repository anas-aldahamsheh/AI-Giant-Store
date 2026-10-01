import type { Product } from "@/features/products/types/product.types";
import { productAdvisorPromptVersion } from "@/lib/ai/prompts/product-advisor";
import { expandQuery } from "@/lib/ai/rag/retrieval";
import type { AiChatMessage, AiChatResponse } from "@/lib/ai/schemas";

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function scoreProduct(product: Product, query: string) {
  const haystack = [
    product.title,
    product.brand,
    product.category,
    product.description,
    product.shortDescription,
    product.tags.join(" "),
    product.attributes.map((attribute) => `${attribute.name} ${attribute.value}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return expandQuery(query)
    .filter((word) => word.length > 2)
    .reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0);
}

function toRecommendedProduct(product: Product) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    slug: product.slug,
    imageUrl: product.imageUrl,
    brand: product.brand,
    ratingAverage: product.ratingAverage,
  };
}

export function buildFallbackAdvisorResponse(messages: AiChatMessage[], products: Product[]): AiChatResponse {
  const userMessage = normalize(messages[messages.length - 1]?.content ?? "");
  const isArabic = /[\u0600-\u06FF]/.test(userMessage);

  if (products.length === 0) {
    return {
      answer: isArabic
        ? "لا توجد منتجات محفوظة في قائمة هذا المتصفح حاليًا. عندما تُضاف منتجات، أستطيع مساعدتك في استكشافها."
        : "There are no products saved in this browser's catalog yet. Once products are added, I can help you explore them.",
      recommended_products: [],
      follow_up_questions: isArabic
        ? ["ما الأقسام المتوفرة؟"]
        : ["What categories are available?"],
      sources: [],
      safety: {
        grounded: true,
        needs_clarification: false,
      },
      meta: {
        provider: "fallback-catalog-advisor",
        promptVersion: productAdvisorPromptVersion,
        rateLimitChecked: true,
        costLogged: false,
      },
    };
  }

  const budgetMatch = userMessage.match(/(?:under|below|less than|تحت|اقل من|أقل من|حدود)\s*\$?\s*(\d+(?:\.\d+)?)/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) : null;
  const availableProducts = products.filter((product) => product.stockStatus !== "out_of_stock" && (budget === null || product.price <= budget));
  const ranked = availableProducts
    .map((product) => ({ product, score: scoreProduct(product, userMessage) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || right.product.ratingAverage - left.product.ratingAverage);

  const matchedProducts = ranked.map((entry) => entry.product).slice(0, 5);
  const needsClarification = ranked.length === 0;
  if (needsClarification) {
    return {
      answer: isArabic
        ? "لم أجد منتجًا متاحًا يطابق طلبك ضمن المنتجات الموجودة في هذا المتصفح. جرّب نوعًا آخر أو حدّد ميزانية مختلفة."
        : "I couldn't find an available product matching that request in this browser's catalog. Try another category or budget.",
      recommended_products: [],
      follow_up_questions: isArabic ? ["ما المنتجات المتوفرة؟", "هل يمكنني تغيير الميزانية؟"] : ["What products are available?", "Can I change my budget?"],
      sources: [],
      safety: { grounded: false, needs_clarification: true },
      meta: { provider: "fallback-catalog-advisor", promptVersion: productAdvisorPromptVersion, rateLimitChecked: true, costLogged: false },
    };
  }
  const recommendationLines = matchedProducts
    .slice(0, needsClarification ? 2 : 5)
    .map((product) => {
      return isArabic
        ? `- ${product.title} (${product.brand}): السعر $${product.price}. ${product.shortDescription}`
        : `- ${product.title} (${product.brand}): $${product.price}. ${product.shortDescription}`;
    })
    .join("\n");

  const answer = isArabic
    ? `هذه منتجات متاحة من القائمة الموجودة في متصفحك:\n${recommendationLines}`
    : `Available matches from this browser's catalog:\n${recommendationLines}`;

  return {
    answer,
    recommended_products: matchedProducts.map(toRecommendedProduct),
    follow_up_questions: isArabic
      ? ["قارن بين هذه المنتجات", "أيها يناسب ميزانيتي؟"]
      : ["Compare these products", "Which one fits my budget?"],
    sources: matchedProducts.map((product) => product.id),
    safety: {
      grounded: false,
      needs_clarification: needsClarification,
    },
    meta: {
      provider: "fallback-catalog-advisor",
      promptVersion: productAdvisorPromptVersion,
      rateLimitChecked: true,
      costLogged: false,
    },
  };
}
