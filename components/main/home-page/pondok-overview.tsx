"use client";

import Image from "next/image";
import * as React from "react";

// Importing icons for the "Keistimewaan Produk" section
import { CheckCircle, Leaf, Apple, Heart } from "lucide-react";

export default function PondokPesantrenOverview() {
  return (
    <div className="bg-gray-50 font-sans">
      {/* Top Section: Welcome to Pondok Pesantren */}
      <section className="relative py-20 md:py-32 text-white overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brohSKqsUTjB3H0KvwO9YpDsMkAhxlSc8uyb24"
          alt="Pondok Pesantren Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          priority // High priority for background image
        />
        {/* Green Overlay */}
        <div className="absolute inset-0 bg-green-800 opacity-80 z-10"></div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 lg:px-12 text-center md:text-left">
          <div className="max-w-3xl mx-auto md:mx-0">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Selamat Datang di
              <br />
              <span className="text-yellow-400">Pondok Pesantren</span> Kami
            </h2>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Jelajahi keaslian dan keberkahan produk halal dari hasil karya
              santri dan masyarakat pondok pesantren. Setiap pembelian adalah
              dukungan nyata untuk pengembangan pendidikan dan ekonomi syariah.
            </p>
          </div>
        </div>
      </section>

      {/* Middle Section: Keistimewaan Produk Halal dan Berkualitas */}
      <section className="pt-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Character Image (Left) */}
          <div className="flex justify-center md:justify-start">
            <Image
              src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brqYF5Hyicv41eBfsxt7X8FgPwidUamN0jOh5E"
              alt="Santri Chef with Basket"
              width={700}
              height={700}
              className="w-full max-w-xl h-auto object-contain"
            />
          </div>

          {/* Text Content and Benefits (Right) */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              Apa Keistimewaan
              <br />
              <span className="text-green-700">Produk Kami?</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <CheckCircle className="text-green-600 flex-shrink-0 w-6 h-6" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Halal dan Higienis
                  </h3>
                  <p className="text-sm text-gray-600">
                    Diproses sesuai syariat dan standar kebersihan tinggi.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <Leaf className="text-green-600 flex-shrink-0 w-6 h-6" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Bahan Alami Pilihan
                  </h3>
                  <p className="text-sm text-gray-600">
                    Dari hasil perkebunan dan peternakan pondok sendiri.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <Apple className="text-green-600 flex-shrink-0 w-6 h-6" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Nutrisi Seimbang
                  </h3>
                  <p className="text-sm text-gray-600">
                    Menyajikan makanan bergizi untuk keluarga sehat.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <Heart className="text-green-600 flex-shrink-0 w-6 h-6" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Dukungan Ekonomi Umat
                  </h3>
                  <p className="text-sm text-gray-600">
                    Setiap pembelian memberdayakan santri dan masyarakat pondok.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Kategori Produk Pondok */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Kategori Produk <span className="text-green-700">Pondok</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category Card 1 */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brA5W9hBnIir0xdSLwavBoJFRCqeUguODGPX8T" // Placeholder Image
                alt="Makanan Sehat"
                width={500}
                height={300}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Makanan Sehat</h3>
                  <p className="text-sm text-white/90">
                    Aneka olahan pangan alami dan bergizi dari hasil pertanian
                    pondok.
                  </p>
                </div>
              </div>
            </div>

            {/* Category Card 2 */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6br8KLbQqTwmd4pFkisl2N5qC9AfRyHaMDWjzg1" // Placeholder Image
                alt="Herbal dan Obat Tradisional"
                width={500}
                height={300}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    Herbal & Obat Tradisional
                  </h3>
                  <p className="text-sm text-white/90">
                    Ramuan alami warisan leluhur untuk kesehatan holistik.
                  </p>
                </div>
              </div>
            </div>

            {/* Category Card 3 */}
            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6br2VOQN3AI8Jh3rQjCSBNRAxdZVoMUuy7we6Eb" // Placeholder Image
                alt="Kerajinan Santri"
                width={500}
                height={300}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Kerajinan Santri</h3>
                  <p className="text-sm text-white/90">
                    Karya seni tangan santri yang unik dan penuh makna.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}