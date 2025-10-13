"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

const tabs = [
  {
    label: "Nilai Kami",
    image:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6breB2JigyoGnIOWsFHm8Cc2aREpdLo36xh9NA7", // Example image for values
    content: [
      {
        title: "Akhlak Karimah",
        points: [
          "Membentuk santri yang berakhlak mulia sesuai ajaran Al-Qur'an dan Sunnah.",
          "Menerapkan nilai-nilai kejujuran, disiplin, dan tanggung jawab.",
          "Menumbuhkan rasa hormat kepada guru, orang tua, dan sesama.",
        ],
      },
      {
        title: "Ilmu Amaliah",
        points: [
          "Mengutamakan penguasaan ilmu agama dan umum yang seimbang.",
          "Mendorong santri untuk mengamalkan ilmu yang telah dipelajari dalam kehidupan sehari-hari.",
        ],
      },
      {
        title: "Kemasyarakatan",
        points: [
          "Melatih santri untuk peka terhadap lingkungan sosial dan berkontribusi positif.",
          "Membekali santri dengan jiwa kepemimpinan dan pengabdian kepada masyarakat.",
        ],
      },
    ],
  },
  {
    label: "Visi Kami",
    image:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brUxj6VpBWSPehBoYMr1DQnmd5C42qTFw3NOEk",
    content: [
      {
        title: "Mencetak Generasi Qur'ani dan Berdaya Saing Global",
        points: [
          "Menjadi lembaga pendidikan Islam unggulan yang melahirkan ulama dan pemimpin masa depan.",
          "Menyebarkan nilai-nilai Islam rahmatan lil 'alamin.",
        ],
      },
    ],
  },
  {
    label: "Misi Kami",
    image:
      "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6broH5TwbUTjB3H0KvwO9YpDsMkAhxlSc8uyb24", // Example image for mission
    content: [
      {
        title: "Misi Pondok Pesantren",
        points: [
          "Menyelenggarakan pendidikan agama dan umum secara terintegrasi.",
          "Mengembangkan potensi santri dalam berbagai bidang (akademik, non-akademik, kewirausahaan).",
          "Menciptakan lingkungan belajar yang kondusif dan islami.",
          "Membina santri agar memiliki kemandirian dan jiwa dakwah.",
        ],
      },
    ],
  },
];

export default function ValuePondokPesantren() {
  const [activeTab, setActiveTab] = useState(0);
  const current = tabs[activeTab];

  return (
    <section
      id="profile-pondok-pesantren" // Changed ID to reflect pondok pesantren
      className="relative bg-white py-20 overflow-hidden"
    >
      {/* Pola Background (opsional) */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-5 pointer-events-none z-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Text & Tab Section */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 leading-tight text-center md:text-left">
            Mengenal Pondok Pesantren
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={clsx(
                  "px-4 py-2 text-sm rounded-md transition border",
                  activeTab === i
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-green-700 border-neutral-300 hover:bg-green-50" // Adjusted hover color
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {current.content.map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold text-green-700 text-base md:text-lg mb-1">
                  ✅ {section.title}
                </h4>
                <ul className="list-disc list-inside text-neutral-700 text-sm md:text-base space-y-1 pl-4">
                  {section.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center md:justify-end">
          <Image
            src={current.image}
            alt={current.label}
            width={600}
            height={600}
            className="rounded-lg w-full h-[400px] md:h-[500px] object-cover shadow-md"
          />
        </div>
      </div>
    </section>
  );
}