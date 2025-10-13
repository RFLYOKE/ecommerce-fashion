// components/sections/AboutStore.tsx
import Image from "next/image";
import { ShieldCheck, Truck, Sparkles } from "lucide-react";

const IMG =
  "https://i.pinimg.com/1200x/dc/28/77/dc2877f08ba923ba34c8fa70bae94128.jpg";

export default function AboutStore() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-50 to-white" />
      <div className="mx-auto px-4 py-10 md:py-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 ring-1 ring-rose-200">
              <Sparkles className="h-3.5 w-3.5" />
              Tentang Toko Kami
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
              Blackboxinc — Kualitas, Gaya, dan Kenyamanan
            </h2>
            <p className="mt-3 text-gray-600">
              Kami kurasi produk fashion dengan standar kualitas tinggi dan
              desain timeless. Misi kami sederhana: bikin kamu percaya diri
              setiap hari, tanpa ribet.
            </p>
            <ul className="mt-5 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-rose-600" />
                Garansi & kualitas terjamin
              </li>
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-rose-600" />
                Pengiriman cepat & aman
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-600" />
                Koleksi update berkala
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 blur-2xl bg-rose-200/60 rounded-3xl" />
            <div className="overflow-hidden rounded-3xl ring-1 ring-rose-200 shadow-sm">
              <Image
                src={IMG}
                alt="Tentang Blackboxinc"
                width={1200}
                height={900}
                className="h-[360px] w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}