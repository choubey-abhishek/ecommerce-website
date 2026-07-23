import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
}

/** A minimal, consistent table shell every admin list page renders through. */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "Nothing here yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 py-16 text-center font-sans text-[14px] text-ink/50">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10">
      <table className="w-full min-w-[600px] border-collapse font-sans text-[14px]">
        <thead>
          <tr className="border-b border-ink/10 bg-sand-50">
            {columns.map((col) => (
              <th
                key={col.header}
                className={`px-4 py-3 text-xs uppercase tracking-widest text-ink/50 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-b border-ink/5 last:border-0">
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-4 py-3 text-ink/75 ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
