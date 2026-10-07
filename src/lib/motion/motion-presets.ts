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

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const springSoft = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.9,
} as const;
export const springSnappy = { type: "spring", stiffness: 420, damping: 26 } as const;

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: easeOutExpo },
  },
};

export const flipUp: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: -35, scale: 0.92, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { ...springSoft },
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 14 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { ...springSnappy } },
};

export const cascade = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const inViewOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
