import { afterEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/ai/chat/route";
import { POST as reindex } from "@/app/api/ai/rag/route";
import { aiChatRequestSchema } from "@/lib/ai/schemas";
import { retrieveRelevantProducts } from "@/lib/ai/rag/retrieval";
import type { Product } from "@/features/products/types/product.types";

const priorKey = process.env.GEMINI_API_KEY;
delete process.env.GEMINI_API_KEY;
afterEach(() => {
  if (priorKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = priorKey;
});

const item: Product = {
  id: "headphones-1", title: "Demo Headphones", slug: "demo-headphones", brand: "Demo",
  category: "Audio", description: "Wireless audio", shortDescription: "Wireless headphones",
  imageUrl: "", gallery: [], price: 120, currency: "USD", ratingAverage: 0,
  ratingCount: 0, stockStatus: "in_stock", tags: ["headphones"], attributes: [],
  variants: [], reviews: [], faqs: [], relatedProductSlugs: [], createdAt: "", updatedAt: "",
};

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("chat endpoint boundaries", () => {
  it("rejects cross-origin chat requests", async () => {
    const response = await POST(request({ messages: [{ role: "user", content: "Hi" }] }, { origin: "https://evil.example" }));
    expect(response.status).toBe(403);
  });

  it("rejects malformed product input and non-user final turns", () => {
    expect(aiChatRequestSchema.safeParse({ messages: [{ role: "assistant", content: "Hi" }] }).success).toBe(false);
    expect(aiChatRequestSchema.safeParse({ messages: [{ role: "user", content: "Hi" }], products: [{ id: "fake" }] }).success).toBe(false);
  });

  it("rejects oversized bodies before parsing them", async () => {
    const response = await POST(request({ messages: [{ role: "user", content: "x".repeat(100_001) }] }));
    expect(response.status).toBe(413);
  });

  it("does not claim browser-supplied products are server verified", async () => {
    const response = await POST(request({ messages: [{ role: "user", content: "headphones" }], products: [item] }));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.safety.grounded).toBe(false);
    expect(data.meta.costLogged).toBe(false);
    expect(data.recommended_products[0]).toMatchObject({ id: item.id, price: item.price });
  });

  it("does not reuse another request's product index", () => {
    retrieveRelevantProducts([item], "headphones");
    const second = retrieveRelevantProducts([{ ...item, id: "camera-1", title: "Demo Camera", slug: "demo-camera", tags: ["camera"] }], "headphones");
    expect(second.products.every((product) => product.id !== item.id)).toBe(true);
  });

  it("disables unauthenticated global reindexing", async () => {
    const response = await reindex();
    expect(response.status).toBe(501);
  });
});
