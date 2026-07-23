"use client";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Slim premium announcement bar that sits above the floating navbar.
 * Uses a seamless CSS marquee (the `marquee` keyframe already defined in
 * tailwind.config) so the messages glide continuously. Respects reduced
 * motion by falling back to a static, centered message.
 *
 * Purely presentational — no state, no storage — so it's safe to mount
 * globally in the layout without affecting any page's behavior.
 */
const MESSAGES = [
  "Complimentary shipping on orders over $300",
  "Each piece hand-built to order in the studio",
  "Certificate of authenticity with every work",
  "Ships worldwide from India",
];

export function AnnouncementBar() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-9 overflow-hidden bg-ink text-white">
      <div className="flex h-full items-center">
        {prefersReducedMotion ? (
          <p className="w-full text-center font-sans text-[11px] uppercase tracking-[0.2em] text-white/85">
            {MESSAGES[0]}
          </p>
        ) : (
          <div className="flex min-w-full shrink-0 animate-marquee items-center whitespace-nowrap will-change-transform">
            {/* Rendered twice so the -50% translate loops seamlessly. */}
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
                {MESSAGES.map((message) => (
                  <span
                    key={`${copy}-${message}`}
                    className="flex items-center font-sans text-[11px] uppercase tracking-[0.2em] text-white/85"
                  >
                    {message}
                    <span className="mx-6 text-clay-400" aria-hidden="true">
                      &bull;
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
