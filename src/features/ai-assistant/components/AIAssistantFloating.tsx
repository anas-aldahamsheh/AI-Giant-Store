"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AssistantLauncher } from "@/features/ai-assistant/components/AssistantLauncher";
import { AssistantPanel } from "@/features/ai-assistant/components/AssistantPanel";
import type { AssistantMessage } from "@/features/ai-assistant/types/assistant.types";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product.types";
import { aiChatResponseSchema, type AiChatMessage } from "@/lib/ai/schemas";

const welcomeMessage: AssistantMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I am your Giant Store AI assistant. I can help you find products, compare options, check prices, or suggest gifts. What are you looking for today?",
};

const maxMessageLength = 2000;

/** Only the fields the assistant reads, cut to the sizes the chat API accepts. */
function toAssistantProduct(product: Product) {
  const cut = (value: string | undefined, max: number) => (value ?? "").slice(0, max);
  return {
    id: cut(product.id, 160),
    title: cut(product.title, 160),
    slug: cut(product.slug, 160),
    brand: cut(product.brand, 160) || "Giant Store",
    category: cut(product.category, 160) || "General",
    description: cut(product.description, 600),
    shortDescription: cut(product.shortDescription, 300),
    // Uploaded images are stored inline and are far too large to send.
    imageUrl: product.imageUrl?.length <= 500 ? product.imageUrl : "",
    price: product.price,
    ...(product.compareAtPrice ? { compareAtPrice: product.compareAtPrice } : {}),
    ratingAverage: Math.min(5, Math.max(0, product.ratingAverage || 0)),
    ratingCount: Math.max(0, Math.round(product.ratingCount || 0)),
    stockStatus: product.stockStatus,
    tags: (product.tags ?? []).slice(0, 20).map((tag) => cut(tag, 80)),
    attributes: (product.attributes ?? [])
      .filter((attribute) => attribute.name?.trim())
      .slice(0, 30)
      .map((attribute) => ({ name: cut(attribute.name, 160), value: cut(attribute.value, 200) })),
  };
}

const suggestionChips = [
  "Find me headphones under $250",
  "Compare the best smart watches",
  "Build a camera starter kit",
  "What should I buy for gaming?",
  "Show best value products",
  "Recommend a gift",
];

export function AIAssistantFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([welcomeMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pendingRef = useRef(false);
  const failedHistoryRef = useRef<AiChatMessage[] | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleClose = useCallback(() => setIsOpen(false), []);

  // A press anywhere outside the panel closes it, the same as the close button.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && target.isConnected && !containerRef.current?.contains(target)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  useEffect(() => () => requestControllerRef.current?.abort(), []);

  useEffect(() => {
    const openAssistant = () => setIsOpen(true);
    window.addEventListener("open-giant-ai", openAssistant);
    return () => window.removeEventListener("open-giant-ai", openAssistant);
  }, []);

  async function requestAnswer(history: AiChatMessage[]) {
    pendingRef.current = true;
    setIsTyping(true);
    setErrorMsg(null);
    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: history,
          products: productService.list().slice(0, 40).filter((product) => product.id && product.title && product.slug).map(toAssistantProduct),
        }),
      });
      if (!response.ok) {
        throw new Error(response.status === 429 ? "Too many requests. Please wait a minute and retry." : "The assistant is unavailable. Please retry.");
      }
      const parsed = aiChatResponseSchema.safeParse(await response.json());
      if (!parsed.success) throw new Error("The assistant returned an invalid response. Please retry.");

      failedHistoryRef.current = null;
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: parsed.data.answer,
        recommendedProducts: parsed.data.recommended_products,
        followUps: parsed.data.follow_up_questions,
      }]);
    } catch (error) {
      if (!controller.signal.aborted) {
        failedHistoryRef.current = history;
        setErrorMsg(error instanceof Error ? error.message : "The assistant is unavailable. Please retry.");
      }
    } finally {
      pendingRef.current = false;
      requestControllerRef.current = null;
      setIsTyping(false);
    }
  }

  async function handleSendMessage(text: string) {
    const cleanText = text.trim();
    if (!cleanText || cleanText.length > maxMessageLength || pendingRef.current) return;

    setErrorMsg(null);
    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanText,
    };

    setMessages((current) => [...current, userMessage]);
    setInputValue("");
    // Answers can run longer than a question may, so older turns are trimmed to fit.
    const chatHistory = [...messages, userMessage].slice(-20).map((message) => ({
      role: message.role,
      content: message.content.slice(0, maxMessageLength),
    })) as AiChatMessage[];
    await requestAnswer(chatHistory);
  }

  async function handleRetry() {
    if (pendingRef.current || !failedHistoryRef.current) return;
    await requestAnswer(failedHistoryRef.current);
  }

  return (
    <div ref={containerRef} className={`fixed bottom-20 right-3 z-50 flex-col items-end md:bottom-6 md:right-6 ${isOpen ? "flex" : "hidden md:flex"}`}>
      {isOpen ? (
        <AssistantPanel
          messages={messages}
          inputValue={inputValue}
          isTyping={isTyping}
          errorMsg={errorMsg}
          suggestionChips={suggestionChips}
          onClose={handleClose}
          onInputChange={setInputValue}
          onSendMessage={handleSendMessage}
          onRetry={handleRetry}
        />
      ) : (
        <AssistantLauncher onOpen={() => setIsOpen(true)} />
      )}
    </div>
  );
}
