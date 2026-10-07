"use client";

import { m } from "framer-motion";
import { useEffect, type ReactNode } from "react";

let hasNavigated = false;

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Runs on every route change: a dark brand curtain lifts off the new page
 * while the page itself rises into place. The very first load skips the
 * curtain so the store appears immediately.
 */
export default function Template({ children }: { children: ReactNode }) {
  const isFirstLoad = !hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <>
      {isFirstLoad ? null : (
        <m.div
          aria-hidden="true"
          className="fx-curtain grid place-items-center"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
        >
          <m.span
            className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-600 via-violet-500 to-cyan-400 text-xl font-black text-white shadow-glow"
            initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
            animate={{
              scale: [0.6, 1.1, 0.4],
              rotate: [-90, 0, 90],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 0.75, times: [0, 0.4, 1], ease: "easeInOut" }}
          >
            GS
          </m.span>
        </m.div>
      )}
      <m.div
        initial={
          isFirstLoad
            ? false
            : { opacity: 0, y: 60, scale: 0.985, filter: "blur(10px)" }
        }
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transitionEnd: { filter: "none", transform: "none" },
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        {children}
      </m.div>
    </>
  );
}
