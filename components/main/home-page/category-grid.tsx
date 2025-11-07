"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useGetCategoryListQuery } from "@/services/product.service";
import { ProductCategory } from "@/types/master/product-category";

const FALLBACK_IMG = "https://placehold.co/800x600/efefef/444?text=Category";

type UiCategory = {
  label: string;
  slug: string;
  image?: string | null;
};

function toUi(cat: ProductCategory): UiCategory {
  return {
    label: cat.name ?? "Kategori",
    slug: cat.slug ?? String(cat.id),
    image: (cat as unknown as { image?: string | null })?.image ?? null,
  };
}

export default function ProductCategories() {
  // Ambil parent categories (is_parent=1 sudah diset di service)
  const { data, isLoading, isError } = useGetCategoryListQuery({
    page: 1,
    paginate: 12,
  });

  const categories: UiCategory[] =
    (data?.data ?? []).map(toUi).filter((c) => !!c.slug) ?? [];

  if (isLoading) {
    return (
      <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-200" />
          <div className="h-4 w-80 bg-gray-200" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
        <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
          Shop By Category
        </h2>
        <p className="text-base text-gray-600 mt-1">
          Explore our curated collections.
        </p>
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Gagal memuat kategori. Coba muat ulang.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto container md:px-4 py-12 md:py-20 bg-white">
      {/* Header Section: Black & White Styling */}
      <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl uppercase">
        Shop By Category
      </h2>
      <p className="text-base text-gray-600 mt-1">
        Explore our curated collections.
      </p>

      {/* Category Grid */}
      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/product?category=${encodeURIComponent(c.slug)}`}
            className="group relative overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-black"
          >
            {/* Image */}
            <div className="relative h-48 w-full">
              <Image
                src={c.image || FALLBACK_IMG}
                alt={c.label}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover grayscale-[15%] transition-transform duration-500 group-hover:scale-105"
                priority={false}
              />
            </div>

            {/* Dark Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Category Label */}
            <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
              <span className="text-lg font-extrabold uppercase tracking-widest text-white drop-shadow-md">
                {c.label}
              </span>
              <ChevronRight className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {/* CTA Bottom */}
      <div className="mt-10 text-center">
        <Link
          href="/product"
          className="inline-flex items-center gap-2 rounded-lg border border-black bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
        >
          Lihat Semua Kategori
        </Link>
      </div>
    </section>
  );
}