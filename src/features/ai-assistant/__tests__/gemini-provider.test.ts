import { afterEach, describe, expect, it, vi } from "vitest";
import { demoProducts } from "@/features/products/data/demo-products.data";
import { geminiProvider } from "@/lib/ai/providers/gemini";

const reply = { answer: "Try the Pulse Buds Pro.", recommended_products: [{ id: "demo_02" }], follow_up_questions: [] };
const ok = () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(reply) }] } }] }), { status: 200 });

describe("model provider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("retries once when the model is busy", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test");
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("busy", { status: 503 })).mockResolvedValueOnce(ok());
    vi.stubGlobal("fetch", fetchMock);
    const result = await geminiProvider.generate({ messages: [{ role: "user", content: "earbuds" }], products: demoProducts });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result?.recommended_products[0]?.id).toBe("demo_02");
  });

  it("does not retry a rejected request", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test");
    const fetchMock = vi.fn().mockResolvedValue(new Response("bad", { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await geminiProvider.generate({ messages: [{ role: "user", content: "hi" }], products: demoProducts })).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
