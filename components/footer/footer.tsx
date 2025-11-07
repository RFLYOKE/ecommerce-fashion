// components/sections/Footer.tsx
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
  Diamond,
  ShieldCheck, // Ikon premium baru
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";

export default function Footer() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const goTofaqPage = () => {
    router.push("/faq");
  };

  // Konten FAQ disesuaikan untuk Fashion
  const faqs = [
    {
      question: "Apa kebijakan pengembalian produk Blackboxinc?",
      answer:
        "Kami menerima pengembalian dan penukaran dalam 30 hari sejak tanggal pembelian, selama produk dalam kondisi asli (belum dipakai dan label masih lengkap).",
    },
    {
      question: "Bagaimana cara menentukan ukuran yang tepat?",
      answer:
        "Anda dapat merujuk ke 'Size Guide' kami yang tersedia di halaman setiap produk untuk pengukuran detail. Jika ragu, hubungi tim support kami.",
    },
  ];

  // Tautan Cepat
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Shop", href: "/product" },
    { name: "Best Sellers", href: "/product?q=best-seller" },
    { name: "Contact", href: "/contact" },
  ];

  // Tautan Layanan Pelanggan
  const serviceLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  // Mengganti logo Image dengan teks brand jika gambar logo tidak relevan dengan B&W
  const BrandLogo = () => (
      <Link href="/" className="group inline-flex flex-col items-start select-none">
          <h1 className="font-extrabold tracking-[0.2em] text-black text-xl leading-none">
              BLACKBOXINC
          </h1>
          <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-gray-700">
              Timeless Style
          </span>
      </Link>
  );


  return (
    <footer className="bg-white text-gray-700 relative overflow-hidden border-t border-gray-200">
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-10 px-6 lg:px-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
              {/* Kolom 1: Company Info & Values (lg:col-span-2) */}
              <div className="col-span-2 lg:col-span-2">
                <BrandLogo />

                <p className="text-sm text-gray-700 leading-relaxed mt-4 mb-4 max-w-sm">
                  Curating timeless fashion pieces with uncompromising quality
                  and sleek, modern design. Elevate your wardrobe with
                  Blackboxinc.
                </p>

                {/* Values - Minimalist B&W */}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-2 font-medium text-black">
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Quality Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-black">
                    <Diamond className="w-4 h-4 text-black" />
                    <span>Exclusive Designs</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-black">
                    <Heart className="w-4 h-4 text-black" />
                    <span>Trusted by Clients</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 text-black flex-shrink-0" />
                    <span>Jatijajar Depok Jawa barat 16455</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-black" />
                    <span>+62 895 6227 17884</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-black" />
                    <span>hello@blackboxinc.com</span>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Quick Links */}
              <div className="col-span-1">
                <h4 className="text-base font-extrabold mb-4 text-black uppercase tracking-wider">
                  Quick Links
                </h4>
                <ul className="space-y-3 text-sm">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-700 hover:text-black transition-colors relative group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform inline-block">
                          {link.name}
                        </span>
                        <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolom 3: Customer Service Links */}
              <div className="col-span-1">
                <h4 className="text-base font-extrabold mb-4 text-black uppercase tracking-wider">
                  Support
                </h4>
                <ul className="space-y-3 text-sm">
                  {serviceLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-700 hover:text-black transition-colors relative group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform inline-block">
                          {link.name}
                        </span>
                        <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolom 4: FAQ (Accordion) */}
              <div className="col-span-2 md:col-span-4 lg:col-span-1">
                <h4 className="text-base font-extrabold mb-4 text-black uppercase tracking-wider">
                  FAQ
                </h4>
                <div className="space-y-3 mb-4">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full flex justify-between items-center text-left p-3 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleAccordion(i)}
                      >
                        <span className="font-medium text-sm pr-2 text-black">
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0">
                          {activeIndex === i ? (
                            <ChevronUp className="w-4 h-4 text-black" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-black" />
                          )}
                        </div>
                      </button>
                      {activeIndex === i && (
                        <div className="px-3 pb-3 border-t border-gray-100">
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
                    // CTA Button: White/Bordered
                    className="w-full border border-black text-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    View All FAQs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} **BLACKBOXINC**. All rights
                reserved.
              </p>

              {/* Social Media */}
              <div className="flex items-center gap-6">
                <p className="text-gray-600 text-sm hidden sm:block">
                  Follow Us:
                </p>
                <div className="flex gap-3">
                  {/* Social Icons: B&W Style */}
                  <a
                    className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                    href="https://www.instagram.com/BLACKBOXINC_Shop?igsh=MTN4MTE0anA2aXB4aA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={16} />
                  </a>
                  <a
                    className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                    href="https://www.facebook.com/share/19mYKsot3N/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <FaFacebookF size={16} />
                  </a>
                  <a
                    className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                    href="https://wa.me/6287726666394"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp size={16} />
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