import { Container } from "@/components/ui/container";

export function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-28 pt-36 sm:pt-40">
      <Container narrow>
        <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
          Legal
        </p>
        <h1 className="mt-3 font-serif text-display-md text-ink">{title}</h1>
        <p className="mt-3 font-sans text-[13px] text-ink/40">
          Last updated {updated}
        </p>

        <div className="prose-legal mt-12 space-y-6 font-sans text-[15px] leading-relaxed text-ink/70 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-ink [&_h2]:first:mt-0 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </div>
  );
}
