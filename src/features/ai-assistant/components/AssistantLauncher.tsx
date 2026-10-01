"use client";

import { m } from "framer-motion";
import { aiOrbPulse } from "@/lib/motion/motion-presets";

type AssistantLauncherProps = {
  onOpen: () => void;
};

export function AssistantLauncher({ onOpen }: AssistantLauncherProps) {
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute bottom-full right-0 mb-3 hidden w-48 rounded-card border border-white/70 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-soft group-hover:block">
        Ask Giant AI for product help
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
