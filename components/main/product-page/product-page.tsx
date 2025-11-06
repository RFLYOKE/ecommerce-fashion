"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Search,
  Package,
  X,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Filter,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/admin/product";
import {
  useGetProductListQuery,
  useGetProductBySlugQuery,
  useGetProductVariantBySlugQuery,
  useGetCategoryListQuery,
} from "@/services/product.service";
import DotdLoader from "@/components/loader/3dot";
import useCart from "@/hooks/use-cart";
import clsx from "clsx";
import VariantPickerModal from "@/components/variant-picker-modal";

/* =========================
   Small typed helpers
========================= */
// type guard kecil
const isKeyedObject = (o: unknown): o is Record<string, unknown> =>
  !!o && typeof o === "object";

// overloads: hasil tergantung 'kind'
function getProp(obj: unknown, key: string, kind: "number"): number | undefined;
function getProp(obj: unknown, key: string, kind: "string"): string | undefined;
function getProp(
  obj: unknown,
  key: string,
  kind: "number" | "string"
): number | string | undefined {
  if (!isKeyedObject(obj)) return undefined;
  const v = obj[key];
  if (kind === "number") return typeof v === "number" ? v : undefined;
  return typeof v === "string" ? v : undefined;
}


const getNumberProp = (obj: unknown, key: string): number | undefined =>
  getProp(obj, key, "number");
const getStringProp = (obj: unknown, key: string): string | undefined =>
  getProp(obj, key, "string");

type MediaObj = { original_url: string };
type MaybeWithMedia = { media?: MediaObj[] };

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

