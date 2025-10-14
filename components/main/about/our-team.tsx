"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const team = [
  {
    name: "Ayu Pratama",
    role: "Founder & CEO",
    image: "/avatars/1.jpeg",
  },
  {
    name: "Rina Cahya",
    role: "Dermatologist Expert",
    image: "/avatars/2.jpeg",
  },
  {
    name: "Nanda Putri",
    role: "Product Development",
    image: "/avatars/3.jpeg",
  },
  {
    name: "Dewi Lestari",
    role: "Marketing Manager",
    image: "/avatars/4.jpeg",
  },
];

export default function TeamSection() {
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
          <h2 className="text-4xl lg:text-5xl font-bold text-[#6B6B6B] mb-4">
            Tim di Balik <span className="text-[#E53935]">YAMEIYA Shop</span>
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            Profesional berpengalaman yang berdedikasi menghadirkan produk Shop
            berkualitas untukmu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center group"
            >
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transform transition duration-300">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#6B6B6B]">
                {member.name}
              </h3>
              <p className="text-[#E53935] font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
