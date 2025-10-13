"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Heart,
  Shield,
  Award,
  ArrowRight,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const goTofaqPage = () => {
    router.push("/faq");
  };

  const faqs = [
    {
      question:
        "Apakah produkBLACKBOXINC SKINCARE aman untuk semua jenis kulit?",
      answer:
        "Ya, semua produkBLACKBOXINC SKINCARE diformulasikan dengan bahan alami dan telah diuji dermatologi, sehingga aman digunakan untuk berbagai jenis kulit.",
    },
    {
      question: "Apakah ada sertifikasi untuk produkBLACKBOXINC SKINCARE?",
      answer:
        "ProdukBLACKBOXINC SKINCARE telah tersertifikasi BPOM dan melalui uji klinis, sehingga terjamin kualitas dan keamanannya.",
    },
  ];

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Produk", href: "/product" },
    { name: "Layanan", href: "/service" },
    { name: "Testimoni", href: "/#testimonials" },
  ];

  return (
    <footer className="bg-gray-50 text-gray-700 relative overflow-hidden border-t">
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8 px-6 lg:px-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    <Image
                      src="/images/new/logo/yameiya-skincare.png"
                      alt="Logo"
                      width={75}
                      height={40}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Perawatan kulit alami dengan bahan berkualitas tinggi untuk
                  menjaga kelembapan, mencerahkan, dan menutrisi kulit wajah.
                </p>

                {/* Values */}
                <div className="space-y-3 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#E53935]" />
                    <span>Aman & Tersertifikasi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#E53935]" />
                    <span>Dermatology Tested</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#E53935]" />
                    <span>Trusted by Thousands</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4.5 h-4.5 text-[#E53935]" />
                    <span>
                      Jalan raya Lohbener depan kantor PEMBAYARAN PDAM LOHBENER
                      celeng RT 18/RW 05,BLACKBOXINC skincare kecamatan Lohbener
                      kabupaten Indramayu
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#E53935]" />
                    <span>+62 877 2666 6394</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#E53935]" />
                    <span>yameiyaskincare@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-gray-800">
                  Menu Utama
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-600 hover:text-[#E53935] transition-colors flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#E53935]" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-gray-800">
                  FAQ
                </h4>
                <div className="space-y-4 mb-4">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                    >
                      <button
                        className="w-full flex justify-between items-center text-left p-4 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          setActiveIndex(activeIndex === i ? null : i)
                        }
                      >
                        <span className="font-medium text-sm pr-2">
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0">
                          {activeIndex === i ? (
                            <ChevronUp className="w-4 h-4 text-[#E53935]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#E53935]" />
                          )}
                        </div>
                      </button>
                      {activeIndex === i && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={goTofaqPage}
                    type="button"
                    className="w-full bg-[#E53935] text-white py-3 rounded-2xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    Punya Pertanyaan Lain?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-200 bg-gray-100">
          <div className="container mx-auto px-6 lg:px-12 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <p>
                © {new Date().getFullYear()}BLACKBOXINC SKINCARE. All rights
                reserved.
              </p>

              {/* Social Media */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <p className="text-gray-600 text-sm">Ikuti kami di:</p>
                <div className="flex gap-4">
                  <a
                    className="w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white"
                    href="https://www.instagram.com/yameiya_skincare?igsh=MTN4MTE0anA2aXB4aA=="
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram size={18} />
                  </a>
                  <a
                    className="w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white"
                    href="https://www.facebook.com/share/19mYKsot3N/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebookF size={18} />
                  </a>
                  <a
                    className="w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-green-500 hover:text-white"
                    href="https://wa.me/6287726666394"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
