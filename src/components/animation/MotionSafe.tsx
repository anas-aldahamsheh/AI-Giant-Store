"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export type MotionSafeProps = {
  children: (canAnimate: boolean) => ReactNode;
};

export function MotionSafe({ children }: MotionSafeProps) {
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanAnimate(!mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return children(canAnimate);
}
