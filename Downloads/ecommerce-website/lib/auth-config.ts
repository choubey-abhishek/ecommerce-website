/**
 * Whether Clerk has real credentials configured. Checked in three
 * places — `middleware.ts`, `app/layout.tsx`, and every `/account`
 * page — so that running the app without a Clerk account (the default,
 * out-of-the-box state) degrades gracefully instead of crashing every
 * route. See `.env.local.example` for the two env vars this depends on.
 */
export const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

/**
 * Admin access is a plain email allowlist for now — there's no roles/
 * permissions table yet (that's Phase 9's job). Set a comma-separated
 * `ADMIN_EMAILS` in `.env.local`; anyone signed in with a matching email
 * can reach `/admin`. Everyone else, including other signed-in
 * customers, sees an access-restricted message rather than the
 * dashboard.
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export const clerkAppearance = {
  // Removes the corner "Development mode" badge Clerk shows on dev keys.
  layout: {
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    colorPrimary: "#111111",
    colorText: "#111111",
    colorTextSecondary: "#6b6b6b",
    colorBackground: "#ffffff",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-inter)",
  },
  elements: {
    card: "shadow-none border border-black/10",
    formButtonPrimary:
      "bg-ink hover:bg-charcoal text-white text-[13px] uppercase tracking-widest normal-case",
    footerActionLink: "text-ink hover:text-ink/70",
    // Hides the "Secured by Clerk" branding bar (the sign-in/up switch link
    // is `footerAction`, kept above this, so navigation is unaffected).
    footer: "hidden",
  },
};
