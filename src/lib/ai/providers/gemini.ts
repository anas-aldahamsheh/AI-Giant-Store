import type { Product } from "@/features/products/types/product.types";
import { buildAdvisorSystemInstruction, productAdvisorPromptVersion } from "@/lib/ai/prompts/product-advisor";
import type { AiChatMessage, AiChatResponse } from "@/lib/ai/schemas";

export type AiProviderInput = {
  messages: AiChatMessage[];
  products: Product[];
  ragContext?: string;
};

export type AiProvider = {
  name: string;
  generate: (input: AiProviderInput) => Promise<AiChatResponse | null>;
};

type GeminiCandidate = {
  content?: {
    parts?: Array<{ text?: string }>;
  };
};

function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

function buildGeminiContents(messages: AiChatMessage[]): GeminiContent[] {
  const contents: GeminiContent[] = [];

  for (const msg of messages) {
    const role = msg.role === "assistant" ? "model" : "user";
    const text = (msg.content || "").trim();
    if (!text) continue;

    const prev = contents[contents.length - 1];
    if (prev && prev.role === role) {
      prev.parts[0].text += "\n" + text;
    } else {
      contents.push({
        role,
        parts: [{ text }],
      });
    }
  }

  // Ensure conversation starts with 'user'
  while (contents.length > 0 && contents[0].role !== "user") {
    contents.shift();
  }

  // Ensure conversation ends with 'user'
  if (contents.length === 0 || contents[contents.length - 1].role !== "user") {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    contents.push({
      role: "user",
      parts: [{ text: lastUser?.content || "Hello" }],
    });
  }

  return contents;
}

function findMatchingProduct(item: Record<string, unknown>, products: Product[]): Product | undefined {
  const itemId = typeof item.id === "string" ? item.id.trim() : "";
  return itemId ? products.find((product) => product.id === itemId) : undefined;
}

export const geminiProvider: AiProvider = {
  name: "gemini-3.1-flash-lite",
  async generate({ messages, products, ragContext }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured.");
      return null;
    }

    const systemInstructionText = buildAdvisorSystemInstruction(products, ragContext);
    const contents = buildGeminiContents(messages);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstructionText }],
          },
          contents,
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      console.error("Gemini API request failed with status", response.status);
      return null;
    }

    const data = (await response.json()) as { candidates?: GeminiCandidate[] };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const jsonText = extractJson(text);
    if (!jsonText) return null;

    try {
      const raw = JSON.parse(jsonText);

      type RecommendedItem = {
        id: string;
        title: string;
        price: number;
        slug: string;
        imageUrl: string;
        brand: string;
        ratingAverage: number;
      };

      const itemsList: (RecommendedItem | null)[] = Array.isArray(raw.recommended_products)
        ? raw.recommended_products.slice(0, 5).map((item: unknown): RecommendedItem | null => {
            if (!item || typeof item !== "object" || Array.isArray(item)) return null;
            const matched = findMatchingProduct(item as Record<string, unknown>, products);
            if (matched) {
              return {
                id: matched.id,
                title: matched.title,
                price: matched.price,
                slug: matched.slug,
                imageUrl: matched.imageUrl,
                brand: matched.brand,
                ratingAverage: matched.ratingAverage,
              };
            }
            return null;
          })
        : [];

      const recommended_products: RecommendedItem[] = itemsList
        .filter((p: RecommendedItem | null): p is RecommendedItem => p !== null)
        .slice(0, 5);

      return {
        answer: typeof raw.answer === "string" ? raw.answer.replaceAll("**", "").slice(0, 5000) : "",
        recommended_products,
        follow_up_questions: Array.isArray(raw.follow_up_questions)
          ? raw.follow_up_questions.filter((value: unknown): value is string => typeof value === "string").slice(0, 5)
          : [],
        sources: Array.isArray(raw.sources)
          ? raw.sources.filter((value: unknown): value is string => typeof value === "string").slice(0, 5)
          : recommended_products.map((p) => p.id),
        safety: {
          grounded: true,
          needs_clarification: Boolean(raw.safety?.needs_clarification),
        },
        meta: {
          provider: "gemini-3.1-flash-lite",
          promptVersion: productAdvisorPromptVersion,
          rateLimitChecked: true,
          costLogged: false,
        },
      };
    } catch (e) {
      console.error("Failed to parse Gemini response JSON", e);
      return null;
    }
  },
};
