"use client";

import { useTranslation } from "@/hooks/use-translation";
import en from "@/translations/home/en";
import id from "@/translations/home/id";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  const t = useTranslation({ id, en });

  return (
    <section className="relative bg-gray-100 py-20">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
        >
          {t["cta-title-1"]} <br />
          <span className="text-[#E53935]">{t["cta-title-2"]}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-lg mb-8"
        >
          {t["cta-subtitle"]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/product"
            className="px-8 py-4 bg-[#E53935] text-white text-lg font-semibold rounded-xl shadow-md hover:bg-red-600 transition"
          >
            {t["cta-btn"]}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
