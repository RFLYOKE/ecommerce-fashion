// Header.tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  FormEvent,
  Suspense,
} from "react";
import { Menu, X, ShoppingCart, User, Globe, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useCart from "@/hooks/use-cart";
import { MarqueeBanner } from "../ui/marque-text";
import clsx from "clsx";

/* ---------- Types ---------- */
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

/* ---------- Suspense-safe reader ---------- */
function SearchParamsReader({
  onChange,
}: {
  onChange: (sp: URLSearchParams) => void;
}) {
  const sp = useSearchParams();
  useEffect(() => {
    onChange(sp);
  }, [sp, onChange]);
  return null;
}

/* ---------- Search UI ---------- */
function SearchEngine({
  placeholder = "Cari produk, kategori, atau merek…",
  className = "",
  autoFocusShortcut = true,
  autoFocus = false,
  onNavigate,
  onClose,
}: {
  placeholder?: string;
  className?: string;
  autoFocusShortcut?: boolean;
  autoFocus?: boolean;
  onNavigate?: (q: string) => void;
  onClose?: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

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
    onClose?.();
    router.push(`/product?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
      setOpen(true);
    }
  }, [autoFocus]);

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
      if (e.key === "Escape") {
        setOpen(false);
        onClose?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [autoFocusShortcut, onClose]);

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
    () => ["denim", "t-shirt", "hoodie", "sneakers", "accessories"],
    []
  );

  return (
    <div
      className={["relative", className].join(" ")}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <form
        onSubmit={onSubmit}
        className="group flex items-center gap-2 rounded-lg border border-black bg-white/95 px-3 py-2 shadow-lg transition focus-within:ring-2 focus-within:ring-black/20"
      >
        <Search className="h-5 w-5 text-gray-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base outline-none placeholder:text-gray-400"
          aria-label="Search"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="rounded-lg px-2 text-xs text-gray-600 hover:text-black"
            aria-label="Clear"
          >
            Esc
          </button>
        )}
        <kbd className="hidden md:inline-flex select-none items-center gap-1 rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
          ⌘K
        </kbd>
      </form>

      {open && (
        <div className="absolute left-0 right-0 z-[60] mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
          {query.length >= 3 ? (
            <div className="max-h-80 overflow-auto p-2">
              <button
                className="w-full text-left rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => doSearch(query)}
              >
                Search “
                <span className="font-semibold text-black">{query}</span>”
              </button>
              <div className="mt-1 grid grid-cols-2 gap-1">
                <div className="col-span-2 px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Trending
                </div>
                {trending.map((k) => (
                  <button
                    key={k}
                    className="truncate rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-100"
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
                Recent Searches
              </div>
              {filteredRecent.length ? (
                <div className="flex flex-wrap gap-2">
                  {filteredRecent.map((r) => (
                    <button
                      key={r}
                      className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-black hover:bg-gray-50"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => doSearch(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Press **/** or **Cmd/Ctrl+K** to quick search.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Main Header ---------- */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const [navHeight, setNavHeight] = useState(0);

  const { switchLang } = useLanguage();
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null
  );
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
      products: "Semua Produk",
      service: "Barang Baru",
      howToOrder: "Cara Pemesanan",
      testimonials: "Penjualan Terbaik",
      tagline: "ORIGINAL EST 2018",
      switchLanguage: "Ganti ke English",
    },
    en: {
      home: "Home",
      products: "All Products",
      service: "New Arrival",
      howToOrder: "How to Order",
      testimonials: "Best Seller",
      tagline: "ORIGINAL EST 2018",
      switchLanguage: "Switch to Bahasa",
    },
  };
  const t = translations[language];

  // === ACTIVE STATE MENU (fix) ===
  const isMenuLinkActive = (href: string) => {
    const currentPath = pathname;
    const currentQ = searchParams?.get("q") ?? null;

    if (href === "/") return currentPath === "/";

    if (!href.includes("?")) {
      if (href === "/product") {
        // All Products aktif hanya ketika /product tanpa q
        return currentPath === "/product" && currentQ === null;
      }
      return currentPath.startsWith(href);
    }

    // Link dengan query (?q=...)
    if (currentPath === "/product" && href.startsWith("/product?")) {
      const url = new URL(`http://dummy${href}`);
      const menuQ = url.searchParams.get("q"); // "new-arrivals" | "best-seller"
      return currentQ === menuQ;
    }
    return false;
  };

  const primaryMenuItems = useMemo(
    () => [
      { name: t.home, href: "/" },
      { name: t.products, href: "/product" },
      { name: t.service, href: "/product?q=new-arrivals" },
      { name: t.testimonials, href: "/product?q=best-seller" },
      { name: t.howToOrder, href: "/how-to-order" },
    ],
    [t]
  );

  const mobileMenuItems = primaryMenuItems;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("BLACKBOXINC-language");
      if (savedLanguage === "id" || savedLanguage === "en")
        setLanguage(savedLanguage);
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((v) => !v);
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "unset";
  };
  const toggleLanguage = () => {
    const newLang = language === "id" ? "en" : "id";
    setLanguage(newLang);
    switchLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("BLACKBOXINC-language", newLang);
      window.dispatchEvent(
        new CustomEvent("languageChanged", { detail: newLang })
      );
    }
  };
  const handleCartClick = () => router.push("/cart");
  const handleUserClick = () => {
    if (status === "loading") return;
    if (session?.user) router.push("/me");
    else router.push("/login");
  };

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsReader onChange={setSearchParams} />
      </Suspense>

      <nav
        ref={navRef}
        className={clsx(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-100"
            : "bg-white/95 backdrop-blur-sm"
        )}
      >
        <MarqueeBanner
          message={
            "NEW ARRIVAL • SALE UP TO 70% • GRATIS ONGKIR"
          }
          size="sm"
          speed={60}
          pauseOnHover
          className="bg-black text-white py-1"
        />

        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20 relative">
            <div className="flex items-center gap-2 md:gap-1">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 transition-all md:hidden"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-black" />
                ) : (
                  <Menu className="w-6 h-6 text-black" />
                )}
              </button>
              <button
                onClick={() => setIsSearchOpen((v) => !v)}
                className="p-2 rounded-full hover:bg-gray-100 transition-all md:hidden"
                aria-label="Search"
                aria-expanded={isSearchOpen}
              >
                <Search className="w-5 h-5 text-black" />
              </button>
              <button
                onClick={() => setIsSearchOpen((v) => !v)}
                className="p-2 rounded-full hover:bg-gray-100 transition-all hidden md:block"
                aria-label="Search"
                aria-expanded={isSearchOpen}
                aria-controls="header-search-panel"
              >
                <Search className="w-5 h-5 text-black" />
              </button>
              <button
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                title={t.switchLanguage}
                aria-label="Toggle language"
              >
                <Globe className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  {language.toUpperCase()}
                </span>
              </button>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center justify-center w-fit">
              <Link
                href="/"
                className="group inline-flex flex-col items-center text-center select-none"
              >
                <h1 className="font-extrabold tracking-[0.2em] text-black text-lg md:text-xl leading-none">
                  BLACKBOX.INC
                </h1>
                <span className="mt-1 text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-gray-600">
                  {t.tagline}
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-1 md:gap-1">
              <button
                onClick={handleUserClick}
                className="p-2 rounded-full hover:bg-gray-100 transition-all"
                aria-label="User account"
              >
                <User className="w-5 h-5 text-black" />
              </button>
              <button
                onClick={handleCartClick}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-all"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 text-black" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center border border-white shadow-sm">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block border-t border-gray-100">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex h-12 items-center justify-center overflow-x-auto">
              <div className="flex items-center gap-8 text-[12px] font-medium tracking-[0.1em] uppercase">
                {primaryMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-2 transition-colors duration-200 group ${
                      isMenuLinkActive(item.href)
                        ? "text-black"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isMenuLinkActive(item.href) && (
                      <span className="pointer-events-none absolute -bottom-[1.5px] left-0 h-[1.5px] w-full bg-black transition-all" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
            aria-hidden
          />
          <div
            id="header-search-panel"
            className="fixed left-0 right-0 z-50 animate-[slideDown_0.2s_ease-out]"
            style={{ top: navHeight }}
          >
            <div className="mx-auto max-w-2xl px-4 md:px-6">
              <SearchEngine
                className="w-full"
                autoFocus
                autoFocusShortcut={false}
                onClose={() => setIsSearchOpen(false)}
              />
            </div>
          </div>
        </>
      )}

      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={toggleMobileMenu}
        >
          <div
            className={`fixed top-0 left-0 w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <h2 className="font-extrabold tracking-[0.15em] text-lg">
                    MENU
                  </h2>
                  <p className="text-xs text-gray-500">{t.tagline}</p>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>
              <SearchEngine
                className="w-full"
                placeholder="Cari di Blackboxinc…"
                autoFocusShortcut={false}
                onClose={toggleMobileMenu}
              />
            </div>

            <div className="p-4 space-y-1">
              {mobileMenuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMobileMenu}
                  className={clsx(
                    "flex items-center justify-between p-3 rounded-lg font-semibold uppercase tracking-wide transition-colors duration-200",
                    isMenuLinkActive(item.href)
                      ? "text-black bg-gray-100"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isMobileMenuOpen
                      ? "slideInLeft 0.3s ease-out forwards"
                      : "none",
                  }}
                >
                  <span className="flex-1">{item.name}</span>
                  <span className="text-gray-400 font-normal text-sm">›</span>
                </Link>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleUserClick}
                  className="flex items-center gap-3 p-3 text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors flex-1 justify-start"
                >
                  <User className="w-5 h-5" />
                  {session?.user ? "Akun Saya" : "Masuk / Daftar"}
                </button>
              </div>

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-4 p-3 w-full rounded-lg text-gray-700 hover:bg-gray-100 font-semibold transition-all duration-300 border border-gray-200"
              >
                <Globe className="w-5 h-5" />
                <span className="flex-1 text-left">{t.switchLanguage}</span>
                <span className="text-xs font-bold text-black bg-gray-100 px-3 py-1 rounded-md">
                  {language === "id" ? "EN" : "ID"}
                </span>
              </button>

              <button className="w-full bg-black text-white py-3 rounded-lg font-bold transition-all shadow-lg hover:opacity-90 uppercase tracking-wider">
                BELANJA SEKARANG
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
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