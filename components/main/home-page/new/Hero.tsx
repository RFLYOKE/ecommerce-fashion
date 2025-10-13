"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import en from "@/translations/home/en";
import id from "@/translations/home/id";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import HeroCarousel from "../caraousel-hero";

export default function Hero() {
  const t = useTranslation({ id, en });

  return (
    <section className="relative bg-white py-16">
      <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center px-6 overflow-hidden">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            {t["hero-title-1"]}{" "}
            <span className="text-[#E53935]">{t["hero-title-2"]}</span> <br />
            {t["hero-title-3"]}
          </h1>
          <p className="text-gray-600 text-lg">{t["hero-subtitle"]}</p>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <Link
              href="/cart"
              className="px-6 py-3 bg-[#E53935] text-white font-medium rounded-xl shadow-md hover:bg-red-600 transition flex items-center gap-x-1.5"
            >
              <ShoppingBagIcon className="size-5" />
              {t["hero-cta-1"]}
            </Link>
            <Link
              href="/product"
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl shadow-md hover:bg-gray-300 transition"
            >
              {t["hero-cta-2"]}
            </Link>
          </div>
        </motion.div>

        {/* Image Content */}
          <HeroCarousel/>
      </div>
    </section>
  );
}
