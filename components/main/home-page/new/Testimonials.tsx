// components/sections/Testimonials.tsx
"use client";

import { useTranslation } from "@/hooks/use-translation";
import en from "@/translations/home/en";
import id from "@/translations/home/id";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import clsx from "clsx";

type LocaleKey = "testimony-title";
type LocaleDict = Record<LocaleKey, string>;
type TranslationsMap = Record<"id" | "en", LocaleDict>;

const isLocaleDict = (v: unknown): v is LocaleDict =>
  typeof v === "object" &&
  v !== null &&
  "testimony-title" in (v as Record<string, unknown>);

const testimonials = [
  {
    name: "Ayu Pratiwi",
    role: "Verified Buyer",
    feedback:
      "The material quality is outstanding. It feels luxurious and the fit is absolutely perfect, just like the runway photos!",
    image: "/avatars/1.jpeg",
  },
  {
    name: "Dewi Lestari",
    role: "Fashion Enthusiast",
    feedback:
      "I was nervous about the fit, but it's incredibly flattering and versatile. A timeless piece that instantly elevates my style.",
    image: "/avatars/2.jpeg",
  },
  {
    name: "Nadia Putri",
    role: "Verified Buyer",
    feedback:
      "Best purchase this season! The construction is solid, and the attention to detail truly reflects the brand's commitment to quality.",
    image: "/avatars/3.jpeg",
  },
];

// Translations (Placeholder)
const PLACEHOLDER_TRANSLATIONS: TranslationsMap = {
  id: { "testimony-title": "Apa Kata Klien Kami" },
  en: { "testimony-title": "What Our Clients Say" },
};

const useTranslationPlaceholder = (bundles: TranslationsMap): LocaleDict => {
  // produksi: pilih dari context/locale; demo: pakai EN
  return bundles.en;
};

// Component Testimonials
export default function Testimonials() {
  const bundles: TranslationsMap = {
    id: isLocaleDict(id) ? id : PLACEHOLDER_TRANSLATIONS.id,
    en: isLocaleDict(en) ? en : PLACEHOLDER_TRANSLATIONS.en,
  };
  const t = useTranslationPlaceholder(bundles);

  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        {/* Title: Black, Bold, Uppercase */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black mb-12 uppercase tracking-wide"
        >
          {t["testimony-title"]}
        </motion.h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              // Card Styling: White background, subtle border, strong shadow on hover
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition text-left relative"
            >
              {/* 5-Star Rating (Hardcoded for visual appeal) */}
              <div className="mb-3 flex items-center justify-start gap-1 text-black">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-black text-black" />
                  ))}
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover grayscale" // Gambar profil grayscale
                  />
                  {/* Badge Verified Buyer */}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-black border-2 border-white" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-black uppercase tracking-wider">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">{t.role}</p>
                </div>
              </div>

              {/* Feedback Text */}
              <p className="text-gray-800 text-base italic leading-relaxed">
                “{t.feedback}”
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
