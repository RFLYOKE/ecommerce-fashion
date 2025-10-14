"use client";

import { useTranslation } from "@/hooks/use-translation";
import en from "@/translations/home/en";
import id from "@/translations/home/id";
import { motion } from "framer-motion";
import { Leaf, FlaskRound, Droplet, Star } from "lucide-react";

export default function Features() {
  const t = useTranslation({ id, en });

  const features = [
    {
      icon: <Leaf className="w-10 h-10 text-[#E53935]" />,
      title: t["why-item-1-title"],
      desc: t["why-item-1-content"],
    },
    {
      icon: <FlaskRound className="w-10 h-10 text-[#E53935]" />,
      title: t["why-item-1-title"],
      desc: t["why-item-2-content"],
    },
    {
      icon: <Droplet className="w-10 h-10 text-[#E53935]" />,
      title: t["why-item-1-title"],
      desc: t["why-item-3-content"],
    },
    {
      icon: <Star className="w-10 h-10 text-[#E53935]" />,
      title: t["why-item-1-title"],
      desc: t["why-item-4-content"],
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
        >
          {t["why-title-1"]}{" "}
          <span className="text-[#E53935]">YAMEIYA Shop</span>?
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
