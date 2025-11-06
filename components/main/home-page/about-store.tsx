// components/sections/AboutStore.tsx
"use client";

import Image from "next/image";
import { ShieldCheck, Truck, Diamond } from "lucide-react";
import { useGetGalleryListQuery } from "@/services/gallery.service";
import { GaleriItem } from "@/types/gallery";
import { useMemo } from "react";

const FALLBACK =
  "https://placehold.co/1600x1200/png?text=Blackboxinc%20Gallery&font=montserrat";

export default function AboutStore() {
  // Ambil maksimal 10 lalu ambil yang paling baru
  const { data, isLoading, isError } = useGetGalleryListQuery({
    page: 1,
    paginate: 10,
  });

  // di atas (komponen ini sudah "use client")
  const YEAR = new Date().getFullYear();

  // Pilih 1 gambar terbaru berdasarkan created_at -> published_at
  const latestImageUrl = useMemo<string>(() => {
    const list: GaleriItem[] = data?.data ?? [];
    if (!list.length) return FALLBACK;

    const sorted = [...list].sort((a, b) => {
      const tB =
        new Date(b.created_at ?? b.published_at).getTime() ||
        new Date().getTime();
      const tA =
        new Date(a.created_at ?? a.published_at).getTime() ||
        new Date().getTime();
      return tB - tA;
    });

    const top = sorted[0];
    const url = typeof top.image === "string" ? top.image : "";
    return url && url.length > 0 ? url : FALLBACK;
  }, [data]);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background clean */}
      <div className="absolute inset-0 -z-10 bg-white" />

      <div className="container mx-auto py-12 md:px-4 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Kiri: Teks & Value */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-700 ring-1 ring-gray-300">
              <Diamond className="h-3.5 w-3.5 text-black" />
              Our Commitment
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-black md:text-4xl lg:text-5xl">
              Blackboxinc — Timeless Style, Uncompromised Quality.
            </h2>
            <p className="mt-5 text-base text-gray-700 md:text-lg">
              We meticulously curate fashion products with high quality
              standards and <strong>timeless design</strong>. Our mission is
              simple: empower you to feel confident every day, effortlessly.
            </p>

            <ul className="mt-8 grid gap-4 text-base font-medium text-black sm:grid-cols-2">
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-black" />
                Guaranteed quality & authenticity
              </li>
              <li className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-black" />
                Fast & secure worldwide shipping
              </li>
              <li className="flex items-center gap-3">
                <Diamond className="h-5 w-5 text-black" />
                Curated new arrivals weekly
              </li>
            </ul>
          </div>

          {/* Kanan: Gambar dari gallery (1 terbaru) */}
          <div className="relative order-first md:order-last">
            <div className="overflow-hidden rounded-2xl border-4 border-black shadow-2xl">
              <Image
                src={latestImageUrl}
                alt="Gallery highlight"
                width={1200}
                height={900}
                className="h-[380px] w-full object-cover md:h-[500px] grayscale-[10%]"
                priority
                unoptimized
              />
            </div>

            {/* Overlay kecil */}
            <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow-md backdrop-blur-sm">
              Est. {YEAR}
            </div>
          </div>
        </div>

        {/* State info sederhana */}
        {isLoading && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Memuat foto terbaru…
          </p>
        )}
        {isError && (
          <p className="mt-6 text-center text-sm text-red-600">
            Gagal memuat gambar galeri. Menampilkan placeholder.
          </p>
        )}
      </div>
    </section>
  );
}