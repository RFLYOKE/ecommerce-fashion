// components/pages/HowToOrderPage.tsx
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
  Ruler, // Ikon baru untuk fashion/size
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"; // Asumsi Tooltip sudah B&W
import clsx from "clsx";

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

  // === THEME: Black and White ===
  const THEME = {
    primary: "#000000",
    secondary: "#FFFFFF",
    accentGray: "#1F2937", // Abu-abu gelap untuk aksen
  };

  const orderSteps: Step[] = [
    {
      id: 1,
      title: "Pilih Gaya & Ukuran",
      description:
        "Jelajahi koleksi eksklusif kami dan tentukan item yang sesuai dengan selera dan ukuran Anda.",
      details: [
        "Browse kategori (T-Shirt, Denim, Aksesori, dll.)",
        "Gunakan fitur 'Size Guide' untuk memastikan fitting yang sempurna",
        "Lihat detail material dan instruksi perawatan untuk setiap produk",
        "Pilih warna dan varian yang Anda inginkan",
      ],
      icon: <Ruler className="w-8 h-8" />,
      image: "images/new/order-steps/step-1.png", // Gambar Fashion
      tips: [
        "Selalu cek Size Guide untuk menghindari retur",
        "Perhatikan detail cutting (Slim, Oversized, Regular)",
        "Lihat ulasan untuk real-life fitting feedback",
      ],
    },
    {
      id: 2,
      title: "Review Keranjang Belanja",
      description:
        "Verifikasi item dan pastikan semua detail (ukuran, warna, kuantitas) sudah benar sebelum checkout.",
      details: [
        "Cek ulang kuantitas dan harga total",
        "Pastikan ukuran dan warna sudah sesuai pilihan",
        "Masukkan kode diskon atau voucher jika ada",
        "Klik 'Proceed to Checkout' untuk lanjut",
      ],
      icon: <Package className="w-8 h-8" />,
      image: "images/new/order-steps/step-2.png", // Gambar Fashion
      tips: [
        "Manfaatkan free shipping untuk pembelian di atas Rp 500.000",
        "Periksa kembali detail ukuran sebelum submit",
        "Keranjang akan tersimpan otomatis jika Anda sudah login",
      ],
    },
    {
      id: 3,
      title: "Isi Detail Pengiriman",
      description:
        "Lengkapi data Anda, termasuk nama, kontak, dan alamat pengiriman yang akurat.",
      details: [
        "Isi nama lengkap dan nomor telepon aktif",
        "Masukkan alamat pengiriman selengkap mungkin (patokan, nomor rumah)",
        "Pilih metode dan estimasi biaya pengiriman",
        "Tambahkan catatan khusus untuk kurir jika diperlukan",
      ],
      icon: <User className="w-8 h-8" />,
      image: "images/new/order-steps/step-3.png", // Gambar Fashion
      tips: [
        "Pastikan nomor telepon aktif untuk konfirmasi kurir",
        "Cek kembali kode pos dan alamat Anda",
        "Alamat yang tidak lengkap bisa menunda pengiriman",
      ],
    },
    {
      id: 4,
      title: "Pilih Metode Pembayaran",
      description:
        "Selesaikan transaksi Anda dengan aman melalui berbagai opsi pembayaran terpercaya (Midtrans).",
      details: [
        "Pilih metode: Transfer Bank, E-Wallet, atau Kartu Kredit/VA",
        "Ikuti instruksi pembayaran yang muncul di layar",
        "Verifikasi pembayaran otomatis dan notifikasi dikirim via email/WhatsApp",
        "Semua transaksi dienkripsi untuk keamanan data Anda",
      ],
      icon: <CreditCard className="w-8 h-8" />,
      image: "images/new/order-steps/step-4.png", // Gambar Fashion
      tips: [
        "Gunakan E-Wallet untuk proses tercepat",
        "Simpan kode pembayaran/Virtual Account Anda",
        "Pembayaran harus dilakukan dalam batas waktu yang ditentukan (maks 2 jam)",
      ],
    },
    {
      id: 5,
      title: "Konfirmasi & Proses Kirim",
      description:
        "Pesanan Anda dikonfirmasi, dan kami segera memulai proses pengepakan dan pengiriman.",
      details: [
        "Pesanan diproses dalam 1x24 jam (hari kerja)",
        "Anda akan menerima nomor resi pengiriman setelah produk dikirim",
        "Kami menggunakan packaging premium untuk menjaga kualitas produk",
        "Update status dikirim via email dan notifikasi WhatsApp",
      ],
      icon: <CheckCircle className="w-8 h-8" />,
      image: "images/new/order-steps/step-5.png", // Gambar Fashion
      tips: [
        "Cek email/WhatsApp secara berkala untuk resi",
        "Pesanan masuk setelah jam 1 siang akan diproses hari kerja berikutnya",
        "Hubungi CS jika resi belum terbit setelah 2 hari kerja",
      ],
    },
    {
      id: 6,
      title: "Terima & Beri Ulasan",
      description:
        "Paket Blackboxinc tiba! Nikmati produk Anda dan bantu kami dengan memberikan ulasan.",
      details: [
        "Periksa kondisi paket saat diterima",
        "Jika ada masalah, hubungi CS segera (sertakan video unboxing)",
        "Login dan berikan review produk untuk mendapatkan loyalty points",
        "Tingkatkan gaya Anda dengan item Blackboxinc yang baru!",
      ],
      icon: <Truck className="w-8 h-8" />,
      image: "images/new/order-steps/step-6.png", // Gambar Fashion
      tips: [
        "Review yang jujur sangat berharga bagi kami",
        "Simpan nota/invoice untuk klaim garansi retur/tukar ukuran",
        "Abadikan gaya Anda dan tag kami di Instagram!",
      ],
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "Berapa lama estimasi pengiriman standar?",
      answer:
        "Estimasi pengiriman standar adalah 2-5 hari kerja untuk wilayah Jabodetabek dan 5-10 hari kerja untuk luar pulau Jawa. Kami akan mengirimkan nomor resi segera setelah pesanan dikirim.",
    },
    {
      question: "Apakah saya bisa menukar ukuran jika tidak pas?",
      answer:
        "Ya, kami menyediakan layanan penukaran ukuran (size exchange) dalam 7 hari setelah barang diterima, selama stok ukuran yang diinginkan masih tersedia dan produk dalam kondisi belum dipakai (label masih ada).",
    },
    {
      question: "Apa saja metode pembayaran yang tersedia?",
      answer:
        "Kami menerima Transfer Bank (BCA, Mandiri, dll.), E-Wallet (GoPay, OVO, Dana), Virtual Account, dan Kartu Kredit. Semua diproses melalui gateway Midtrans yang terenkripsi aman.",
    },
    {
      question: "Bisakah mengubah alamat atau membatalkan pesanan?",
      answer:
        "Perubahan alamat atau pembatalan hanya dapat dilakukan dalam waktu 1 jam setelah pembayaran terkonfirmasi. Setelah itu, pesanan akan masuk tahap pengepakan dan tidak dapat diubah.",
    },
    {
      question: "Bagaimana jika produk yang diterima cacat?",
      answer:
        "Kami menjamin kualitas produk. Jika produk cacat atau salah kirim, hubungi Customer Service kami dalam 48 jam setelah paket diterima (sertakan video unboxing) untuk proses penggantian tanpa biaya tambahan.",
    },
    {
      question: "Apakah ada biaya untuk penukaran ukuran?",
      answer:
        "Penukaran ukuran tidak dikenakan biaya produk, namun biaya pengiriman kembali ke gudang dan pengiriman ulang kepada Anda ditanggung oleh pembeli, kecuali jika terjadi kesalahan dari pihak kami.",
    },
  ];

  const paymentMethods = [
    {
      name: "Transfer Bank",
      icon: "🏦",
      description: "BCA, Mandiri, BNI, BRI",
    },
    {
      name: "E-Wallet",
      icon: "📱",
      description: "GoPay, OVO, DANA, ShopeePay",
    },
    { name: "Virtual Account", icon: "💳", description: "All Major Banks" },
    { name: "Credit Card", icon: "💳", description: "Visa, Mastercard, JCB" },
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: "Secure Payment",
      description: "Protected by SSL encryption and Midtrans.",
    },
    {
      icon: <Truck className="w-6 h-6" style={{ color: THEME.primary }} />,
      title: "Fast Shipping",
      description: "2-5 working days with real-time tracking.",
    },
    {
      icon: (
        <HeadphonesIcon className="w-6 h-6" style={{ color: THEME.primary }} />
      ),
      title: "Expert Support",
      description: "Dedicated team ready to assist 24/7.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ============== HERO (B&W Theme) ============== */}
      <section className="relative pt-24 pb-16 px-6 lg:px-12 overflow-hidden bg-white border-b border-gray-100">
        {/* Background Accent (Subtle Gray/Black Blur) */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full"
            style={{
              background: THEME.primary,
              filter: "blur(80px)",
              opacity: 0.05,
            }}
          />
          <div
            className="absolute top-1/3 right-[-10%] w-[28rem] h-[28rem] rounded-full"
            style={{
              background: THEME.accentGray,
              filter: "blur(100px)",
              opacity: 0.08,
            }}
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: THEME.primary, color: "#FFFFFF" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Ordering Guide
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-extrabold text-black mb-6 uppercase tracking-tight">
            How To Order From
            <span className="block text-gray-700">Blackboxinc</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-10 font-medium">
            Follow our **6 simple steps** to successfully purchase your exclusive
            fashion items. Secure, straightforward, and fast!
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                // B&W Stat Card Styling
                className="bg-gray-50 rounded-lg p-5 shadow-sm border border-gray-200"
              >
                <div className="flex justify-center mb-3 text-black">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-black text-base mb-1 uppercase tracking-wide">
                  {benefit.title}
                </h3>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== STEP NAV + CONTENT (B&W Theme) ============== */}
      <section className="px-6 lg:px-12 mb-16 pt-16">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-black mb-4 uppercase">
              The 6 Steps Process
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg">
              A straightforward and secure journey from selection to delivery.
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div
              className="bg-white rounded-lg p-3 md:p-6 shadow-xl w-full border border-gray-200"
              style={{ border: `1px solid ${THEME.accentGray}33` }}
            >
              <div className="flex flex-wrap justify-center gap-3">
                {orderSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setActiveStep(step.id)}
                          // Step Button B&W Styling
                          className={clsx(
                            "flex items-center gap-3 w-full sm:w-auto px-4 py-3 rounded-lg font-bold transition-all duration-300 text-sm uppercase tracking-wider",
                            activeStep === step.id
                              ? "bg-black text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                        >
                          <div
                            className="p-2 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor:
                                activeStep === step.id ? "#FFFFFF33" : "#fff",
                            }}
                          >
                            <div
                              style={{
                                color:
                                  activeStep === step.id ? "#fff" : "#000000",
                              }}
                            >
                              {step.icon}
                            </div>
                          </div>
                          <span className="hidden sm:inline">
                            {step.id}. {step.title.split(" ")[0]}
                          </span>
                          <span className="sm:hidden">{step.id}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{step.title}</TooltipContent>
                    </Tooltip>

                    {/* Arrow */}
                    {index < orderSteps.length - 1 && (
                      <ArrowRight className="hidden md:block w-5 h-5 text-gray-400 mx-2" />
                    )}
                  </div>
                ))}
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
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Content */}
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className="w-16 h-16 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: THEME.primary }}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-700 uppercase tracking-wider">
                            Step {step.id}
                          </div>
                          <h3 className="text-3xl font-extrabold text-black uppercase">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      <div className="space-y-4 mb-8">
                        <h4 className="font-bold text-black uppercase tracking-wider">
                          Key Details:
                        </h4>
                        {step.details.map((detail, index) => (
                          <div key={index} className="flex items-start gap-3">
                            {/* Bullet Point B&W */}
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-black/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-black" />
                            </div>
                            <span className="text-gray-700 font-medium text-sm">
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>

                      {step.tips && (
                        <div className="rounded-lg p-6 bg-gray-50 border border-gray-200">
                          <h4 className="font-bold text-black mb-3 flex items-center gap-2 uppercase tracking-wider">
                            <AlertCircle className="w-5 h-5 text-black" />
                            Expert Tips:
                          </h4>
                          <ul className="space-y-2">
                            {step.tips.map((tip, index) => (
                              <li
                                key={index}
                                className="text-sm flex items-start gap-2 text-gray-700"
                              >
                                <Star className="w-4 h-4 flex-shrink-0 mt-0.5 text-black" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Visual */}
                    <div className="relative flex items-center justify-center p-8 bg-gray-100/70">
                      <div className="relative w-full max-w-md">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={400}
                          height={300}
                          className="w-full h-auto rounded-lg shadow-2xl grayscale" // Grayscale image
                          priority={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Navigation Buttons (B&W Theme) */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              // Button Secondary B&W
              className="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-black text-black hover:bg-black hover:text-white font-semibold uppercase tracking-wider"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous Step
            </button>

            <button
              onClick={() => setActiveStep(Math.min(6, activeStep + 1))}
              disabled={activeStep === 6}
              // Button Primary B&W
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-black hover:bg-gray-800 font-bold uppercase tracking-wider"
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============== PAYMENT METHODS (B&W Theme) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-xl p-8 lg:p-12 shadow-lg border border-gray-200">
            {/* Title */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-black mb-4 uppercase">
                Secure Payment Methods
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto text-lg">
                Your transaction safety is our priority. Powered by Midtrans.
              </p>
            </div>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-10">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg transition-all duration-300 border border-gray-300 bg-gray-50 hover:shadow-md"
                >
                  <div className="text-4xl mb-4 text-black">
                    {method.icon}
                  </div>
                  <h3 className="font-bold text-black mb-1 uppercase tracking-wide">
                    {method.name}
                  </h3>
                  <p className="text-xs text-gray-600">{method.description}</p>
                </div>
              ))}
            </div>

            {/* Security Info */}
            <div
              className="rounded-lg p-6 text-center border border-black/20"
              style={{ backgroundColor: `${THEME.primary}0D` }} 
            >
              <div className="flex justify-center mb-4">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-bold text-black mb-2 uppercase tracking-wider">
                100% Security Guarantee
              </h3>
              <p className="text-gray-700 text-sm">
                All transactions are secured with 256-bit SSL encryption and
                processed via PCI DSS Level 1 certified gateway.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CONTACT (B&W Theme) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div
            // Contact Card B&W Inverted
            className="rounded-xl p-8 lg:p-12 text-white shadow-2xl"
            style={{
              background: THEME.primary,
              color: THEME.secondary,
            }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold mb-4 uppercase">
                Need Assistance?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                Our dedicated support team is available during business hours to
                assist you with any questions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-1 uppercase tracking-wider">
                  Live Chat / WA
                </h3>
                <p className="text-white/90 font-semibold">+62 817 694 2128</p>
                <p className="text-sm text-white/70">Fast response (5 mins)</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-1 uppercase tracking-wider">
                  Email Support
                </h3>
                <p className="text-white/90 font-semibold">support@blackboxinc.id</p>
                <p className="text-sm text-white/70">Response within 2 hours</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-1 uppercase tracking-wider">
                  Operational Hours
                </h3>
                <p className="text-white/90 font-semibold">Mon - Fri, 8AM - 5PM WIB</p>
                <p className="text-sm text-white/70">GMT+7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CTA (B&W Theme) ============== */}
      <section className="px-6 lg:px-12 mb-16">
        <div className="container mx-auto">
          <div className="bg-gray-50 rounded-xl p-8 lg:p-12 text-center shadow-lg border border-gray-200">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-black mb-4 uppercase">
              Ready To Define Your Style?
            </h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg">
              Explore our exclusive collection and start your journey towards
              timeless fashion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goToProductPage}
                // Button Primary B&W
                className="text-white px-8 py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 bg-black hover:bg-gray-800 uppercase tracking-wider shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                Shop Now
              </button>
              <button
                // Button Secondary B&W
                className="px-8 py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 border border-black text-black hover:bg-black hover:text-white uppercase tracking-wider"
              >
                <Play className="w-5 h-5" />
                Watch Brand Video
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FAQ (B&W Theme) ============== */}
      <section className="px-6 lg:px-12 pb-16 pt-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-black mb-4 uppercase">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg">
              Find quick answers about our shipping, returns, and exchanges.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  // FAQ Card B&W
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === index ? null : index)
                    }
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-bold text-black pr-4 uppercase tracking-wider text-sm md:text-base">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0 text-black">
                      {expandedFAQ === index ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed text-sm">
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