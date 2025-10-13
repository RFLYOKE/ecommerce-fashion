"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  CreditCard,
  User,
  Package,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Truck,
  HeadphonesIcon,
  Mail,
  MessageCircle,
  Star,
  Play,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface Step {
  id: number;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  image: string;
  tips?: string[];
}
interface FAQ {
  question: string;
  answer: string;
}

export default function HowToOrderPage() {
  const router = useRouter();

  const goToProductPage = () => {
    router.push("/product");
  };

  const [activeStep, setActiveStep] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // === THEME (urut ke-2: #F6CCD0), selang-seling dgn putih ===
  const THEME = {
    primary: "#6B6B6B", // warna halaman ini
    bubbleA: "#DFF19D",
    bubbleB: "#BFF0F5",
  };

  const orderSteps: Step[] = [
    {
      id: 1,
      title: "Pilih Produk / Layanan",
      description:
        "Jelajahi koleksi skincare dan layanan perawatan kulit, lalu pilih yang sesuai kebutuhan Anda.",
      details: [
        "Browse kategori skincare (Facial Wash, Serum, Moisturizer, Sunscreen, dll.)",
        "Gunakan filter jenis kulit untuk rekomendasi yang lebih tepat",
        "Baca detail produk, manfaat, dan review dari pelanggan lain",
        "Untuk layanan, pilih jadwal reservasi yang tersedia",
      ],
      icon: <ShoppingCart className="w-8 h-8" />,
      image: "/images/new/order-steps/step-1.png",
      tips: [
        "Gunakan filter jenis kulit (berminyak, kering, sensitif, kombinasi)",
        "Cek label dermatologically tested atau hypoallergenic",
        "Untuk layanan, pastikan pilih cabang & jadwal sesuai waktu luang Anda",
      ],
    },
    {
      id: 2,
      title: "Review Keranjang",
      description:
        "Periksa kembali produk skincare dan layanan yang dipilih sebelum checkout.",
      details: [
        "Klik ikon keranjang untuk melihat daftar produk & layanan",
        "Ubah quantity atau hapus item jika diperlukan",
        "Cek total harga termasuk ongkos kirim atau biaya reservasi",
        "Klik 'Checkout' untuk melanjutkan",
      ],
      icon: <Package className="w-8 h-8" />,
      image: "/images/new/order-steps/step-2.png",
      tips: [
        "Gunakan kode promo atau voucher yang tersedia",
        "Periksa kembali jadwal reservasi sebelum melanjutkan",
        "Manfaatkan free shipping untuk pembelian tertentu",
      ],
    },
    {
      id: 3,
      title: "Isi Data Pengiriman / Reservasi",
      description:
        "Lengkapi informasi pengiriman produk atau detail reservasi layanan.",
      details: [
        "Isi nama lengkap dan nomor WhatsApp aktif",
        "Masukkan alamat lengkap untuk pengiriman produk",
        "Untuk reservasi, pilih tanggal & jam yang tersedia",
        "Tambahkan catatan khusus jika diperlukan",
      ],
      icon: <User className="w-8 h-8" />,
      image: "/images/new/order-steps/step-3.png",
      tips: [
        "Pastikan nomor WhatsApp aktif untuk konfirmasi cepat",
        "Alamat pengiriman harus jelas dan lengkap",
        "Cek kembali tanggal & jam reservasi sebelum submit",
      ],
    },
    {
      id: 4,
      title: "Pilih Metode Pembayaran",
      description:
        "Nikmati proses pembayaran aman melalui Midtrans dengan berbagai metode.",
      details: [
        "Pilih metode: Transfer Bank, E-Wallet, Virtual Account, atau Kartu Kredit",
        "Ikuti instruksi sesuai metode yang dipilih",
        "Sistem otomatis memverifikasi pembayaran",
        "Konfirmasi pembayaran dikirim via WhatsApp/Email",
      ],
      icon: <CreditCard className="w-8 h-8" />,
      image: "/images/new/order-steps/step-4.png",
      tips: [
        "Gunakan E-Wallet untuk cashback & promo menarik",
        "Simpan bukti pembayaran untuk berjaga-jaga",
        "Konfirmasi biasanya hanya memakan waktu beberapa menit",
      ],
    },
    {
      id: 5,
      title: "Pesanan Diproses",
      description:
        "Pesanan produk segera dikirim, dan layanan reservasi akan dikonfirmasi.",
      details: [
        "Produk skincare akan diproses dalam 1-2 hari kerja",
        "Untuk reservasi, Anda akan menerima notifikasi konfirmasi",
        "Update status akan dikirim via WhatsApp/Email",
        "Estimasi pengiriman produk 2-5 hari kerja",
      ],
      icon: <CheckCircle className="w-8 h-8" />,
      image: "/images/new/order-steps/step-5.png",
      tips: [
        "Simpan nomor pesanan untuk tracking",
        "Cek update status di WhatsApp/Email",
        "Hubungi customer service jika ada kendala",
      ],
    },
    {
      id: 6,
      title: "Cek Status Pesanan",
      description:
        "Pantau status pesanan produk atau konfirmasi reservasi layanan.",
      details: [
        "Login ke akun Anda di website skincare",
        "Buka menu 'Pesanan Saya' untuk produk",
        "Lihat status reservasi layanan di menu 'Reservasi'",
        "Download invoice atau berikan review pengalaman",
      ],
      icon: <Truck className="w-8 h-8" />,
      image: "/images/new/order-steps/step-6.png",
      tips: [
        "Gunakan nomor resi untuk tracking pengiriman",
        "Review produk atau layanan untuk dapatkan reward poin",
        "Status akan update otomatis saat ada perubahan",
      ],
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "Berapa lama proses pengiriman?",
      answer:
        "Estimasi pengiriman 3-7 hari kerja untuk wilayah Jabodetabek, dan 7-14 hari kerja untuk luar kota. Kami menggunakan ekspedisi terpercaya seperti JNE, TIKI, dan J&T.",
    },
    {
      question: "Apakah ada minimum pembelian?",
      answer:
        "Tidak ada minimum pembelian. Namun untuk pembelian di atas Rp 250.000, Anda mendapat free shipping ke seluruh Indonesia.",
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer:
        "Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, DANA, ShopeePay), dan virtual account. Semua pembayaran diproses melalui Midtrans yang aman.",
    },
    {
      question: "Bisakah mengubah atau membatalkan pesanan?",
      answer:
        "Pesanan dapat diubah atau dibatalkan dalam 1 jam setelah pembayaran dikonfirmasi. Setelah itu, pesanan akan masuk proses packing dan tidak dapat diubah.",
    },
    {
      question: "Bagaimana jika produk rusak atau salah?",
      answer:
        "Kami menyediakan garansi 30 hari untuk produk rusak atau salah kirim. Hubungi customer service kami dengan foto produk untuk proses penggantian.",
    },
    {
      question: "Apakah ada program loyalitas?",
      answer:
        "Ya! Setiap pembelian akan mendapat poin COLORE yang bisa ditukar dengan diskon atau produk gratis. Bergabunglah dengan COLORE Club untuk benefit eksklusif.",
    },
  ];

  const paymentMethods = [
    {
      name: "Transfer Bank",
      icon: "🏦",
      description: "BCA, Mandiri, BRI, BNI",
    },
    {
      name: "E-Wallet",
      icon: "📱",
      description: "GoPay, OVO, DANA, ShopeePay",
    },
    { name: "Virtual Account", icon: "💳", description: "VA Bank & Retail" },
    { name: "Credit Card", icon: "💳", description: "Visa, Mastercard, JCB" },
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: "Pembayaran Aman",
      description: "Dilindungi enkripsi SSL dan gateway Midtrans",
    },
    {
      icon: <Truck className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: "Pengiriman Cepat",
      description: "3-7 hari kerja dengan tracking real-time",
    },
    {
      icon: (
        <HeadphonesIcon className="w-6 h-6" style={{ color: THEME.primary }} />
      ),
      title: "Customer Support",
      description: "Tim support siap membantu 24/7",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, #FFFFFF 0%, ${THEME.primary}1A 100%)`,
      }}
    >
      {/* ============== HERO (skincare theme) ============== */}
      <section className="relative pt-24 pb-12 px-6 lg:px-12 overflow-hidden bg-white">
        {/* bubbles blend */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full"
            style={{
              background: "#6B6B6B",
              filter: "blur(80px)",
              opacity: 0.15,
            }}
          />
          <div
            className="absolute -top-10 right-[-10%] w-[28rem] h-[28rem] rounded-full"
            style={{
              background: "#E53935",
              filter: "blur(100px)",
              opacity: 0.12,
            }}
          />
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full"
            style={{
              background: "#6B6B6B",
              filter: "blur(80px)",
              opacity: 0.1,
            }}
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: "#E53935", color: "#FFFFFF" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium">Panduan Pemesanan</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-[#000000] mb-6">
            Cara Pesan di
            <span className="block text-[#6B6B6B]">YAMEIYA Skincare</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-[#6B6B6B] max-w-3xl mx-auto mb-8">
            Ikuti 6 langkah mudah untuk mendapatkan produk perawatan kulit
            terbaik untuk Anda. Proses yang simple, aman, dan menyenangkan!
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#6B6B6B]/20"
              >
                <div className="flex justify-center mb-3 text-[#E53935]">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-[#000000] text-sm mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[#6B6B6B]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== STEP NAV + CONTENT (skincare theme) ============== */}
      <section className="px-6 lg:px-12 mb-16 bg-white pt-10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#000000] mb-4">
              Langkah-langkah <span className="text-[#E53935]">Pemesanan</span>
            </h2>
            <p className="text-[#6B6B6B] max-w-2xl mx-auto">
              Proses pemesanan yang simple dan user-friendly, dirancang untuk
              kemudahan Anda
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            {/* Step Navigation */}
            <div className="flex justify-center mb-12">
              <div
                className="bg-white rounded-3xl p-6 shadow-lg w-full"
                style={{ border: `1px solid #6B6B6B33` }}
              >
                <div className="flex flex-wrap gap-3">
                  {orderSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setActiveStep(step.id)}
                            className="flex items-center gap-3 w-full sm:w-auto px-4 py-3 rounded-2xl font-medium transition-all duration-300 text-sm sm:text-base"
                            style={
                              activeStep === step.id
                                ? {
                                    backgroundColor: "#E53935",
                                    color: "#fff",
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                                  }
                                : {
                                    backgroundColor: "#F3F4F6",
                                    color: "#6B6B6B",
                                  }
                            }
                          >
                            <div
                              className="p-2 rounded-xl flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  activeStep === step.id ? "#FFFFFF33" : "#fff",
                              }}
                            >
                              <div
                                style={{
                                  color:
                                    activeStep === step.id ? "#fff" : "#E53935",
                                }}
                              >
                                {step.icon}
                              </div>
                            </div>
                            <span className="sm:hidden">{step.id}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {index + 1}. {step.title}
                        </TooltipContent>
                      </Tooltip>

                      {/* Arrow only on large screens */}
                      {index < orderSteps.length - 1 && (
                        <ArrowRight className="w-5 h-5 text-[#6B6B6B]/30 mx-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Step Content */}
          {orderSteps.map((step) => (
            <div
              key={step.id}
              className={`transition-all duration-500 ${
                activeStep === step.id
                  ? "opacity-100 visible"
                  : "opacity-0 invisible absolute"
              }`}
            >
              {activeStep === step.id && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Content */}
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                          style={{ backgroundColor: "#E53935" }}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#E53935]">
                            Langkah {step.id}
                          </div>
                          <h3 className="text-2xl font-bold text-[#000000]">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-[#6B6B6B] text-lg mb-6">
                        {step.description}
                      </p>

                      <div className="space-y-4 mb-8">
                        <h4 className="font-semibold text-[#000000]">
                          Detail Langkah:
                        </h4>
                        {step.details.map((detail, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#E53935]/10">
                              <div className="w-2 h-2 rounded-full bg-[#E53935]" />
                            </div>
                            <span className="text-[#6B6B6B]">{detail}</span>
                          </div>
                        ))}
                      </div>

                      {step.tips && (
                        <div className="rounded-2xl p-6 bg-[#6B6B6B]/5">
                          <h4 className="font-semibold text-[#000000] mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-[#E53935]" />
                            Tips Berguna:
                          </h4>
                          <ul className="space-y-2">
                            {step.tips.map((tip, index) => (
                              <li
                                key={index}
                                className="text-sm flex items-start gap-2 text-[#6B6B6B]"
                              >
                                <Star className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#E53935]" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Visual */}
                    <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-[#FFFFFF] via-[#F9F9F9] to-[#FFEAEA]">
                      <div className="relative w-full max-w-md">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={400}
                          height={300}
                          className="w-full h-auto rounded-2xl shadow-lg"
                        />
                        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full opacity-50 bg-[#E53935]/30" />
                        <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full opacity-50 bg-[#6B6B6B]/30" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#6B6B6B] text-[#6B6B6B] hover:bg-[#6B6B6B] hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Langkah Sebelumnya
            </button>

            <button
              onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
              disabled={activeStep === 6}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#E53935] hover:bg-[#c62828]"
            >
              Langkah Selanjutnya
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============== PAYMENT (section putih) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            {/* Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Metode <span style={{ color: THEME.primary }}>Pembayaran</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Kami menyediakan berbagai metode pembayaran yang aman dan
                terpercaya melalui gateway Midtrans
              </p>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl transition-all duration-300 border hover:shadow-md"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <div
                    className="text-4xl mb-4"
                    style={{ color: THEME.primary }}
                  >
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              ))}
            </div>

            {/* Security Info */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ backgroundColor: `${THEME.primary}0D` }} // merah lembut transparan
            >
              <div className="flex justify-center mb-4">
                <Shield className="w-8 h-8" style={{ color: THEME.primary }} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Keamanan Terjamin
              </h3>
              <p className="text-gray-600">
                Semua transaksi dilindungi enkripsi SSL 256-bit dan diproses
                melalui Midtrans yang telah tersertifikasi PCI DSS Level 1
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CONTACT (section berwarna) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div
            className="rounded-3xl p-8 lg:p-12 text-gray-900"
            style={{
              background: `linear-gradient(90deg, ${THEME.primary} 0%, ${THEME.primary}CC 100%)`,
              color: "#fff",
            }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Butuh Bantuan?</h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                Tim Customer Services akan siap membantu fast response hari
                Senin - Jumat jam 08.00 - 17.00 WIB. Jangan ragu untuk
                menghubungi kami!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {/* phone icon replaced with Mail & MessageCircle above; keeping consistent */}
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-white/90">+62 817 694 2128</p>
                <p className="text-sm text-white/70">
                  Respon cepat dalam 5 menit
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-white/90">support@yameiya.id</p>
                <p className="text-sm text-white/70">Respon dalam 2 jam</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-white/90">24/7 Online</p>
                <p className="text-sm text-white/70">Live chat tersedia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CTA (section putih) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-12 text-center shadow-lg">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Yuk Mulai Belanja Sekarang
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Jelajahi koleksi produk ramah lingkungan kami dan berikan yang
              terbaik untuk perkembangan kreativitas anak Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goToProductPage}
                className="text-white px-8 py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: THEME.primary }}
              >
                <ShoppingCart className="w-5 h-5" />
                Mulai Berbelanja
              </button>
              <button
                className="px-8 py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2 border"
                style={{ color: THEME.primary, borderColor: THEME.primary }}
              >
                <Play className="w-5 h-5" />
                Lihat Video Tutorial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FAQ (section putih) ============== */}
      <section className="px-6 lg:px-12 pb-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan <span style={{ color: THEME.primary }}>Umum</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan yang sering ditanyakan tentang
              proses pemesanan
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === index ? null : index)
                    }
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {expandedFAQ === index ? (
                      <ChevronUp
                        className="w-5 h-5"
                        style={{ color: THEME.primary }}
                      />
                    ) : (
                      <ChevronDown
                        className="w-5 h-5"
                        style={{ color: THEME.primary }}
                      />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
