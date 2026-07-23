"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils";
import { EASE_STUDIO } from "@/animations/variants";
import { isClerkConfigured } from "@/lib/auth-config";

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer on route change so it never "sticks open".
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Anchor links (e.g. /#contact, /about#exhibitions) never claim the
  // "current page" state — this avoids two items highlighting at once and
  // lets Contact/Exhibitions coexist with their base route.
  const isActive = (href: string, isAnchor?: boolean) => {
    if (isAnchor) return false;
    const base = href.split("#")[0];
    if (base === "" || base === "/") return pathname === "/";
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_STUDIO }}
      className="fixed top-9 inset-x-0 z-50 flex justify-center px-4 pt-3 sm:pt-4"
    >
      <a
        href="#main-content"
        className="sr-only-focusable fixed left-4 top-12 z-[100] rounded-full bg-ink px-4 py-2 font-sans text-xs uppercase tracking-widest text-white"
      >
       
      </a>

      <nav
        aria-label="Primary"
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-3.5 transition-all duration-700 ease-studio sm:px-8",
          scrolled ? "glass shadow-soft" : "border border-transparent bg-transparent shadow-none"
        )}
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-serif text-lg tracking-tight text-ink"
          aria-label={`${siteConfig.name} — Home`}
        >
          <Image
            src="/logo.png"
            alt=""
            width={200}
            height={56}
            aria-hidden="true"
            className="h-11 w-auto object-contain transition-transform duration-500 ease-studio group-hover:scale-[1.03] sm:h-12"
            priority
          />
          <span className="sr-only">{siteConfig.name}</span>
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {siteConfig.nav.map((link) => {
            const active = isActive(link.href, link.isAnchor);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "link-underline font-sans text-[13px] uppercase tracking-wide transition-colors duration-300",
                    active ? "text-ink" : "text-ink/70 hover:text-ink"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {isClerkConfigured ? (
            <>
              <SignedIn>
                <div className="flex h-11 w-11 items-center justify-center">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{ elements: { userButtonAvatarBox: "h-7 w-7" } }}
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  aria-label="Sign in"
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-clay-50"
                >
                  <User className="h-[18px] w-[18px] text-ink" strokeWidth={1.5} />
                </Link>
              </SignedOut>
            </>
          ) : (
            <Link
              href="/sign-in"
              aria-label="Sign in"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-clay-50"
            >
              <User className="h-[18px] w-[18px] text-ink" strokeWidth={1.5} />
            </Link>
          )}

          <button
            aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            onClick={openCart}
            className="relative flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-clay-50"
          >
            <ShoppingBag className="h-[18px] w-[18px] text-ink" strokeWidth={1.5} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                aria-label="Open menu"
                className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-clay-50 md:hidden"
              >
                <Menu className="h-[18px] w-[18px] text-ink" strokeWidth={1.5} />
              </button>
            </Dialog.Trigger>

            <AnimatePresence>
              {mobileOpen && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay forceMount asChild>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fixed inset-0 z-[90] bg-ink/20 backdrop-blur-sm md:hidden"
                    />
                  </Dialog.Overlay>
                  <Dialog.Content forceMount asChild>
                    <motion.div
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: EASE_STUDIO }}
                      className="glass fixed left-4 right-4 top-28 z-[95] rounded-3xl p-6 shadow-glass md:hidden"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <Dialog.Title className="font-serif text-base text-ink">
                          Menu
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <button
                            aria-label="Close menu"
                            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand-100"
                          >
                            <X className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </Dialog.Close>
                      </div>
                      <ul className="flex flex-col gap-1">
                        {siteConfig.nav.map((link) => {
                          const active = isActive(link.href, link.isAnchor);
                          return (
                            <li key={link.href}>
                              <Dialog.Close asChild>
                                <Link
                                  href={link.href}
                                  aria-current={active ? "page" : undefined}
                                  className={cn(
                                    "-mx-2 flex items-center justify-between rounded-2xl px-2 py-3 font-sans text-sm uppercase tracking-wide transition-colors",
                                    active
                                      ? "bg-sand-100 text-ink"
                                      : "text-ink/80 hover:bg-sand-50 hover:text-ink"
                                  )}
                                >
                                  {link.label}
                                </Link>
                              </Dialog.Close>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </nav>
    </motion.header>
  );
}
