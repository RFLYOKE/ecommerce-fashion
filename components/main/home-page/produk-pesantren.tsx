"use client";

import Image from "next/image";
import { Banknote, ShoppingBag, Smartphone, Leaf } from "lucide-react"; // Added Check icon if needed

export default function ProdukPondokPesantrenSection() {
  const produk = [
    {
      icon: <Banknote className="w-6 h-6 text-green-600" />,
      title: "Produk Keuangan Syariah",
      items: [
        "Simpanan Mudharabah & Wadiah",
        "Pembiayaan Murabahah & Musyarakah",
        "Donasi & Zakat Online",
      ],
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-green-600" />,
      title: "Produk Halal & Berkualitas",
      items: [
        "Sembako & kebutuhan pesantren",
        "Produk UMKM santri & alumni",
        "Buku Islami & alat ibadah",
      ],
    },
    {
      icon: <Smartphone className="w-6 h-6 text-green-600" />,
      title: "Layanan Digital Pesantren",
      items: [
        "Pembayaran SPP & tagihan online",
        "Marketplace khusus pondok",
        "Aplikasi Mobile Pesantren",
      ],
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: "Produk Unggulan Santri & Alumni",
      items: [
        "Kerajinan tangan santri",
        "Hasil pertanian organik",
        "Jasa layanan alumni (laundry, catering)",
      ],
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brohSKqsUTjB3H0KvwO9YpDsMkAhxlSc8uyb24" // Updated background image
          alt="Produk Pondok Pesantren"
          layout="fill"
          objectFit="cover"
          className="brightness-50" // Adjust brightness as needed for readability
          priority // Added priority
        />
        <div className="absolute inset-0 bg-black/50" />{" "}
        {/* Darker overlay for text contrast */}
      </div>

      {/* Content on top of background */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Produk & Layanan Unggulan Pondok Pesantren
        </h2>
        <p className="max-w-2xl mx-auto mb-12 text-neutral-200">
          BLACKBOXINC menyediakan berbagai produk unggulan dan layanan syariah
          untuk mendukung kesejahteraan santri, alumni, dan masyarakat luas
          melalui ekosistem ekonomi pesantren.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {produk.map((p, idx) => (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 space-y-4 hover:-translate-y-2 transition text-neutral-800 cursor-pointer border border-green-200" // Added border for visual pop
            >
              <div className="text-green-600 mb-2">{p.icon}</div>{" "}
              {/* Adjusted icon spacing */}
              <h3 className="font-semibold text-lg text-gray-900">
                {p.title}
              </h3>{" "}
              {/* Ensured title color */}
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                {" "}
                {/* Ensured list item color */}
                {p.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
