import type { Product } from "@/features/products/types/product.types";
import { productAdvisorPromptVersion } from "@/lib/ai/prompts/product-advisor";
import { expandQuery } from "@/lib/ai/rag/retrieval";
import type { AiChatMessage, AiChatResponse } from "@/lib/ai/schemas";

type Lang = "ar" | "en";

const meta = {
  provider: "fallback-catalog-advisor",
  promptVersion: productAdvisorPromptVersion,
  rateLimitChecked: true,
  costLogged: false,
};

/** Lower case, Western digits and plain Arabic letters, so one pattern covers common spellings. */
function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "show", "find", "need", "want", "looking", "something", "with", "under", "below", "less", "than", "over", "above",
  "between", "and", "the", "for", "best", "good", "cheap", "cheapest", "product", "products", "please", "some", "any",
  "what", "which", "have", "you", "your", "store", "price", "prices", "dollars", "usd", "buy", "recommend", "suggest",
  "بدي", "ابي", "اريد", "عندكم", "عندك", "في", "اشي", "شي", "ابحث", "دور", "دورلي", "اعطيني", "منتج", "منتجات",
  "سعر", "اسعار", "دولار", "دينار", "تحت", "اقل", "اكثر", "من", "بين", "افضل", "احسن", "رخيص", "ارخص", "شو", "ايش",
  "هل", "عن", "على", "الى", "لي", "الي", "مع", "بحدود", "حدود", "يعني", "لو", "سمحت",
]);

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

function respond(
  answer: string,
  recommended: Product[],
  followUps: string[],
  options: { grounded?: boolean; needsClarification?: boolean } = {},
): AiChatResponse {
  const items = recommended.slice(0, 5);
  return {
    answer,
    recommended_products: items.map(toRecommendedProduct),
    follow_up_questions: followUps.slice(0, 3),
    sources: items.map((product) => product.id),
    safety: { grounded: options.grounded ?? items.length > 0, needs_clarification: options.needsClarification ?? false },
    meta,
  };
}

function stockNote(product: Product, lang: Lang) {
  if (product.stockStatus === "low_stock") return lang === "ar" ? " (الكمية قليلة)" : " (low stock)";
  if (product.stockStatus === "out_of_stock") return lang === "ar" ? " (غير متوفر حاليًا)" : " (out of stock)";
  return "";
}

function line(product: Product, lang: Lang) {
  const sale = product.compareAtPrice && product.compareAtPrice > product.price
    ? lang === "ar" ? ` بدل $${product.compareAtPrice}` : ` (was $${product.compareAtPrice})`
    : "";
  return lang === "ar"
    ? `- ${product.title}: $${product.price}${sale}، تقييم ${product.ratingAverage}${stockNote(product, lang)}`
    : `- ${product.title}: $${product.price}${sale}, rated ${product.ratingAverage}${stockNote(product, lang)}`;
}

function lines(products: Product[], lang: Lang) {
  return products.slice(0, 5).map((product) => line(product, lang)).join("\n");
}

function inStock(products: Product[]) {
  return products.filter((product) => product.stockStatus !== "out_of_stock");
}

function categories(products: Product[]) {
  const counts = new Map<string, number>();
  products.forEach((product) => counts.set(product.category, (counts.get(product.category) ?? 0) + 1));
  return [...counts.entries()].sort((left, right) => right[1] - left[1]);
}

/** Reads "under 100", "between 50 and 150", "100-300", "تحت 100", "بين 50 و 150", "ب 200". */
function readBudget(text: string): { min?: number; max?: number } | null {
  const number = String.raw`\$?\s*(\d+(?:[.,]\d+)?)\s*(?:\$|usd|dollars?|دولار|دينار|jd)?`;
  const toNumber = (value: string) => Number(value.replace(",", "."));
  const range = text.match(new RegExp(String.raw`(?:between|from|بين|من)\s*${number}\s*(?:and|to|-|و|ل|الي|لـ)\s*${number}`, "i"))
    ?? text.match(new RegExp(String.raw`${number}\s*(?:-|to|الي)\s*${number}`, "i"));
  if (range) {
    const [low, high] = [toNumber(range[1]), toNumber(range[2])].sort((left, right) => left - right);
    return { min: low, max: high };
  }
  const max = text.match(new RegExp(String.raw`(?:under|below|less than|up to|max(?:imum)?|within|budget(?: of| is)?|تحت|اقل من|ما يزيد عن|لا يزيد عن|حدود|بحدود|ميزانيتي|ميزانية)\s*${number}`, "i"));
  if (max) return { max: toNumber(max[1]) };
  const min = text.match(new RegExp(String.raw`(?:over|above|more than|at least|فوق|اكثر من|اعلي من)\s*${number}`, "i"));
  if (min) return { min: toNumber(min[1]) };
  const bare = text.match(/(?:^|\s)(?:ب|بـ)\s*(\d+(?:[.,]\d+)?)/);
  if (bare) return { max: toNumber(bare[1]) };
  return null;
}

