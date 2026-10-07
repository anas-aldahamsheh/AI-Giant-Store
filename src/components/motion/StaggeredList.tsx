"use client";

import { AnimatePresence, m } from "framer-motion";
import { Children, isValidElement, type ReactNode } from "react";
import { easeOutExpo } from "@/lib/motion/motion-presets";

/**
 * Grid/list wrapper: items cascade in with depth the first time, and when the
 * list changes (filters, sorting) they glide to their new places while removed
 * items fold away and new ones bloom in.
 */
export function StaggeredList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const items = Children.toArray(children);

  return (
    <m.div data-fx-manual className={className} style={{ perspective: 1400 }}>
      <AnimatePresence mode="popLayout" initial>
        {items.map((child, index) => (
          <m.div
            key={isValidElement(child) && child.key != null ? child.key : index}
            layout
            initial={{
              opacity: 0,
              y: 60,
              rotateX: -22,
              scale: 0.92,
              filter: "blur(10px)",
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            exit={{
              opacity: 0,
              scale: 0.85,
              filter: "blur(8px)",
              transition: { duration: 0.3 },
            }}
            transition={{
              layout: { type: "spring", stiffness: 260, damping: 30 },
              default: {
                duration: 0.9,
                ease: easeOutExpo,
                delay: Math.min(index % 6, 5) * 0.07,
              },
            }}
          >
            {child}
          </m.div>
        ))}
      </AnimatePresence>
    </m.div>
  );
}
