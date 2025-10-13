"use client";

import Image from "next/image";

const programs = [
  {
    title: "Tahfizhul Qur'an",
    image:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brUxj6VpBWSPehBoYMr1DQnmd5C42qTFw3NOEk", // Example image for Tahfiz
  },
  {
    title: "Kajian Kitab Kuning",
    image:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brKv0lD014VcdFfpgaC3D2L58U6OKsuJSRx9Yb", // Example image for Kitab Kuning
  },
  {
    title: "Pembelajaran Bahasa Arab & Inggris",
    image:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6br7VKAzkhpNrnlqaJbePh1cuk4FvyYmTIfM3Sd", // Example image for Languages
  },
  {
    title: "Ekstrakurikuler Santri",
    image:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brJiyanFsxXS4VG7LWfm6advRg0CwOth93nzoI", // Example image for Extracurricular
  },
  {
    title: "Pengabdian Masyarakat",
    image:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brAxxU1enIir0xdSLwavBoJFRCqeUguODGPX8T", // Example image for Community Service
  },
  {
    title: "Wirausaha Santri",
    image:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brDXrodole9Pq1UKOrEp3SatvGfhVg28HxdYIs", // Example image for Entrepreneurship
  },
];

export default function ProgramSection() {
  return (
    <section id="program" className="bg-white py-20 px-6 md:px-12">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-4">
          Program Unggulan Kami
        </h2>
        <p className="text-center text-neutral-600 text-base md:text-lg mb-12 max-w-3xl mx-auto">
          Kami menyelenggarakan berbagai program pendidikan dan pembinaan yang
          komprehensif untuk membentuk santri yang berilmu, berakhlak mulia,
          mandiri, dan siap berbakti kepada umat.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden group"
            >
              <Image
                src={program.image}
                alt={program.title}
                width={600}
                height={400}
                className="w-full h-[250px] object-cover transform group-hover:scale-105 transition duration-300"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white text-lg font-semibold">
                  {program.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}