function withinBudget(products: Product[], budget: { min?: number; max?: number } | null) {
  if (!budget) return products;
  return products.filter((product) => (budget.min === undefined || product.price >= budget.min) && (budget.max === undefined || product.price <= budget.max));
}

function searchable(product: Product) {
  return normalize([
    product.title,
    product.brand,
    product.category,
    product.shortDescription,
    product.description,
    product.tags.join(" "),
    product.attributes.map((attribute) => `${attribute.name} ${attribute.value}`).join(" "),
  ].join(" "));
}

function queryTerms(query: string) {
  return expandQuery(normalize(query))
    .map(normalize)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word) && !/^\d+$/.test(word));
}

/** True when a word starts with the term, so "phone" finds "phone case" but not "headphones". */
function startsWord(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])(ال)?${escaped}`, "u").test(text);
}

function scoreProduct(product: Product, terms: string[]) {
  const haystack = searchable(product);
  const title = normalize(product.title);
  const category = normalize(product.category);
  return terms.reduce((score, word) => {
    if (startsWord(title, word)) return score + 3;
    if (startsWord(category, word)) return score + 2;
    return score + (startsWord(haystack, word) ? 1 : 0);
  }, 0);
}

function rank(products: Product[], query: string) {
  const terms = queryTerms(query);
  return products
    .map((product) => ({ product, score: scoreProduct(product, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || right.product.ratingAverage - left.product.ratingAverage)
    .map((entry) => entry.product);
}

/** What kind of thing a product is: its category, the last word of its title and its first tag. */
function isOfType(product: Product, terms: string[]) {
  const words = normalize(product.title).split(" ");
  const kind = [normalize(product.category), words[words.length - 1] ?? "", normalize(product.tags[0] ?? "")].join(" | ");
  return terms.some((term) => startsWord(kind, term));
}

/** Products named in a message: the full title, or a distinctive title word such as "Aurora". */
function mentionedIn(text: string, products: Product[]) {
  const normalized = normalize(text);
  return products.filter((product) => {
    const title = normalize(product.title);
    if (normalized.includes(title)) return true;
    const first = title.split(" ")[0];
    const escaped = first.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return first.length >= 4 && new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`).test(normalized);
  });
}

/** Products the conversation was last about, for "compare them" or "كم سعرهم". */
function productsInContext(messages: AiChatMessage[], products: Product[]) {
  for (let index = messages.length - 2; index >= 0; index -= 1) {
    const found = mentionedIn(messages[index].content, products);
    if (found.length) return found;
  }
  return [];
}

const has = (text: string, pattern: RegExp) => pattern.test(text);

