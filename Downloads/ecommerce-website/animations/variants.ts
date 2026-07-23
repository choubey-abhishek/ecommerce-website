import type { Variants } from "framer-motion";

/**
 * Centralized Framer Motion variants. Every scroll-reveal, stagger, and
 * page transition in the app should import from here instead of
 * redefining `{opacity: 0, y: 24}` inline — keeps the motion language
 * consistent (same easing curve, same durations) across every feature,
 * and means a single tweak here updates the whole site's "feel".
 */

export const EASE_STUDIO = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE_STUDIO },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, delay: i * 0.06, ease: EASE_STUDIO },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE_STUDIO } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/** Word-by-word reveal for hero/section headlines. */
export const textReveal: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.05, ease: EASE_STUDIO },
  }),
};

/** Route-level page transition (used by PageTransition). */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STUDIO } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.35, ease: EASE_STUDIO } },
};
