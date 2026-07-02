"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SORTS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const activeSizes = searchParams.get("sizes")?.split(",") ?? [];

  function toggleSize(size: string) {
    const next = activeSizes.includes(size)
      ? activeSizes.filter((s) => s !== size)
      : [...activeSizes, size];
    setParam("sizes", next.length ? next.join(",") : null);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Sort By</p>
        <select
          defaultValue={searchParams.get("sort") ?? "newest"}
          onChange={(e) => setParam("sort", e.target.value)}
          className="w-full border border-line bg-transparent px-3 py-2 text-sm"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="eyebrow mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-9 w-9 border text-xs transition-colors ${
                activeSizes.includes(size)
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-line hover:border-charcoal"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
