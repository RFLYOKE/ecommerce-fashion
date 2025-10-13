"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  ShoppingBag,
  CreditCard,
  User,
  MapPin,
  Phone,
  Mail,
  Shield,
  Truck,
  Gift,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
  Clock,
  Star,
  Package,
  Heart,
  Tag,
  AlertCircle,
  Edit3
} from "lucide-react";

interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  ageGroup: string;
  isEcoFriendly: boolean;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  notes?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
  fee: number;
  description: string;
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
    notes: ""
  });
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState("regular");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const checkoutItems: CheckoutItem[] = [
    {
      id: 1,
      name: "Eco Paint Set Premium",
      price: 149000,
      originalPrice: 199000,
      image: "/api/placeholder/300/300",
      quantity: 2,
      category: "Art Supplies",
      ageGroup: "3-6 tahun",
      isEcoFriendly: true
    },
    {
      id: 2,
      name: "Nature Craft Kit",
      price: 89000,
      originalPrice: 119000,
      image: "/api/placeholder/300/300",
      quantity: 1,
      category: "Craft Kits", 
      ageGroup: "4-8 tahun",
      isEcoFriendly: true
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: "bank_transfer",
      name: "Transfer Bank",
      type: "bank",
      icon: "🏦",
      fee: 0,
      description: "BCA, Mandiri, BRI, BNI"
    },
    {
      id: "ewallet",
      name: "E-Wallet",
      type: "digital",
      icon: "📱",
      fee: 0,
      description: "GoPay, OVO, DANA, ShopeePay"
    },
    {
      id: "virtual_account",
      name: "Virtual Account",
      type: "va",
      icon: "💳",
      fee: 0,
      description: "VA Bank & Retail"
    },
    {
      id: "credit_card",
      name: "Kartu Kredit",
      type: "card",
      icon: "💳",
      fee: 0,
      description: "Visa, Mastercard, JCB"
    }
  ];

  const shippingOptions = [
    {
      id: "regular",
      name: "Pengiriman Reguler",
      duration: "5-7 hari kerja",
      price: 15000,
      description: "JNE, TIKI, J&T"
    },
    {
      id: "express",
      name: "Pengiriman Express",
      duration: "2-3 hari kerja",
      price: 25000,
      description: "Same day & next day delivery"
    },
    {
      id: "free",
      name: "Gratis Ongkir",
      duration: "5-7 hari kerja",
      price: 0,
      description: "Minimum belanja Rp 250.000"
    }
  ];

  const steps = [
    { id: 1, title: "Informasi", icon: <User className="w-5 h-5" /> },
    { id: 2, title: "Pengiriman", icon: <Truck className="w-5 h-5" /> },
    { id: 3, title: "Pembayaran", icon: <CreditCard className="w-5 h-5" /> },
    { id: 4, title: "Konfirmasi", icon: <CheckCircle className="w-5 h-5" /> }
  ];

  // Calculations
  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 250000 ? 0 : shippingOptions.find(opt => opt.id === selectedShipping)?.price || 0;
  const paymentFee = paymentMethods.find(method => method.id === selectedPayment)?.fee || 0;
  const total = subtotal + shippingCost + paymentFee;

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return shippingInfo.fullName && shippingInfo.email && shippingInfo.phone;
      case 2:
        return shippingInfo.address && shippingInfo.city && shippingInfo.postalCode && shippingInfo.province;
      case 3:
        return selectedPayment && selectedShipping;
      case 4:
        return agreeToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to Midtrans payment page or success page
      alert("Redirecting to payment gateway...");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24">
      <div className="container mx-auto px-6 lg:px-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#A3B18A] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Keranjang
            </button>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#A3B18A]/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#A3B18A]" />
              <span className="text-sm font-medium text-[#A3B18A]">Checkout Aman</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Selesaikan <span className="text-[#A3B18A]">Pesanan</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Langkah terakhir untuk mendapatkan produk kreatif terbaik untuk si kecil
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep >= step.id 
                        ? "bg-[#A3B18A] text-white shadow-lg" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className={`text-sm font-medium mt-2 ${
                      currentStep >= step.id ? "text-[#A3B18A]" : "text-gray-500"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 rounded-full transition-colors duration-300 ${
                      currentStep > step.id ? "bg-[#A3B18A]" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Informasi Kontak</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nomor Telepon *
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                  </div>

                  <div className="bg-[#A3B18A]/5 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#A3B18A] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Informasi Aman</h4>
                        <p className="text-sm text-gray-600">
                          Data pribadi Anda dilindungi dengan enkripsi SSL dan tidak akan dibagikan kepada pihak ketiga.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Alamat Pengiriman</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Alamat Lengkap *
                      </label>
                      <textarea
                        value={shippingInfo.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                        placeholder="Jl. Contoh No. 123, RT/RW 01/02, Kelurahan..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Kota *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                          placeholder="Jakarta Selatan"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Kode Pos *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                          placeholder="12345"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Provinsi *
                        </label>
                        <select
                          value={shippingInfo.province}
                          onChange={(e) => handleInputChange("province", e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                        >
                          <option value="">Pilih Provinsi</option>
                          <option value="DKI Jakarta">DKI Jakarta</option>
                          <option value="Jawa Barat">Jawa Barat</option>
                          <option value="Jawa Tengah">Jawa Tengah</option>
                          <option value="Jawa Timur">Jawa Timur</option>
                          <option value="Banten">Banten</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Catatan Pengiriman (Opsional)
                      </label>
                      <textarea
                        value={shippingInfo.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A3B18A] focus:border-transparent"
                        placeholder="Patokan rumah, instruksi khusus, dll."
                      />
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Pilih Metode Pengiriman</h3>
                    {shippingOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedShipping(option.id)}
                        className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                          selectedShipping === option.id
                            ? "border-[#A3B18A] bg-[#A3B18A]/5"
                            : "border-gray-200 hover:border-[#A3B18A]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              selectedShipping === option.id
                                ? "border-[#A3B18A] bg-[#A3B18A]"
                                : "border-gray-300"
                            }`}>
                              {selectedShipping === option.id && (
                                <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{option.name}</h4>
                              <p className="text-sm text-gray-600">{option.description}</p>
                              <p className="text-sm text-[#A3B18A]">{option.duration}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-gray-900">
                              {option.price === 0 ? "GRATIS" : `Rp ${option.price.toLocaleString('id-ID')}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Metode Pembayaran</h2>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                          selectedPayment === method.id
                            ? "border-[#A3B18A] bg-[#A3B18A]/5"
                            : "border-gray-200 hover:border-[#A3B18A]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              selectedPayment === method.id
                                ? "border-[#A3B18A] bg-[#A3B18A]"
                                : "border-gray-300"
                            }`}>
                              {selectedPayment === method.id && (
                                <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div className="text-2xl">{method.icon}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{method.name}</h4>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-green-600 font-semibold">
                              {method.fee === 0 ? "Gratis" : `+Rp ${method.fee.toLocaleString('id-ID')}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Pembayaran Aman</h4>
                        <p className="text-sm text-blue-700">
                          Pembayaran diproses melalui Midtrans yang telah tersertifikasi PCI DSS Level 1. 
                          Data kartu kredit Anda tidak disimpan di server kami.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Order Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#A3B18A] rounded-2xl flex items-center justify-center text-white">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Konfirmasi Pesanan</h2>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Informasi Pengiriman</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nama:</span> {shippingInfo.fullName}</p>
                        <p><span className="font-medium">Email:</span> {shippingInfo.email}</p>
                        <p><span className="font-medium">Telepon:</span> {shippingInfo.phone}</p>
                        <p><span className="font-medium">Alamat:</span> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.province} {shippingInfo.postalCode}</p>
                        <p><span className="font-medium">Pengiriman:</span> {shippingOptions.find(opt => opt.id === selectedShipping)?.name}</p>
                        <p><span className="font-medium">Pembayaran:</span> {paymentMethods.find(method => method.id === selectedPayment)?.name}</p>
                      </div>
                      
                      <button className="text-[#A3B18A] text-sm font-medium mt-3 flex items-center gap-1 hover:underline">
                        <Edit3 className="w-4 h-4" />
                        Edit Informasi
                      </button>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="w-5 h-5 text-[#A3B18A] border-gray-300 rounded focus:ring-[#A3B18A]"
                      />
                      <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                        Saya setuju dengan{" "}
                        <a href="/terms" className="text-[#A3B18A] hover:underline">
                          Syarat & Ketentuan
                        </a>{" "}
                        dan{" "}
                        <a href="/privacy" className="text-[#A3B18A] hover:underline">
                          Kebijakan Privasi
                        </a>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Sebelumnya
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className="flex items-center gap-2 px-6 py-3 bg-[#A3B18A] text-white rounded-2xl hover:bg-[#A3B18A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!validateStep() || isProcessing}
                    className="flex items-center gap-2 px-8 py-3 bg-[#A3B18A] text-white rounded-2xl hover:bg-[#A3B18A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Bayar Sekarang
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Items Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#A3B18A]" />
                Ringkasan Pesanan
              </h3>

              <div className="space-y-4 mb-6">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-xl"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#A3B18A] text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-[#A3B18A]">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            Rp {(item.originalPrice * item.quantity).toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                    {shippingCost === 0 ? 'GRATIS' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                  </span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Admin</span>
                    <span className="font-semibold">Rp {paymentFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#A3B18A]">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Jaminan Belanja Aman</h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#A3B18A]" />
                  <span className="text-gray-600">Pembayaran 100% aman</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#A3B18A]" />
                  <span className="text-gray-600">Garansi 30 hari</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#A3B18A]" />
                  <span className="text-gray-600">Pengiriman terpercaya</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-[#A3B18A]" />
                  <span className="text-gray-600">Customer support 24/7</span>
                </div>
              </div>
            </div>

            {/* Promo */}
            <div className="bg-gradient-to-r from-[#A3B18A] to-[#DFF19D] rounded-3xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Gift className="w-6 h-6" />
                <h4 className="font-bold">Hemat Lebih Banyak!</h4>
              </div>
              <p className="text-sm text-white/90 mb-4">
                Dapatkan gratis ongkir untuk pembelian di atas Rp 250.000
              </p>
              <div className="bg-white/20 rounded-2xl p-3 text-center">
                <p className="text-xs">Kurang Rp {Math.max(0, 250000 - subtotal).toLocaleString('id-ID')} lagi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}