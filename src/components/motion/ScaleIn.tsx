"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { scaleIn } from "@/lib/motion/motion-presets";

export function ScaleIn({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = false;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <m.div
      className={className}
      initial={mounted && reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true }}
      variants={scaleIn}
    >
      {children}
    </m.div>
  );
}
