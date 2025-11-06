"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { Product } from "@/types/admin/product";
import { useGetProductVariantBySlugQuery } from "@/services/product.service";
import useCart from "@/hooks/use-cart";

type ProductVariant = {
  id: number;
  name: string | number;
  price: number | string;
  stock: number | string;
  sku?: string | null;
};

const isVariantArray = (v: unknown): v is ProductVariant[] =>
  Array.isArray(v) &&
  v.every(
    (o) =>
      !!o &&
      typeof o === "object" &&
      "id" in o &&
      "name" in o &&
      "price" in o &&
      "stock" in o
  );

const toNumber = (val: number | string | undefined): number => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const IMG_FALLBACK =
  "https://via.placeholder.com/400x400/000000/FFFFFF?text=BLACKBOXINC";

function getImageUrl(p?: Product): string {
  if (!p) return IMG_FALLBACK;
  if (typeof p.image === "string" && p.image) return p.image;
  const media = (p as unknown as { media?: { original_url: string }[] })?.media;
  if (Array.isArray(media) && media[0]?.original_url)
    return media[0].original_url;
  return IMG_FALLBACK;
}

export default function VariantPickerModal({
  open,
  product,
  onClose,
  onAdded,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onAdded?: () => void;
}) {
  const { addItem } = useCart();

  // fetch daftar varian berdasar slug produk
  const slug = product?.slug ?? "";
  const { data: variantResp, isLoading } = useGetProductVariantBySlugQuery(
    slug,
    {
      skip: !open || !slug,
    }
  );

  const variants: ProductVariant[] = useMemo(() => {
    const maybe = (variantResp as unknown as { data?: unknown })?.data;
    return isVariantArray(maybe) ? maybe : [];
  }, [variantResp]);

  const [selected, setSelected] = useState<ProductVariant | null>(null);
  const [qty, setQty] = useState<number>(1);

  // kalau produk tidak punya varian, langsung add dan tutup
  useEffect(() => {
    if (!open || !product) return;
    if (!isLoading && variants.length === 0) {
      const fallbackPrice = toNumber(product.price);
      addItem(
        { ...product, price: fallbackPrice },
        product.product_variant_id ?? 0
      );
      onClose();
      onAdded?.();
    }
  }, [open, isLoading, variants.length, product, addItem, onClose, onAdded]);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setQty(1);
    }
  }, [open]);

  if (!open || !product) return null;
  if (variants.length === 0) return null; // kasus auto-add di effect di atas

  const curPrice = toNumber(selected?.price);
  const curStock = toNumber(selected?.stock);
  const total = curPrice * qty;

  const handleAdd = () => {
    if (!selected) return;
    const vId = selected.id;
    const price = curPrice || toNumber(product.price);
    addItem({ ...product, price }, vId);
    onAdded?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-base font-bold uppercase tracking-wider text-black">
            Pilih Varian
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-black hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-[140px_1fr]">
          <div className="rounded-lg border bg-gray-50 p-1">
            <Image
              src={getImageUrl(product)}
              alt={product.name}
              width={140}
              height={140}
              className="h-36 w-full rounded-md object-cover"
              unoptimized
            />
          </div>

          <div>
            <div className="mb-3">
              <div className="text-sm font-semibold text-black">
                {product.name}
              </div>
              <div className="text-xs text-gray-600">
                {product.category_name}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-black">
                Varian
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {variants.map((v) => {
                  const disabled = toNumber(v.stock) <= 0;
                  const active = selected?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      disabled={disabled}
                      onClick={() => setSelected(v)}
                      className={[
                        "rounded-md px-3 py-1.5 text-sm font-semibold ring-1 transition",
                        disabled
                          ? "cursor-not-allowed opacity-50 line-through ring-gray-200"
                          : active
                          ? "bg-black text-white ring-black"
                          : "bg-white text-gray-700 ring-gray-300 hover:ring-black/60",
                      ].join(" ")}
                    >
                      {String(v.name)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center rounded-lg border border-gray-300">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={!selected || curStock <= 0}
                  className="rounded-l-lg p-2 hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  className="w-12 border-x border-gray-300 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={qty}
                  min={1}
                  max={curStock > 0 ? curStock : 1}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    const max = curStock > 0 ? curStock : 1;
                    setQty(Number.isNaN(v) ? 1 : Math.max(1, Math.min(v, max)));
                  }}
                  disabled={!selected || curStock <= 0}
                />
                <button
                  onClick={() =>
                    setQty((q) => Math.min(q + 1, curStock > 0 ? curStock : 1))
                  }
                  disabled={!selected || curStock <= 0 || qty >= curStock}
                  className="rounded-r-lg p-2 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Total: </span>
                <span className="font-extrabold text-black">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={!selected || curStock <= 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-white transition hover:bg-gray-800 disabled:bg-gray-400"
            >
              <ShoppingCart className="h-5 w-5" />
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}