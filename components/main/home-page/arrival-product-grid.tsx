"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useGetProductListQuery } from "@/services/product.service";
import type { Product as ApiProduct } from "@/types/admin/product";

const FALLBACK_IMG =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

type CardProduct = {
  id: string | number;
  name: string;
  price: number;
  href: string;
  image?: string | null;
};

const CURRENCY = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export default function NewArrival() {
  // NOTE: pakai sorting backend "products.sales" desc, max 8 item
  const { data, isLoading, isError } = useGetProductListQuery({
    page: 1,
    paginate: 8,
    orderBy: "products.sales",
    order: "desc",
  });

  const items = useMemo<CardProduct[]>(() => {
    const list: ApiProduct[] = data?.data ?? [];
    return list.map((p) => ({
      id: (p as { id?: number | string }).id ?? "",
      name:
        (p as { name?: string }).name ??
        (p as { title?: string }).title ??
        "Produk",
      price:
        (p as { price?: number }).price ??
        (p as { base_price?: number }).base_price ??
        0,
      href: `/products/${
        (p as { slug?: string }).slug ??
        (p as { id?: number | string }).id ??
        ""
      }`,
      image:
        (p as { thumbnail?: string | null }).thumbnail ??
        (p as { image?: string | null }).image ??
        FALLBACK_IMG,
    }));
  }, [data]);

  return (
    <section className="mx-auto container md:px-4 py-16 md:py-20 bg-white">
      <div className="flex items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
            New Arrivals
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Produk terbaru berdasarkan penjualan.
          </p>
        </div>
        <Link
          href="/product?sort=best"
          className="rounded-lg bg-black px-5 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-gray-800 border-2 border-black"
        >
          Lihat Semua
        </Link>
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center text-gray-500">
          Memuat produk…
        </div>
      )}
      {isError && (
        <div className="flex h-40 items-center justify-center text-red-600">
          Gagal memuat produk.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="mt-8 grid gap-x-6 gap-y-10 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className="group block transition-all duration-300 relative"
            >
              <div className="relative overflow-hidden aspect-[3/4] bg-gray-50 border border-gray-100">
                <img
                  src={p.image ?? FALLBACK_IMG}
                  alt={p.name}
                  className="h-full w-full object-cover grayscale-[10%] transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-0 top-0 inline-flex items-center rounded-br-lg bg-black px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  Best
                </span>
              </div>

              <div className="mt-4 flex flex-col">
                <h3 className="line-clamp-1 text-base font-semibold text-black uppercase tracking-wide">
                  {p.name}
                </h3>
                <p className="mt-1 text-lg font-extrabold text-black">
                  {CURRENCY(p.price)}
                </p>
              </div>

              <span className="absolute bottom-0 left-0 h-[1px] w-full bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="flex h-40 items-center justify-center text-gray-500">
          Belum ada produk.
        </div>
      )}
    </section>
  );
}