// components/sections/ProductSale.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  X,
  Star,
  Truck,
  ShieldCheck,
  Heart,
  Plus,
  Minus,
} from "lucide-react";
import { useGetProductListQuery } from "@/services/product.service";
import { Product } from "@/types/admin/product";

const FALLBACK_IMG = "https://placehold.co/800x1066/efefef/444?text=Product";

type SaleItem = {
  id: string;
  name: string;
  price: number; // after discount/current price
  was?: number; // original/compare-at (optional)
  href: string;
  image?: string;
  images?: string[];
  desc?: string;
  rating?: number; // 0..5
  reviews?: number; // jumlah ulasan
  stock?: number; // stok tersedia
  sku?: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
};

const CURRENCY = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

const etaRange = () => {
  const a = new Date();
  const b = new Date();
  a.setDate(a.getDate() + 2);
  b.setDate(b.getDate() + 5);
  return `${formatDate(a)} – ${formatDate(b)}`;
};

const DEF_COLORS = [
  { name: "Navy", hex: "#1f2937" },
  { name: "Black", hex: "#111827" },
  { name: "White", hex: "#F9FAFB" },
  { name: "Grey", hex: "#6b7280" },
];

const DEF_SIZES = ["S", "M", "L", "XL", "XXL"];

/* ================= Helpers mapping ================= */
function getProductImage(p: Product): string | undefined {
  const maybe = p as unknown as {
    image?: string | null;
    images?: string[] | null;
    media?: { original_url?: string }[] | null;
    thumbnail?: string | null;
  };
  return (
    maybe?.image ??
    maybe?.thumbnail ??
    (maybe?.images && maybe.images[0]) ??
    (maybe?.media && maybe.media[0]?.original_url) ??
    undefined
  );
}

function getProductSlug(p: Product): string {
  const maybe = p as unknown as { slug?: string; id?: number | string };
  return maybe?.slug ?? String(maybe?.id ?? "");
}

function getProductName(p: Product): string {
  const maybe = p as unknown as { name?: string; title?: string };
  return maybe?.name ?? maybe?.title ?? "Product";
}

function getPrices(p: Product): { price: number; was?: number } {
  const maybe = p as unknown as {
    price?: number;
    selling_price?: number;
    final_price?: number;
    compare_at_price?: number;
    original_price?: number;
    normal_price?: number;
    base_price?: number;
    was?: number;
  };
  const price =
    maybe.price ??
    maybe.selling_price ??
    maybe.final_price ??
    maybe.base_price ??
    0;

  const was =
    maybe.compare_at_price ??
    maybe.original_price ??
    maybe.normal_price ??
    maybe.was ??
    undefined;

  // Jangan tampilkan diskon bogus: jika was <= price, treat as undefined
  const safeWas = typeof was === "number" && was > price ? was : undefined;

  return { price, was: safeWas };
}

function toSaleItem(p: Product): SaleItem {
  const { price, was } = getPrices(p);
  const slug = getProductSlug(p);
  return {
    id: String((p as unknown as { id?: number | string })?.id ?? slug),
    name: getProductName(p),
    price,
    was,
    href: `/product/${slug}`,
    image: getProductImage(p) ?? FALLBACK_IMG,
    images: undefined,
    desc: (p as unknown as { description?: string })?.description,
    rating: (p as unknown as { rating?: number })?.rating ?? undefined,
    reviews:
      (p as unknown as { reviews_count?: number })?.reviews_count ?? undefined,
    stock: (p as unknown as { stock?: number })?.stock ?? undefined,
    sku: (p as unknown as { sku?: string })?.sku ?? undefined,
    colors: DEF_COLORS,
    sizes: DEF_SIZES,
  };
}

