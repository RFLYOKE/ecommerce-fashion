"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Palette,
  Scissors,
  Users,
  Award,
  Sparkles,
  Camera,
  Play,
  Heart,
  Share2,
  Filter,
} from "lucide-react";

// === TYPES from your shared types ===
import { GaleriItem } from "@/types/gallery";

// === SERVICE hooks ===
import {
  useGetGalleryListQuery,
  // useGetGalleryBySlugQuery, // tersedia bila nanti butuh detail per slug
} from "@/services/gallery.service";
import DotdLoader from "@/components/loader/3dot";

// Kategori untuk filter (UI)
const categories = [
  { name: "Semua", icon: <Camera className="w-4 h-4" />, color: "bg-gray-100" },
  {
    name: "Workshop",
    icon: <Users className="w-4 h-4" />,
    color: "bg-[#A3B18A]/10",
  },
  {
    name: "Produk",
    icon: <Palette className="w-4 h-4" />,
    color: "bg-[#DFF19D]/20",
  },
  {
    name: "Kegiatan",
    icon: <Scissors className="w-4 h-4" />,
    color: "bg-[#F6CCD0]/20",
  },
  {
    name: "Event",
    icon: <Award className="w-4 h-4" />,
    color: "bg-[#BFF0F5]/20",
  },
];

// View-model agar UI lama tetap bisa pakai `category`, `date`, dan url gambar string
type GaleriCard = {
  id: number;
  title: string;
  description: string;
  date?: string; // dari published_at
  category: string; // derivasi dari judul
  image_url: string; // string yang aman untuk <Image src=...>
  // Simpan raw jika suatu saat butuh akses field asli
  __raw: GaleriItem;
};

interface GaleriModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GaleriCard | null;
}

function toImageUrl(img: GaleriItem["image"]): string {
  if (typeof img === "string" && img) return img;
  return "/api/placeholder/400/300";
}

function toCategoryFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("workshop")) return "Workshop";
  if (t.includes("produk") || t.includes("product")) return "Produk";
  if (t.includes("kegiatan") || t.includes("activity")) return "Kegiatan";
  if (t.includes("event") || t.includes("exhibition") || t.includes("pameran"))
    return "Event";
  return "Kegiatan"; // fallback agar tetap masuk salah satu filter yang ada
}

