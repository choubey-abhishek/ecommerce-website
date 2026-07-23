"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-[13px] uppercase tracking-widest transition-colors duration-300 ease-studio disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white hover:bg-charcoal",
        secondary: "bg-clay-100 text-ink hover:bg-clay-200",
        outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
        ghost: "text-ink/70 hover:text-ink",
        link: "text-ink underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-full px-4 text-[11px]",
        md: "h-12 rounded-full px-7",
        lg: "h-14 rounded-full px-9 text-sm",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Motion-aware Slot so `asChild` still works when the magnetic effect is
// active — Radix's Slot forwards refs/props onto its single child, and
// Framer Motion can wrap any ref-forwarding component this way.
const MotionSlot = motion(Slot);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Subtle cursor-follow effect for hero/primary CTAs. Off by default. */
  magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, magnetic = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const prefersReducedMotion = usePrefersReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
    const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
      y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    if (!magnetic || prefersReducedMotion) {
      return (
        <Comp
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    const MagneticComp = asChild ? MotionSlot : motion.button;

    return (
      <MagneticComp
        ref={ref}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(buttonVariants({ variant, size, className }))}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </MagneticComp>
    );
  }
);
Button.displayName = "Button";

export { Button };
