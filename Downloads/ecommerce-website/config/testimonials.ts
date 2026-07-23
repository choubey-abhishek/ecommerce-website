/**
 * SAMPLE CONTENT — replace before launch.
 *
 * These are placeholder collector quotes standing in for real
 * testimonials, exactly the way `public/artwork/*.svg` stands in for
 * real photography. Do not ship to production without swapping in
 * genuine, permissioned quotes from actual collectors or galleries.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "The piece arrived even more striking in person — the glaze has a depth that photos just don't capture. It's the first thing guests ask about.",
    name: "Sample Collector",
    role: "Private Collector, New York",
  },
  {
    quote:
      "We source ceramics for a number of boutique hotel projects, and Kopal's vessels have a warmth and restraint that fits almost any interior.",
    name: "Sample Designer",
    role: "Interior Designer",
  },
  {
    quote:
      "Every piece feels considered. You can tell the work comes from real technical skill, not just aesthetics.",
    name: "Sample Curator",
    role: "Gallery Contact",
  },
];
