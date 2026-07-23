import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "About — Kopal Seth Studio",
  description:
    "Kopal Seth is a contemporary ceramic artist with an MFA from RISD, formerly a resident artist at The Clay Studio, Philadelphia.",
};

export default function AboutPage() {
  return <AboutSection />;
}
