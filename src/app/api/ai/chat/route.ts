import { NextResponse } from "next/server";
import { products } from "@/features/products/data/products.data";
import type { Product } from "@/features/products/types/product.types";
import { buildFallbackAdvisorResponse } from "@/lib/ai/fallback-advisor";
import { productAdvisorPromptVersion } from "@/lib/ai/prompts/product-advisor";
import { geminiProvider } from "@/lib/ai/providers/gemini";
import { retrieveRelevantProducts } from "@/lib/ai/rag/retrieval";
import { aiChatRequestSchema, aiChatResponseSchema, type AiChatResponse } from "@/lib/ai/schemas";

const windowMs = 60_000;
const maxRequests = 30;
const maxBodyBytes = 100_000;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

async function readLimitedBody(request: Request): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBodyBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function checkRateLimit(request: Request) {
  const now = Date.now();
  for (const [key, value] of rateLimitStore) {
    if (value.resetAt <= now) rateLimitStore.delete(key);
  }
  // Forwarded headers are client controlled unless a trusted proxy is configured.
  const clientId = process.env.TRUST_PROXY_IP_HEADERS === "true"
    ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "shared"
    : "shared";
  const current = rateLimitStore.get(clientId);
  if (!current) {
    rateLimitStore.set(clientId, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= maxRequests) return false;
  current.count += 1;
  return true;
}

function sanitizeResponse(response: AiChatResponse, catalog: Product[], browserCatalog: boolean): AiChatResponse {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const seen = new Set<string>();
  const recommended_products = response.recommended_products.flatMap(({ id }) => {
    const product = byId.get(id);
    if (!product || seen.has(id)) return [];
    seen.add(id);
    return [{
      id: product.id,
      title: product.title,
      price: product.price,
      slug: product.slug,
      imageUrl: product.imageUrl,
      brand: product.brand,
      ratingAverage: product.ratingAverage,
    }];
  });
  return {
    ...response,
    recommended_products,
    sources: [...new Set(response.sources)].filter((id) => byId.has(id)),
    safety: { ...response.safety, grounded: !browserCatalog && response.safety.grounded },
    meta: { ...response.meta, rateLimitChecked: true, costLogged: false },
  };
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Cross-origin requests are not allowed." }, 403);
  if (!checkRateLimit(request)) return json({ error: "Too many AI requests. Please try again shortly." }, 429);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "JSON is required." }, 415);
  }
  if (Number(request.headers.get("content-length")) > maxBodyBytes) {
    return json({ error: "AI request is too large." }, 413);
  }

  let raw: string | null;
  try {
    raw = await readLimitedBody(request);
  } catch {
    return json({ error: "Could not read request body." }, 400);
  }
  if (raw === null) return json({ error: "AI request is too large." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  const parsed = aiChatRequestSchema.safeParse(body);
  if (!parsed.success) return json({ error: "Invalid AI chat request." }, 400);

  const browserCatalog = parsed.data.products !== undefined;
  const catalog: Product[] = browserCatalog ? parsed.data.products! : products;
  const messages = parsed.data.messages;
  const fallback = buildFallbackAdvisorResponse(messages, catalog);
  if (catalog.length === 0) return json(sanitizeResponse(fallback, catalog, browserCatalog));

  let candidate: AiChatResponse = fallback;
  try {
    const rag = retrieveRelevantProducts(catalog, messages[messages.length - 1].content);
    const relevantProducts = rag.products.length ? rag.products : catalog.slice(0, 15);
    const providerResponse = await geminiProvider.generate({
      messages,
      products: relevantProducts,
      ragContext: rag.context,
    });
    if (providerResponse) {
      candidate = {
        ...providerResponse,
        meta: {
          provider: geminiProvider.name,
          promptVersion: productAdvisorPromptVersion,
          rateLimitChecked: true,
          costLogged: false,
        },
      };
    }
  } catch (error) {
    console.error("AI provider unavailable", error instanceof Error ? error.name : "unknown error");
  }

  const parsedResponse = aiChatResponseSchema.safeParse(candidate);
  const safeResponse = sanitizeResponse(parsedResponse.success && parsedResponse.data.answer.trim()
    ? parsedResponse.data
    : fallback, catalog, browserCatalog);
  return json(safeResponse);
}
