"use client";

import { useTranslation } from "@/hooks/use-translation";
import en from "@/translations/home/en";
import id from "@/translations/home/id";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Ayu Pratiwi",
    role: "Pelanggan",
    feedback:
      "Setelah 2 minggu pakaiBLACKBOXINC Shop, kulitku jadi lebih lembap dan cerah. Produk ini bener-bener bikin percaya diri!",
    image: "/avatars/1.jpeg",
  },
  {
    name: "Dewi Lestari",
    role: "Pelanggan",
    feedback:
      "Aku punya kulit sensitif, tapi ShopBLACKBOXINC Shop ternyata aman banget dan bikin kulitku glowing tanpa iritasi.",
    image: "/avatars/2.jpeg",
  },
  {
    name: "Nadia Putri",
    role: "Pelanggan",
    feedback:
      "Produk terbaik yang pernah aku coba! Teksturnya ringan dan hasilnya nyata. Highly recommended.",
    image: "/avatars/3.jpeg",
  },
];

export default function Testimonials() {
  const t = useTranslation({ id, en });

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
        >
          {t["testimony-title"]}
        </motion.h2>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                “{t.feedback}”
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