/* ---------- Star rating ---------- */
function StarRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(value)
              ? "fill-black text-black"
              : "text-gray-300"
          }`}
        />
      ))}
    </span>
  );
}

type ViewMode = "grid" | "list";
type PriceRange =
  | "all"
  | "under-100k"
  | "100k-200k"
  | "200k-500k"
  | "above-500k";
type SortKey =
  | "featured"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest"
  | "diskon-terbesar";

export interface ProductVariant {
  id: number;
  name: string | number;
  price: number | string;
  stock: number | string;
  sku?: string | null;
}
type SelectedVariant = {
  id?: number;
  price?: number | string;
  stock?: number | string;
  sku?: string | null;
};

const isVariantArray = (v: unknown): v is ProductVariant[] =>
  Array.isArray(v) &&
  v.every(
    (o) =>
      !!o &&
      typeof o === "object" &&
      "id" in o &&
      "name" in o &&
      "price" in o &&
      "stock" in o
  );

const IMG_FALLBACK =
  "https://via.placeholder.com/400x400/000000/FFFFFF?text=BLACKBOXINC";

const formatDate = (d: Date) =>
  d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
const etaRange = () => {
  const a = new Date();
  const b = new Date();
  a.setDate(a.getDate() + 2);
  b.setDate(b.getDate() + 5);
  return `${formatDate(a)} – ${formatDate(b)}`;
};

const FilterBlocks = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
const Pagination = ({
  page,
  totalPages,
  onChange,
  children,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  children?: React.ReactNode;
}) => (
  <div className="text-center flex items-center justify-center gap-2">
    <button
      onClick={() => onChange(Math.max(1, page - 1))}
      disabled={page <= 1}
      className="px-3 py-1 rounded bg-gray-200 text-black disabled:opacity-50"
    >
      Prev
    </button>
    <span className="px-2 text-sm font-semibold text-black">
      Page {page} of {totalPages}
    </span>
    <button
      onClick={() => onChange(Math.min(totalPages, page + 1))}
      disabled={page >= totalPages}
      className="px-3 py-1 rounded bg-gray-200 text-black disabled:opacity-50"
    >
      Next
    </button>
    {children}
  </div>
);
const Button = ({
  children,
  className,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button className={className} onClick={onClick} {...props}>
    {children}
  </button>
);

/* ---------- Utils ---------- */
const toNumber = (val: number | string): number => {
  if (typeof val === "number") return val;
  const parsed = parseFloat(val);
  return Number.isFinite(parsed) ? parsed : 0;
};
const formatQueryToTitle = (q: string | null): string => {
  if (!q) return "Semua Produk";
  if (q === "new-arrivals") return "New Arrivals";
  if (q === "best-seller") return "Best Seller";
  const spaced = q.replace(/-/g, " ").trim();
  return spaced
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function ProductsPage() {
  /* ---------- Search params ---------- */
  const [sp, setSp] = useState<URLSearchParams | null>(null);
  const rawQ = sp?.get("q") ?? null;

  type Mode = "all" | "new" | "best";
  const mode: Mode =
    rawQ === "new-arrivals" ? "new" : rawQ === "best-seller" ? "best" : "all";
  const urlSearchTerm = mode === "all" ? rawQ ?? "" : "";

  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);

  const dynamicTitle = useMemo(() => formatQueryToTitle(rawQ), [rawQ]);

  /* ---------- Local states ---------- */
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState(urlSearchTerm);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedVariant, setSelectedVariant] =
    useState<SelectedVariant | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setQuery(urlSearchTerm);
    setCurrentPage(1);
  }, [urlSearchTerm]);

  const [filter, setFilter] = useState<{
    category: string;
    priceRange: PriceRange;
    sort: SortKey;
  }>({
    category: "all",
    priceRange: "all",
    sort: "featured",
  });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  const { addItem } = useCart();

  /* ---------- API bindings ---------- */
  const ITEMS_PER_PAGE = 9;

  const orderBy =
    mode === "new"
      ? "updated_at"
      : mode === "best"
      ? "products.sales"
      : undefined;
  const order: "asc" | "desc" | undefined = orderBy ? "desc" : undefined;

  const { data: listResp, isLoading } = useGetProductListQuery({
    page: currentPage,
    paginate: ITEMS_PER_PAGE,
    orderBy,
    order,
    search: urlSearchTerm || undefined,
  });

  const { data: categoryResp } = useGetCategoryListQuery({
    page: 1,
    paginate: 100,
  });

  const categoryOptions = useMemo(() => {
    if (categoryResp?.data && Array.isArray(categoryResp.data)) {
      return categoryResp.data.map((cat: { name: string }) => cat.name);
    }
    return ["T-Shirts", "Hoodies", "Pants", "Footwear", "Bags", "Accessories"];
  }, [categoryResp]);

  const [activeImg, setActiveImg] = useState(0);
  const totalPages = useMemo(() => listResp?.last_page ?? 1, [listResp]);
  const products = useMemo<Product[]>(() => listResp?.data ?? [], [listResp]);
  const [qty, setQty] = useState(1);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const { data: detailProduct, isLoading: isDetailLoading } =
    useGetProductBySlugQuery(selectedSlug ?? "", { skip: !selectedSlug });
  const { data: detailProductVariant, isLoading: isDetailVariantLoading } =
    useGetProductVariantBySlugQuery(selectedSlug ?? "", {
      skip: !selectedSlug,
    });

  const variants = useMemo<ProductVariant[]>(() => {
    const maybe = (detailProductVariant as unknown as { data?: unknown })?.data;
    return isVariantArray(maybe) ? maybe : [];
  }, [detailProductVariant]);

  const currentPrice = toNumber(
    selectedVariant?.price ?? detailProduct?.price ?? 0
  );
  const currentStock = toNumber(
    selectedVariant?.stock ?? detailProduct?.stock ?? 0
  );
  const currentSku = selectedVariant?.sku ?? detailProduct?.sku ?? "N/A";
  const currentDiscount = 0;

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (
    product: Product,
    id?: number,
    priceOverride?: number | string
  ) => {
    const variantId = id ?? product.product_variant_id ?? 0;
    const priceNum = toNumber(
      typeof priceOverride !== "undefined" ? priceOverride : product.price
    );
    addItem({ ...product, price: priceNum }, variantId);
    if (typeof window !== "undefined")
      window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const openVariantModalFor = (p: Product) => {
    setVariantProduct(p);
    setVariantModalOpen(true);
  };

  const openProductModal = (p: Product) => {
    setSelectedSlug(p.slug);
    setIsModalOpen(true);
  };

  /* ---------- Modal lifecycle ---------- */
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    if (isModalOpen && detailProduct) {
      if (variants.length > 0) {
        setSelectedVariant(variants[0]);
      } else {
        setSelectedVariant({
          id: detailProduct.id,
          price: detailProduct.price,
          stock: detailProduct.stock,
          sku: detailProduct.sku ?? null,
        });
      }
      setQty(1);
    } else {
      setSelectedVariant(null);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        if (e.shiftKey && activeEl === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && activeEl === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    if (isModalOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isModalOpen, detailProduct, variants.length]);

  /* ---------- Helpers ---------- */
  const getImageUrl = (p: Product): string => {
    if (typeof p.image === "string" && p.image) return p.image;
    const media = (p as unknown as MaybeWithMedia).media;
    if (Array.isArray(media) && media.length > 0 && media[0]?.original_url)
      return media[0].original_url;
    return IMG_FALLBACK;
  };

  /* ---------- Client-side filter/sort ---------- */
  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    let data = products;

    data = data.filter((p) => {
      const price = toNumber(p.price);
      const stock = toNumber(p.stock);
      const matchSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.category_name.toLowerCase().includes(term);
      const matchCategory =
        filter.category === "all" || p.category_name === filter.category;
      const matchPrice =
        filter.priceRange === "all" ||
        (filter.priceRange === "under-100k" && price < 100_000) ||
        (filter.priceRange === "100k-200k" &&
          price >= 100_000 &&
          price <= 200_000) ||
        (filter.priceRange === "200k-500k" &&
          price > 200_000 &&
          price <= 500_000) ||
        (filter.priceRange === "above-500k" && price > 500_000);
      const matchStock = inStockOnly ? stock > 0 : true;

      const was = getNumberProp(p, "was"); // optional price-before
      const matchDiscount = onlyDiscount
        ? typeof was === "number" && was > p.price
        : true;

      return (
        matchSearch &&
        matchCategory &&
        matchPrice &&
        matchStock &&
        matchDiscount
      );
    });

    return data;
  }, [
    products,
    query,
    filter.category,
    filter.priceRange,
    inStockOnly,
    onlyDiscount,
  ]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    switch (filter.sort) {
      case "price-low":
        return arr.sort((a, b) => a.price - b.price);
      case "price-high":
        return arr.sort((a, b) => b.price - a.price);
      case "rating": {
        return arr.sort(
          (a, b) =>
            (getNumberProp(b, "rating") ?? 0) -
            (getNumberProp(a, "rating") ?? 0)
        );
      }
      case "newest":
        return arr.sort((a, b) => b.id - a.id);
      case "diskon-terbesar":
        return arr.sort((a, b) => {
          const wasA = getNumberProp(a, "was") ?? a.price;
          const wasB = getNumberProp(b, "was") ?? b.price;
          const discA = (wasA - a.price) / wasA;
          const discB = (wasB - b.price) / wasB;
          return discB - discA;
        });
      default:
        return arr;
    }
  }, [filteredProducts, filter.sort]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sortedProducts.slice(start, end);
  }, [sortedProducts, currentPage]);

  const totalFilteredPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / ITEMS_PER_PAGE)
  );
  const startFilteredIdx = sortedProducts.length
    ? (currentPage - 1) * ITEMS_PER_PAGE + 1
    : 0;
  const endFilteredIdx = Math.min(
    currentPage * ITEMS_PER_PAGE,
    sortedProducts.length
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    query,
    filter.category,
    filter.priceRange,
    filter.sort,
    inStockOnly,
    onlyDiscount,
  ]);

  const formatCurrency = (n: number): string =>
    `Rp ${n.toLocaleString("id-ID")}`;
  const totalModalPrice = currentPrice * qty;

  const SimplifiedFilterBlocks = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-black uppercase tracking-wider border-b border-gray-200 pb-2">
        Category
      </h3>
      <div className="flex flex-col gap-2 mb-4">
        <label className="flex items-center space-x-2 text-sm text-gray-700">
          <input
            type="radio"
            name="category"
            value="all"
            checked={filter.category === "all"}
            onChange={() => setFilter({ ...filter, category: "all" })}
            className="text-black focus:ring-black"
          />
          <span>All Categories</span>
        </label>
        {categoryOptions.map((cat) => (
          <label
            key={cat}
            className="flex items-center space-x-2 text-sm text-gray-700"
          >
            <input
              type="radio"
              name="category"
              value={cat}
              checked={filter.category === cat}
              onChange={() => setFilter({ ...filter, category: cat })}
              className="text-black focus:ring-black"
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>

      <h3 className="font-bold text-black uppercase tracking-wider border-b border-gray-200 pb-2">
        Availability
      </h3>
      <label className="flex items-center space-x-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="text-black focus:ring-black"
        />
        <span>In Stock Only</span>
      </label>
      <label className="flex items-center space-x-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={onlyDiscount}
          onChange={(e) => setOnlyDiscount(e.target.checked)}
          className="text-black focus:ring-black"
        />
        <span>On Discount</span>
      </label>

      <h3 className="font-bold text-black uppercase tracking-wider border-b border-gray-200 pt-4 pb-2">
        Price Range
      </h3>
      <select
        value={filter.priceRange}
        onChange={(e) =>
          setFilter({
            ...filter,
            priceRange: (
              [
                "all",
                "under-100k",
                "100k-200k",
                "200k-500k",
                "above-500k",
              ] as PriceRange[]
            ).includes(e.target.value as PriceRange)
              ? (e.target.value as PriceRange)
              : "all",
          })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black bg-white"
      >
        <option value="all">All Prices</option>
        <option value="under-100k">Below Rp100.000</option>
        <option value="100k-200k">Rp100.000 - Rp200.000</option>
        <option value="200k-500k">Rp200.000 - Rp500.000</option>
        <option value="above-500k">Above Rp500.000</option>
      </select>
    </div>
  );

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <SearchParamsReader onChange={setSp} />
      </Suspense>

      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white shadow-sm pt-16">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-black uppercase">
                {dynamicTitle}
              </h1>
              <p className="text-sm text-gray-700">TIMELESS STYLE</p>
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="group flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm ring-1 ring-transparent transition focus-within:ring-black/40 md:w-80">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for items, categories, or tags…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 text-black"
                  aria-label="Cari"
                />
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-black hover:bg-gray-50 md:hidden transition-colors"
              >
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[260px_1fr]">
          <aside className="hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:block">
            <SimplifiedFilterBlocks />
          </aside>

          <section>
            {/* Sort row */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <strong>
                  {filteredProducts.length
                    ? `${startFilteredIdx}-${endFilteredIdx}`
                    : 0}
                </strong>{" "}
                of <strong>{filteredProducts.length}</strong> products
                {query ? (
                  <>
                    {" "}
                    for{" "}
                    <span className="font-semibold text-black">{`"${query}"`}</span>
                  </>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Sort by:</span>
                <select
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black font-medium"
                  value={filter.sort}
                  onChange={(e) =>
                    setFilter({ ...filter, sort: e.target.value as SortKey })
                  }
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="w-full flex justify-center items-center min-h-64">
                <DotdLoader />
              </div>
            ) : pageItems.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 uppercase">
                  No Products Found
                </h3>
                <p className="text-gray-700 mb-6">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((product) => {
                  const img = getImageUrl(product);
                  const ratingNum = getNumberProp(product, "rating") ?? 0;
                  const totalReviews =
                    getNumberProp(product, "total_reviews") ?? 0;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg transition-all duration-300 overflow-hidden group relative border border-gray-100 shadow-sm"
                    >
                      <div className="relative">
                        <Image
                          src={img}
                          alt={product.name}
                          width={400}
                          height={533}
                          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale-[10%]"
                          unoptimized
                        />
                        <div
                          className={clsx(
                            "absolute top-4 right-4 flex flex-col gap-2 z-10 transition-opacity",
                            "opacity-0 group-hover:opacity-100"
                          )}
                        >
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2 rounded-full shadow-lg transition-colors ${
                              wishlist.includes(product.id)
                                ? "bg-black text-white"
                                : "bg-white text-gray-600 hover:text-black"
                            }`}
                            aria-label="Toggle Wishlist"
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
                            className="p-2 bg-white text-gray-600 hover:text-black rounded-full shadow-lg transition-colors"
                            aria-label="Quick View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-1 font-semibold text-black uppercase tracking-wide">
                          {product.name}
                        </h3>
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-black text-lg">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <StarRating value={ratingNum} />
                            <span className="text-xs text-gray-500">
                              {totalReviews}
                            </span>
                          </div>
                        </div>
                        {product.stock <= 0 ? (
                          <div className="mt-2 text-xs font-semibold text-red-600">
                            Sold out — notify me
                          </div>
                        ) : (
                          <div className="mt-2 text-xs text-gray-600">
                            Stock: {product.stock} • Ready to ship
                          </div>
                        )}
                        <div className="mt-4">
                          <Button
                            onClick={() => openVariantModalFor(product)}
                            className="w-full bg-black text-white hover:bg-gray-800 uppercase tracking-wider font-bold py-2.5 rounded-lg"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalFilteredPages > 1 && (
              <div className="mt-8 flex items-center justify-center">
                <Pagination
                  page={currentPage}
                  totalPages={totalFilteredPages}
                  onChange={(p: number) => setCurrentPage(p)}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Drawer Filter (mobile) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm animate-[slideIn_200ms_ease-out] overflow-y-auto rounded-l-xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-black uppercase">
                Filter Options
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100 text-black"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SimplifiedFilterBlocks />
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full bg-black text-white py-3 rounded-lg font-bold mt-6 uppercase"
            >
              Apply Filters
            </button>
          </div>

          <style jsx>{`
            @keyframes slideIn {
              from {
                transform: translateX(16px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      <VariantPickerModal
        open={variantModalOpen}
        product={variantProduct}
        onClose={() => setVariantModalOpen(false)}
        onAdded={() => {
          // optional: kamu bisa munculkan toast, dll
        }}
      />

      {/* Product Detail Modal */}
      {isModalOpen && detailProduct && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail ${detailProduct.name}`}
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative mx-auto my-6 max-w-5xl p-4 md:p-0">
            <div
              ref={panelRef}
              className="animate-[fadeIn_180ms_ease-out] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl"
            >
              <div className="grid gap-0 md:grid-cols-2">
                <div className="relative p-0 md:p-4 bg-gray-50">
                  <div className="overflow-hidden">
                    <Image
                      src={
                        typeof detailProduct.image === "string"
                          ? detailProduct.image
                          : IMG_FALLBACK
                      }
                      alt={`${detailProduct.name} - image 1`}
                      width={500}
                      height={625}
                      className="h-96 w-full object-cover md:h-[540px] grayscale-[10%]"
                      unoptimized
                    />
                  </div>
                  <div className="mt-3 flex gap-2 p-3 md:p-0">
                    <button
                      onClick={() => setActiveImg(0)}
                      className={clsx(
                        "overflow-hidden rounded-lg ring-2 transition",
                        activeImg === 0
                          ? "ring-black ring-2"
                          : "ring-gray-300 hover:ring-black/50"
                      )}
                      aria-label="Select image 1"
                    >
                      <Image
                        src={
                          typeof detailProduct.image === "string"
                            ? detailProduct.image
                            : IMG_FALLBACK
                        }
                        alt="thumb 1"
                        width={64}
                        height={64}
                        className="h-16 w-16 object-cover grayscale-[10%]"
                        unoptimized
                      />
                    </button>
                  </div>
                </div>

                <div className="relative p-6 md:p-8">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Tutup"
                    className="absolute right-4 top-4 rounded-full p-2 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                    ref={closeBtnRef}
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-start justify-between gap-3 pr-8">
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight text-black uppercase">
                        {detailProduct.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating
                          value={getNumberProp(detailProduct, "rating") ?? 0}
                        />
                        <span className="text-sm text-gray-600">
                          {(
                            getNumberProp(detailProduct, "rating") ?? 0
                          ).toFixed(1)}{" "}
                          • {getNumberProp(detailProduct, "total_reviews") ?? 0}{" "}
                          reviews
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        SKU: <span className="font-mono">{currentSku}</span> •
                        Stock:{" "}
                        <span
                          className={
                            currentStock > 0
                              ? "text-black font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {isDetailLoading || isDetailVariantLoading
                            ? "Loading..."
                            : currentStock > 0
                            ? `${currentStock} available`
                            : "Sold Out"}
                        </span>
                      </div>
                    </div>
                    <button
                      className="rounded-full p-2 text-black hover:bg-gray-50 transition-colors"
                      aria-label="Tambah ke wishlist"
                      onClick={() => toggleWishlist(detailProduct.id)}
                    >
                      <Heart className="h-5 w-5 fill-transparent hover:fill-black" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-end gap-2 border-b border-gray-100 pb-3">
                    <span className="text-3xl font-extrabold text-black">
                      {formatCurrency(currentPrice)}
                    </span>
                    {currentDiscount > 0 && (
                      <span className="inline-flex items-center rounded-lg bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                        -{currentDiscount}%
                      </span>
                    )}
                  </div>

                  {getStringProp(detailProduct, "description") && (
                    <p className="mt-3 text-sm text-gray-700">
                      {getStringProp(detailProduct, "description")}
                    </p>
                  )}

                  {variants.length > 0 && (
                    <div className="mt-5 grid grid-cols-1">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-black">
                          Varian (
                          {String(variants[0]?.name ?? "")
                            .toLowerCase()
                            .includes("size")
                            ? "Size"
                            : "Pilihan"}
                          )
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {variants.map((v) => {
                            const selected = selectedVariant?.id === v.id;
                            const vStock = toNumber(v.stock);
                            return (
                              <button
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                disabled={vStock <= 0}
                                className={clsx(
                                  "rounded-lg px-4 py-2 text-sm font-semibold ring-1 transition",
                                  vStock <= 0 &&
                                    "opacity-50 cursor-not-allowed line-through",
                                  selected
                                    ? "bg-black text-white ring-black"
                                    : "bg-white text-gray-700 ring-gray-300 hover:ring-black/50"
                                )}
                                aria-pressed={selected}
                              >
                                {String(v.name)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <div className="inline-flex items-center rounded-lg border border-gray-300">
                      <button
                        className="p-2 hover:bg-gray-50 rounded-l-lg text-black"
                        aria-label="Kurangi"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={currentStock <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        className="w-12 border-x border-gray-300 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-black font-semibold"
                        value={qty}
                        min={1}
                        max={currentStock > 0 ? currentStock : 100}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          const max =
                            currentStock > 0 ? currentStock : Infinity;
                          setQty(
                            Number.isNaN(val)
                              ? 1
                              : Math.max(1, Math.min(val, max))
                          );
                        }}
                        aria-label="Jumlah"
                        disabled={currentStock <= 0}
                      />
                      <button
                        className="p-2 hover:bg-gray-50 rounded-r-lg text-black"
                        aria-label="Tambah"
                        onClick={() =>
                          setQty((q) =>
                            Math.min(
                              q + 1,
                              currentStock > 0 ? currentStock : Infinity
                            )
                          )
                        }
                        disabled={currentStock <= 0 || qty >= currentStock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-700">
                      Total:{" "}
                      <span className="font-extrabold text-black">
                        {formatCurrency(totalModalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 items-center gap-3">
                    <button
                      className="col-span-3 inline-flex items-center justify-center rounded-lg bg-black px-4 py-3 text-base font-bold text-white shadow-xl hover:bg-gray-800 transition-colors uppercase tracking-wider disabled:bg-gray-400"
                      onClick={() => {
                        if (currentStock <= 0) return;
                        if (variants.length > 0 && !selectedVariant)
                          return alert("Pilih varian dulu.");
                        addToCart(
                          detailProduct,
                          selectedVariant?.id,
                          selectedVariant?.price
                        );
                        setIsModalOpen(false);
                      }}
                      disabled={
                        currentStock <= 0 ||
                        (variants.length > 0 && !selectedVariant)
                      }
                    >
                      <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <Truck className="h-4 w-4 text-black" />
                      ETA: {etaRange()}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      <ShieldCheck className="h-4 w-4 text-black" />
                      7-day exchange guarantee
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-gray-300">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-black uppercase tracking-wider">
                        Details & Specifications
                        <span className="text-gray-500 group-open:rotate-180 transition">
                          ⌄
                        </span>
                      </summary>
                      <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <ul className="ms-4 list-disc space-y-1">
                          <li>Material: Premium heavy cotton blend</li>
                          <li>Care: Cold wash, do not use bleach</li>
                          <li>Origin: Indonesia</li>
                        </ul>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 sm:grid-cols-3">
                          <div>
                            <span className="text-gray-500">SKU:</span>{" "}
                            {currentSku}
                          </div>
                          <div>
                            <span className="text-gray-500">Weight:</span> ~350g
                          </div>
                          <div>
                            <span className="text-gray-500">Category:</span>{" "}
                            {detailProduct.category_name}
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-sm text-white/90">
              Press{" "}
              <kbd className="rounded bg-black/50 px-1 py-0.5 text-white">
                Esc
              </kbd>{" "}
              or click outside to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}