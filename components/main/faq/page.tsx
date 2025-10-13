"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import FaqItems from "./faq-items";

const FaqPage = () => {
  const [groupsActive, setGroupsActive] = useState<Array<number>>([]);

  const groupedFaqs: {
    name: string;
    items: { question: string; answer: string }[];
  }[] = [
    {
      name: "Produk",
      items: [
        {
          question: "Apakah produkBLACKBOXINC aman untuk semua jenis kulit?",
          answer:
            "Ya, seluruh produkBLACKBOXINC diformulasikan dengan bahan-bahan berkualitas tinggi, dermatologically tested, dan aman untuk semua jenis kulit, termasuk kulit sensitif. Namun, kami tetap menyarankan untuk melakukan patch test sebelum pemakaian rutin.",
        },
        {
          question: "Apakah produkBLACKBOXINC sudah terdaftar di BPOM?",
          answer:
            "Benar, semua produkBLACKBOXINC telah mendapatkan izin edar resmi dari BPOM sehingga terjamin aman digunakan.",
        },
        {
          question: "ApakahBLACKBOXINC menggunakan bahan alami?",
          answer:
            "Kami menggabungkan bahan aktif modern dengan ekstrak alami yang sudah terbukti secara klinis, seperti Niacinamide, Hyaluronic Acid, Green Tea, dan Centella Asiatica untuk hasil yang maksimal.",
        },
        {
          question: "Berapa lama hasil produk terlihat?",
          answer:
            "Setiap kulit berbeda, namun rata-rata pelanggan kami melihat perubahan signifikan setelah 2–4 minggu penggunaan rutin sesuai anjuran.",
        },
      ],
    },
    {
      name: "Pemakaian",
      items: [
        {
          question:
            "Apakah produkBLACKBOXINC bisa dipakai oleh ibu hamil dan menyusui?",
          answer:
            "Sebagian besar produkBLACKBOXINC aman digunakan oleh ibu hamil dan menyusui. Namun, untuk produk dengan kandungan tertentu seperti retinol, sebaiknya dikonsultasikan dengan dokter terlebih dahulu.",
        },
        {
          question: "Apakah bisa digabung dengan skincare lain?",
          answer:
            "Ya, produkBLACKBOXINC dapat dikombinasikan dengan skincare lain. Kami menyarankan untuk mengikuti urutan basic skincare: cleansing → toner → serum → moisturizer → sunscreen.",
        },
        {
          question:
            "Bagaimana cara memilih produk yang sesuai dengan jenis kulit?",
          answer:
            "Kami menyediakan skin quiz interaktif di website untuk membantu Anda menemukan produk sesuai dengan jenis dan kebutuhan kulit. Atau, Anda bisa berkonsultasi langsung dengan beauty advisor kami via chat.",
        },
      ],
    },
    {
      name: "Pemesanan & Pengiriman",
      items: [
        {
          question: "Berapa lama pengiriman produkBLACKBOXINC?",
          answer:
            "Pengiriman biasanya 2–5 hari kerja untuk wilayah Jabodetabek, dan 5–10 hari kerja untuk luar pulau. Kami bekerja sama dengan ekspedisi terpercaya seperti JNE, SiCepat, dan J&T.",
        },
        {
          question: "Apakah ada free shipping?",
          answer:
            "Ya! Gratis ongkir untuk pembelian di atas Rp300.000 ke seluruh Indonesia.",
        },
        {
          question: "Bagaimana jika produk yang diterima rusak atau bocor?",
          answer:
            "Tenang, kami memberikan garansi 7 hari. Hubungi customer service kami dengan foto produk, dan kami akan mengganti dengan yang baru tanpa biaya tambahan.",
        },
      ],
    },
    {
      name: "Pembayaran",
      items: [
        {
          question: "Metode pembayaran apa saja yang tersedia?",
          answer:
            "Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (OVO, GoPay, DANA, ShopeePay), kartu kredit, dan pembayaran melalui marketplace resmi kami.",
        },
        {
          question: "Apakah aman berbelanja di websiteBLACKBOXINC?",
          answer:
            "Ya, transaksi Anda 100% aman karena diproses melalui payment gateway terpercaya dengan sistem enkripsi tingkat tinggi.",
        },
      ],
    },
    {
      name: "Membership & Promo",
      items: [
        {
          question: "Apakah ada program loyalitasBLACKBOXINC?",
          answer:
            "Ya! Bergabunglah denganBLACKBOXINC Club untuk mengumpulkan poin dari setiap transaksi. Poin bisa ditukar dengan diskon, voucher, atau produk eksklusif.",
        },
        {
          question: "Apakah ada promo khusus untuk pelanggan baru?",
          answer:
            "Pelanggan baru mendapatkan diskon 10% untuk pembelian pertama dengan kode voucher WELCOMEYAMEIYA.",
        },
        {
          question: "Apakah ada bundle atau paket hemat?",
          answer:
            "Kami menyediakan paket skincare bundle yang lebih hemat hingga 25%. Cek halaman promo kami untuk penawaran terbaru.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Header Section */}
      <section className="pt-24 pb-6 px-6 lg:px-12">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#E53935]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#E53935]" />
            <span className="text-sm font-medium text-[#E53935]">FAQ</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-[#6B6B6B] mb-6">
            Ada Pertanyaan?
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Temukan jawaban cepat seputar produk, layanan, dan pengalaman
            berbelanja bersama{" "}
            <span className="text-[#E53935] font-semibold">YAMEIYA</span>.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="pt-4 pb-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-3">
            {groupedFaqs.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "border-b border-gray-200 py-3 transition-all",
                  "hover:bg-gray-50 rounded-xl px-3"
                )}
              >
                <button
                  onClick={() => {
                    setGroupsActive((state) =>
                      state.includes(index)
                        ? state.filter((x) => x !== index)
                        : [...state, index]
                    );
                  }}
                  className="w-full flex items-center gap-x-2 text-left"
                >
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 text-[#E53935] transition-transform duration-300",
                      { "rotate-90": groupsActive.includes(index) }
                    )}
                    strokeWidth={2.3}
                  />
                  <span className="text-lg font-medium text-[#6B6B6B]">
                    {item.name}
                  </span>
                </button>
                {groupsActive.includes(index) && (
                  <div className="mt-3 text-gray-600">
                    <FaqItems faqs={item.items} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