/* ================= Star Rating (B&W) ================= */
function StarRating({ value = 0 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5 text-gray-800">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${
              filled
                ? "fill-black text-black"
                : "fill-transparent text-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
}

/* ================= Component ================= */
export default function ProductSale() {
  // Ambil 8 terlaris, urut dari penjualan tertinggi
  const { data, isLoading, isError } = useGetProductListQuery({
    page: 1,
    paginate: 8,
    orderBy: "products.sales",
    order: "desc",
  });

  const items: SaleItem[] = useMemo(
    () => (data?.data ?? []).slice(0, 8).map(toSaleItem),
    [data?.data]
  );

  const [active, setActive] = useState<SaleItem | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

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
      setColor(active.colors?.[0]?.name ?? null);
      setSize(active.sizes?.[0] ?? null);
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

  if (isLoading) {
    return (
      <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
              Best Sellers
            </h2>
            <p className="text-base text-gray-600 mt-1">
              Loading top-selling products…
            </p>
          </div>
          <div className="h-9 w-28 rounded-lg bg-gray-200" />
        </div>

        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-lg bg-gray-100" />
              <div className="mt-4 h-4 w-3/4 bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
              Best Sellers
            </h2>
            <p className="text-base text-gray-600 mt-1">
              Gagal memuat produk terlaris. Coba muat ulang.
            </p>
          </div>
          <Link
            href="/product?sale=true"
            className="rounded-lg bg-black px-5 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-gray-800 border-2 border-black"
          >
            View All
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
            Best Sellers
          </h2>
          <p className="text-base text-gray-600 mt-1">
            Exclusive picks—our most-loved items.
          </p>
        </div>
        <Link
          href="/product?sale=true"
          className="rounded-lg bg-black px-5 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-gray-800 border-2 border-black"
        >
          View All
        </Link>
      </div>

      {/* Product Cards Grid */}
      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => {
          const hasDiscount = typeof p.was === "number" && p.was > p.price;
          const disc = hasDiscount
            ? Math.max(0, Math.round(((p.was! - p.price) / p.was!) * 100))
            : 0;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(p)}
              className="group text-left block focus:outline-none transition-all duration-300 relative"
              aria-haspopup="dialog"
              aria-label={`Quick view ${p.name}`}
            >
              <div className="relative overflow-hidden aspect-[3/4] bg-gray-50 border border-gray-100">
                <img
                  src={p.image ?? FALLBACK_IMG}
                  alt={p.name}
                  className="h-full w-full object-cover grayscale-[10%] transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {hasDiscount && (
                  <span className="absolute left-0 top-0 inline-flex items-center rounded-br-lg bg-black px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    -{disc}%
                  </span>
                )}
                <button
                  className="absolute right-3 top-3 p-1 rounded-full bg-white/80 text-black shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Add to Wishlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <Heart className="h-4 w-4 fill-transparent hover:fill-black" />
                </button>
              </div>

              <div className="mt-4 flex flex-col">
                <h3 className="line-clamp-1 text-base font-semibold text-black uppercase tracking-wide">
                  {p.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-black">
                    {CURRENCY(p.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      {CURRENCY(p.was!)}
                    </span>
                  )}
                </div>
              </div>

              <span className="absolute bottom-0 left-0 h-[1px] w-full bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>
          );
        })}
      </div>

      {/* --- Modal Detail (Quick View) --- */}
      {active && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail ${active.name}`}
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setActive(null)}
          />
          <div className="relative mx-auto my-6 max-w-5xl">
            <div
              ref={panelRef}
              className="animate-[fadeIn_180ms_ease-out] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl"
            >
              <div className="grid gap-0 md:grid-cols-2">
                {/* Left: Gallery */}
                <div className="relative p-0 md:p-4 bg-gray-50">
                  <div className="overflow-hidden">
                    <img
                      src={
                        (active.images ?? [active.image ?? FALLBACK_IMG])[
                          activeImg
                        ] ?? FALLBACK_IMG
                      }
                      alt={`${active.name} - image ${activeImg + 1}`}
                      className="h-72 w-full object-cover md:h-[540px] grayscale-[10%]"
                    />
                  </div>
                  <div className="mt-3 flex gap-2 p-3 md:p-0">
                    {(active.images ?? [active.image ?? FALLBACK_IMG]).map(
                      (src, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImg(i)}
                          className={`overflow-hidden rounded-lg ring-1 transition ${
                            i === activeImg
                              ? "ring-black ring-2"
                              : "ring-gray-300 hover:ring-black/50"
                          }`}
                          aria-label={`Select image ${i + 1}`}
                        >
                          <img
                            src={src}
                            alt={`thumb ${i + 1}`}
                            className="h-14 w-14 object-cover grayscale-[10%]"
                          />
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Right: Content */}
                <div className="relative p-6 md:p-8">
                  <button
                    ref={closeBtnRef}
                    onClick={() => setActive(null)}
                    aria-label="Close"
                    className="absolute right-4 top-4 rounded-full p-2 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-start justify-between gap-3 pr-8">
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight text-black uppercase">
                        {active.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating value={active.rating ?? 0} />
                        <span className="text-sm text-gray-600">
                          {(active.rating ?? 0).toFixed(1)} rating •{" "}
                          {active.reviews ?? 0} reviews
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        SKU:{" "}
                        <span className="font-mono">
                          {active.sku ?? `BBX-${active.id}`}
                        </span>{" "}
                        • Stock:{" "}
                        <span
                          className={
                            active.stock && active.stock > 0
                              ? "text-black font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {active.stock && active.stock > 0
                            ? `${active.stock} available`
                            : "Sold Out"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end gap-3 border-t border-b border-gray-100 py-3">
                    <span className="text-3xl font-extrabold text-black">
                      {CURRENCY(active.price)}
                    </span>
                    {typeof active.was === "number" &&
                      active.was > active.price && (
                        <>
                          <span className="text-base text-gray-500 line-through">
                            {CURRENCY(active.was)}
                          </span>
                          <span className="inline-flex items-center rounded-lg bg-black px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">
                            -
                            {Math.max(
                              0,
                              Math.round(
                                ((active.was - active.price) / active.was) * 100
                              )
                            )}
                            %
                          </span>
                        </>
                      )}
                  </div>

                  {active.desc && (
                    <p className="mt-4 text-sm text-gray-700">{active.desc}</p>
                  )}

                  {/* Options */}
                  <div className="mt-6 grid grid-cols-1 gap-5">
                    {/* Colors */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-black">
                        Color:{" "}
                        <span className="font-normal text-gray-600">
                          {color}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(active.colors ?? DEF_COLORS).map((c) => {
                          const selected = color === c.name;
                          return (
                            <button
                              key={c.name}
                              onClick={() => setColor(c.name)}
                              className={`relative grid h-8 w-8 place-content-center rounded-full ring-2 transition ${
                                selected
                                  ? "ring-black ring-offset-2"
                                  : "ring-gray-300 hover:ring-black/50"
                              }`}
                              aria-pressed={selected}
                              aria-label={c.name}
                              title={c.name}
                            >
                              <span
                                className="h-6 w-6 rounded-full border border-gray-200"
                                style={{ backgroundColor: c.hex }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sizes */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-black">
                        Size:{" "}
                        <span className="font-normal text-gray-600">
                          {size}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(active.sizes ?? DEF_SIZES).map((s) => {
                          const selected = size === s;
                          return (
                            <button
                              key={s}
                              onClick={() => setSize(s)}
                              className={`rounded-lg px-4 py-2 text-sm font-semibold ring-1 transition ${
                                selected
                                  ? "bg-black text-white ring-black"
                                  : "bg-white text-gray-700 ring-gray-300 hover:ring-black/50"
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
                  <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-gray-100 pt-4">
                    <div className="inline-flex items-center rounded-lg border border-gray-300">
                      <button
                        className="p-2 hover:bg-gray-50 rounded-l-lg"
                        aria-label="Decrease quantity"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="h-4 w-4 text-black" />
                      </button>
                      <input
                        type="number"
                        className="w-12 border-x border-gray-300 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-black font-semibold"
                        value={qty}
                        min={1}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setQty(Number.isNaN(val) ? 1 : Math.max(1, val));
                        }}
                        aria-label="Quantity"
                      />
                      <button
                        className="p-2 hover:bg-gray-50 rounded-r-lg"
                        aria-label="Increase quantity"
                        onClick={() => setQty((q) => q + 1)}
                      >
                        <Plus className="h-4 w-4 text-black" />
                      </button>
                    </div>

                    <div className="text-base text-gray-700 font-medium">
                      Total:{" "}
                      <span className="font-extrabold text-black">
                        {CURRENCY(total)}
                      </span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-black px-6 py-3 text-base font-bold text-white shadow-xl hover:bg-gray-800 transition-colors uppercase tracking-wider disabled:bg-gray-400"
                      onClick={() => {
                        if (!color || !size)
                          return alert("Please select a color and size first.");
                        window.dispatchEvent(
                          new CustomEvent("cart:add", {
                            detail: { ...active, color, size, qty },
                          })
                        );
                        setActive(null);
                      }}
                      disabled={!active.stock || active.stock <= 0}
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={active.href}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-black px-4 py-3 text-base font-semibold text-black hover:bg-gray-50 transition-colors"
                    >
                      Buy Now
                    </Link>
                  </div>

                  {/* Shipping & Guarantee */}
                  <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-gray-700 border-t border-gray-100 pt-6 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 bg-gray-50">
                      <Truck className="h-5 w-5 text-black" />
                      ETA: {etaRange()}
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 bg-gray-50">
                      <ShieldCheck className="h-5 w-5 text-black" />
                      7-day exchange guarantee
                    </div>
                  </div>

                  {/* Details/Specs */}
                  <div className="mt-6 rounded-xl border border-gray-300">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-black uppercase tracking-wider">
                        Details & Specifications
                        <span className="text-gray-500 group-open:rotate-180 transition">
                          ⌄
                        </span>
                      </summary>
                      <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <ul className="ms-4 list-disc space-y-1">
                          <li>Material: Premium heavy cotton blend</li>
                          <li>Care: Cold wash, do not bleach</li>
                          <li>Origin: Indonesia</li>
                        </ul>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 sm:grid-cols-3">
                          <div>
                            <span className="text-gray-500">SKU:</span>{" "}
                            {active.sku ?? `BBX-${active.id}`}
                          </div>
                          <div>
                            <span className="text-gray-500">Weight:</span> ~350g
                          </div>
                          <div>
                            <span className="text-gray-500">Category:</span>{" "}
                            Sale
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-sm text-white/90">
              Press{" "}
              <kbd className="rounded bg-black/50 px-1 py-0.5 text-white">
                Esc
              </kbd>{" "}
              or click outside to close
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}