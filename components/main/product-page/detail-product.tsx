"use client";

import { useState, useEffect } from "react";
import { Heart, X, Info, Shield, Users, Leaf, Award } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/admin/product";
import useCart from "@/hooks/use-cart";

type ProductDetailProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  addCart: (product: Product) => void; // Keep this for consistency but we'll use the hook directly
};

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  // addCart,
}: ProductDetailProps) {
  const { addItem, open: openCart } = useCart();
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (product?.image) {
      setActiveImage(product.image as string);
    }
    // Reset quantity when product changes
    setQuantity(1);
  }, [product]);

  if (!isOpen) {
    return null;
  }

  if (!product) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg relative p-6 mx-4 text-center">
          <p>Gagal memuat detail produk. Silakan coba lagi.</p>
          <Button onClick={onClose} className="mt-4">
            Tutup
          </Button>
        </div>
      </div>
    );
  }

  const allImages = [
    product.image,
    product.image_2,
    product.image_3,
    product.image_4,
    product.image_5,
    product.image_6,
    product.image_7,
  ].filter(Boolean) as string[];

  const hasMultipleImages = allImages.length > 1;

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  // Updated handleAddToCart function
  const handleAddToCart = () => {
    // Add the product to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }

    // Open the cart sidebar to show the added items
    openCart();

    // Close the modal
    onClose();

    // Reset quantity for next time
    setQuantity(1);
  };

  const productPrice = product.price;
  const originalPrice = productPrice * 1.25;
  const discountPercent = 20;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-lg shadow-xl relative overflow-hidden">
        {/* Tombol Close */}
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 hover:bg-gray-100 rounded-full p-2"
        >
          <X size={20} />
        </Button>

        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Left Side: Image Gallery - Fixed */}
          <div className="flex-shrink-0 w-full lg:w-1/2 p-8">
            <div className="flex gap-4 h-full">
              {/* Thumbnail Column */}
              {hasMultipleImages && (
                <div className="flex flex-col gap-3 w-16">
                  <button className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {allImages.map((imgSrc, index) => (
                    <div
                      key={index}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        (activeImage || allImages[0]) === imgSrc
                          ? "border-gray-400"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      onClick={() => setActiveImage(imgSrc)}
                    >
                      <Image
                        src={imgSrc}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-contain object-center"
                      />
                    </div>
                  ))}
                  <button className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 relative bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={activeImage || allImages[0]}
                  alt={product.name}
                  width={500}
                  height={600}
                  className="w-full h-auto object-contain"
                  style={{ minHeight: "600px" }}
                />

                {/* Best Seller Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-green-800 text-white px-3 py-1 rounded-full text-sm font-medium border">
                    BEST SELLER
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Product Details - Scrollable */}
          <div className="w-full lg:w-1/2 overflow-y-auto max-h-[90vh] p-8 space-y-6">
            {/* Brand */}
            <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
              {product.merk_name || "EVERYDAY HUMANS"}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-normal text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-green-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(parseFloat(product.rating as string))
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-500 text-sm">
                {product.total_reviews} reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-medium text-gray-900">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              <span className="text-lg text-gray-400 line-through">
                Rp {originalPrice.toLocaleString("id-ID")}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                {discountPercent}%
              </span>
            </div>

            {/* Stock Information */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Stok tersedia:</span>
              <span className="text-sm font-medium text-green-600">
                {product.duration} unit
              </span>
            </div>

            {/* Product Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description ||
                "A reliable bodyguard for your skin, with secret uses. This lightweight, long lasting SPF50 sunscreen lotion will save you from the harshest midday sun, while also protecting dry skin, discoloured tattoos, darker scars, gel manicure UV exposures and more."}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Jumlah:
                </span>
                <div className="flex items-center border border-gray-300 rounded-full bg-gray-50">
                  <Button
                    variant="ghost"
                    className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    −
                  </Button>
                  <span className="px-4 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
                    onClick={handleIncreaseQuantity}
                    disabled={quantity >= product.duration} // Prevent exceeding duration
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Total Harga:
                </span>
                <span className="text-lg font-bold text-green-600">
                  Rp {(product.price * quantity).toLocaleString("id-ID")}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.duration === 0}
                  className="flex-1 bg-green-900 text-white hover:bg-green-800 rounded-full py-6 text-base font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.duration === 0
                    ? "STOK HABIS"
                    : `TAMBAH KE KERANJANG (${quantity})`}
                </Button>

                <Button
                  variant="ghost"
                  className="rounded-full w-12 h-12 p-0 border border-gray-300 hover:bg-gray-50"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>Gratis ongkir untuk pembelian di atas Rp 100.000</span>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Kualitas Terjamin
                </div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Produk Lokal
                </div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Leaf className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Ramah Lingkungan
                </div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Berkualitas Tinggi
                </div>
              </div>
            </div>

            {/* Collapsible Details */}
            <div className="border-t pt-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-900"
              >
                <span>Detail Produk</span>
                <span className="text-2xl">{showDetails ? "−" : "+"}</span>
              </button>

              {showDetails && (
                <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-4">
                    {product.description ||
                      "Produk berkualitas tinggi yang dibuat dengan standar terbaik untuk memenuhi kebutuhan sehari-hari Anda."}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <strong>Kategori:</strong>
                      <span>{product.category_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Merek:</strong>
                      <span>{product.merk_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Stok:</strong>
                      <span>{product.duration} unit</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Berat:</strong>
                      <span>{product.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Dimensi:</strong>
                      <span>
                        {product.length}cm x {product.width}cm x{" "}
                        {product.height}cm
                      </span>
                    </div>
                    {product.diameter > 0 && (
                      <div className="flex justify-between">
                        <strong>Diameter:</strong>
                        <span>{product.diameter}cm</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <strong>Rating:</strong>
                      <span>
                        ⭐ {product.rating}/5.0 ({product.total_reviews} ulasan)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}