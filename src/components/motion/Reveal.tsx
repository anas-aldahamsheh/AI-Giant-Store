"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { fadeUp } from "@/lib/motion/motion-presets";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
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
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      {children}
    </m.div>
  );
}
