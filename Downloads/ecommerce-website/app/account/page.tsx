import type { Metadata } from "next";
import { UserProfile } from "@clerk/nextjs";
import { buildMetadata } from "@/lib/seo";
import { clerkAppearance } from "@/lib/auth-config";

export const metadata: Metadata = buildMetadata({
  title: "Your Account",
  path: "/account",
  noIndex: true,
});

export default function AccountPage() {
  return (
    <UserProfile
      routing="hash"
      appearance={{
        ...clerkAppearance,
        elements: {
          ...clerkAppearance.elements,
          rootBox: "w-full",
          card: "shadow-none border border-black/10 w-full",
        },
      }}
    />
  );
}
