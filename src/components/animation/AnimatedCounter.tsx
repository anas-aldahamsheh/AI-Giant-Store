"use client";

import { useEffect, useRef, useState } from "react";

export type AnimatedCounterProps = {
  value: number;
  durationMs?: number;
  formatter?: (value: number) => string;
};

export function AnimatedCounter({
  value,
  durationMs = 600,
  formatter = (counterValue) => Math.round(counterValue).toLocaleString("en-US"),
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const displayValueRef = useRef(value);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    if (mediaQuery.matches) {
      frameId = requestAnimationFrame(() => {
        displayValueRef.current = value;
        setDisplayValue(value);
      });

      return () => cancelAnimationFrame(frameId);
    }

    const start = displayValueRef.current;
    const difference = value - start;
    const startTime = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - startTime) / durationMs, 1);
      const nextValue = start + difference * progress;
      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [durationMs, value]);

  return <span>{formatter(displayValue)}</span>;
}
