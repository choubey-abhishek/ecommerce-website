import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 p-5">
      <div className="flex items-center justify-between">
        <p className="font-sans text-xs uppercase tracking-widest text-ink/50">{label}</p>
        {icon}
      </div>
      <p className="mt-3 font-serif text-3xl font-light text-ink">{value}</p>
      {hint && <p className="mt-1 font-sans text-[12px] text-ink/40">{hint}</p>}
    </div>
  );
}
