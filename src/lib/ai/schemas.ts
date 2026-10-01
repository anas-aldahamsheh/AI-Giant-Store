import { z } from "zod";

export const aiChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const shortText = z.string().trim().min(1).max(160);
const productInputSchema = z.object({
  id: shortText,
  title: shortText,
  slug: shortText,
  brand: shortText,
  category: shortText,
  description: z.string().max(2000).default(""),
  shortDescription: z.string().max(500).default(""),
  imageUrl: z.string().max(500).default(""),
  price: z.number().finite().nonnegative().max(10_000_000),
  ratingAverage: z.number().finite().min(0).max(5).default(0),
  ratingCount: z.number().int().nonnegative().max(1_000_000).default(0),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]),
  tags: z.array(z.string().max(80)).max(20).default([]),
  attributes: z.array(z.object({ name: shortText, value: z.string().max(200) })).max(30).default([]),
}).transform((product) => ({
  ...product,
  currency: "USD",
  gallery: [] as string[],
  variants: [],
  reviews: [],
  faqs: [],
  relatedProductSlugs: [] as string[],
  createdAt: "",
  updatedAt: "",
}));

export const aiChatRequestSchema = z.object({
  messages: z.array(aiChatMessageSchema).min(1).max(20).refine(
    (messages) => messages[messages.length - 1]?.role === "user",
    "The last message must be from the user.",
  ),
  products: z.array(productInputSchema).max(40).optional(),
}).strict();

export const recommendedProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  slug: z.string(),
  imageUrl: z.string(),
  brand: z.string(),
  ratingAverage: z.number().optional(),
});

export const aiChatResponseSchema = z.object({
  answer: z.string(),
  recommended_products: z.array(recommendedProductSchema).min(0).max(5),
  follow_up_questions: z.array(z.string()).min(0).max(5),
  sources: z.array(z.string()),
  safety: z.object({
    grounded: z.boolean(),
    needs_clarification: z.boolean(),
  }),
  meta: z.object({
    provider: z.string(),
    promptVersion: z.string(),
    rateLimitChecked: z.boolean(),
    costLogged: z.boolean(),
  }),
});

export type AiChatMessage = z.infer<typeof aiChatMessageSchema>;
export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;
export type AiChatResponse = z.infer<typeof aiChatResponseSchema>;
