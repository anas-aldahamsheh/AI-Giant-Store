"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCart } from "@/features/cart/store/cart.store";
import { productService } from "@/features/products/services/productService";
import { cn } from "@/lib/utils/cn";
import { isArabic } from "@/lib/utils/text-direction";
import type { AssistantMessage } from "@/features/ai-assistant/types/assistant.types";

type AssistantPanelProps = {
  messages: AssistantMessage[];
  inputValue: string;
  isTyping: boolean;
  errorMsg: string | null;
  suggestionChips: string[];
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: (text: string) => void;
  onRetry: () => void;
};

function renderMessageContent(content: string) {
  return content.split("\n").map((line, index) => {
    if (!line.trim()) return null;
    const isRtl = isArabic(line);
    const dir = isRtl ? "rtl" : "ltr";

    if (line.startsWith("- ")) {
      return (
        <li
          key={`${line}-${index}`}
          dir={dir}
          style={{ unicodeBidi: "plaintext" }}
          className={cn(
            "list-disc text-sm leading-relaxed text-slate-700",
            isRtl ? "mr-4 text-right" : "ml-4 text-left",
          )}
        >
          {line.substring(2)}
        </li>
      );
    }

    return (
      <p
        key={`${line}-${index}`}
        dir={dir}
        style={{ unicodeBidi: "plaintext" }}
        className={cn(
          "mb-2 text-sm leading-relaxed",
          isRtl ? "text-right" : "text-left",
        )}
      >
        {line.replaceAll("**", "")}
      </p>
    );
  });
}

export function AssistantPanel({
  messages,
  inputValue,
  isTyping,
  errorMsg,
  suggestionChips,
  onClose,
  onInputChange,
  onSendMessage,
  onRetry,
}: AssistantPanelProps) {
  const { addItem } = useCart();
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSendMessage(inputValue);
  }

  return (
    <Card role="dialog" aria-modal="true" aria-label="Giant AI Assistant" className="flex h-[calc(100dvh-7rem)] max-h-[36rem] w-[min(26rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-panel border border-white/70 bg-white/95 shadow-premium backdrop-blur fx-genie">
      <div className="dark-mesh-bg flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 text-sm font-black">AI</span>
          <div>
            <h3 className="text-sm font-black">Giant AI Assistant</h3>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-cyan-100">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Browser catalog · verify details
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-2 py-1 text-lg font-black text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Close AI Assistant"
        >
          x
        </button>
      </div>

      <div ref={threadRef} role="log" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
        {messages.map((message) => {
          const isAi = message.role === "assistant";
          const isRtl = isArabic(message.content);
          const dir = isRtl ? "rtl" : "ltr";

          return (
            <div key={message.id} className={`flex flex-col ${isAi ? "items-start fx-msg-ai" : "items-end fx-msg-user"}`}>
              <div
                dir={dir}
                style={{ unicodeBidi: "plaintext" }}
                className={cn(
                  "max-w-[85%] rounded-2xl p-3 text-sm shadow-sm",
                  isRtl ? "text-right" : "text-left",
                  isAi
                    ? "rounded-tl-none border border-slate-200 bg-white text-slate-800"
                    : "rounded-tr-none bg-brand-600 text-white",
                )}
              >
                {isAi ? (
                  renderMessageContent(message.content)
                ) : (
                  <p
                    dir={dir}
                    style={{ unicodeBidi: "plaintext" }}
                    className={cn("leading-relaxed", isRtl ? "text-right" : "text-left")}
                  >
                    {message.content}
                  </p>
                )}
              </div>

              {isAi && message.recommendedProducts?.length ? (
                <div className="mt-3 grid w-full max-w-[90%] grid-cols-2 gap-2">
                  {message.recommendedProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-slate-200 bg-white shadow-sm transition hover:shadow-soft">
                      <CardContent className="space-y-2 p-2">
                        <div className="h-20 w-full overflow-hidden rounded-card bg-slate-100">
                          <ProductImage src={product.imageUrl} alt={product.title} />
                        </div>
                        <div>
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={onClose}
                            dir="auto"
                            className="block line-clamp-1 text-[11px] font-black text-slate-950 hover:text-brand-700"
                          >
                            {product.title}
                          </Link>
                          <span className="block text-[9px] font-black uppercase text-slate-500">
                            {product.brand}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1 border-t border-slate-200 pt-2">
                          <span className="text-[11px] font-black text-slate-950">
                            <PriceDisplay amount={product.price} />
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            className="h-6 px-1.5 text-[9px]"
                            onClick={() => {
                              const fullProduct = productService.getBySlug(product.slug);
                              if (fullProduct) {
                                addItem(fullProduct);
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        {isTyping ? (
          <div role="status" aria-label="Assistant is responding" className="flex w-16 items-center gap-1.5 rounded-2xl rounded-tl-none border border-slate-200 bg-white p-3 text-slate-500">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]" />
          </div>
        ) : null}

        {errorMsg ? (
          <div role="alert" className="flex flex-col gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <p>{errorMsg}</p>
            <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
              Retry connection
            </Button>
          </div>
        ) : null}

      </div>

      {messages.length === 1 ? (
        <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white p-3 text-xs">
          <span className="w-full text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            Suggested prompts
          </span>
          {suggestionChips.map((chip) => {
            const isChipRtl = isArabic(chip);
            return (
              <button
                key={chip}
                type="button"
                dir={isChipRtl ? "rtl" : "ltr"}
                onClick={() => onSendMessage(chip)}
                disabled={isTyping}
                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                {chip}
              </button>
            );
          })}
        </div>
      ) : null}

      <form onSubmit={handleFormSubmit} className="flex gap-2 border-t border-slate-200 bg-white p-3">
        <input
          ref={inputRef}
          type="text"
          aria-label="Message Giant AI Assistant"
          maxLength={2000}
          dir="auto"
          placeholder="Ask Giant Assistant..."
          className="min-w-0 flex-1 rounded-button border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          disabled={isTyping}
        />
        <Button type="submit" disabled={isTyping || !inputValue.trim()}>
          Send
        </Button>
      </form>
    </Card>
  );
}
