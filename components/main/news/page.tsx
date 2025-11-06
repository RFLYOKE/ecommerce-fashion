"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  Search,
  Heart,
  MessageCircle,
} from "lucide-react";
import { News } from "@/types/admin/news";
import {
  useGetNewsListQuery,
  useGetNewsBySlugQuery,
} from "@/services/public-news.service";
import DotdLoader from "@/components/loader/3dot";

// ==== Utils ====
const getImageUrl = (img: File | string) =>
  typeof img === "string" && img ? img : "/api/placeholder/600/400";

const plainText = (htmlOrMd: string) =>
  htmlOrMd
    // hapus tag HTML
    .replace(/<[^>]*>/g, " ")
    // hapus markdown header
    .replace(/^#{1,6}\s+/gm, "")
    // rapikan spasi
    .replace(/\s+/g, " ")
    .trim();

const makeExcerpt = (content: string, max = 160) => {
  const text = plainText(content);
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const estimateReadTime = (content: string) => {
  const words = plainText(content).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} menit`;
};

export default function NewsPage() {
  // ===== list state
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedArticles, setLikedArticles] = useState<number[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const ARTICLES_PER_PAGE = 6;

  // ===== fetch list
  const {
    data: listResp,
    isLoading,
    isError,
    refetch,
  } = useGetNewsListQuery({
    page: currentPage,
    paginate: ARTICLES_PER_PAGE,
  });

  const totalPages = useMemo(() => listResp?.last_page ?? 1, [listResp]);
  const listItems: News[] = useMemo(() => listResp?.data ?? [], [listResp]);

  // categories dari API tidak ada → minimal "Semua"
  const categories = useMemo(
    () => [
      {
        name: "Semua",
        icon: <BookOpen className="w-4 h-4" />,
        count: listResp?.total ?? listItems.length ?? 0,
      },
    ],
    [listResp, listItems.length]
  );

  // filter (client-side pada page aktif)
  const filteredArticles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return listItems.filter((a) => {
      const inCategory = selectedCategory === "Semua"; // tidak ada kategori di API
      const inSearch =
        a.title.toLowerCase().includes(q) ||
        plainText(a.content).toLowerCase().includes(q);
      return inCategory && (q ? inSearch : true);
    });
  }, [listItems, selectedCategory, searchTerm]);

  // featured (ambil artikel pertama di halaman pertama saat "Semua" & tanpa search)
  const featured = useMemo(() => {
    if (currentPage !== 1 || selectedCategory !== "Semua" || searchTerm)
      return null;
    return filteredArticles[0] ?? null;
  }, [filteredArticles, currentPage, selectedCategory, searchTerm]);

  const displayedArticles = filteredArticles;

  const toggleLike = (articleId: number) => {
    setLikedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  const openArticle = (article: News) => {
    setSelectedSlug(article.slug ?? String(article.id));
  };

  const closeArticle = () => setSelectedSlug(null);

  // ===== fetch detail by slug saat dipilih
  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetNewsBySlugQuery(selectedSlug ?? "", { skip: !selectedSlug });

  // ===== Article Detail View
  if (selectedSlug) {
    const title = detail?.title ?? "";
    const image = detail
      ? getImageUrl(detail.image)
      : "/api/placeholder/600/400";
    const published = detail?.published_at
      ? new Date(detail.published_at).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-";
    const readTime = detail ? estimateReadTime(detail.content) : "";

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B6B6B] to-[#6B6B6B]/80 text-white pt-16">
          <div className="container mx-auto px-6 lg:px-12 py-8">
            <button
              onClick={closeArticle}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Berita
            </button>

            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  Artikel
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {isDetailLoading ? "Memuat…" : title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>BLACKBOXINC Shop</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{published}</span>
                </div>
                {detail && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{readTime} baca</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-96 lg:h-[500px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 lg:px-12 py-12">
          <div className="max-w-5xl mx-auto">
            {isDetailError && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-700 mb-6">
                Gagal memuat detail.{" "}
                <button
                  className="underline"
                  onClick={() => window.location.reload()}
                >
                  Muat ulang
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Article Content */}
              <div className="lg:col-span-8">
                {isDetailLoading ? (
                  <div className="text-gray-600">Memuat konten…</div>
                ) : (
                  <div
                    className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
                    // Jika konten sudah HTML dari backend, render apa adanya
                    dangerouslySetInnerHTML={{
                      __html: (detail?.content ?? "")
                        // fallback kecil agar heading markdown terlihat
                        .replace(/\n/g, "<br/>")
                        .replace(
                          /## (.*?)(<br\/>|$)/g,
                          '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>'
                        )
                        .replace(
                          /### (.*?)(<br\/>|$)/g,
                          '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>'
                        ),
                    }}
                  />
                )}

                {/* Social Actions (lokal) */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => detail && toggleLike(detail.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-colors ${
                        detail && likedArticles.includes(detail.id)
                          ? "bg-red-50 text-red-600"
                          : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          detail && likedArticles.includes(detail.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      <span>Suka</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-[#A3B18A]/10 hover:text-[#A3B18A] transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      Diskusikan
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-8 space-y-8">
                  {/* Author Info (statis) */}
                  <div className="bg-gray-50 rounded-3xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4">
                      Tentang Penulis
                    </h4>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#6B6B6B] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          BLACKBOXINC Shop Team
                        </div>
                        <div className="text-sm text-gray-600">Penulis</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Berbagi inspirasi & info terbaru COLORE.
                    </p>
                  </div>

                  {/* Related (ambil dari list halaman ini) */}
                  {listItems.length > 1 && (
                    <div className="bg-gray-50 rounded-3xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">
                        Artikel Lainnya
                      </h4>
                      <div className="space-y-4">
                        {listItems
                          .filter((a) => a.slug !== selectedSlug)
                          .slice(0, 3)
                          .map((a) => (
                            <div
                              key={a.id}
                              onClick={() => openArticle(a)}
                              className="cursor-pointer group"
                            >
                              <h5 className="font-medium text-gray-900 group-hover:text-[#A3B18A] transition-colors text-sm leading-snug">
                                {a.title}
                              </h5>
                              <p className="text-xs text-gray-500 mt-1">
                                {estimateReadTime(a.content)} baca
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error/Retry */}
            {isDetailError && (
              <div className="mt-8">
                <button
                  onClick={closeArticle}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#A3B18A] text-[#A3B18A] hover:bg-[#A3B18A]/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== Main News List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10">
      {/* Header Section */}
      <section className="pt-24 pb-12 px-6 lg:px-12">
        <div className="container mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E53935]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#E53935]" />
            <span className="text-sm font-medium text-[#E53935]">
              Artikel Shop
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-[#6B6B6B] mb-6">
            Rahasia Kulit Sehat
            <span className="block text-[#E53935]">bersamaBLACKBOXINC</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Dapatkan produk terbaik, rekomendasi produk, dan insight
            produk berkualitas, keren, dan fashionable
            setiap hari.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="px-6 lg:px-12 mb-12">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari artikel Shop, tips, atau produk..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl 
                       focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="flex items-center gap-3 overflow-x-auto">
                <Filter className="w-5 h-5 text-[#6B6B6B] flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category.name
                        ? "bg-[#E53935] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-[#6B6B6B] hover:text-white"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedCategory === category.name
                          ? "bg-white/20"
                          : "bg-gray-200"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && !isLoading && (
        <section className="px-6 lg:px-12 mb-12">
          <div className="container mx-auto">
            <div
              onClick={() => openArticle(featured)}
              className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Gambar Artikel */}
                <div className="relative h-80 lg:h-96">
                  <Image
                    src={getImageUrl(featured.image)}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#E53935] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                      Artikel Unggulan
                    </span>
                  </div>
                </div>

                {/* Konten Artikel */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="text-[#6B6B6B] font-semibold mb-3 uppercase tracking-wide">
                    Shop News
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-[#E53935] transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {makeExcerpt(featured.content, 220)}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>BLACKBOXINC Shop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(featured.published_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{estimateReadTime(featured.content)}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="self-start bg-[#E53935] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#c62828] transition-colors flex items-center gap-2">
                    Baca Selengkapnya
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error / Loading */}
      <section className="px-6 lg:px-12">
        <div className="container mx-auto">
          {isError && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 mb-6">
              Gagal memuat berita.{" "}
              <button className="underline" onClick={() => refetch()}>
                Coba lagi
              </button>
            </div>
          )}
          {isLoading && (
            <div className="w-full flex justify-center items-center mb-6">
              <DotdLoader />
            </div>
          )}
        </div>
      </section>

      {/* Articles Grid */}
      {!isLoading && (
        <section className="px-6 lg:px-12 mb-12">
          <div className="container mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "Semua"
                  ? "Semua Artikel Shop"
                  : selectedCategory}
              </h3>
              <p className="text-gray-600">
                {filteredArticles.length} artikel ditemukan
              </p>
            </div>

            {/* Grid Artikel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => openArticle(article)}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-2"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48">
                    <Image
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-[#E53935] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        Artikel
                      </span>
                    </div>
                  </div>

                  {/* Konten */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#E53935] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {makeExcerpt(article.content)}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>BLACKBOXINC Shop</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{estimateReadTime(article.content)}</span>
                      </div>
                    </div>

                    {/* Footer Card */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(article.published_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {/* Like Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(article.id);
                          }}
                          className={`flex items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                            likedArticles.includes(article.id)
                              ? "bg-red-50 text-red-600"
                              : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              likedArticles.includes(article.id)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                          <span>Suka</span>
                        </button>

                        {/* Komentar Placeholder */}
                        <div className="hidden sm:flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>—</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {displayedArticles.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-[#6B6B6B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-[#6B6B6B]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Artikel tidak ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  Coba ubah filter atau kata kunci pencarian Anda.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Semua");
                    setCurrentPage(1);
                  }}
                  className="bg-[#E53935] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#c62828] transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <section className="px-6 lg:px-12 mb-16">
          <div className="container mx-auto">
            <div className="flex justify-center items-center gap-4">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-6 py-3 border border-[#A3B18A] text-[#A3B18A] rounded-full font-medium
                     hover:bg-[#A3B18A] hover:text-white shadow-sm transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
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
                      className={`w-12 h-12 rounded-full font-semibold transition-all shadow-sm
                ${
                  currentPage === page
                    ? "bg-[#A3B18A] text-white shadow-md scale-105"
                    : "border border-[#A3B18A] text-[#A3B18A] hover:bg-[#A3B18A] hover:text-white"
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
                className="px-6 py-3 border border-[#A3B18A] text-[#A3B18A] rounded-full font-medium
                     hover:bg-[#A3B18A] hover:text-white shadow-sm transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-[#6B6B6B]/10 rounded-3xl p-10 lg:p-16 text-center shadow-sm">
            {/* Heading */}
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
              Jangan Lewatkan Update Terbaru
            </h3>
            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Dapatkan tips Shop, promo eksklusif, dan artikel inspiratif
              langsung di inbox Anda setiap minggu.
            </p>

            {/* Input + Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 border border-[#6B6B6B]/40
                     focus:ring-2 focus:ring-[#6B6B6B] focus:border-[#6B6B6B] outline-none transition-all"
              />
              <button
                className="bg-[#6B6B6B] text-white px-8 py-4 rounded-full font-semibold 
                           hover:bg-[#6B6B6B]/90 transition-colors"
              >
                Subscribe
              </button>
            </div>

            {/* Small Note */}
            <p className="text-sm text-gray-500 mt-6">
              Dengan berlangganan, Anda setuju menerima email promosi dari
              BLACKBOXINC.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
