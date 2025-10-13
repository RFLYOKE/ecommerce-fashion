// components/sections/RunningCarousel.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type RunningCarouselProps = {
  images?: string[];
  heightClass?: string; // e.g. "h-[320px]"
  intervalMs?: number;
  showArrows?: boolean;
  showDots?: boolean;
};

const DEFAULT_IMAGE =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

export default function RunningCarousel({
  images,
  heightClass = "h-[360px]",
  intervalMs = 3500,
  showArrows = true,
  showDots = true,
}: RunningCarouselProps) {
  const items = useMemo(
    () =>
      images?.length ? images : [DEFAULT_IMAGE, DEFAULT_IMAGE, DEFAULT_IMAGE],
    [images]
  );
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  // autoplay
  useEffect(() => {
    if (paused) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [items.length, intervalMs, paused]);

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + items.length) % items.length);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl ${heightClass} bg-rose-100`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* slides */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((src, i) => (
          <div key={i} className="relative min-w-full">
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="h-full w-full object-cover"
              draggable={false}
            />
            {/* red overlay for elegance */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rose-900/40 via-rose-800/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* arrows */}
      {showArrows && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="group absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md ring-1 ring-black/10 backdrop-blur hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5 text-rose-700 group-hover:scale-110 transition-transform" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => go(1)}
            className="group absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md ring-1 ring-black/10 backdrop-blur hover:bg-white"
          >
            <ChevronRight className="h-5 w-5 text-rose-700 group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* dots */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === index
                  ? "bg-white shadow ring-2 ring-rose-600"
                  : "bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}