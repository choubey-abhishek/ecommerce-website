import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import HomeFeatured from "@/components/HomeFeatured";
import { BestSellers } from "@/components/home/best-sellers";
import HomeAboutTeaser from "@/components/HomeAboutTeaser";
import { StudioStory } from "@/components/home/studio-story";
import { FeaturedExhibition } from "@/components/home/featured-exhibition";
import { ShopByCollection } from "@/components/home/shop-by-collection";

// Below-the-fold sections: still server-rendered (so content, SEO, and
// no-JS visibility are unaffected — `ssr: false` is deliberately NOT set
// here) but split into their own client chunks instead of the shared
// homepage bundle, since a first-time visitor's browser has to parse the
// carousel, RHF+Zod, and Instagram-grid code before they're likely to
// have scrolled anywhere near them.
const Testimonials = dynamic(() =>
  import("@/components/home/testimonials").then((mod) => mod.Testimonials)
);
const InstagramFeed = dynamic(() =>
  import("@/components/home/instagram-feed").then((mod) => mod.InstagramFeed)
);
const NewsletterSignup = dynamic(() =>
  import("@/components/home/newsletter-signup").then((mod) => mod.NewsletterSignup)
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeFeatured />
      <BestSellers />
      <HomeAboutTeaser />
      <StudioStory />
      <FeaturedExhibition />
      <ShopByCollection />
      <Testimonials />
      <InstagramFeed />
      <NewsletterSignup />
    </>
  );
}
