import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { AddressBook } from "@/components/account/address-book";

export const metadata: Metadata = buildMetadata({
  title: "Addresses",
  path: "/account/addresses",
  noIndex: true,
});

export default function AddressesPage() {
  return <AddressBook />;
}
