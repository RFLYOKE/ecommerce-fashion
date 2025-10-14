"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  X,
  ArrowRight,
  Star,
  Truck,
  ShieldCheck,
  Heart,
  Plus,
  Minus,
  Share2,
} from "lucide-react";
import ColorSizeFilter from "./color-size-filter";

const IMG =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

type SaleItem = {
  id: string;
  name: string;
  price: number; // after discount
  was: number; // original price
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
  { name: "Maroon", hex: "#7f1d1d" },
  { name: "Hitam", hex: "#111827" },
  { name: "Putih", hex: "#F9FAFB" },
  { name: "Navy", hex: "#1f2937" },
];

const DEF_SIZES = ["S", "M", "L", "XL", "XXL"];

const SAMPLE: SaleItem[] = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i + 1),
  name: `Produk Sale ${i + 1}`,
  was: 329_000 + i * 20_000,
  price: 259_000 + i * 15_000,
  href: `/product/${i + 1}?sale=1`,
  image: IMG,
  images: [IMG, IMG, IMG],
  desc: "Material nyaman dipakai harian. Cutting rapi dan detail premium khas Blackboxinc.",
  rating: 4.7,
  reviews: 128 + i * 5,
  stock: 12 - i, // demo
  sku: `BBX-SALE-${1000 + i}`,
  colors: DEF_COLORS,
  sizes: DEF_SIZES,
}));

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

export default function ProductSale({
  items = SAMPLE,
}: {
  items?: SaleItem[];
}) {
  const [active, setActive] = useState<SaleItem | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Modal helpers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "Tab" && panelRef.current) {
        // simple focus trap
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

  // Init modal state & lock scroll
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

  return (
    <section className="mx-auto px-4">
      <div className="mx-auto   px-4 py-10"></div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Produk Sale
          </h2>
          <p className="text-sm text-gray-500">
            Diskon terbatas — buruan sebelum habis.
          </p>
        </div>
        <Link
          href="/product?sale=true"
          className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-rose-700"
        >
          Lihat Semua
        </Link>
      </div>
      <ColorSizeFilter
        colors={[
          { name: "Hitam", value: "#111827" },
          { name: "Putih", value: "#F9FAFB" },
          { name: "Merah", value: "#DC2626" },
          { name: "Biru", value: "#2563EB" },
        ]}
        sizes={["XS", "S", "M", "L", "XL", "XXL"]}
        onChange={(state) => {
          // Integrasikan ke query param / store filter kamu di sini
          console.log("filter:", state);
        }}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
        {items.map((p) => {
          const disc = Math.max(
            0,
            Math.round(((p.was - p.price) / p.was) * 100)
          );
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(p)}
              className="group text-left overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm ring-1 ring-rose-100 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500"
              aria-haspopup="dialog"
              aria-label={`Lihat detail ${p.name}`}
            >
              <div className="relative">
                <img
                  src={p.image ?? IMG}
                  alt={p.name}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  -{disc}%
                </span>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-1 font-semibold text-gray-900">
                  {p.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-rose-700 font-bold">
                    {CURRENCY(p.price)}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {CURRENCY(p.was)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal Detail */}
      {active && (
        <div
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail ${active.name}`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setActive(null)}
          />

          {/* Panel */}
          <div className="absolute inset-x-4 top-6 bottom-6 mx-auto max-w-5xl">
            <div
              ref={panelRef}
              className="animate-[fadeIn_180ms_ease-out] overflow-hidden rounded-3xl border border-rose-200/70 bg-white shadow-2xl"
            >
              <div className="grid gap-0 md:grid-cols-2">
                {/* Left: Gallery */}
                <div className="relative p-4">
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={
                        (active.images ?? [active.image ?? IMG])[activeImg] ??
                        IMG
                      }
                      alt={`${active.name} - gambar ${activeImg + 1}`}
                      className="h-72 w-full object-cover md:h-[420px]"
                    />
                  </div>
                  {/* thumbnails */}
                  <div className="mt-3 flex gap-2">
                    {(active.images ?? [active.image ?? IMG]).map((src, i) => (
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
                    ))}
                  </div>
                </div>

                {/* Right: Content */}
                <div className="relative p-5 md:p-6">
                  <button
                    ref={closeBtnRef}
                    onClick={() => setActive(null)}
                    aria-label="Tutup"
                    className="absolute right-3 top-3 rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Title & rating */}
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
                      onClick={() => {
                        // placeholder action
                        window.dispatchEvent(
                          new CustomEvent("wishlist:add", { detail: active })
                        );
                      }}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-2xl font-extrabold text-rose-700">
                      {CURRENCY(active.price)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {CURRENCY(active.was)}
                    </span>
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
                  </div>

                  {/* Desc */}
                  {active.desc && (
                    <p className="mt-3 text-sm text-gray-600">{active.desc}</p>
                  )}

                  {/* Options */}
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Colors */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Warna
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(active.colors ?? DEF_COLORS).map((c) => {
                          const selected = color === c.name;
                          return (
                            <button
                              key={c.name}
                              onClick={() => setColor(c.name)}
                              className={`relative grid h-9 w-9 place-content-center rounded-full ring-1 transition ${
                                selected
                                  ? "ring-rose-600 ring-2"
                                  : "ring-gray-200 hover:ring-rose-300"
                              }`}
                              aria-pressed={selected}
                              aria-label={c.name}
                              title={c.name}
                            >
                              <span
                                className="h-6 w-6 rounded-full"
                                style={{
                                  backgroundColor: c.hex,
                                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
                                }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sizes */}
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
                        // Placeholder add-to-cart event
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
                        )} (${CURRENCY(active.was)})`;
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

                  {/* Details/Specs */}
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
                            Sale
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
