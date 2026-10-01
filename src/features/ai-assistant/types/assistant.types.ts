export type AssistantRecommendedProduct = {
  id: string;
  title: string;
  price: number;
  slug: string;
  imageUrl: string;
  brand: string;
};

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedProducts?: AssistantRecommendedProduct[];
};