export function buildFallbackAdvisorResponse(messages: AiChatMessage[], products: Product[]): AiChatResponse {
  const raw = messages[messages.length - 1]?.content ?? "";
  const text = normalize(raw);
  const lang: Lang = /[؀-ۿ]/.test(raw) ? "ar" : "en";
  const ar = lang === "ar";

  if (products.length === 0) {
    return respond(
      ar
        ? "لا توجد منتجات محفوظة في قائمة هذا المتصفح حاليًا. عندما تُضاف منتجات، أستطيع مساعدتك في استكشافها."
        : "There are no products saved in this browser's catalog yet. Once products are added, I can help you explore them.",
      [],
      ar ? ["ما الأقسام المتوفرة؟"] : ["What categories are available?"],
      { grounded: true },
    );
  }

  const available = inStock(products);
  const categoryList = categories(products).map(([name, count]) => `${name} (${count})`).join(", ");
  const named = mentionedIn(raw, products);
  const context = named.length ? named : productsInContext(messages, products);
  const budget = readBudget(text);

  // Greetings, thanks and "what can you do".
  // \b does not work next to Arabic letters, so the end of a word is spelled out.
  const greeting = has(text, /^(hi|hello|hey|good (morning|evening)|marhaba|مرحبا|اهلا|هلا|السلام عليكم|سلام|صباح الخير|مساء الخير|هاي)(?=$|[\s!.,،؟?])/);
  const thanks = has(text, /^(thanks|thank you|thx|شكرا|مشكور|يعطيك العافيه|يسلمو)/);
  const abilities = has(text, /(what can you do|who are you|how can you help|help me|شو بتقدر|شو بتعمل|مين انت|كيف بتساعد|ساعدني)/);
  if ((greeting || thanks || abilities) && text.split(" ").length <= 6 && !budget) {
    if (thanks) {
      return respond(ar ? "العفو! إذا احتجت أي شيء آخر من المتجر أنا هنا." : "You're welcome! I'm here if you need anything else from the store.", [], ar ? ["شو العروض الحالية؟"] : ["What deals are on now?"], { grounded: true });
    }
    return respond(
      ar
        ? `أهلًا! أنا مساعد Giant Store. أقدر أدورلك على منتج، ألتزم بميزانيتك، أقارن بين منتجين، أعرض العروض، وأقترح هدايا.\nالأقسام المتوفرة: ${categoryList}.`
        : `Hi! I'm the Giant Store assistant. I can find products, stick to your budget, compare items, show current deals and suggest gifts.\nCategories in the store: ${categoryList}.`,
      [],
      ar ? ["شو أرخص منتج؟", "شو العروض الحالية؟", "بدي سماعات تحت 150 دولار"] : ["What's the cheapest product?", "What deals are on now?", "Headphones under $150"],
      { grounded: true },
    );
  }

  // Off-topic or attempts to change the rules.
  if (has(text, /(ignore (all|previous|the) |system prompt|your instructions|تجاهل التعليمات|التعليمات السابقه)/)) {
    return respond(
      ar ? "أقدر أساعدك فقط في منتجات هذا المتجر. شو المنتج اللي بتدور عليه؟" : "I can only help with products in this store. What are you shopping for?",
      [],
      ar ? ["شو الأقسام المتوفرة؟"] : ["What categories do you have?"],
      { grounded: true },
    );
  }

  // Categories and "what do you sell".
  if (has(text, /(categor|what do you (sell|have)|what products|available products|اقسام|الاقسام|شو عندكم|شو في عندكم|ايش عندكم|شو بتبيعو|المنتجات المتوفره|شو المنتجات)/)) {
    const top = [...available].sort((left, right) => right.ratingAverage - left.ratingAverage).slice(0, 5);
    return respond(
      ar
        ? `عندنا ${products.length} منتج في هذه الأقسام: ${categoryList}.\nالأعلى تقييمًا:\n${lines(top, lang)}`
        : `We have ${products.length} products in these categories: ${categoryList}.\nTop rated right now:\n${lines(top, lang)}`,
      top,
      ar ? ["شو أرخص منتج؟", "شو العروض الحالية؟"] : ["What's the cheapest product?", "What deals are on now?"],
    );
  }

  // Comparison of named or recently discussed products.
  if (has(text, /(compare|comparison| vs |versus|difference|قارن|مقارنه|الفرق|ايهما|اي واحد|مين احسن)/)) {
    const candidates = context.length >= 2 ? context : rank(available, raw).slice(0, 2);
    if (candidates.length >= 2) {
      const pair = candidates.slice(0, 3);
      const cheapest = [...pair].sort((left, right) => left.price - right.price)[0];
      const bestRated = [...pair].sort((left, right) => right.ratingAverage - left.ratingAverage)[0];
      const details = pair.map((product) => {
        const specs = product.attributes.slice(0, 2).map((attribute) => `${attribute.name} ${attribute.value}`).join(ar ? "، " : ", ");
        return `${line(product, lang)}${specs ? (ar ? `، ${specs}` : `, ${specs}`) : ""}`;
      }).join("\n");
      return respond(
        ar
          ? `مقارنة سريعة:\n${details}\nالأرخص: ${cheapest.title}. الأعلى تقييمًا: ${bestRated.title}.`
          : `Quick comparison:\n${details}\nCheapest: ${cheapest.title}. Best rated: ${bestRated.title}.`,
        pair,
        ar ? [`احكيلي أكثر عن ${bestRated.title}`, "في شي أرخص؟"] : [`Tell me more about ${bestRated.title}`, "Anything cheaper?"],
      );
    }
    return respond(
      ar ? "أي منتجين بدك أقارن بينهم؟ اكتب اسميهما أو نوع المنتج." : "Which two products would you like me to compare? Name them or the product type.",
      [],
      ar ? ["قارن بين الساعات الذكية", "قارن بين السماعات"] : ["Compare the smart watches", "Compare the headphones"],
      { grounded: true, needsClarification: true },
    );
  }

  // Price and detail questions about named products or the ones just discussed ("how much are they?").
  const asksPrice = has(text, /(how much|price|cost|كم سعر|كم حق|قديش|بكم|كم سعره|كم سعرهم|اسعارهم|سعرها|سعره)/);
  const asksDetails = has(text, /(tell me (more )?about|details|specs|features|battery|is it|does it|in stock|available|مواصفات|تفاصيل|احكيلي|خبرني عن|متوفر|بطاريه|كيف)/);
  const pronounFollowUp = has(text, /\b(it|them|they|those|these|this one|that one)\b|(هم|ها|ه)$|هذول|هدول|هاي|هاد/);
  if ((asksPrice || asksDetails) && (named.length || (pronounFollowUp && context.length))) {
    const targets = (named.length ? named : context).slice(0, 5);
    const details = targets.map((product) => {
      const specs = product.attributes.map((attribute) => `${attribute.name}: ${attribute.value}`).join(ar ? "، " : ", ");
      return `${line(product, lang)}\n  ${product.shortDescription}${specs ? ` ${specs}.` : ""}`;
    }).join("\n");
    return respond(
      ar ? `هذه التفاصيل من الكتالوج:\n${details}` : `Here's what the catalog says:\n${details}`,
      targets,
      ar ? ["قارن بينهم", "في شي أرخص؟"] : ["Compare them", "Anything cheaper?"],
    );
  }

  // Deals.
  if (has(text, /(deal|discount|sale|offer|promo|عروض|عرض|خصم|خصومات|تخفيض|تنزيلات)/)) {
    const deals = withinBudget(available, budget)
      .filter((product) => product.compareAtPrice && product.compareAtPrice > product.price)
      .sort((left, right) => (right.compareAtPrice! - right.price) / right.compareAtPrice! - (left.compareAtPrice! - left.price) / left.compareAtPrice!);
    const scoped = rank(deals, raw).length ? rank(deals, raw) : deals;
    if (scoped.length) {
      return respond(
        ar ? `أقوى العروض الحالية:\n${lines(scoped, lang)}` : `Best deals right now:\n${lines(scoped, lang)}`,
        scoped,
        ar ? ["شو أرخص منتج؟", "قارن بين أول اثنين"] : ["What's the cheapest product?", "Compare the first two"],
      );
    }
  }

  // Cheapest, most expensive and best rated, optionally inside a category.
  const wantsCheapest = has(text, /(cheapest|lowest price|least expensive|ارخص|اقل سعر)/);
  const wantsPriciest = has(text, /(most expensive|highest price|priciest|premium|اغلي|اعلي سعر)/);
  const wantsBestRated = has(text, /(best rated|top rated|highest rated|most popular|best seller|اعلي تقييم|الاكثر مبيع|الافضل تقييم|الاشهر)/);
  if (wantsCheapest || wantsPriciest || wantsBestRated) {
    const scope = withinBudget(rank(available, raw).length ? rank(available, raw) : available, budget);
    const sorted = [...scope].sort((left, right) =>
      wantsCheapest ? left.price - right.price : wantsPriciest ? right.price - left.price : right.ratingAverage - left.ratingAverage || right.ratingCount - left.ratingCount,
    ).slice(0, 3);
    if (sorted.length) {
      const label = ar
        ? wantsCheapest ? "الأرخص" : wantsPriciest ? "الأغلى" : "الأعلى تقييمًا"
        : wantsCheapest ? "Cheapest" : wantsPriciest ? "Most expensive" : "Best rated";
      return respond(`${label}:\n${lines(sorted, lang)}`, sorted, ar ? ["قارن بينهم", "شو العروض؟"] : ["Compare them", "Any deals?"]);
    }
  }

  // Gift ideas.
  if (has(text, /(gift|present|هديه|هدايا)/)) {
    const pool = withinBudget(rank(available, raw).length ? rank(available, raw) : available, budget);
    const picks = [...pool].sort((left, right) => right.ratingAverage - left.ratingAverage).slice(0, 4);
    if (picks.length) {
      return respond(
        ar ? `أفكار هدايا عليها تقييم عالي${budget?.max ? ` ضمن $${budget.max}` : ""}:\n${lines(picks, lang)}` : `Well-rated gift ideas${budget?.max ? ` within $${budget.max}` : ""}:\n${lines(picks, lang)}`,
        picks,
        ar ? ["هدية تحت 100 دولار", "هدية لشخص بحب الرياضة"] : ["A gift under $100", "A gift for someone who loves fitness"],
      );
    }
  }

  // General search with an optional budget. When the user names a kind of product
  // ("laptop") and none fits the budget, say so rather than offering accessories as if they were one.
  const terms = queryTerms(raw);
  const ofType = rank(available, raw).filter((product) => isOfType(product, terms));
  if (budget && ofType.length && withinBudget(ofType, budget).length === 0) {
    const closest = [...ofType].sort((left, right) => left.price - right.price)[0];
    const related = rank(withinBudget(available, budget), raw).slice(0, 3);
    return respond(
      (ar
        ? `ما في منتج من هذا النوع ضمن ميزانيتك. أقرب خيار هو ${closest.title} بسعر $${closest.price}.`
        : `Nothing of that kind fits that budget. The closest is ${closest.title} at $${closest.price}.`)
        + (related.length ? (ar ? `\nوضمن ميزانيتك في إكسسوارات مناسبة:\n${lines(related, lang)}` : `\nWithin your budget, these related items fit:\n${lines(related, lang)}`) : ""),
      related,
      ar ? ["شو العروض الحالية؟", "شو الأرخص؟"] : ["What deals are on now?", "What's the cheapest product?"],
      { needsClarification: true },
    );
  }
  const typedInBudget = withinBudget(ofType, budget);
  const matches = typedInBudget.length ? typedInBudget : rank(withinBudget(available, budget), raw);
  if (matches.length) {
    const outOfBudget = budget ? (typedInBudget.length ? ofType : rank(available, raw)).filter((product) => !matches.includes(product)) : [];
    const budgetText = budget?.max !== undefined && budget.min !== undefined
      ? ar ? ` بين $${budget.min} و $${budget.max}` : ` between $${budget.min} and $${budget.max}`
      : budget?.max !== undefined ? ar ? ` ضمن $${budget.max}` : ` within $${budget.max}`
      : budget?.min !== undefined ? ar ? ` فوق $${budget.min}` : ` above $${budget.min}` : "";
    return respond(
      (ar ? `هذا اللي لقيته${budgetText}:\n${lines(matches, lang)}` : `Here's what I found${budgetText}:\n${lines(matches, lang)}`)
        + (outOfBudget.length ? (ar ? `\nوفي كمان ${outOfBudget[0].title} بسعر $${outOfBudget[0].price} إذا بتقدر تزيد الميزانية.` : `\nThere's also ${outOfBudget[0].title} at $${outOfBudget[0].price} if you can stretch the budget.`) : ""),
      matches,
      ar ? ["قارن بين أول اثنين", "شو الأرخص؟"] : ["Compare the first two", "Which is the cheapest?"],
    );
  }

  // Something matched but not within the budget.
  if (budget) {
    const overBudget = rank(available, raw);
    if (overBudget.length) {
      const cheapest = [...overBudget].sort((left, right) => left.price - right.price)[0];
      return respond(
        ar
          ? `ما في منتج من هذا النوع ضمن الميزانية. أرخص خيار عندنا هو ${cheapest.title} بسعر $${cheapest.price}.`
          : `Nothing of that kind fits that budget. The closest is ${cheapest.title} at $${cheapest.price}.`,
        [cheapest],
        ar ? ["شو العروض الحالية؟"] : ["What deals are on now?"],
        { needsClarification: true },
      );
    }
    const inRange = withinBudget(available, budget).sort((left, right) => right.ratingAverage - left.ratingAverage);
    if (inRange.length && text.replace(/[\d$.,]/g, "").trim().split(" ").filter((word) => word.length > 2 && !STOP_WORDS.has(word)).length === 0) {
      return respond(ar ? `منتجات ضمن ميزانيتك:\n${lines(inRange, lang)}` : `Products within your budget:\n${lines(inRange, lang)}`, inRange, ar ? ["قارن بين أول اثنين"] : ["Compare the first two"]);
    }
  }

  const outOfStockMatch = rank(products.filter((product) => product.stockStatus === "out_of_stock"), raw)[0];
  if (outOfStockMatch) {
    return respond(
      ar ? `${outOfStockMatch.title} غير متوفر حاليًا.` : `${outOfStockMatch.title} is out of stock right now.`,
      [],
      ar ? ["شو البدائل المتوفرة؟"] : ["What alternatives are in stock?"],
      { grounded: true },
    );
  }

  return respond(
    ar
      ? `ما لقيت هذا المنتج في متجرنا. الأقسام المتوفرة: ${categoryList}.`
      : `I couldn't find that in our store. Here's what we carry: ${categoryList}.`,
    [],
    ar ? ["شو أرخص منتج؟", "شو العروض الحالية؟"] : ["What's the cheapest product?", "What deals are on now?"],
    { grounded: false, needsClarification: true },
  );
}
