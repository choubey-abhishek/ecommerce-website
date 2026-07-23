export type ProductCategory = "Vessels" | "Sculptural" | "Tableware" | "Vases";

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc";

export type Product = {
  id: string;
  slug: string;
  title: string;
  dimensions: string;
  price: number;
  currency: string;
  /** Short description used in grids, cards, and meta descriptions. */
  description: string;
  /** Longer narrative for the product page's "The Story" section. */
  story: string;
  material: string;
  weight: string;
  /** Primary image (grids/cards) followed by supplementary gallery views. */
  image: string;
  images: string[];
  category: ProductCategory;
  sold?: boolean;
  /** Surfaced in the "Best Sellers" home page rail. */
  bestSeller?: boolean;
  /** Surfaced in the "Featured Collection" home page rail. */
  featured?: boolean;
  /** ISO date the piece was listed — powers the "Newest" sort. */
  createdAt: string;
};

export interface ProductQuery {
  category?: ProductCategory | "All";
  search?: string;
  sort?: ProductSort;
  minPrice?: number;
  maxPrice?: number;
  /** "all" (default) includes sold pieces; "available" hides them. */
  availability?: "all" | "available";
}

// NOTE: Replace `image`/`images` paths with real, high-resolution
// photography of Kopal's work before launch. Drop files into
// /public/artwork and point each product at its files
// (e.g. "/artwork/piece-01-main.jpg", "/artwork/piece-01-detail.jpg").
// The two "detail-*.svg" placeholders are intentionally shared across
// every product for now — real photography should give each piece its
// own 3+ unique angles.
// Product galleries reference real photography uploaded to /public.
// Each product lists a primary image followed by additional gallery views.

