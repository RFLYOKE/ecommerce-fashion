/* Stats Section */
"use client";
import { motion } from "framer-motion";

const stats = [
  { number: "10.000+", label: "Pelanggan Puas" },
  { number: "50+", label: "Produk Skincare" },
  { number: "15+", label: "Penghargaan & Sertifikasi" },
  { number: "5 Tahun", label: "Pengalaman" },
];

export default function Stats() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#6B6B6B] mb-4">
            Pencapaian <span className="text-[#E53935]">YAMEIYA SKINCARE</span>
          </h2>
          <p className="text-lg text-[#6B6B6B]">
            Bukti nyata kualitas kami yang dipercaya ribuan pelanggan.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white rounded-3xl shadow-md p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-[#E53935] mb-2">
                {stat.number}
              </h3>
              <p className="text-[#6B6B6B]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
