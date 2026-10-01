import type { Variants } from "framer-motion";

export const motionDurations = {
  fast: 0.18,
  base: 0.28,
  slow: 0.44,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.slow, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: motionDurations.base, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideIn: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: motionDurations.slow, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

export const hoverLift = {
  y: -6,
  scale: 1.01,
  transition: { duration: motionDurations.base, ease: [0.22, 1, 0.36, 1] },
} as const;

export const softPulse: Variants = {
  initial: { scale: 1, opacity: 0.75 },
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.75, 1, 0.75],
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  },
};

export const drawerSlide: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: motionDurations.base, ease: [0.22, 1, 0.36, 1] },
  },
};

export const modalScale: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: motionDurations.base, ease: [0.22, 1, 0.36, 1] },
  },
};

export const productCardHover = {
  y: -8,
  boxShadow: "0 30px 90px rgb(79 70 229 / 0.18)",
  transition: { duration: motionDurations.base, ease: [0.22, 1, 0.36, 1] },
} as const;

export const aiOrbPulse: Variants = {
  initial: { boxShadow: "0 0 0 0 rgb(34 211 238 / 0.55)" },
  animate: {
    boxShadow: [
      "0 0 0 0 rgb(34 211 238 / 0.55)",
      "0 0 0 18px rgb(34 211 238 / 0)",
      "0 0 0 0 rgb(34 211 238 / 0)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeOut" },
  },
};
