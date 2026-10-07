"use client";

import { m, type Variants } from "framer-motion";
import { easeOutExpo, inViewOnce } from "@/lib/motion/motion-presets";

type SplitTextProps = {
  text: string;
  by?: "char" | "word";
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
};

const piece: Variants = {
  hidden: { opacity: 0, y: "0.9em", rotateX: -80, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easeOutExpo },
  },
};

/**
 * Splits a line into characters or words that rise and unfold into place.
 * Screen readers get the whole text once through aria-label.
 */
export function SplitText({
  text,
  by = "char",
  className,
  delay = 0,
  stagger,
  inView = false,
}: SplitTextProps) {
  const words = text.split(" ");
  const step = stagger ?? (by === "char" ? 0.035 : 0.07);
  const trigger = inView
    ? { initial: "hidden", whileInView: "visible", viewport: inViewOnce }
    : { initial: "hidden", animate: "visible" };

  return (
    <m.span
      aria-label={text}
      role="text"
      className={className}
      style={{ display: "inline-block", perspective: 800 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
      {...trigger}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          aria-hidden="true"
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {by === "char" ? (
            Array.from(word).map((char, charIndex) => (
              <m.span
                key={`${char}-${charIndex}`}
                variants={piece}
                style={{
                  display: "inline-block",
                  transformOrigin: "50% 100%",
                  willChange: "transform",
                }}
              >
                {char}
              </m.span>
            ))
          ) : (
            <m.span
              variants={piece}
              style={{ display: "inline-block", transformOrigin: "50% 100%" }}
            >
              {word}
            </m.span>
          )}
          {wordIndex < words.length - 1 ? " " : null}
        </span>
      ))}
    </m.span>
  );
}
