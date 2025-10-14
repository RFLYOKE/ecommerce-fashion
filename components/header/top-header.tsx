// Header.tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { Menu, X, ShoppingCart, User, Globe, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useCart from "@/hooks/use-cart";
import Image from "next/image";
import { MarqueeBanner } from "../ui/marque-text";

interface TranslationContent {
  home: string;
  about?: string;
  products: string;
  service: string;
  testimonials: string;
  news?: string;
  howToOrder: string;
  tagline: string;
  switchLanguage: string;
}

interface Translations {
  id: TranslationContent;
  en: TranslationContent;
}

// --- Search Engine UI (reusable) ---
function SearchEngine({
  placeholder = "Cari produk, kategori, atau merek…",
  className = "",
  autoFocusShortcut = true, // '/' to focus, Cmd/Ctrl+K to focus
  autoFocus = false, // focus input saat mount
  onNavigate,
}: {
  placeholder?: string;
  className?: string;
  autoFocusShortcut?: boolean;
  autoFocus?: boolean;
  onNavigate?: (q: string) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  // Load & persist recent searches
  useEffect(() => {
    try {
      const raw = localStorage.getItem("search:recent");
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const saveRecent = (term: string) => {
    const next = [
      term,
      ...recent.filter((r) => r.toLowerCase() !== term.toLowerCase()),
    ].slice(0, 7);
    setRecent(next);
    try {
      localStorage.setItem("search:recent", JSON.stringify(next));
    } catch {}
  };

  const doSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    onNavigate?.(q);
    saveRecent(q);
    setOpen(false);
    router.push(`/product?search=${encodeURIComponent(q)}`);
  };

  // Auto focus + buka panel saat mount jika diminta
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
      setOpen(true);
    }
  }, [autoFocus]);

  // Keyboard shortcuts to focus
  useEffect(() => {
    if (!autoFocusShortcut) return;
    const handler = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const isSlash = !e.metaKey && !e.ctrlKey && !e.altKey && e.key === "/";
      if (isCmdK || isSlash) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [autoFocusShortcut]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const filteredRecent = useMemo(() => {
    if (!query) return recent;
    const q = query.toLowerCase();
    return recent.filter((r) => r.toLowerCase().includes(q));
  }, [recent, query]);

  const trending = useMemo(
    () => [
      "serum acne",
      "moisturizer",
      "sunscreen",
      "brightening",
      "anti-aging",
    ],
    []
  );

  return (
    <div
      className={["relative", className].join(" ")}
      onBlur={(e) => {
        // close only if focus leaves the wrapper
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <form
        onSubmit={onSubmit}
        className="group flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/90 px-3 py-2 shadow-sm ring-1 ring-transparent transition focus-within:ring-black/30 focus-within:border-black/40"
      >
        <Search className="h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          aria-label="Search"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="rounded-lg px-2 text-xs text-gray-500 hover:text-gray-700"
            aria-label="Clear"
          >
            Esc
          </button>
        )}
        <kbd className="hidden md:inline-flex select-none items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-500">
          /
        </kbd>
      </form>

      {/* Suggestion panel */}
      {open && (
        <div className="absolute left-0 right-0 z-[60] mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur">
          {query.length >= 3 ? (
            <div className="max-h-80 overflow-auto p-2">
              <button
                className="w-full text-left rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => doSearch(query)}
              >
                Cari “
                <span className="font-semibold text-gray-900">{query}</span>”
              </button>
              <div className="mt-1 grid grid-cols-2 gap-1">
                {trending.map((k) => (
                  <button
                    key={k}
                    className="truncate rounded-xl px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => doSearch(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pencarian Terakhir
              </div>
              {filteredRecent.length ? (
                <div className="flex flex-wrap gap-2">
                  {filteredRecent.map((r) => (
                    <button
                      key={r}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => doSearch(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Ketik minimal 3 huruf untuk mulai mencari.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // ⬅️ toggle panel
  const navRef = useRef<HTMLElement | null>(null);
  const [navHeight, setNavHeight] = useState(0);

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
      products: "Barang Penjualan",
      service: "Barang Baru",
      howToOrder: "Cara Pemesanan",
      testimonials: "Penjualan Terbaik",
      tagline: "Kecantikan Alami, Seutuhnya",
      switchLanguage: "Ganti ke English",
    },
    en: {
      home: "Home",
      products: "Sale Item",
      service: "New Arrival",
      howToOrder: "How to Order",
      testimonials: "Best Seller",
      tagline: "Beauty Redefined, Naturally",
      switchLanguage: "Switch to Bahasa",
    },
  };

  const t = translations[language];

  const menuItems = [
    { name: t.howToOrder, href: "/how-to-order" },
    { name: t.service, href: "/new-arrivals" },
    { name: t.products, href: "/product" },
    { name: t.testimonials, href: "/best-seller" },
  ];

  // Mapping warna hover untuk setiap menu sesuai palet
  const menuItemColors = [
    {
      name: t.about,
      href: "/about",
      hoverBg: "hover:bg-gray-100",
      activeBg: "bg-gray-100",
      textColor: "text-gray-700",
    },
    {
      name: t.products,
      href: "/product",
      hoverBg: "hover:bg-gray-100",
      activeBg: "bg-gray-100",
      textColor: "text-gray-700",
    },
    {
      name: t.service,
      href: "/service",
      hoverBg: "hover:bg-gray-100",
      activeBg: "bg-gray-100",
      textColor: "text-gray-700",
    },
    {
      name: t.howToOrder,
      href: "/how-to-order",
      hoverBg: "hover:bg-gray-100",
      activeBg: "bg-gray-100",
      textColor: "text-gray-700",
    },
    {
      name: t.news,
      href: "/news",
      hoverBg: "hover:bg-gray-100",
      activeBg: "bg-gray-100",
      textColor: "text-gray-700",
    },
    {
      name: t.testimonials,
      href: "/testimonials",
      hoverBg: "hover:bg-gray-100",
      activeBg: "bg-gray-100",
      textColor: "text-gray-700",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Recalc nav height (includes marquee)
  useEffect(() => {
    const recalc = () =>
      setNavHeight(navRef.current?.getBoundingClientRect().height ?? 0);
    recalc();
    const ro = new ResizeObserver(recalc);
    if (navRef.current) ro.observe(navRef.current);
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [isScrolled]);

  // Close search on route change or ESC
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      {/* Thin top line like reference */}
      <div className="fixed top-0 z-[60] h-1 w-full bg-black" />

      <nav
        ref={navRef}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        {/* Optional marquee (kept as-is) */}
        <MarqueeBanner
          message={
            "Diskon akhir tahun • Gratis ongkir seluruh Indonesia • Katalog baru rilis hari ini • Dukungan 24/7 via WhatsApp"
          }
          size="sm"
          speed={70}
          pauseOnHover
        />

        {/* Row 1: centered brand, right icons */}
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-3 items-center h-20">
            {/* Left spacer (could hold language toggle later) */}
            <div className="hidden md:block" />

            {/* Center brand (Blackboxinc) */}
            <div className="flex items-center justify-center">
              <Link
                href="/"
                className="group inline-flex flex-col items-center text-center select-none"
              >
                {/* If you want to keep image, show it subtle; else rely on text brand */}
                <div className="sr-only">
                  <Image
                    src="/images/new/logo/yameiya-Shop.png"
                    alt="BLACKBOXINC"
                    width={120}
                    height={48}
                  />
                </div>
                <h1 className="font-extrabold tracking-[0.15em] text-gray-900 text-lg md:text-xl leading-none">
                  BLACKBOXINC
                </h1>
                <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gray-500">
                  {t.tagline}
                </span>
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center justify-end gap-1">
              {/* Search Icon only (opens panel below header) */}
              <button
                onClick={() => setIsSearchOpen((v) => !v)}
                className="p-3 rounded-full hover:bg-gray-100 transition-all"
                aria-label="Search"
                aria-expanded={isSearchOpen}
                aria-controls="header-search-panel"
              >
                <Search className="w-5 h-5 text-gray-900" />
              </button>

              {/* Language Toggle - Desktop (kept) */}
              <button
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-[#F3F4F6] transition-all"
                title={t.switchLanguage}
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-bold text-gray-700">
                  {language.toUpperCase()}
                </span>
              </button>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-3 rounded-full hover:bg-gray-100 transition-all"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-900" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              <button
                onClick={handleUserClick}
                className="p-3 rounded-full hover:bg-gray-100 transition-all"
                aria-label="User"
              >
                <User className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: centered nav links */}
        <div className="border-t border-gray-100">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex h-[4rem] items-center justify-center overflow-x-auto">
              <div className="flex items-center gap-8 md:gap-12 text-[12px] md:text-[13px] font-semibold tracking-[0.12em] uppercase">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-xl px-3 py-2 transition-colors ${
                      isActiveLink(item.href)
                        ? "text-gray-900 bg-[#F3F4F6]"
                        : "text-gray-700 hover:bg-[#F3F4F6] hover:text-gray-900"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActiveLink(item.href) && (
                      <span className="pointer-events-none absolute -bottom-2 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-black" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating search panel BELOW the header */}
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsSearchOpen(false)}
            aria-hidden
          />
          {/* Panel */}
          <div
            id="header-search-panel"
            className="fixed left-0 right-0 z-50 animate-[slideDown_0.2s_ease-out]"
            style={{ top: navHeight }}
          >
            <div className="mx-auto max-w-3xl px-4 md:px-6">
              <SearchEngine
                className="w-full"
                autoFocus
                autoFocusShortcut={false}
              />
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMobileMenu}
      >
        <div
          className={`fixed top-0 right-0 w-[90%] max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header */}
          <div className="p-6 border-b border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="font-extrabold tracking-[0.15em]">
                  BLACKBOXINC
                </h2>
                <p className="text-xs text-gray-500">{t.tagline}</p>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Mobile Search */}
            <SearchEngine
              className="w-full"
              placeholder="Cari di Blackboxinc…"
            />
          </div>

          {/* Mobile Menu Items */}
          <div className="p-6 space-y-2 flex-1 overflow-y-auto">
            {menuItemColors.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleMobileMenu}
                className={`flex items-center gap-4 p-4 rounded-2xl font-semibold transition-all duration-300 group ${
                  pathname.startsWith(item.href)
                    ? `${item.activeBg} text-gray-800 border-2 border-gray-300 shadow-sm`
                    : `text-gray-700 ${item.hoverBg} hover:shadow-sm`
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen
                    ? "slideInRight 0.3s ease-out forwards"
                    : "none",
                }}
              >
                <span className="flex-1 uppercase tracking-[0.12em]">
                  {item.name}
                </span>
                {pathname.startsWith(item.href) && (
                  <div className="w-1 h-6 bg-gray-600 rounded-full shadow-sm" />
                )}
              </Link>
            ))}

            {/* Language Toggle - Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-4 p-4 w-full rounded-2xl text-gray-700 hover:bg-gray-100 font-semibold transition-all duration-300 mt-6 border-2 border-gray-200"
            >
              <Globe className="w-5 h-5" />
              <span className="flex-1 text-left">{t.switchLanguage}</span>
              <span className="text-sm font-bold text-white bg-black px-3 py-1 rounded-lg shadow-md">
                {language === "id" ? "EN" : "ID"}
              </span>
            </button>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4">
              <button className="flex-1 bg-black text-white py-4 rounded-2xl font-bold transition-all shadow-sm hover:shadow-md">
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
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
