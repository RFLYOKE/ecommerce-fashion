"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brdd36bq0nqHce9XxtVuI86ofTjbUO5PQwgzRW",
  "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brQVhbhv7IOtx9mVj7iZ6qdEYrH3cfDWRzgBFn",
  "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brHEZxkizf6brTe3nRNP7yCzUuWdMvYwItjFLi",
  "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brBLGmzbJW0SyOvsUDTq1i28JkhbzNwoC6xlMH",
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
};

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const startAutoplay = () => {
    stopAutoplay();
    timerRef.current = setInterval(() => goTo(index + 1, 1), 5000);
  };
  const stopAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    const len = images.length;
    setIndex(((next % len) + len) % len);
  };

  const next = () => goTo(index + 1, 1);
  const prev = () => goTo(index - 1, -1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center"
    >
      <div
        className="relative w-full max-w-[560px] rounded-2xl shadow-lg overflow-hidden"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        {/* ⬇️ Fixed height agar semua slide sama tinggi */}
        <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-[70vh]">
          <AnimatePresence custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[index]}
                alt="YAMEIYA Shop Product"
                fill
                className="object-cover" /* penting: jaga tinggi seragam */
                priority
                sizes="(max-width: 640px) 100vw, 560px"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Kontrol kiri/kanan */}
        <button
          onClick={prev}
          aria-label="Sebelumnya"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 backdrop-blur px-2 py-2 text-gray-800 hover:bg-white shadow"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={next}
          aria-label="Berikutnya"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 backdrop-blur px-2 py-2 text-gray-800 hover:bg-white shadow"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Indikator dot */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white shadow" : "w-2.5 bg-white/60"
              }`}
              aria-label={`Ke slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
