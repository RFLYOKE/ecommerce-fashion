"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Search,
  Grid3X3,
  List,
  Sparkles,
  Package,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/admin/product";
import {
  useGetProductListQuery,
  useGetProductBySlugQuery,
} from "@/services/product.service";
import DotdLoader from "@/components/loader/3dot";

// ==== Cart (tanpa sidebar)
import useCart from "@/hooks/use-cart";

type ViewMode = "grid" | "list";

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [filter, setFilter] = useState({
    category: "all",
    ageGroup: "all", // tidak ada di data API; dibiarkan agar UI tidak berubah
    priceRange: "all",
    sort: "featured",
  });

  // Cart actions
  const { addItem } = useCart();

  // === Pagination from API ===
  const ITEMS_PER_PAGE = 9;

  const {
    data: listResp,
    isLoading,
    isError,
    refetch,
  } = useGetProductListQuery({
    page: currentPage,
    paginate: ITEMS_PER_PAGE,
    product_merk_id: 1
  });

  const totalPages = useMemo(() => listResp?.last_page ?? 1, [listResp]);
  const products = useMemo(() => listResp?.data ?? [], [listResp]);

  // === Detail by slug (modal) ===
  const {
    data: detailProduct,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetProductBySlugQuery(selectedSlug ?? "", {
    skip: !selectedSlug,
  });

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // === Add to cart via zustand (persist ke localStorage)
  const addToCart = (product: Product) => {
    addItem(product);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cartUpdated")); // kompatibel dgn logic globalmu
    }
  };

  const openProductModal = (p: Product) => {
    setSelectedSlug(p.slug);
    setIsModalOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Helpers
  const getImageUrl = (p: Product): string => {
    if (typeof p.image === "string" && p.image) return p.image;
    const media = (p as unknown as { media?: Array<{ original_url: string }> })
      .media;
    if (Array.isArray(media) && media.length > 0 && media[0]?.original_url) {
      return media[0].original_url;
    }
    return "/api/placeholder/400/400";
  };

  const toNumber = (val: number | string): number => {
    if (typeof val === "number") return val;
    const parsed = parseFloat(val);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // === Client-side filter & sort (hanya pada page aktif dari API) ===
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(term) ||
        p.category_name.toLowerCase().includes(term);
      const matchCategory =
        filter.category === "all" || p.category_name === filter.category;

      const price = p.price;
      const matchPrice =
        filter.priceRange === "all" ||
        (filter.priceRange === "under-100k" && price < 100_000) ||
        (filter.priceRange === "100k-200k" &&
          price >= 100_000 &&
          price <= 200_000) ||
        (filter.priceRange === "above-200k" && price > 200_000);

      // Filter out "Jasa" products - only show "Produk" type
      // const isNotJasa = !p.merk_name || p.merk_name.toLowerCase() !== "jasa";

      // ageGroup tidak ada di data; diabaikan
      return matchSearch && matchCategory && matchPrice;
    });
  }, [products, searchTerm, filter.category, filter.priceRange]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    switch (filter.sort) {
      case "price-low":
        return arr.sort((a, b) => a.price - b.price);
      case "price-high":
        return arr.sort((a, b) => b.price - a.price);
      case "rating":
        return arr.sort((a, b) => toNumber(b.rating) - toNumber(a.rating));
      case "newest":
        // tidak ada field tanggal urut khusus; dibiarkan apa adanya
        return arr;
      default:
        // featured: tidak ada flag; biarkan urutan dari API
        return arr;
    }
  }, [filteredProducts, filter.sort]);

  // === Loading & Error states sederhana (UI tetap) ===
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-3">
            Gagal memuat produk.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl border"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#6B6B6B]/10">
      {/* ===================== Header / Hero ===================== */}
      <section className="relative pt-24 pb-12 px-6 lg:px-12 overflow-hidden bg-white">
        {/* background aksen */}
        <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-[#E53935]/10 blur-3xl opacity-50" />
        <div className="absolute top-1/3 right-[-10%] w-[28rem] h-[28rem] rounded-full bg-[#6B6B6B]/10 blur-3xl opacity-40" />

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#E53935]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#E53935]" />
            <span className="text-sm font-medium text-[#6B6B6B]">
              Perawatan Kulit Premium
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-[#6B6B6B] mb-6">
            Koleksi Skincare{" "}
            <span className="block text-[#E53935]">YAMEIYA SKINCARE</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Temukan rangkaian skincare terbaik untuk kulit sehat, segar, dan
            bercahaya alami.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E53935] rounded-full" />
              <span>Dermatologically Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#6B6B6B] rounded-full" />
              <span>100% Aman & Halal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-black rounded-full" />
              <span>Bahan Alami Berkualitas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Filters & Search (Skincare Theme) ===================== */}
      <section className="px-6 lg:px-12 mb-8">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari skincare..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                {/* Category */}
                <select
                  value={filter.category}
                  onChange={(e) =>
                    setFilter({ ...filter, category: e.target.value })
                  }
                  className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53935] bg-white text-[#6B6B6B]"
                >
                  <option value="all">Semua Produk</option>
                  <option value="cleanser">Cleanser</option>
                  <option value="toner">Toner</option>
                  <option value="serum">Serum</option>
                  <option value="moisturizer">Moisturizer</option>
                  <option value="sunscreen">Sunscreen</option>
                  <option value="masker">Masker</option>
                  <option value="bodycare">Body Care</option>
                </select>

                {/* Price */}
                <select
                  value={filter.priceRange}
                  onChange={(e) =>
                    setFilter({ ...filter, priceRange: e.target.value })
                  }
                  className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53935] bg-white text-[#6B6B6B]"
                >
                  <option value="all">Semua Harga</option>
                  <option value="under-100k">Di bawah Rp100.000</option>
                  <option value="100k-200k">Rp100.000 - Rp200.000</option>
                  <option value="200k-500k">Rp200.000 - Rp500.000</option>
                  <option value="above-500k">Di atas Rp500.000</option>
                </select>

                {/* Sort */}
                <select
                  value={filter.sort}
                  onChange={(e) =>
                    setFilter({ ...filter, sort: e.target.value })
                  }
                  className="px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E53935] bg-white text-[#6B6B6B]"
                >
                  <option value="featured">Unggulan</option>
                  <option value="newest">Terbaru</option>
                  <option value="price-low">Harga: Rendah - Tinggi</option>
                  <option value="price-high">Harga: Tinggi - Rendah</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#E53935] text-white shadow-sm"
                      : "text-[#6B6B6B] hover:text-[#E53935]"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-colors ${
                    viewMode === "list"
                      ? "bg-[#E53935] text-white shadow-sm"
                      : "text-[#6B6B6B] hover:text-[#E53935]"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid / List */}
      <section className="px-6 lg:px-12 pb-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            {isLoading ? (
              <div className="w-full flex justify-center items-center min-h-48">
                <DotdLoader />
              </div>
            ) : (
              <p className="text-[#6B6B6B]">
                Menampilkan {sortedProducts?.length ?? 0} dari{" "}
                {products?.length ?? 0} produk
              </p>
            )}
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {sortedProducts.map((product) => {
                const img = getImageUrl(product);
                const ratingNum = toNumber(product.rating);
                const reviews = product.total_reviews;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                  >
                    <div className="relative">
                      <Image
                        src={img}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`p-2 rounded-full shadow-lg transition-colors ${
                            wishlist.includes(product.id)
                              ? "bg-[#E53935] text-white"
                              : "bg-white text-[#6B6B6B] hover:text-[#E53935]"
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              wishlist.includes(product.id)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => openProductModal(product)}
                          className="p-2 bg-white text-[#6B6B6B] hover:text-[#E53935] rounded-full shadow-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-3">
                        <span className="text-xs text-[#6B6B6B] font-medium">
                          {product.category_name}
                        </span>
                        <h3 className="text-lg font-bold text-[#000000] mt-1 line-clamp-2">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(ratingNum)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-[#6B6B6B]">
                          ({reviews})
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-[#6B6B6B]">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-[#E53935] text-white py-3 rounded-2xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedProducts.map((product) => {
                const img = getImageUrl(product);
                const ratingNum = toNumber(product.rating);
                const reviews = product.total_reviews;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-80">
                        <Image
                          src={img}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <span className="text-sm text-[#6B6B6B] font-medium">
                                {product.category_name}
                              </span>
                              <h3 className="text-2xl font-bold text-[#000000] mt-1">
                                {product.name}
                              </h3>
                            </div>
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              className={`p-2 rounded-full transition-colors ${
                                wishlist.includes(product.id)
                                  ? "bg-[#E53935] text-white"
                                  : "bg-gray-100 text-[#6B6B6B] hover:text-[#E53935]"
                              }`}
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  wishlist.includes(product.id)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>

                          <p className="text-[#6B6B6B] mb-4 line-clamp-3">
                            {product.description}
                          </p>

                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= Math.round(ratingNum)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-[#6B6B6B]">
                              ({reviews} ulasan)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-[#6B6B6B]">
                              Rp {product.price.toLocaleString("id-ID")}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => openProductModal(product)}
                              className="px-6 py-3 border border-[#6B6B6B] text-[#6B6B6B] rounded-2xl hover:bg-[#6B6B6B] hover:text-white transition-colors"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => addToCart(product)}
                              className="px-6 py-3 bg-[#E53935] text-white rounded-2xl hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                              <ShoppingCart className="w-5 h-5" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#6B6B6B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-[#6B6B6B]" />
              </div>
              <h3 className="text-2xl font-bold text-[#000000] mb-4">
                Produk tidak ditemukan
              </h3>
              <p className="text-[#6B6B6B] mb-6">
                Coba ubah filter atau kata kunci pencarian Anda.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter({
                    category: "all",
                    ageGroup: "all",
                    priceRange: "all",
                    sort: "featured",
                  });
                }}
                className="bg-[#E53935] text-white px-6 py-3 rounded-2xl hover:bg-red-700 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="px-6 lg:px-12 pb-4">
          <div className="container mx-auto">
            <div className="flex justify-center items-center gap-4">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-6 py-3 border border-[#6B6B6B] text-[#6B6B6B] rounded-2xl 
                     hover:bg-[#E53935] hover:text-white transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-12 h-12 rounded-2xl font-semibold transition-colors ${
                        currentPage === page
                          ? "bg-[#E53935] text-white"
                          : "border border-[#6B6B6B] text-[#6B6B6B] hover:bg-[#E53935] hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-6 py-3 border border-[#6B6B6B] text-[#6B6B6B] rounded-2xl 
                     hover:bg-[#E53935] hover:text-white transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Product Detail Modal (by slug) */}
      {isModalOpen && selectedSlug && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-[#000000]">
                  Detail Produk
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedSlug(null);
                  }}
                  className="p-2 hover:bg-[#6B6B6B]/10 rounded-2xl transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Error State */}
              {isDetailError && (
                <div className="text-[#E53935]">
                  Gagal memuat detail produk.
                </div>
              )}

              {/* Loading State */}
              {isDetailLoading && (
                <div className="w-full flex justify-center items-center min-h-32">
                  <DotdLoader />
                </div>
              )}

              {/* Content */}
              {detailProduct && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div className="relative">
                    <Image
                      src={getImageUrl(detailProduct)}
                      alt={detailProduct.name}
                      width={500}
                      height={400}
                      className="w-full h-96 object-cover rounded-2xl"
                    />
                  </div>

                  {/* Product Info */}
                  <div>
                    <span className="text-sm text-[#6B6B6B] font-medium">
                      {detailProduct.category_name}
                    </span>
                    <h3 className="text-3xl font-bold text-[#000000] mt-2 mb-4">
                      {detailProduct.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(toNumber(detailProduct.rating))
                                ? "fill-[#E53935] text-[#E53935]"
                                : "text-[#6B6B6B]/40"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[#6B6B6B]">
                        ({detailProduct.total_reviews} ulasan)
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[#6B6B6B] mb-6">
                      {detailProduct.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-4xl font-bold text-[#E53935]">
                        Rp {detailProduct.price.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
                        <span className="font-medium">Kategori:</span>
                        <span>{detailProduct.category_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
                        <span className="font-medium">Merk Produk:</span>
                        <span>{detailProduct.merk_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
                        <span className="font-medium">Stok:</span>
                        <span>{detailProduct.duration}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          addToCart(detailProduct);
                          setIsModalOpen(false);
                          setSelectedSlug(null);
                        }}
                        className="flex-1 bg-[#E53935] text-white py-4 rounded-2xl font-semibold 
                             hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
