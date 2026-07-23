/**
 * Shared placeholder grid for the shop results area — used both as the
 * `<Suspense>` fallback inside app/shop/page.tsx (while the client-side
 * filter UI hydrates) and, via app/shop/loading.tsx, as the route-level
 * fallback Next shows while navigating to /shop. One definition avoids
 * two grids quietly drifting out of sync.
 */
export function ShopResultsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[4/5] rounded-3xl" />
          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="skeleton h-4 w-2/3 rounded-full" />
              <div className="skeleton mt-2 h-3 w-1/3 rounded-full" />
            </div>
            <div className="skeleton h-4 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
