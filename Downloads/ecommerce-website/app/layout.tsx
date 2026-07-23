import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { buildMetadata, buildOrganizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { isClerkConfigured, clerkAppearance } from "@/lib/auth-config";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import PageTransition from "@/components/PageTransition";
import { WebVitals } from "@/components/WebVitals";

// The drawer is invisible until a piece is added to the bag, so it's
// excluded from server rendering and the initial client bundle entirely —
// it loads in the background right after hydration instead of blocking it.
// (AnimatePresence itself would render `null` either way; this skips
// shipping and hydrating its code on every single page load.)
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });

// Floating contact assistant — loaded after hydration and kept out of the
// initial bundle since it's not needed for first paint on any page.
const ContactChatbot = dynamic(() => import("@/components/chatbot/contact-chatbot"), {
  ssr: false,
});

export const metadata: Metadata = {
  ...buildMetadata({}),
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

/**
 * Only mounts ClerkProvider when real keys exist. Without this guard,
 * Clerk throws the moment it renders without a publishable key — which
 * would break every page on the site, not just the auth-related ones,
 * for anyone running the project before setting up `.env.local`.
 */
function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured) return <>{children}</>;
  return <ClerkProvider appearance={clerkAppearance}>{children}</ClerkProvider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = buildOrganizationJsonLd();

  return (
    <AuthProvider>
      <html lang="en" className={fontVariables}>
        <body className="bg-paper font-sans text-ink antialiased">
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <WebVitals />
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <PageTransition>
                <main id="main-content" className="min-h-screen">
                  {children}
                </main>
              </PageTransition>
              <Footer />
              <CartDrawer />
              <ContactChatbot />
            </WishlistProvider>
          </CartProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
