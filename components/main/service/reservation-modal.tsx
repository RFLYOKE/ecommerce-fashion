"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Phone, User, CreditCard } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Import from cart/page.tsx
import { Combobox } from "@/components/ui/combo-box";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
import {
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery,
} from "@/services/shop/open-shop/open-shop.service";
import { useGetCurrentUserQuery } from "@/services/auth.service";
import { useCreateTransactionFrontendMutation } from "@/services/admin/transaction.service";
import { useGetUserAddressListQuery } from "@/services/address.service";
import type { Address } from "@/types/address";
// import { CreateTransactionFrontendRequest } from "@/types/admin/transaction";

interface ReservationPayload {
  date: string;
  hour: string;
  payment_method: string;
  data: {
    shop_id: number;
    details: {
      product_id: number;
      quantity: number;
    }[];
  }[];
}

interface ServiceType {
  id: number;
  thumbnail: string;
  images: Array<{ image: string }>;
  name: string;
  description: string;
  price: number;
  duration: string;
  category_name: string;
  merk_name: string;
}

type ErrorBag = Record<string, string[] | string>;

export default function ReservationModal({
  isOpen,
  onClose,
  service,
}: {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceType | null;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionName = useMemo(() => session?.user?.name ?? "", [session]);

  // state internal untuk image preview
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    reservationDate: "",
    reservationTime: "",
  });

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address_line_1: "",
    city: "",
    postal_code: "",
    kecamatan: "",
    rajaongkir_province_id: 0,
    rajaongkir_city_id: 0,
    rajaongkir_district_id: 0,
  });

  const [paymentMethod, setPaymentMethod] = useState("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Validation
  const validatePhone = (phone: string) => {
    const regex = /^(?:\+62|62|0)8\d{8,11}$/;
    return regex.test(phone);
  };

  useEffect(() => {
    setIsPhoneValid(validatePhone(formData.phone));
  }, [formData.phone]);

  // RTK Query hooks
  const { data: currentUserResp } = useGetCurrentUserQuery();
  const currentUser = useMemo(() => currentUserResp || null, [currentUserResp]);

  const { data: userAddressList } = useGetUserAddressListQuery({
    page: 1,
    paginate: 100,
  });

  const defaultAddress: Address | undefined = userAddressList?.data?.find(
    (a) => a.is_default
  );

  const { data: provinces = [], isLoading: loadingProvince } =
    useGetProvincesQuery();
  const { data: cities = [], isLoading: loadingCity } = useGetCitiesQuery(
    shippingInfo.rajaongkir_province_id,
    { skip: !shippingInfo.rajaongkir_province_id }
  );
  const { data: districts = [], isLoading: loadingDistrict } =
    useGetDistrictsQuery(shippingInfo.rajaongkir_city_id, {
      skip: !shippingInfo.rajaongkir_city_id,
    });

  // const [createTransaction] = useCreateTransactionMutation();
  const [createTransactionFrontend] = useCreateTransactionFrontendMutation();

  const didPrefill = useRef(false);

  // Auto-fill user data
  useEffect(() => {
    if (didPrefill.current) return;
    if (sessionName) {
      setFormData((prev) => ({ ...prev, fullName: sessionName }));
      setShippingInfo((prev) => ({ ...prev, fullName: sessionName }));
    }
  }, [sessionName]);

  useEffect(() => {
    if (didPrefill.current) return;
    if (defaultAddress) {
      setShippingInfo((prev) => ({
        ...prev,
        phone: currentUser?.phone || "",
        address_line_1: defaultAddress.address_line_1 ?? prev.address_line_1,
        postal_code: defaultAddress.postal_code ?? prev.postal_code,
        rajaongkir_province_id:
          defaultAddress.rajaongkir_province_id ?? prev.rajaongkir_province_id,
        rajaongkir_city_id:
          defaultAddress.rajaongkir_city_id ?? prev.rajaongkir_city_id,
        rajaongkir_district_id:
          defaultAddress.rajaongkir_district_id ?? prev.rajaongkir_district_id,
      }));
      
      setFormData((prev) => ({
        ...prev,
        phone: currentUser?.phone || "",
      }));
      
      didPrefill.current = true;
    }
  }, [defaultAddress, currentUser]);

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;

    // Validation
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.reservationDate ||
      !formData.reservationTime ||
      !isPhoneValid
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Lengkapi Data",
        text: "Harap lengkapi semua informasi yang diperlukan untuk melanjutkan reservasi.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create payload sesuai dokumentasi API yang benar
      const payload: ReservationPayload = {
        date: formData.reservationDate,
        hour: formData.reservationTime,
        payment_method: paymentMethod === "midtrans" ? "midtrans" : paymentMethod === "cod" ? "cod" : "manual",
        data: [
          {
            shop_id: 1,
            details: [
              {
                product_id: service.id,
                quantity: 1
              }
            ]
            // shipment tidak diperlukan untuk layanan (nullable)
          }
        ]
        // voucher tidak diperlukan (nullable)
      };

      // Debug: Log the payload being sent
      console.log("Reservation payload being sent:", JSON.stringify(payload, null, 2));
      
      // ----- panggil mutasi (ganti yang lama) -----
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await createTransactionFrontend(payload as unknown as any).unwrap();

      if (
        result &&
        result.data &&
        typeof result.data === "object" &&
        "payment_link" in result.data
      ) {
        await Swal.fire({
          icon: "success",
          title: "Reservasi Berhasil Dibuat",
          text: "Silakan lanjutkan ke halaman pembayaran.",
          confirmButtonText: "Lanjut ke Pembayaran",
        });

        window.open(
          (result.data as { payment_link: string }).payment_link,
          "_blank"
        );

        onClose(); // Close modal
        setTimeout(() => {
          router.push("/me");
        }, 2000);
      } else {
        console.warn("Unexpected response format:", result);
        await Swal.fire({
          icon: "success",
          title: "Reservasi Berhasil",
          text: "Reservasi berhasil dibuat! Kami akan menghubungi Anda segera.",
        });
        onClose();
      }
    } catch (err: unknown) {
      console.error("Error creating reservation:", err);

      let serverMessage =
        "Terjadi kesalahan saat membuat reservasi. Silakan coba lagi.";
      let fieldErrors = "";

      if (typeof err === "object" && err !== null) {
        const apiErr = err as {
          data?: { message?: string; errors?: ErrorBag };
        };
        const genericErr = err as { message?: string };

        if (apiErr.data?.message) {
          serverMessage = apiErr.data.message;
        } else if (genericErr.message) {
          serverMessage = genericErr.message;
        }

        const rawErrors: ErrorBag | undefined = apiErr.data?.errors;
        if (rawErrors) {
          fieldErrors = Object.entries(rawErrors)
            .map(([field, msgs]) => {
              const list = Array.isArray(msgs) ? msgs : [msgs];
              return `${field}: ${list.join(", ")}`;
            })
            .join("\n");
        }
      }

      await Swal.fire({
        icon: "error",
        title: "Gagal Membuat Reservasi",
        html:
          `<p style="text-align:left">${serverMessage}</p>` +
          (fieldErrors
            ? `<pre style="text-align:left;white-space:pre-wrap;background:#f8f9fa;padding:12px;border-radius:8px;margin-top:8px">${fieldErrors}</pre>`
            : ""),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white z-10">
          <h3 className="w-full text-xl md:text-center font-bold text-[#000000]">
            Reservasi Layanan
          </h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg hover:bg-[#6B6B6B]/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Image Preview */}
          <div className="flex flex-col gap-4 min-h-80">
            {/* Gambar besar */}
            <div className="flex-5/6">
              <Image
                src={selectedImage || service.images[0].image}
                width={100}
                height={100}
                alt="Preview"
                className="w-full h-full md:max-h-80 object-cover rounded-2xl"
              />
            </div>

            {/* Thumbnail kecil */}
            <div className="grid grid-cols-4 gap-2 flex-1/6">
              {service.images.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(item.image)}
                  className={`border-2 rounded-xl overflow-hidden ${
                    selectedImage === item.image
                      ? "border-[#E53935]"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={`Thumb ${idx}`}
                    width={100}
                    height={100}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Service Info */}
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="p-4 bg-[#6B6B6B]/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-[#E53935]/10 text-[#E53935] px-2 py-1 rounded-full">
                  {service.category_name}
                </span>
                <span className="text-xs bg-[#6B6B6B]/10 text-[#6B6B6B] px-2 py-1 rounded-full">
                  {service.merk_name}
                </span>
              </div>
              <p className="font-semibold text-[#000000]">{service.name}</p>
              <p className="text-sm text-[#6B6B6B]">{service.duration}</p>
              <p className="text-[#E53935] font-bold">
                Rp {service.price.toLocaleString("id-ID")}
              </p>
            </div>
              <div className="bg-[#6B6B6B]/5 p-4 rounded-2xl">
                <h4 className="font-semibold text-[#000000] mb-4">Informasi Pribadi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 border border-[#6B6B6B]/30 rounded-2xl px-3">
                    <User className="w-5 h-5 text-[#6B6B6B]" />
                    <input
                      type="text"
                      placeholder="Nama Lengkap"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full py-3 bg-transparent outline-none text-[#000000]"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 border border-[#6B6B6B]/30 rounded-2xl px-3">
                    <Phone className="w-5 h-5 text-[#6B6B6B]" />
                    <input
                      type="text"
                      placeholder="No. WhatsApp"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full py-3 bg-transparent outline-none text-[#000000]"
                      required
                    />
                  </div>
                  {!isPhoneValid && formData.phone && (
                    <p className="text-sm text-red-500 col-span-2">
                      Nomor telepon tidak valid
                    </p>
                  )}
                </div>
              </div>

              {/* Reservation Date & Time */}
              <div className="bg-[#6B6B6B]/5 p-4 rounded-2xl">
                <h4 className="font-semibold text-[#000000] mb-4">Waktu Reservasi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 border border-[#6B6B6B]/30 rounded-2xl px-3">
                    <Calendar className="w-5 h-5 text-[#6B6B6B]" />
                    <input
                      type="date"
                      value={formData.reservationDate}
                      onChange={(e) => handleInputChange("reservationDate", e.target.value)}
                      className="w-full py-3 bg-transparent outline-none text-[#000000]"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 border border-[#6B6B6B]/30 rounded-2xl px-3">
                    <Clock className="w-5 h-5 text-[#6B6B6B]" />
                    <input
                      type="time"
                      value={formData.reservationTime}
                      onChange={(e) => handleInputChange("reservationTime", e.target.value)}
                      className="w-full py-3 bg-transparent outline-none text-[#000000]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#6B6B6B]/5 p-4 rounded-2xl">
                <h4 className="font-semibold text-[#000000] mb-4">Metode Pembayaran</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border-2 transition-colors ${
                      paymentMethod === "cod"
                        ? "border-[#E53935] bg-[#E53935]/10"
                        : "border-gray-200 hover:border-[#6B6B6B]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E53935] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">COD</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Bayar saat layanan selesai</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("midtrans")}
                    className={`p-4 rounded-2xl border-2 transition-colors ${
                      paymentMethod === "midtrans"
                        ? "border-[#E53935] bg-[#E53935]/10"
                        : "border-gray-200 hover:border-[#6B6B6B]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Transfer Bank</div>
                        <div className="text-sm text-gray-600">Bayar via transfer bank</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("manual")}
                    className={`p-4 rounded-2xl border-2 transition-colors ${
                      paymentMethod === "manual"
                        ? "border-[#E53935] bg-[#E53935]/10"
                        : "border-gray-200 hover:border-[#6B6B6B]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">MAN</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Manual Transfer</div>
                        <div className="text-sm text-gray-600">Upload bukti transfer manual</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Address Info */}
              <div className="bg-[#6B6B6B]/5 p-4 rounded-2xl hidden">
                <h4 className="font-semibold text-[#000000] mb-4">Alamat</h4>
                <div className="space-y-4">
                  <textarea
                    value={shippingInfo.address_line_1}
                    onChange={(e) => handleShippingChange("address_line_1", e.target.value)}
                    rows={3}
                    placeholder="Alamat lengkap (Nama jalan, RT/RW, Kelurahan)"
                    className="w-full px-4 py-3 border border-[#6B6B6B]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provinsi
                      </label>
                      <Combobox
                        value={shippingInfo.rajaongkir_province_id}
                        onChange={(id) => {
                          setShippingInfo((prev) => ({
                            ...prev,
                            rajaongkir_province_id: id,
                            rajaongkir_city_id: 0,
                            rajaongkir_district_id: 0,
                          }));
                        }}
                        data={provinces}
                        isLoading={loadingProvince}
                        getOptionLabel={(item) => item.name}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kota / Kabupaten
                      </label>
                      <Combobox
                        value={shippingInfo.rajaongkir_city_id}
                        onChange={(id) => {
                          setShippingInfo((prev) => ({
                            ...prev,
                            rajaongkir_city_id: id,
                            rajaongkir_district_id: 0,
                          }));
                        }}
                        data={cities}
                        isLoading={loadingCity}
                        getOptionLabel={(item) => item.name}
                        disabled={!shippingInfo.rajaongkir_province_id}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kecamatan
                      </label>
                      <Combobox
                        value={shippingInfo.rajaongkir_district_id}
                        onChange={(id) => {
                          setShippingInfo((prev) => ({
                            ...prev,
                            rajaongkir_district_id: id,
                          }));
                        }}
                        data={districts}
                        isLoading={loadingDistrict}
                        getOptionLabel={(item) => item.name}
                        disabled={!shippingInfo.rajaongkir_city_id}
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={shippingInfo.postal_code}
                    onChange={(e) => handleShippingChange("postal_code", e.target.value)}
                    placeholder="Kode Pos"
                    className="w-full px-4 py-3 border border-[#6B6B6B]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E53935] text-white py-4 rounded-2xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses Reservasi...
                  </>
                ) : (
                  "Konfirmasi Reservasi"
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}