export const products: Product[] = [
  {
    id: "p1",
    slug: "amber-horizon-vessel",
    title: "Amber Horizon Vessel",
    dimensions: '12" x 12" x 14"',
    price: 480,
    currency: "USD",
    description:
      "A hand-built stoneware vessel finished in a warm amber glaze, evoking sedimentary layers formed over time.",
    story:
      "Amber Horizon began as a study in slab-building — layering coils of stoneware clay by hand and letting each one settle slightly before adding the next, so the finished form keeps a record of its own construction. The amber glaze is applied in three passes and fired in a reduction kiln, which pulls warmer, smokier tones out of the same glaze recipe that reads brighter in an electric kiln.",
    material: "Stoneware clay, amber reduction glaze",
    weight: "4.2 kg (9.3 lb)",
    image: "/1.avif",
    images: ["/1.avif", "/2.avif", "/3.avif"],
    category: "Vessels",
    featured: true,
    bestSeller: true,
    createdAt: "2026-05-12",
  },
  {
    id: "p2",
    slug: "quiet-fold-sculpture",
    title: "Quiet Fold",
    dimensions: '9" x 7" x 15"',
    price: 620,
    currency: "USD",
    description:
      "A sculptural study in negative space and gesture, coil-built and left in a matte unglazed finish.",
    story:
      "Quiet Fold is coil-built from a dark stoneware body and left largely unglazed, so the surface keeps the texture of the maker's hands rather than a glossy finish. The piece explores a single folding gesture repeated at different scales — the kind of form that reads differently depending on the angle it's viewed from.",
    material: "Dark stoneware, unglazed with a matte sealant",
    weight: "3.6 kg (7.9 lb)",
    image: "/4.avif",
    images: ["/4.avif", "/5.avif", "/6.avif"],
    category: "Sculptural",
    featured: true,
    createdAt: "2026-04-02",
  },
  {
    id: "p3",
    slug: "sage-bloom-vase",
    title: "Sage Bloom Vase",
    dimensions: '6" x 6" x 11"',
    price: 260,
    currency: "USD",
    description:
      "A soft, hand-thrown vase in a muted sage glaze with a subtly textured surface.",
    story:
      "Thrown on the wheel in a single sitting, Sage Bloom is glazed with a matte celadon-adjacent recipe that breaks slightly at the rim, showing a touch of the clay body underneath. It's sized for a single stem or a small gathered bunch — built to be used, not just displayed.",
    material: "Stoneware clay, matte sage glaze",
    weight: "1.4 kg (3.1 lb)",
    image: "/7.avif",
    images: ["/7.avif", "/8.avif", "/9.avif"],
    category: "Vases",
    featured: true,
    bestSeller: true,
    createdAt: "2026-06-20",
  },
  {
    id: "p4",
    slug: "terra-plate-set",
    title: "Terra Plate Set",
    dimensions: '10.5" diameter (set of 4)',
    price: 340,
    currency: "USD",
    description:
      "Four hand-thrown dinner plates in warm terracotta tones, food-safe and dishwasher friendly.",
    story:
      "Each plate in this set of four is thrown individually, so no two are perfectly identical in glaze pooling or rim shape — a deliberate contrast to factory-made tableware. Designed for daily use: microwave- and dishwasher-safe, and durable enough for a family table.",
    material: "Food-safe stoneware, terracotta glaze",
    weight: "0.6 kg (1.3 lb) each, 2.4 kg (5.3 lb) set",
    image: "/10.avif",
    images: ["/10.avif", "/11.avif", "/12.avif"],
    category: "Tableware",
    featured: true,
    createdAt: "2026-03-18",
  },
  {
    id: "p5",
    slug: "monolith-study-no-3",
    title: "Monolith Study No. 3",
    dimensions: '8" x 8" x 22"',
    price: 890,
    currency: "USD",
    description:
      "Part of an ongoing series exploring verticality and erosion, finished with a chalky white slip.",
    story:
      "The third in an ongoing series, this piece is built in sections and joined leather-hard, then finished with a chalky white slip that's sanded back after firing to expose the clay body at the high points — mimicking the way stone erodes unevenly over time.",
    material: "Stoneware clay, white slip, sanded finish",
    weight: "6.8 kg (15 lb)",
    image: "/13.avif",
    images: ["/13.avif", "/14.avif", "/15.avif"],
    category: "Sculptural",
    sold: true,
    createdAt: "2026-01-09",
  },
  {
    id: "p6",
    slug: "clay-moon-bowl",
    title: "Clay Moon Bowl",
    dimensions: '14" x 14" x 5"',
    price: 310,
    currency: "USD",
    description:
      "A generous centerpiece bowl with a soft cratered texture reminiscent of a lunar surface.",
    story:
      "The cratered surface of this centerpiece bowl comes from pressing natural materials into the wet clay before bisque firing, then letting glaze pool unevenly across the resulting texture. Large enough to anchor a table on its own.",
    material: "Stoneware clay, pooled matte glaze",
    weight: "2.9 kg (6.4 lb)",
    image: "/16.avif",
    images: ["/16.avif", "/17.avif", "/18.avif"],
    category: "Vessels",
    bestSeller: true,
    createdAt: "2026-05-30",
  },
  {
    id: "p7",
    slug: "morning-mist-cups",
    title: "Morning Mist Cups",
    dimensions: '3.5" x 3.5" x 4" (set of 2)',
    price: 140,
    currency: "USD",
    description:
      "A pair of intimate drinking vessels glazed in a soft, milky celadon.",
    story:
      "A small, everyday pair made to be used together — for tea, coffee, or water at the bedside. The milky celadon glaze shifts from pale blue to warm white depending on the light.",
    material: "Food-safe stoneware, celadon glaze",
    weight: "0.3 kg (0.7 lb) each",
    image: "/19.avif",
    images: ["/19.avif", "/20.avif", "/21.avif"],
    category: "Tableware",
    createdAt: "2026-02-14",
  },
  {
    id: "p8",
    slug: "driftwood-vase",
    title: "Driftwood Vase",
    dimensions: '7" x 7" x 16"',
    price: 410,
    currency: "USD",
    description:
      "An elongated, hand-built vase with a weathered, driftwood-inspired surface treatment.",
    story:
      "Built in stages to reach its height without collapsing under its own weight, this vase's surface is worked with a rib tool while leather-hard to create a striated texture reminiscent of weathered driftwood, then finished with a dry, understated glaze that catches light along the ridges.",
    material: "Stoneware clay, dry matte glaze",
    weight: "3.1 kg (6.8 lb)",
    image: "/22.avif",
    images: ["/22.avif", "/23.avif", "/24.avif"],
    category: "Vases",
    bestSeller: true,
    createdAt: "2026-06-01",
  },
  // PLACEHOLDER product — generated so every uploaded image appears in the
  // shop (images 25–27 as a 3-angle gallery). Edit the title, price,
  // dimensions, category, and copy below to match the real piece, or add
  // more entries following this same shape.
  {
    id: "p9",
    slug: "ember-glaze-cup-set",
    title: "Ember Glaze Cup Set",
    dimensions: '3.5" x 3.5" x 4" (set of 4)',
    price: 180,
    currency: "USD",
    description:
      "A set of four wheel-thrown cups finished in a warm ember glaze that pools and breaks softly over the rims.",
    story:
      "Placeholder entry so every uploaded photo is represented in the shop. Update the title, price, dimensions, category, and this text in lib/products.ts to match the actual piece.",
    material: "Food-safe stoneware, ember glaze",
    weight: "0.3 kg (0.7 lb) each",
    image: "/25.avif",
    images: ["/25.avif", "/26.avif", "/27.avif"],
    category: "Tableware",
    createdAt: "2026-06-25",
  },

  // ===================================================================
  // Products built from the uploaded .jpg photography. These reference
  // the CLEAN filenames produced by `rename-product-images.ps1` — run
  // that script once so these images resolve. Titles, prices, and copy
  // are editable placeholders; adjust to match each real piece.
  // ===================================================================
  {
    id: "p10",
    slug: "studio-mugs",
    title: "Studio Mugs",
    dimensions: '3.5" x 3.5" x 4"',
    price: 45,
    currency: "USD",
    description:
      "Wheel-thrown mugs in small batches, each glazed by hand so no two are exactly alike.",
    story:
      "Placeholder copy — edit in lib/products.ts. A set of everyday mugs shown at the 400 Cups exhibition, thrown and glazed in the studio.",
    material: "Food-safe stoneware, mixed glazes",
    weight: "0.4 kg (0.9 lb)",
    image: "/mugs-1.jpg",
    images: ["/mugs-1.jpg", "/mugs-2.jpg", "/mugs-3.jpg", "/mugs-4.jpg", "/mugs-5.jpg", "/mugs-6.jpg"],
    category: "Tableware",
    bestSeller: true,
    createdAt: "2026-06-10",
  },
  {
    id: "p11",
    slug: "wheel-thrown-cups",
    title: "Wheel-Thrown Cups",
    dimensions: '3" x 3" x 3.5"',
    price: 38,
    currency: "USD",
    description:
      "A collection of small drinking cups with layered, reactive glazes.",
    story:
      "Placeholder copy — edit in lib/products.ts. Cups from the 400 Cups show, exploring glaze chemistry and everyday form.",
    material: "Food-safe stoneware, reactive glaze",
    weight: "0.3 kg (0.7 lb)",
    image: "/cups-1.jpg",
    images: ["/cups-1.jpg", "/cups-2.jpg", "/cups-3.jpg", "/cups-4.jpg"],
    category: "Tableware",
    featured: true,
    createdAt: "2026-06-08",
  },
  {
    id: "p12",
    slug: "midnight-dew-pots",
    title: "Midnight Dew Pots",
    dimensions: '6" x 6" x 8"',
    price: 240,
    currency: "USD",
    description:
      "A series of pots in black-beige with accents of gold, goopy dew-drop detailing.",
    story:
      "Placeholder copy — edit in lib/products.ts. The Midnight Dew series pairs a dark body with pooled gold accents that catch the light like dew.",
    material: "Stoneware, black-beige glaze, gold accents",
    weight: "1.6 kg (3.5 lb)",
    image: "/midnight-dew-1.jpg",
    images: ["/midnight-dew-1.jpg", "/midnight-dew-2.jpg"],
    category: "Vessels",
    featured: true,
    createdAt: "2026-05-28",
  },
  {
    id: "p13",
    slug: "tensions-and-harmonies",
    title: "Tensions & Harmonies",
    dimensions: '10" x 8" x 18"',
    price: 680,
    currency: "USD",
    description:
      "A sculptural work exploring the interplay of tensions and harmonies in contemporary form.",
    story:
      "Placeholder copy — edit in lib/products.ts. Part of an ongoing body of sculptural work on balance and contrast.",
    material: "Stoneware, mixed finishes",
    weight: "5.4 kg (11.9 lb)",
    image: "/tensions-1.jpg",
    images: ["/tensions-1.jpg", "/tensions-2.jpg"],
    category: "Sculptural",
    createdAt: "2026-04-20",
  },
  {
    id: "p14",
    slug: "blue-and-white-study",
    title: "Blue & White Study",
    dimensions: '7" x 7" x 9"',
    price: 280,
    currency: "USD",
    description:
      "A vessel inspired by traditional Chinese blue-and-white painting styles.",
    story:
      "Placeholder copy — edit in lib/products.ts. Hand-painted underglaze work venturing into classic blue-and-white motifs.",
    material: "Porcelain-stoneware, cobalt underglaze",
    weight: "1.4 kg (3.1 lb)",
    image: "/blue-white-1.jpg",
    images: ["/blue-white-1.jpg", "/blue-white-2.jpg"],
    category: "Vessels",
    createdAt: "2026-04-05",
  },
  {
    id: "p15",
    slug: "obscured-spaces",
    title: "Obscured Spaces",
    dimensions: '12" x 12" x 40"',
    price: 1200,
    currency: "USD",
    description:
      "A four-tier suspended sculpture exploring depth, layering, and negative space.",
    story:
      "Placeholder copy — edit in lib/products.ts. A suspended, multi-tier sculptural work about the interplay of concealment and reveal.",
    material: "Stoneware, suspension hardware",
    weight: "7.2 kg (15.9 lb)",
    image: "/obscured-spaces.jpg",
    images: ["/obscured-spaces.jpg"],
    category: "Sculptural",
    createdAt: "2026-03-30",
  },
  {
    id: "p16",
    slug: "reverie-totems",
    title: "Reverie Totems",
    dimensions: '5" x 5" x 14"',
    price: 540,
    currency: "USD",
    description:
      "Totem forms resembling spools of thread, narrating an intertwined history.",
    story:
      "Placeholder copy — edit in lib/products.ts. The Reverie series stacks spool-like forms into quiet vertical totems.",
    material: "Stoneware, matte glaze",
    weight: "3.0 kg (6.6 lb)",
    image: "/reverie-totems.jpg",
    images: ["/reverie-totems.jpg"],
    category: "Sculptural",
    createdAt: "2026-03-15",
  },
  {
    id: "p17",
    slug: "ceramic-tableware-set",
    title: "Ceramic Tableware Set",
    dimensions: "Assorted",
    price: 180,
    currency: "USD",
    description:
      "Hand-made ceramic tableware — a coordinated set for everyday use.",
    story:
      "Placeholder copy — edit in lib/products.ts. A tableware collection shown in Mumbai, made for daily rituals.",
    material: "Food-safe stoneware",
    weight: "2.5 kg (5.5 lb) set",
    image: "/tableware-set.jpg",
    images: ["/tableware-set.jpg"],
    category: "Tableware",
    createdAt: "2026-02-28",
  },
  {
    id: "p18",
    slug: "back-to-earth",
    title: "Back to Earth",
    dimensions: '9" x 9" x 12"',
    price: 760,
    currency: "USD",
    description:
      "A sculptural piece exhibited in the “Back to Earth” show in Mumbai.",
    story:
      "Placeholder copy — edit in lib/products.ts. Part of the Back to Earth exhibition, exploring material and origin.",
    material: "Stoneware, raw and glazed surfaces",
    weight: "4.6 kg (10.1 lb)",
    image: "/back-to-earth.jpg",
    images: ["/back-to-earth.jpg"],
    category: "Sculptural",
    createdAt: "2026-02-12",
  },
  {
    id: "p19",
    slug: "lidded-pots",
    title: "Lidded Pots",
    dimensions: '5" x 5" x 6"',
    price: 150,
    currency: "USD",
    description:
      "Thrown lidded pots with an unglazed, tactile stoneware surface.",
    story:
      "Placeholder copy — edit in lib/products.ts. A study in fit and proportion — lidded forms left largely unglazed.",
    material: "Stoneware, non-glazed practice finish",
    weight: "1.1 kg (2.4 lb)",
    image: "/lidded-pots.jpg",
    images: ["/lidded-pots.jpg"],
    category: "Vessels",
    createdAt: "2026-01-24",
  },
  {
    id: "p20",
    slug: "tumblers-and-jars",
    title: "Tumblers & Jars",
    dimensions: '3" x 3" x 5"',
    price: 60,
    currency: "USD",
    description:
      "Cylinder tumblers and jars in blue and brown reactive glazes.",
    story:
      "Placeholder copy — edit in lib/products.ts. Everyday cylinders exploring shrinkage and glaze movement.",
    material: "Food-safe stoneware, reactive glaze",
    weight: "0.5 kg (1.1 lb)",
    image: "/tumblers-jars.jpg",
    images: ["/tumblers-jars.jpg"],
    category: "Tableware",
    createdAt: "2026-01-15",
  },
  {
    id: "p21",
    slug: "bowl-and-dish",
    title: "Bowl & Dish",
    dimensions: '8" x 8" x 3"',
    price: 90,
    currency: "USD",
    description:
      "A bowl-and-dish pairing with a soft, reactive glaze finish.",
    story:
      "Placeholder copy — edit in lib/products.ts. A functional bowl and dish set, finished with a gentle reactive glaze.",
    material: "Food-safe stoneware, reactive glaze",
    weight: "0.9 kg (2.0 lb)",
    image: "/bowl-dish.jpg",
    images: ["/bowl-dish.jpg"],
    category: "Tableware",
    createdAt: "2026-01-06",
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Vessels",
  "Sculptural",
  "Vases",
  "Tableware",
];

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getBestSellers(limit = 4): Product[] {
  return products.filter((p) => p.bestSeller).slice(0, limit);
}

export function getProductsByCategory(category?: ProductCategory | "All"): Product[] {
  if (!category || category === "All") return products;
  return products.filter((p) => p.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Same-category pieces first (excluding the piece itself), topped up
 * with other featured/best-selling work if the category is thin — so
 * the "Recommended" rail on a product page is never empty or too short.
 */
export function getRecommendedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );

  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const fallback = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category !== product.category &&
      (p.featured || p.bestSeller)
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}

export const PRICE_BOUNDS = products.reduce(
  (bounds, p) => ({
    min: Math.min(bounds.min, p.price),
    max: Math.max(bounds.max, p.price),
  }),
  { min: Infinity, max: 0 }
);

/**
 * The single source of truth for turning a shop query (search, category,
 * price range, availability, sort) into a result list. Both the client
 * shop UI (`features/shop/use-shop-filters.ts`) and, later, a server
 * route or Server Action for a real database call this same function
 * signature — swapping the in-memory `products` array for a DB query is
 * then a one-file change instead of a rewrite of the filtering logic.
 */
export function queryProducts(query: ProductQuery = {}): Product[] {
  const {
    category = "All",
    search = "",
    sort = "featured",
    minPrice = PRICE_BOUNDS.min,
    maxPrice = PRICE_BOUNDS.max,
    availability = "all",
  } = query;

  const normalizedSearch = search.trim().toLowerCase();

  let results = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.title.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch);
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesAvailability = availability === "all" || !product.sold;

    return matchesCategory && matchesSearch && matchesPrice && matchesAvailability;
  });

  switch (sort) {
    case "price-asc":
      results = [...results].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results = [...results].sort((a, b) => b.price - a.price);
      break;
    case "newest":
      results = [...results].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "featured":
    default:
      // Keep curated catalog order (featured pieces were authored first).
      break;
  }

  return results;
}

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];
