"use client";
import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Heart, Sparkles } from "lucide-react";

const values = [
  {
    icon: <Leaf className="w-8 h-8 text-[#E53935]" />,
    title: "Bahan Alami",
    description:
      "Setiap produk dibuat dari ekstrak alami pilihan yang lembut dan aman untuk kulit.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#6B6B6B]" />,
    title: "Dermatologically Tested",
    description:
      "Teruji oleh ahli dermatologi untuk memastikan keamanan dan kualitas terbaik.",
  },
  {
    icon: <Heart className="w-8 h-8 text-[#E53935]" />,
    title: "Cruelty Free",
    description:
      "Kami berkomitmen tidak melakukan uji coba pada hewan dalam setiap proses produksi.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-[#6B6B6B]" />,
    title: "Hasil Terbukti",
    description:
      "Didukung testimoni nyata pelanggan dengan hasil kulit yang lebih sehat & glowing.",
  },
];

export default function Values() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#6B6B6B] mb-6">
            Nilai Utama <span className="text-[#E53935]">YAMEIYA Shop</span>
          </h2>
          <p className="text-xl text-[#6B6B6B] max-w-3xl mx-auto">
            Prinsip yang selalu kami pegang dalam menciptakan Shop berkualitas
            untukmu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-2xl bg-gray-100 group-hover:scale-110 transform transition duration-300">
                  {value.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#6B6B6B] mb-4">
                {value.title}
              </h3>
              <p className="text-[#6B6B6B] leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
