// components/sections/RunningCarousel.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useGetGalleryListQuery } from "@/services/gallery.service";

interface GaleriItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  published_at: string;
  image: string | File | null;
}

interface GalleryListShape {
  data: GaleriItem[];
  last_page: number;
  current_page: number;
  total: number;
  per_page: number;
}

type RunningCarouselProps = {
  heightClass?: string;
  intervalMs?: number;
  showArrows?: boolean;
  showDots?: boolean;
};

export default function RunningCarousel({
  heightClass = "h-[60vh]",
  intervalMs = 3000,
  showArrows = true,
  showDots = true,
}: RunningCarouselProps) {
  const { data, isLoading, isError } = useGetGalleryListQuery({
    page: 1,
    paginate: 10,
  });

  // Ambil langsung field `image` dari API
  const items = useMemo<string[]>(() => {
    const list = (data as GalleryListShape | undefined)?.data ?? [];
    return list
      .map((it) => (typeof it.image === "string" ? it.image : ""))
      .filter((u): u is string => u.length > 0);
  }, [data]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [items.length, intervalMs, paused]);

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + items.length) % items.length);

  if (isLoading) {
    return (
      <div
        className={clsx(
          "relative w-full overflow-hidden rounded-3xl bg-gray-100 shadow-xl",
          heightClass
        )}
        aria-roledescription="carousel"
      >
        <div className="absolute inset-0 grid place-items-center text-sm text-gray-500">
          Memuat galeri…
        </div>
      </div>
    );
  }

  if (isError || items.length === 0) {
    return (
      <div
        className={clsx(
          "relative w-full overflow-hidden rounded-3xl bg-gray-100 shadow-xl",
          heightClass
        )}
        aria-roledescription="carousel"
      >
        <div className="absolute inset-0 grid place-items-center text-sm text-gray-500">
          Belum ada gambar galeri.
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        `relative w-full overflow-hidden rounded-3xl ${heightClass} bg-gray-100`,
        "shadow-xl"
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* track */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((src, i) => (
          <div key={`${src}-${i}`} className="relative min-w-full">
            {/* pakai <img> biasa → gak butuh whitelist next/image */}
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="group absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-all hover:bg-black"
          >
            <ChevronLeft className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(1)}
            className="group absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-all hover:bg-black"
          >
            <ChevronRight className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* dots */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {items.map((_, i) => (
            <button
              key={`dot-${i}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={clsx(
                "h-2.5 w-2.5 rounded-full transition-all duration-300",
                i === index
                  ? "bg-white shadow-md ring-2 ring-gray-400"
                  : "bg-gray-400/60 hover:bg-gray-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}