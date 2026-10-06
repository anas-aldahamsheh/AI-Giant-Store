"use client";

import { m } from "framer-motion";
import { Sparkles } from "lucide-react";
import { aiOrbPulse } from "@/lib/motion/motion-presets";

type AssistantLauncherProps = {
  onOpen: () => void;
};

export function AssistantLauncher({ onOpen }: AssistantLauncherProps) {
  return (
    <div className="group relative">
      <div
        role="tooltip"
        className="pointer-events-none absolute right-full top-1/2 mr-4 flex -translate-y-1/2 translate-x-2 items-center gap-3 whitespace-nowrap rounded-2xl border border-slate-200/80 bg-white/95 py-2.5 pl-2.5 pr-4 opacity-0 shadow-soft backdrop-blur transition duration-200 ease-out group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 via-violet-500 to-cyan-400 text-white">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-slate-900">Giant AI assistant</span>
          <span className="text-xs font-medium text-slate-500">Ask anything about our products</span>
        </span>
        <span
          aria-hidden="true"
          className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r border-t border-slate-200/80 bg-white"
        />
      </div>
      <m.button
        type="button"
        onClick={onOpen}
        aria-label="Open AI Assistant"
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 via-violet-500 to-cyan-400 text-white shadow-glow transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        variants={aiOrbPulse}
        initial="initial"
        animate="animate"
      >
        <span className="absolute -inset-2 -z-10 rounded-full bg-cyan-400/20 blur-xl" />
        <span className="absolute -inset-4 -z-20 animate-ping rounded-full bg-brand-500/10" />
        <span className="text-xl font-black">AI</span>
      </m.button>
    </div>
  );
}
