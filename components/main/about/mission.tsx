"use client";
import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#6B6B6B] mb-6">
            Visi & <span className="text-[#E53935]">Misi</span>
          </h2>
          <p className="text-lg text-[#6B6B6B] leading-relaxed mb-6">
            BLACKBOXINC Shop hadir untuk menghadirkan perawatan kulit terbaik
            dengan mengutamakan kualitas, keamanan, dan inovasi.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white shadow-lg rounded-3xl p-6 border-l-4 border-[#E53935]">
            <h3 className="text-2xl font-bold text-[#6B6B6B] mb-2">Visi</h3>
            <p className="text-[#6B6B6B]">
              Menjadi brand Shop terpercaya yang membantu setiap individu meraih
              kulit sehat dan bercahaya.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-3xl p-6 border-l-4 border-[#6B6B6B]">
            <h3 className="text-2xl font-bold text-[#6B6B6B] mb-2">Misi</h3>
            <p className="text-[#6B6B6B]">
              Memberikan produk berkualitas tinggi dengan bahan alami pilihan,
              inovasi berkelanjutan, dan pelayanan terbaik untuk semua
              pelanggan.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
