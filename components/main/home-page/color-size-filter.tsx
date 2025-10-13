// components/sections/VariationFilter.tsx
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Color = { name: string; value: string }; // value = css color (e.g. "#E11D48")
type FilterValue = { colors: string[]; sizes: string[] };

type Props = {
  colors?: Color[];
  sizes?: string[];
  value?: FilterValue;
  onChange?: (v: FilterValue) => void;
  className?: string;
};

const DEFAULT_COLORS: Color[] = [
  { name: "Black", value: "#111827" },
  { name: "White", value: "#F9FAFB" },
  { name: "Red", value: "#E11D48" },
  { name: "Navy", value: "#1F2937" },
  { name: "Olive", value: "#4B5563" },
];

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function VariationFilter({
  colors = DEFAULT_COLORS,
  sizes = DEFAULT_SIZES,
  value,
  onChange,
  className = "",
}: Props) {
  const [selected, setSelected] = useState<FilterValue>({
    colors: value?.colors ?? [],
    sizes: value?.sizes ?? [],
  });

  useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  const toggleColor = (v: string) =>
    setSelected((s) => ({
      ...s,
      colors: s.colors.includes(v)
        ? s.colors.filter((c) => c !== v)
        : [...s.colors, v],
    }));

  const toggleSize = (v: string) =>
    setSelected((s) => ({
      ...s,
      sizes: s.sizes.includes(v)
        ? s.sizes.filter((c) => c !== v)
        : [...s.sizes, v],
    }));

  const clearAll = () => setSelected({ colors: [], sizes: [] });

  return (
    <div
      className={`rounded-2xl border border-rose-100 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filter</h3>
        {(selected.colors.length > 0 || selected.sizes.length > 0) && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 hover:text-rose-800"
            aria-label="Clear filters"
          >
            <X className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Colors */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Warna
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((c) => {
            const active = selected.colors.includes(c.value);
            return (
              <button
                key={c.value}
                onClick={() => toggleColor(c.value)}
                className={`relative grid h-9 w-9 place-content-center rounded-full ring-1 transition ${
                  active
                    ? "ring-rose-600 ring-2"
                    : "ring-gray-200 hover:ring-rose-300"
                }`}
                aria-pressed={active}
                aria-label={c.name}
                title={c.name}
              >
                <span
                  className="h-6 w-6 rounded-full"
                  style={{
                    backgroundColor: c.value,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="mt-4">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Ukuran
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = selected.sizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ring-1 transition ${
                  active
                    ? "bg-rose-600 text-white ring-rose-600"
                    : "bg-white text-gray-700 ring-gray-200 hover:ring-rose-300"
                }`}
                aria-pressed={active}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}