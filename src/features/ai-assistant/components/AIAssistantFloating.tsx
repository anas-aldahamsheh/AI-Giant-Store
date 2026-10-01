"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AssistantLauncher } from "@/features/ai-assistant/components/AssistantLauncher";
import { AssistantPanel } from "@/features/ai-assistant/components/AssistantPanel";
import type { AssistantMessage } from "@/features/ai-assistant/types/assistant.types";
import { productService } from "@/features/products/services/productService";
import { aiChatResponseSchema, type AiChatMessage } from "@/lib/ai/schemas";

const welcomeMessage: AssistantMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I am your Giant Store AI assistant. I can help you find products, compare options, check prices, or suggest gifts. What are you looking for today?",
};

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
  const handleClose = useCallback(() => setIsOpen(false), []);

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
          products: productService.list().slice(0, 40),
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
    if (!cleanText || cleanText.length > 2000 || pendingRef.current) return;

    setErrorMsg(null);
    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanText,
    };

    setMessages((current) => [...current, userMessage]);
    setInputValue("");
    const chatHistory = [...messages, userMessage].slice(-20).map((message) => ({
        role: message.role,
        content: message.content,
      })) as AiChatMessage[];
    await requestAnswer(chatHistory);
  }

  async function handleRetry() {
    if (pendingRef.current || !failedHistoryRef.current) return;
    await requestAnswer(failedHistoryRef.current);
  }

  return (
    <div className={`fixed bottom-20 right-3 z-50 flex-col items-end md:bottom-6 md:right-6 ${isOpen ? "flex" : "hidden md:flex"}`}>
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