function toReadableDate(published_at?: string): string | undefined {
  if (!published_at) return undefined;
  const d = new Date(published_at);
  if (isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function GaleriModal({ isOpen, onClose, item }: GaleriModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="relative h-96">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3">
            <span className="text-xs text-[#A3B18A] font-medium">
              {item.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {item.title}
          </h2>
          <p className="text-gray-600 mb-4">{item.__raw.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{item.date}</span>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#A3B18A]/10 text-[#A3B18A] rounded-xl hover:bg-[#A3B18A]/20 transition-colors">
                <Heart className="w-4 h-4" />
                Suka
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#F6CCD0]/20 text-gray-700 rounded-xl hover:bg-[#F6CCD0]/30 transition-colors">
                <Share2 className="w-4 h-4" />
                Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<GaleriCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ambil data galeri dari service (pagination bebas; default contoh: 12 item)
  const { data, isLoading, isError, refetch } = useGetGalleryListQuery({
    page: 1,
    paginate: 12,
  });

  // Mapping API -> view-model untuk dipakai UI lama
  const galeriCards: GaleriCard[] = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      date: toReadableDate(g.published_at),
      category: toCategoryFromTitle(g.title),
      image_url: toImageUrl(g.image),
      __raw: g,
    }));
  }, [data]);

  const filteredList: GaleriCard[] =
    selectedCategory === "Semua"
      ? galeriCards
      : galeriCards.filter((item) => item.category === selectedCategory);

  const handleClick = (item: GaleriCard) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10">
      {/* Header Section */}
      <section className="pt-24 pb-12 px-6 lg:px-12 bg-gradient-to-r from-[#A3B18A] to-[#A3B18A]/80">
        <div className="container mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium">Galeri COLORE</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Momen Kreatif
            <span className="block">Bersama COLORE</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Dokumentasi kegiatan seru, workshop edukatif, dan produk ramah
            lingkungan yang mengembangkan kreativitas ribuan anak Indonesia.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#DFF19D]"></div>
              <span>Workshop Kreatif</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#F6CCD0]"></div>
              <span>Produk Ramah Lingkungan</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full shadow-sm">
              <div className="w-3 h-3 rounded-full bg-[#BFF0F5]"></div>
              <span>Event Edukatif</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#A3B18A]/10">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-[#A3B18A]" />
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Kategori
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.name
                      ? "bg-[#A3B18A] text-white shadow-lg"
                      : `${category.color} text-gray-700 hover:bg-[#A3B18A] hover:text-white border border-gray-200`
                  }`}
                >
                  {category.icon}
                  {category.name}
                  {selectedCategory === category.name && (
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      {filteredList.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center justify-between">
            {isLoading ? (
              <div className="w-full flex justify-center items-center">
                <DotdLoader />
              </div>
            ) : isError ? (
              <div className="flex items-center gap-3">
                <p className="text-red-600">Gagal memuat galeri.</p>
                <button
                  onClick={() => refetch()}
                  className="px-3 py-1.5 rounded-xl border text-sm"
                >
                  Coba lagi
                </button>
              </div>
            ) : (
              <p className="text-gray-600">
                Menampilkan{" "}
                <span className="font-semibold text-[#A3B18A]">
                  {filteredList.length}
                </span>{" "}
                foto
              </p>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(isLoading ? [] : filteredList).map((item, index) => {
              const patterns = [
                "aspect-square",
                "aspect-[4/3]",
                "aspect-[3/4]",
                "aspect-square",
              ];
              const aspectClass = patterns[index % patterns.length];

              return (
                <div
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`relative overflow-hidden rounded-3xl cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white ${
                    index % 6 === 0 || index % 6 === 3 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className={`relative ${aspectClass} overflow-hidden`}>
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white/90 backdrop-blur-sm text-[#A3B18A] px-3 py-1 rounded-full text-xs font-semibold">
                        {item.category}
                      </span>
                    </div>

                    {/* Play Icon for Workshop/Events */}
                    {(item.category === "Workshop" ||
                      item.category === "Event") && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-[#A3B18A] ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.__raw.description && (
                        <p className="text-sm text-white/90 line-clamp-2">
                          {item.__raw.description}
                        </p>
                      )}
                      {item.date && (
                        <p className="text-xs text-white/70 mt-2">
                          {item.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mobile Title */}
                  <div className="p-4 sm:hidden">
                    <h3 className="font-semibold text-gray-900 text-center">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-center mt-1">
                      {item.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {!isLoading && !isError && filteredList.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#A3B18A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-[#A3B18A]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Belum ada foto
              </h3>
              <p className="text-gray-600 mb-6">
                Foto untuk kategori ini belum tersedia.
              </p>
              <button
                onClick={() => setSelectedCategory("Semua")}
                className="bg-[#A3B18A] text-white px-6 py-3 rounded-2xl hover:bg-[#A3B18A]/90 transition-colors"
              >
                Lihat Semua Foto
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-[#A3B18A] to-[#A3B18A]/80 rounded-3xl p-8 text-white text-center">
            <h3 className="text-3xl font-bold mb-6">Kreativitas Tanpa Batas</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-white/90">Workshop</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-white/90">Produk</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-white/90">Anak Bahagia</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-white/90">Ramah Lingkungan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-[#A3B18A]/10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Bergabung dengan Komunitas Kreatif
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Daftarkan anak Anda untuk workshop berikutnya dan saksikan
              kreativitas mereka berkembang dengan produk-produk ramah
              lingkungan dari COLORE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#A3B18A] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#A3B18A]/90 transition-colors flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Daftar Workshop
              </button>
              <button className="border border-[#A3B18A] text-[#A3B18A] px-8 py-4 rounded-2xl font-semibold hover:bg-[#A3B18A] hover:text-white transition-colors">
                Lihat Produk
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <GaleriModal
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
      />
    </div>
  );
}