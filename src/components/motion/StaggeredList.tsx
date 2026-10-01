"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/motion/motion-presets";

export function StaggeredList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
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
      variants={staggerContainer}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <m.div key={index} variants={fadeUp}>
              {child}
            </m.div>
          ))
        : children}
    </m.div>
  );
}
