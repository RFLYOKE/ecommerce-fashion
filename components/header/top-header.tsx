// Header.tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useMemo } from "react";
import { Menu, X, ShoppingCart, User, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useCart from "@/hooks/use-cart";
import Image from "next/image";

interface TranslationContent {
  home: string;
  about: string;
  products: string;
  service: string;
  testimonials: string;
  news: string;
  howToOrder: string;
  tagline: string;
  switchLanguage: string;
}

interface Translations {
  id: TranslationContent;
  en: TranslationContent;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { switchLang } = useLanguage();
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const cartItems = useCart((s) => s.cartItems);
  const cartCount = useMemo(
    () => cartItems.reduce((t, item) => t + item.quantity, 0),
    [cartItems]
  );

  const translations: Translations = {
    id: {
      home: "Beranda",
      products: "Produk",
      service: "Layanan",
      howToOrder: "Cara Pemesanan",
      about: "Tentang Kami",
      news: "Artikel",
      testimonials: "Testimoni",
      tagline: "Kecantikan Alami, Seutuhnya",
      switchLanguage: "Ganti ke English",
    },
    en: {
      home: "Home",
      products: "Products",
      service: "Layanan",
      howToOrder: "How to Order",
      about: "About Us",
      news: "Articles",
      testimonials: "Testimonials",
      tagline: "Beauty Redefined, Naturally",
      switchLanguage: "Switch to Bahasa",
    },
  };

  const t = translations[language];

  const menuItems = [
    { name: t.about, href: "/about" },
    { name: t.products, href: "/product" },
    { name: t.service, href: "/service" },
    { name: t.howToOrder, href: "/how-to-order" },
    { name: t.news, href: "/news" },
    { name: t.testimonials, href: "/testimonials" },
  ];

  // Mapping warna hover untuk setiap menu sesuai palet
  const menuItemColors = [
    {
      name: t.about,
      href: "/about",
      hoverBg: "hover:bg-[#F3F4F6]", // Light green
      activeBg: "bg-[#F3F4F6]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.products,
      href: "/product",
      hoverBg: "hover:bg-[#F3F4F6]", // Light pink
      activeBg: "bg-[#F3F4F6]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.service,
      href: "/service",
      hoverBg: "hover:bg-[#F3F4F6]", // Light pink
      activeBg: "bg-[#F3F4F6]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.howToOrder,
      href: "/how-to-order",
      hoverBg: "hover:bg-[#F3F4F6]", // Light blue
      activeBg: "bg-[#F3F4F6]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.news,
      href: "/news",
      hoverBg: "hover:bg-[#F3F4F6]", // Light green
      activeBg: "bg-[#F3F4F6]",
      textColor: "text-[#6B7280]",
    },
    {
      name: t.testimonials,
      href: "/testimonials",
      hoverBg: "hover:bg-[#F3F4F6]", // Light green
      activeBg: "bg-[#F3F4F6]",
      textColor: "text-[#6B7280]",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("yameiya-language");
      if (savedLanguage === "id" || savedLanguage === "en") {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const toggleLanguage = () => {
    const newLang = language === "id" ? "en" : "id";
    setLanguage(newLang);
    switchLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("yameiya-language", newLang);
      window.dispatchEvent(
        new CustomEvent("languageChanged", { detail: newLang })
      );
    }
  };

  const handleCartClick = () => {
    window.location.assign("/cart");
    window.dispatchEvent(new CustomEvent("openCart"));
  };

  const handleUserClick = () => {
    if (status === "loading") return;
    if (session?.user) {
      router.push("/me");
    } else {
      router.push("/login");
    }
  };

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-100"
            : "bg-white/90 backdrop-blur-sm shadow-md"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-full h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image
                    src="/images/new/logo/yameiya-skincare.png"
                    alt="YAMEIYA SKINCARE"
                    width={120}
                    height={48}
                  />
                </div>
                <p className="text-xs text-gray-500 font-medium leading-tight">
                  {t.tagline}
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative font-semibold transition-all duration-300 py-3 px-4 rounded-xl ${
                    isActiveLink(item.href)
                      ? "bg-[#E53935]/10 text-[#E53935] shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Language Toggle - Desktop */}
              <button
                onClick={toggleLanguage}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6B6B6B]/10 hover:bg-[#6B6B6B]/20 transition-all duration-300 shadow-sm"
                title={t.switchLanguage}
              >
                <Globe className="w-4 h-4 text-[#6B6B6B]" />
                <span className="text-sm font-bold text-[#6B6B6B]">
                  {language.toUpperCase()}
                </span>
              </button>

              {/* User Icon */}
              <button
                onClick={handleUserClick}
                className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-300"
                aria-label="User"
              >
                <User className="w-5 h-5 text-[#6B6B6B]" />
              </button>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-300"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-[#6B6B6B]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-xs font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMobileMenu}
      >
        <div
          className={`fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header */}
          <div className="p-6 border-b border-[#6B6B6B]/20 bg-gradient-to-r from-[#E53935]/10 to-[#FFFFFF]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E53935]/80 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">Y</span>
                </div>
                <div>
                  <h2 className="font-bold bg-gradient-to-r from-[#E53935] to-[#6B6B6B] bg-clip-text text-transparent">
                    YAMEIYA SKINCARE
                  </h2>
                  <p className="text-xs text-[#6B6B6B]/70">{t.tagline}</p>
                </div>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-[#E53935]/10 transition-colors"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5 text-[#6B6B6B]" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <div className="p-6 space-y-2 flex-1 overflow-y-auto">
            {menuItemColors.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={toggleMobileMenu}
                className={`flex items-center gap-4 p-4 rounded-2xl font-semibold transition-all duration-300 group ${
                  isActiveLink(item.href)
                    ? `${item.activeBg} text-gray-700 border-2 border-gray-300 shadow-md`
                    : `text-gray-700 ${item.hoverBg} hover:shadow-sm`
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen
                    ? "slideInRight 0.3s ease-out forwards"
                    : "none",
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${
                    isActiveLink(item.href)
                      ? "bg-gray-600"
                      : "bg-gray-300 group-hover:bg-gray-500"
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {isActiveLink(item.href) && (
                  <div className="w-1 h-6 bg-gray-600 rounded-full shadow-sm" />
                )}
              </Link>
            ))}

            {/* Language Toggle - Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-4 p-4 w-full rounded-2xl text-[#6B6B6B] hover:bg-[#E53935]/10 font-semibold transition-all duration-300 mt-6 border-2 border-[#6B6B6B]/30 bg-[#FFFFFF]/10"
            >
              <Globe className="w-5 h-5 text-[#6B6B6B]" />
              <span className="flex-1 text-left">{t.switchLanguage}</span>
              <span className="text-sm font-bold text-white bg-[#E53935] px-3 py-1 rounded-lg shadow-md">
                {language === "id" ? "EN" : "ID"}
              </span>
            </button>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t border-[#6B6B6B]/20 bg-gradient-to-r from-[#E53935]/10 to-[#FFFFFF]/10">
            <div className="flex items-center justify-center gap-4">
              <button className="flex-1 bg-[#E53935]/80 text-white py-4 rounded-2xl font-bold hover:from-[#E53935]/70 hover:to-[#6B6B6B]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Belanja Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
