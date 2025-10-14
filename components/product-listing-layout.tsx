"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search as SearchIcon,
  Filter,
  X,
  Star,
  Heart,
  Truck,
  ShieldCheck,
  ArrowRight,
  Share2,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterBlocks from "@/components/ui/block-filter";
import Pagination from "@/components/ui/pagination";

/* ---------- Types ---------- */
export type ListingProduct = {
  id: string;
  name: string;
  price: number;
  was?: number;
  image?: string;
  images?: string[];
  href: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  sku?: string;
  category?: string;
  featured?: boolean;
  tags?: string[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  desc: string;
};

type Chip = { label: string; slug: string }; // slug bisa 'low-stock' | 'newest' | kategori biasa

type SortKey =
  | "terendah"
  | "tertinggi"
  | "terlaris"
  | "terbaru"
  | "diskon-terbesar";

/* ---------- Const ---------- */
const DEF_COLORS = [
  { name: "Maroon", hex: "#7f1d1d" },
  { name: "Hitam", hex: "#111827" },
  { name: "Putih", hex: "#F9FAFB" },
  { name: "Navy", hex: "#1f2937" },
];
const DEF_SIZES = ["S", "M", "L", "XL", "XXL"];
const PAGE_SIZE_DEFAULT = 10;
const LOW_STOCK_AT_DEFAULT = 5;
const IMG_FALLBACK =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

const CURRENCY = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

function StarRating({ value = 0 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${
              filled ? "fill-amber-400" : "fill-transparent"
            }`}
          />
        );
      })}
    </div>
  );
}

const formatDate = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

const etaRange = () => {
  const a = new Date();
  const b = new Date();
  a.setDate(a.getDate() + 2);
  b.setDate(b.getDate() + 5);
  return `${formatDate(a)} – ${formatDate(b)}`;
};

/* ---------- Layout Component ---------- */
export default function ProductListingLayout({
  title,
  subtitle,
  products,
  chips,
  pageSize = PAGE_SIZE_DEFAULT,
  lowStockAt = LOW_STOCK_AT_DEFAULT,
  defaultSort = "terendah",
}: {
  title: string;
  subtitle: string;
  products: ListingProduct[];
  chips: Chip[]; // kategori chips pada scroller (boleh 'low-stock' & 'newest')
  pageSize?: number;
  lowStockAt?: number;
  defaultSort?: SortKey;
}) {
  // filters/state
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [priceRange, setPriceRange] = useState<
    "lt310" | "310to570" | "570to830" | "gte830" | null
  >(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // pagination
  const [page, setPage] = useState(1);

  // modal
  const [active, setActive] = useState<ListingProduct | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // compute filtered + sorted
  const list = useMemo(() => {
    let data = products.slice();

    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // chip filtering
    if (chip) {
      if (chip === "low-stock") {
        data = data.filter(
          (p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= lowStockAt
        );
      } else if (chip === "newest") {
        // gunakan tag 'terbaru' jika ada, fallback: id terbesar
        const byTag = data.filter((p) =>
          p.tags?.some((t) => t.toLowerCase() === "terbaru")
        );
        data = byTag.length
          ? byTag
          : data.sort((a, b) => Number(b.id) - Number(a.id)).slice(0);
      } else {
        // kategori biasa
        data = data.filter((p) => p.category === chip);
      }
    }

    if (inStockOnly) data = data.filter((p) => (p.stock ?? 0) > 0);
    if (featuredOnly) data = data.filter((p) => p.featured);
    if (onlyDiscount) data = data.filter((p) => (p.was ?? p.price) > p.price);

    if (priceRange) {
      data = data.filter((p) => {
        const price = p.price;
        switch (priceRange) {
          case "lt310":
            return price < 310_000;
          case "310to570":
            return price >= 310_000 && price < 570_000;
          case "570to830":
            return price >= 570_000 && price < 830_000;
          case "gte830":
            return price >= 830_000;
          default:
            return true;
        }
      });
    }

    // sorting
    data.sort((a, b) => {
      if (sort === "terendah") return a.price - b.price;
      if (sort === "tertinggi") return b.price - a.price;
      if (sort === "diskon-terbesar") {
        const da = ((a.was ?? a.price) - a.price) / (a.was ?? a.price);
        const db = ((b.was ?? b.price) - b.price) / (b.was ?? b.price);
        return db - da;
      }
      if (sort === "terlaris") return (b.reviews ?? 0) - (a.reviews ?? 0);
      // terbaru: id lebih besar = lebih baru (fallback jika tidak menggunakan tag)
      return Number(b.id) - Number(a.id);
    });

    return data;
  }, [
    products,
    query,
    chip,
    inStockOnly,
    featuredOnly,
    onlyDiscount,
    priceRange,
    sort,
    lowStockAt,
  ]);

  // reset page saat filter berubah
  useEffect(() => {
    setPage(1);
  }, [query, chip, inStockOnly, featuredOnly, onlyDiscount, priceRange, sort]);

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const startIdx = list.length ? (page - 1) * pageSize + 1 : 0;
  const endIdx = Math.min(page * pageSize, list.length);
  const pageItems = useMemo(
    () => list.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
    [list, page, pageSize]
  );

  /* ===== Modal helpers ===== */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        if (e.shiftKey && activeEl === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && activeEl === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (active) {
      document.documentElement.style.overflow = "hidden";
      setActiveImg(0);
      setColor(active.colors?.[0]?.name ?? DEF_COLORS[0].name);
      setSize(active.sizes?.[0] ?? DEF_SIZES[0]);
      setQty(1);
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [active]);

  const total = useMemo(() => (active ? active.price * qty : 0), [active, qty]);

  /* ===== UI ===== */
  return (
    <main className="pb-16">
      {/* Top bar */}
      <div className="border-b bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                {title}
              </h1>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>

            {/* Search + filter btn (mobile) */}
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="group flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm ring-1 ring-transparent transition focus-within:ring-rose-400/40 md:w-80">
                <SearchIcon className="h-4 w-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari produk, kategori, atau merek…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  aria-label="Cari"
                />
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 md:hidden"
              >
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category chips scroller */}
      {chips?.length > 0 && (
        <div className="border-b bg-gradient-to-b from-rose-50 to-white">
          <div className="container mx-auto max-w-7xl px-4 py-4">
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-rose-50 to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-rose-50 to-transparent" />
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
                {chips.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() =>
                      setChip((prev) => (prev === c.slug ? null : c.slug))
                    }
                    className={`group inline-flex snap-start items-center gap-2 rounded-2xl border px-3 py-2 text-sm shadow-sm transition ${
                      chip === c.slug
                        ? "border-rose-600 bg-rose-600 text-white"
                        : "border-rose-100 bg-white text-gray-700 hover:border-rose-300"
                    }`}
                    aria-pressed={chip === c.slug}
                  >
                    <span className="relative inline-block h-6 w-6 overflow-hidden rounded-full ring-1 ring-rose-200">
                      <img
                        src={IMG_FALLBACK}
                        alt={c.label}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[260px_1fr]">
          {/* Sidebar filter (desktop) */}
          <aside className="hidden rounded-2xl border border-rose-100 bg-white p-4 shadow-sm md:block">
            <FilterBlocks
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              featuredOnly={featuredOnly}
              setFeaturedOnly={setFeaturedOnly}
              onlyDiscount={onlyDiscount}
              setOnlyDiscount={setOnlyDiscount}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </aside>

          {/* Right: header controls + grid */}
          <section>
            {/* Sort row */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Menampilkan{" "}
                <strong>
                  {startIdx}-{endIdx}
                </strong>{" "}
                dari <strong>{list.length}</strong> produk
                {chip ? (
                  <>
                    {" "}
                    untuk <span className="font-semibold">{chip}</span>
                  </>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">urutan:</span>
                <select
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  <option value="terendah">Harga Terendah</option>
                  <option value="tertinggi">Harga Tertinggi</option>
                  <option value="terlaris">Terlaris</option>
                  <option value="terbaru">Terbaru</option>
                  <option value="diskon-terbesar">Diskon Terbesar</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => {
                const disc =
                  p.was && p.was > p.price
                    ? Math.max(0, Math.round(((p.was - p.price) / p.was) * 100))
                    : 0;
                const out = (p.stock ?? 0) <= 0;

                return (
                  <article
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm ring-1 ring-rose-100 transition hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => setActive(p)}
                      className="block text-left focus:outline-none"
                      aria-haspopup="dialog"
                      aria-label={`Lihat detail ${p.name}`}
                    >
                      <div className="relative">
                        <img
                          src={p.image ?? IMG_FALLBACK}
                          alt={p.name}
                          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {disc > 0 && (
                          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                            -{disc}%
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label="Tambah ke wishlist"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(
                              new CustomEvent("wishlist:add", { detail: p })
                            );
                          }}
                          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-600 shadow-sm hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-1 font-semibold text-gray-900">
                          {p.name}
                        </h3>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-rose-700">
                              {CURRENCY(p.price)}
                            </span>
                            {p.was && (
                              <span className="text-xs text-gray-400 line-through">
                                {CURRENCY(p.was)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <StarRating value={p.rating ?? 0} />
                            <span className="text-xs text-gray-400">
                              {p.reviews ?? 0}
                            </span>
                          </div>
                        </div>
                        {out ? (
                          <div className="mt-2 text-xs font-semibold text-rose-600">
                            Stok habis — klik untuk minta notifikasi
                          </div>
                        ) : (
                          <div className="mt-2 text-xs text-gray-500">
                            Stok: {p.stock} • Siap kirim
                          </div>
                        )}
                        <div className="mt-3">
                          <Button
                            size="lg"
                            variant="destructive"
                            className="w-full"
                          >
                            Beli
                          </Button>
                        </div>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => setPage(p)}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Drawer Filter (mobile) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm animate-[slideIn_200ms_ease-out] overflow-y-auto rounded-l-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-gray-900">Filter</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterBlocks
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              featuredOnly={featuredOnly}
              setFeaturedOnly={setFeaturedOnly}
              onlyDiscount={onlyDiscount}
              setOnlyDiscount={setOnlyDiscount}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          <style jsx>{`
            @keyframes slideIn {
              from {
                transform: translateX(16px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {/* Modal Detail */}
      {active && (
        <div
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail ${active.name}`}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setActive(null)}
          />
          <div className="absolute inset-x-4 top-6 bottom-6 mx-auto max-w-5xl">
            <div
              ref={panelRef}
              className="animate-[fadeIn_180ms_ease-out] overflow-hidden rounded-3xl border border-rose-200/70 bg-white shadow-2xl"
            >
              <div className="grid gap-0 md:grid-cols-2">
                {/* Gallery */}
                <div className="relative p-4">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={
                        (active.images ?? [active.image ?? IMG_FALLBACK])[
                          activeImg
                        ] ?? IMG_FALLBACK
                      }
                      alt={`${active.name} - gambar ${activeImg + 1}`}
                      className="h-72 w-full object-cover md:h-[420px]"
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    {(active.images ?? [active.image ?? IMG_FALLBACK]).map(
                      (src, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImg(i)}
                          className={`overflow-hidden rounded-xl ring-2 transition ${
                            i === activeImg
                              ? "ring-rose-600"
                              : "ring-gray-200 hover:ring-rose-300"
                          }`}
                          aria-label={`Pilih gambar ${i + 1}`}
                        >
                          <img
                            src={src}
                            alt={`thumb ${i + 1}`}
                            className="h-16 w-16 object-cover"
                          />
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-5 md:p-6">
                  <button
                    ref={closeBtnRef}
                    onClick={() => setActive(null)}
                    aria-label="Tutup"
                    className="absolute right-3 top-3 rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-start justify-between gap-3 pr-8">
                    <div>
                      <h3 className="text-lg font-extrabold tracking-tight text-gray-900">
                        {active.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating value={active.rating ?? 0} />
                        <span className="text-xs text-gray-500">
                          {(active.rating ?? 0).toFixed(1)} •{" "}
                          {active.reviews ?? 0} ulasan
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        SKU:{" "}
                        <span className="font-mono">
                          {active.sku ?? `BBX-${active.id}`}
                        </span>{" "}
                        • Stok:{" "}
                        <span
                          className={
                            active.stock && active.stock > 0
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }
                        >
                          {active.stock && active.stock > 0
                            ? `${active.stock} ready`
                            : "Habis"}
                        </span>
                      </div>
                    </div>
                    <button
                      className="rounded-full p-2 text-rose-600 hover:bg-rose-50"
                      aria-label="Tambah ke wishlist"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("wishlist:add", { detail: active })
                        )
                      }
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-2xl font-extrabold text-rose-700">
                      {CURRENCY(active.price)}
                    </span>
                    {active.was && (
                      <span className="text-sm text-gray-400 line-through">
                        {CURRENCY(active.was)}
                      </span>
                    )}
                    {active.was && active.was > active.price && (
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 ring-1 ring-rose-200">
                        -
                        {Math.max(
                          0,
                          Math.round(
                            ((active.was - active.price) / active.was) * 100
                          )
                        )}
                        %
                      </span>
                    )}
                  </div>

                  {active.desc && (
                    <p className="mt-3 text-sm text-gray-600">{active.desc}</p>
                  )}

                  {/* Options */}
                  <div className="mt-5 grid grid-cols-1">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Ukuran
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(active.sizes ?? DEF_SIZES).map((s) => {
                          const selected = size === s;
                          return (
                            <button
                              key={s}
                              onClick={() => setSize(s)}
                              className={`rounded-lg px-3 py-2 text-sm font-semibold ring-1 transition ${
                                selected
                                  ? "bg-rose-600 text-white ring-rose-600"
                                  : "bg-white text-gray-700 ring-gray-200 hover:ring-rose-300"
                              }`}
                              aria-pressed={selected}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Qty + Total */}
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <div className="inline-flex items-center rounded-xl border border-gray-200">
                      <button
                        className="p-2 hover:bg-gray-50"
                        aria-label="Kurangi"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        className="w-12 border-0 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        value={qty}
                        min={1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setQty(Number.isNaN(val) ? 1 : Math.max(1, val));
                        }}
                        aria-label="Jumlah"
                      />
                      <button
                        className="p-2 hover:bg-gray-50"
                        aria-label="Tambah"
                        onClick={() => setQty((q) => q + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-600">
                      Total:{" "}
                      <span className="font-bold text-gray-900">
                        {CURRENCY(total)}
                      </span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 px-4 py-2.5 text-sm font-bold text-white shadow hover:from-rose-700 hover:to-rose-800"
                      onClick={() => {
                        if (!color || !size)
                          return alert("Pilih warna & ukuran dulu ya.");
                        window.dispatchEvent(
                          new CustomEvent("cart:add", {
                            detail: { ...active, color, size, qty },
                          })
                        );
                        alert("Ditambahkan ke keranjang!");
                      }}
                    >
                      Tambah ke Keranjang
                    </button>
                    <Link
                      href={active.href}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Beli Sekarang <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        const shareText = `${active.name} — ${CURRENCY(
                          active.price
                        )}`;
                        navigator.clipboard.writeText(
                          `${shareText} ${location.origin}${active.href}`
                        );
                        alert("Link produk disalin.");
                      }}
                    >
                      <Share2 className="h-4 w-4" /> Bagikan
                    </button>
                  </div>

                  {/* Shipping & Guarantee */}
                  <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2">
                      <Truck className="h-4 w-4 text-rose-700" />
                      Estimasi tiba: {etaRange()}
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2">
                      <ShieldCheck className="h-4 w-4 text-rose-700" />
                      Garansi tukar 7 hari
                    </div>
                  </div>

                  {/* Details / Specs */}
                  <div className="mt-6 rounded-2xl border border-gray-200">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900">
                        Detail & Spesifikasi
                        <span className="text-gray-400 group-open:rotate-180 transition">
                          ⌄
                        </span>
                      </summary>
                      <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <ul className="ms-4 list-disc space-y-1">
                          <li>Bahan: Cotton blend premium</li>
                          <li>
                            Perawatan: Cuci dingin, jangan gunakan pemutih
                          </li>
                          <li>Asal: Indonesia</li>
                        </ul>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 sm:grid-cols-3">
                          <div>
                            <span className="text-gray-500">SKU:</span>{" "}
                            {active.sku ?? `BBX-${active.id}`}
                          </div>
                          <div>
                            <span className="text-gray-500">Berat:</span> ~350g
                          </div>
                          <div>
                            <span className="text-gray-500">Kategori:</span>{" "}
                            Best Seller
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* helper text */}
            <div className="mt-3 text-center text-xs text-white/80">
              Tekan <kbd className="rounded bg-white/20 px-1">Esc</kbd> atau
              klik di luar untuk menutup
            </div>
          </div>
        </div>
      )}
    </main>
  );
}