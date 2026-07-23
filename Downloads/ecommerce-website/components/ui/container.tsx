import * as React from "react";
import { cn } from "@/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  /** Narrower max-width for long-form reading content (bios, journal posts). */
  narrow?: boolean;
}

/**
 * Consistent max-width + gutter wrapper used by every section on the
 * site. Centralizing this in one component (instead of repeating
 * `mx-auto max-w-6xl px-6 sm:px-10` everywhere) means the editorial
 * grid can be widened or tightened site-wide from a single place.
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Tag = "div", narrow = false, className, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          "mx-auto w-full px-6 sm:px-10",
          narrow ? "max-w-3xl" : "max-w-6xl",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Container.displayName = "Container";
