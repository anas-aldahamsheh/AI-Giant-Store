"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$*+<>";

type ScrambleTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
};

/**
 * Decodes the text from random glyphs when it scrolls into view,
 * like a signal locking on. Layout is reserved by the final text.
 */
export function ScrambleText({
  text,
  className,
  delay = 0,
  duration = 1100,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [output, setOutput] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let timeout = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const locked = Math.floor(t * text.length);
        let next = "";
        for (let i = 0; i < text.length; i += 1) {
          const ch = text[i];
          next +=
            i < locked || ch === " "
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOutput(next);
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      io.disconnect();
      timeout = window.setTimeout(run, delay);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [text, delay, duration]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      style={{ display: "inline-grid" }}
    >
      <span aria-hidden="true" style={{ gridArea: "1 / 1", visibility: "hidden" }}>
        {text}
      </span>
      <span aria-hidden="true" style={{ gridArea: "1 / 1" }}>
        {output}
      </span>
    </span>
  );
}
