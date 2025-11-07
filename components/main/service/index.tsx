"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import ReservationModal from "./reservation-modal";
import { useGetProductListQuery } from "@/services/product.service";

interface Service {
  id: number;
  thumbnail: string;
  images: Array<{ image: string }>;
  name: string;
  description: string;
  price: number;
  duration: string;
  category_name: string;
  merk_name: string;
}

type Maybe<T> = T | null | undefined;

interface ShopProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  duration?: Maybe<number | string>;
  category_name: string;
  merk_name: string;
  image?: Maybe<string>;
  image_2?: Maybe<string>;
  image_3?: Maybe<string>;
  image_4?: Maybe<string>;
  image_5?: Maybe<string>;
  image_6?: Maybe<string>;
  image_7?: Maybe<string>;
}

interface Paginated<T> {
  data: T[];
  last_page?: number;
}

// helper type predicate untuk filter gambar
const isNonEmptyString = (v: Maybe<string>): v is string =>
  typeof v === "string" && v.trim() !== "";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ product_merk_id harus array
  const {
    data: shopProductsData,
    isLoading,
    error,
  } = useGetProductListQuery({
    page: currentPage,
    paginate: 9,
    product_merk_id: [2], // ← perbaikan: number[] bukan number
  });

  const services = useMemo<Service[]>(() => {
    const paged = shopProductsData as Paginated<ShopProduct> | undefined;
    if (!paged?.data) return [];

    return paged.data
      .filter((product) => product.merk_name?.toLowerCase() === "jasa")
      .map((product) => {
        const imagesSrc: string[] = [
          product.image,
          product.image_2,
          product.image_3,
          product.image_4,
          product.image_5,
          product.image_6,
          product.image_7,
        ].filter(isNonEmptyString);

        const getFallbackImage = (categoryName: string) => {
          const category = categoryName?.toLowerCase();
          if (category?.includes("facial"))
            return "/images/new/services/facial-treatment.jpg";
          if (category?.includes("peeling"))
            return "/images/new/services/chemical-peeling.webp";
          if (category?.includes("microdermabrasion"))
            return "/images/new/services/microdermabrasion.webp";
          if (category?.includes("whitening"))
            return "/images/new/services/whitening-treatment.jpg";
          return "/images/new/services/facial-treatment.jpg";
        };

        return {
          id: product.id,
          thumbnail: isNonEmptyString(product.image)
            ? product.image
            : getFallbackImage(product.category_name),
          images: imagesSrc.map((img) => ({ image: img })),
          name: product.name,
          description: product.description,
          price: product.price,
          duration: product.duration ? `${product.duration} Menit` : "30 Menit",
          category_name: product.category_name,
          merk_name: product.merk_name,
        };
      });
  }, [shopProductsData]);

  const totalPages = useMemo(
    () => shopProductsData?.last_page ?? 1,
    [shopProductsData]
  );

  const getImageUrl = (p: Service): string => {
    if (p.thumbnail) return p.thumbnail;
    const media = (p as unknown as { media?: Array<{ original_url: string }> })
      .media;
    if (Array.isArray(media) && media.length > 0 && media[0]?.original_url) {
      return media[0].original_url;
    }
    return "/api/placeholder/400/400";
  };

  const openModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const renderPaginationButtons = () => {
    const pageButtons: Array<number | "..."> = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pageButtons.push(i);
    } else {
      pageButtons.push(1);
      if (currentPage > 3) pageButtons.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pageButtons.push(i);
      }
      if (currentPage < totalPages - 2) pageButtons.push("...");
      pageButtons.push(totalPages);
    }

    return pageButtons.map((page, index) =>
      page === "..." ? (
        <span key={index} className="px-4 py-2 text-[#6B6B6B]">
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => setCurrentPage(Number(page))}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            currentPage === page
              ? "bg-[#E53935] text-white"
              : "border border-[#6B6B6B] text-[#6B6B6B] hover:bg-[#E53935] hover:text-white"
          }`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <section className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 lg:px-12 bg-gradient-to-r from-white via-[#F5F5F5] to-[#FFEAEA]">
        <div className="container mx-auto text-center text-[#6B6B6B]">
          <div className="inline-flex items-center gap-2 bg-[#E53935]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#E53935]" />
            <span className="text-sm font-medium">Layanan Perawatan Kulit</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Rawat Kulitmu
            <span className="block text-[#E53935]">
              Dengan Sentuhan Profesional
            </span>
          </h1>
          <p className="text-xl text-[#6B6B6B] max-w-3xl mx-auto mb-8">
            Nikmati berbagai layanan perawatan kulit seperti facial, peeling,
            dan treatment eksklusif lainnya untuk menjaga kesehatan dan
            kecantikan kulit Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
              <div className="w-3 h-3 rounded-full bg-[#E53935]" />
              <span>Facial</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
              <div className="w-3 h-3 rounded-full bg-[#6B6B6B]" />
              <span>Peeling</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
              <div className="w-3 h-3 rounded-full bg-[#E53935]" />
              <span>Treatment Eksklusif</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div id="services" className="container mx-auto px-6 lg:px-12 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-[#000000] text-center mb-12"
        >
          Pilih Layanan Kami
        </motion.h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#6B6B6B]/20 rounded-3xl shadow-md p-6 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded-t-2xl mb-3" />
                <div className="h-6 bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Gagal memuat layanan</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#E53935] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B6B6B] mb-4">Belum ada layanan tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-[#6B6B6B]/20 rounded-3xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <Image
                    className="w-full aspect-video object-cover mb-3 rounded-t-2xl"
                    src={getImageUrl(service)}
                    width={400}
                    height={225}
                    alt={service.name}
                    unoptimized
                    onError={(e) => {
                      const getFallbackImage = (categoryName: string) => {
                        const category = categoryName?.toLowerCase();
                        if (category?.includes("facial"))
                          return "/images/new/services/facial-treatment.jpg";
                        if (category?.includes("peeling"))
                          return "/images/new/services/chemical-peeling.webp";
                        if (category?.includes("microdermabrasion"))
                          return "/images/new/services/microdermabrasion.webp";
                        if (category?.includes("whitening"))
                          return "/images/new/services/whitening-treatment.jpg";
                        return "/images/new/services/facial-treatment.jpg";
                      };
                      (e.currentTarget as HTMLImageElement).src =
                        getFallbackImage(service.category_name);
                    }}
                    priority={false}
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-[#E53935]/10 text-[#E53935] px-2 py-1 rounded-full">
                      {service.category_name}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#000000] mb-3">
                    {service.name}
                  </h3>
                  <p className="text-[#6B6B6B] mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <p className="text-sm text-[#6B6B6B] mb-2">
                    Durasi: {service.duration}
                  </p>
                  <p className="text-lg font-bold text-[#E53935]">
                    Rp {service.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => openModal(service)}
                  className="mt-6 w-full bg-[#E53935] text-white py-3 rounded-2xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Reservasi
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-12">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-[#6B6B6B] text-[#6B6B6B] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E53935] hover:text-white transition-colors"
          >
            Previous
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-[#6B6B6B] text-[#6B6B6B] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E53935] hover:text-white transition-colors"
          >
            Next
          </button>
        </div>
      )}

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </section>
  );
}
