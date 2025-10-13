"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  MapPin,
  Package,
  BarChart3,
  LogOut,
  Edit3,
  Plus,
  Trash2,
  Eye,
  Star,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Camera,
  CreditCard,
  Truck,
  Download,
  Upload,
  X,
  FileText,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from "@/services/auth.service";
import {
  useGetUserAddressListQuery,
  useGetUserAddressByIdQuery,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} from "@/services/address.service";
import {
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery,
} from "@/services/shop/open-shop/open-shop.service";
import { 
  useGetTransactionListQuery,
  useGetTransactionByIdQuery,
  useGetTransactionShopByIdQuery
} from "@/services/admin/transaction.service";
import Swal from "sweetalert2";
import { mapTxnStatusToOrderStatus, OrderStatus } from "@/lib/status-order";
import type { Address as UserAddress } from "@/types/address";
import { ROResponse, toList, findName } from "@/types/geo";
import { Region } from "@/types/shop";
import ProfileEditModal from "../profile-page/edit-modal";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ShopDetailItem } from "@/types/admin/transaction";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  image: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}
interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  grand_total: number;
  items: OrderItem[];
  trackingNumber?: string;
  payment_method?: string;
  payment_proof?: string;
  shipment_cost?: number;
  cod?: number;
  discount_total?: number;
  address_line_1?: string;
  postal_code?: string;
}
interface ApiTransactionDetail {
  id?: number | string;
  product_id?: number;
  quantity?: number;
  price?: number;
  product_name?: string;
  product?: {
    name?: string;
    image?: string;
    media?: Array<{ original_url: string }>;
  } | null;
  image?: string | null;
}
interface ApiTransaction {
  id: number | string;
  reference?: string;
  status?: number;
  total: number;
  grand_total: number;
  discount_total?: number;
  created_at?: string;
  details?: ApiTransactionDetail[];
  tracking_number?: string;
  payment_method?: string;
  payment_proof?: string;
  shipment_cost?: number;
  cod?: number;
  address_line_1?: string;
  postal_code?: string;
}

// Add mutation hook for uploading payment proof
const useUploadPaymentProofMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const uploadPaymentProof = async (transactionId: string, file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('payment_proof', file);
      formData.append('_method', 'PUT');

      const response = await fetch(
        `https://cms.yameiyashop.com/api/v1/public/transaction/${transactionId}/manual?_method=PUT`,
        {
          method: 'POST', // Using POST with _method=PUT for form-data
          body: formData,
          headers: {
            // Don't set Content-Type, let browser set it for FormData
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload payment proof');
      }

      const data = await response.json();
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadPaymentProof, isLoading };
};

const pickImageUrl = (d?: ApiTransactionDetail): string => {
  if (!d) return "/api/placeholder/80/80";
  if (typeof d.image === "string" && d.image) return d.image;
  const prod = d.product;
  if (prod?.image) return prod.image;
  const firstMedia = prod?.media?.[0]?.original_url;
  if (firstMedia) return firstMedia;
  return "/api/placeholder/80/80";
};

// Helper function to get product image from shop details
const getProductImageFromShopDetails = (product: {
  image?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  image_6?: string;
  image_7?: string;
  media?: Array<{ original_url?: string }>;
} | null | undefined): string => {
  if (!product) return "/api/placeholder/80/80";
  
  // Try direct image field first
  if (product.image) return product.image;
  
  // Try image_2, image_3, etc.
  if (product.image_2) return product.image_2;
  if (product.image_3) return product.image_3;
  if (product.image_4) return product.image_4;
  if (product.image_5) return product.image_5;
  if (product.image_6) return product.image_6;
  if (product.image_7) return product.image_7;
  
  // Try media array
  if (product.media && product.media.length > 0) {
    const firstMedia = product.media[0]?.original_url;
    if (firstMedia) return firstMedia;
  }
  
  return "/api/placeholder/80/80";
};

/* ======================================================================= */

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [logoutReq, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [updateCurrentUser, { isLoading: isUpdatingProfile }] =
    useUpdateCurrentUserMutation();
  const [isPrefillingProfile, setIsPrefillingProfile] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    imageFile: File | null;
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    imageFile: null,
  });

  // Order detail modal states
  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderShopId, setSelectedOrderShopId] = useState<number | null>(
    null
  );
  const [paymentProofModalOpen, setPaymentProofModalOpen] = useState(false);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "addresses" | "orders"
  >("dashboard");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditing, setIsEditing] = useState(false);

  // Session basics
  const sessionName = useMemo(() => session?.user?.name ?? "User", [session]);
  const sessionEmail = useMemo(
    () => session?.user?.email ?? "user@email.com",
    [session]
  );
  const sessionId = (session?.user as { id?: number } | undefined)?.id;

  // Payment proof upload mutation
  const { uploadPaymentProof, isLoading: isUploadingProof } =
    useUploadPaymentProofMutation();

  /* --------------------- Transaksi (tetap) --------------------- */
  const { data: txnResp, refetch: refetchTransactions } =
    useGetTransactionListQuery(
      { page: 1, paginate: 10, user_id: sessionId },
      { skip: !sessionId }
    );

  const transactions: ApiTransaction[] = useMemo(
    () => (txnResp?.data as ApiTransaction[]) || [],
    [txnResp]
  );

  const orders: Order[] = useMemo(() => {
    return transactions.map((t) => {
      const items: OrderItem[] = (t.details || []).map((det, idx) => ({
        id: String(det.id ?? `${t.id}-${idx}`),
        name: det.product?.name ?? det.product_name ?? "Produk",
        image: pickImageUrl(det),
        quantity: det.quantity ?? 1,
        price: det.price ?? 0,
      }));
      return {
        id: String(t.id),
        orderNumber: t.reference || `REF-${String(t.id)}`,
        date: t.created_at || new Date().toISOString(),
        status: mapTxnStatusToOrderStatus(t.status),
        total: t.total ?? 0,
        grand_total: t.grand_total ?? 0,
        items,
        trackingNumber: (t as { tracking_number?: string }).tracking_number,
        payment_method: t.payment_method,
        payment_proof: t.payment_proof,
        shipment_cost: t.shipment_cost,
        cod: t.cod,
        discount_total: t.discount_total,
        address_line_1: t.address_line_1,
        postal_code: t.postal_code,
      };
    });
  }, [transactions]);

  // Get order detail query
  const { data: orderDetailResp } = useGetTransactionByIdQuery(
    selectedOrderId ?? "",
    { skip: !selectedOrderId }
  );

  // Get shop details with receipt code
  const { data: shopDetailResp, isLoading: isLoadingReceiptCode } =
    useGetTransactionShopByIdQuery(selectedOrderShopId ?? 0, {
      skip: !selectedOrderShopId,
    });

  // true kalau ada SATU produk bermerek "jasa"
  const isJasaOrder = useMemo(() => {
    const details: ReadonlyArray<ShopDetailItem> =
      (shopDetailResp?.details as ReadonlyArray<ShopDetailItem> | undefined) ??
      [];

    return details.some((d) => {
      const p = d.product;
      if (!p) return false;
      const merk =
        p.product_merk?.name ?? p.merk_name ?? p.product_merk_name ?? "";
      return merk.toLowerCase() === "jasa";
    });
  }, [shopDetailResp]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return orders.find((order) => order.id === selectedOrderId) || null;
  }, [selectedOrderId, orders]);

  // Set shop ID when transaction details are loaded
  useEffect(() => {
    if (
      orderDetailResp &&
      orderDetailResp.stores &&
      orderDetailResp.stores.length > 0
    ) {
      setSelectedOrderShopId(orderDetailResp.stores[0].id);
    }
  }, [orderDetailResp]);

  /* --------------------- Address via SERVICE --------------------- */
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [addrEditId, setAddrEditId] = useState<number | null>(null);

  type AddrForm = Partial<Omit<UserAddress, "id">>;
  const [addrForm, setAddrForm] = useState<AddrForm>({
    user_id: sessionId || undefined,
    rajaongkir_province_id: null,
    rajaongkir_city_id: null,
    rajaongkir_district_id: null,
    address_line_1: "",
    address_line_2: "",
    postal_code: "",
    is_default: false,
  });

  const [createUserAddress, { isLoading: isCreatingAddr }] =
    useCreateUserAddressMutation();
  const [updateUserAddress, { isLoading: isUpdatingAddr }] =
    useUpdateUserAddressMutation();
  const [deleteUserAddress, { isLoading: isDeletingAddr }] =
    useDeleteUserAddressMutation();

  const {
    data: userAddressList,
    refetch: refetchUserAddressList,
    isFetching: isFetchingAddressList,
  } = useGetUserAddressListQuery(
    { page: 1, paginate: 100 },
    { skip: !sessionId }
  );

  const { data: addrDetail } = useGetUserAddressByIdQuery(addrEditId ?? 0, {
    skip: !addrEditId,
  });

  // RO hooks – pakai 0 saat skip agar param number tetap valid
  const provinceId = addrForm.rajaongkir_province_id ?? 0;
  const { data: provinces } = useGetProvincesQuery();
  const { data: cities } = useGetCitiesQuery(provinceId, {
    skip: !addrForm.rajaongkir_province_id,
  });
  const cityId = addrForm.rajaongkir_city_id ?? 0;
  const { data: districts } = useGetDistrictsQuery(cityId, {
    skip: !addrForm.rajaongkir_city_id,
  });

  // Normalisasi RO lists (tanpa any)
  const provinceList = toList<Region>(provinces as ROResponse<Region>);
  const cityList = toList<Region>(cities as ROResponse<Region>);
  const districtList = toList<Region>(districts as ROResponse<Region>);

  // Prefill form saat edit
  useEffect(() => {
    if (!addrDetail) return;
    setAddrForm({
      user_id: sessionId || undefined,
      rajaongkir_province_id: addrDetail.rajaongkir_province_id ?? null,
      rajaongkir_city_id: addrDetail.rajaongkir_city_id ?? null,
      rajaongkir_district_id: addrDetail.rajaongkir_district_id ?? null,
      address_line_1: addrDetail.address_line_1 ?? "",
      address_line_2: addrDetail.address_line_2 ?? "",
      postal_code: addrDetail.postal_code ?? "",
      is_default: Boolean(addrDetail.is_default),
    });
  }, [addrDetail, sessionId]);

  const openCreateAddress = () => {
    setAddrEditId(null);
    setAddrForm({
      user_id: sessionId || undefined,
      rajaongkir_province_id: null,
      rajaongkir_city_id: null,
      rajaongkir_district_id: null,
      address_line_1: "",
      address_line_2: "",
      postal_code: "",
      is_default: false,
    });
    setAddrModalOpen(true);
  };

  const openEditAddress = (id: number) => {
    setAddrEditId(id);
    setAddrModalOpen(true);
  };

  // Ambil alamat dari DETAIL kalau ada; kalau tidak, pakai dari list
  const addressLine1 =
    (orderDetailResp as { address_line_1?: string } | undefined)
      ?.address_line_1 ??
    selectedOrder?.address_line_1 ??
    "-";

  const postalCode =
    (orderDetailResp as { postal_code?: string } | undefined)?.postal_code ??
    selectedOrder?.postal_code ??
    "";

  const handleDeleteAddressApi = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus alamat ini?",
      text: "Tindakan ini tidak bisa dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          await deleteUserAddress(id).unwrap();
          await refetchUserAddressList();
        } catch (e) {
          console.error(e);
          Swal.showValidationMessage("Gagal menghapus alamat.");
          throw e;
        }
      },
    });

    if (result.isConfirmed) {
      await Swal.fire("Terhapus!", "Alamat berhasil dihapus.", "success");
    }
  };

  const handleSubmitAddress = async () => {
    if (!addrForm.user_id) {
      Swal.fire("Info", "Session user belum tersedia.", "info");
      return;
    }
    try {
      if (addrEditId) {
        await updateUserAddress({ id: addrEditId, payload: addrForm }).unwrap();
      } else {
        await createUserAddress(addrForm).unwrap();
      }
      setAddrModalOpen(false);
      setAddrEditId(null);
      await refetchUserAddressList();
    } catch (e) {
      console.error(e);
      Swal.fire("Gagal", "Tidak dapat menyimpan alamat.", "error");
    }
  };

  // Handle order detail modal
  const openOrderDetailModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetailModalOpen(true);
    // We'll set the shop ID after we get the transaction details
  };

  const closeOrderDetailModal = () => {
    setOrderDetailModalOpen(false);
    setSelectedOrderId(null);
    setSelectedOrderShopId(null);
  };

  // Handle payment proof upload
  const openPaymentProofModal = () => {
    setPaymentProofModalOpen(true);
  };

  const closePaymentProofModal = () => {
    setPaymentProofModalOpen(false);
    setPaymentProofFile(null);
  };

  const handlePaymentProofUpload = async () => {
    if (!paymentProofFile || !selectedOrderId) {
      Swal.fire("Error", "Silakan pilih file bukti pembayaran", "error");
      return;
    }

    try {
      await uploadPaymentProof(selectedOrderId, paymentProofFile);
      await Swal.fire(
        "Berhasil",
        "Bukti pembayaran berhasil diupload",
        "success"
      );
      closePaymentProofModal();
      closeOrderDetailModal();
      await refetchTransactions();
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire("Error", "Gagal mengupload bukti pembayaran", "error");
    }
  };

  /* --------------------- Profil/dsb (tetap) --------------------- */
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id:
      (session?.user as { id?: number } | undefined)?.id?.toString?.() ??
      "user-id",
    fullName: sessionName,
    email: sessionEmail,
    phone: "",
    birthDate: "1990-05-15", // default birth date
    image: session?.user?.image || "/api/placeholder/150/150",
    joinDate: "",
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
  });

  useEffect(() => {
    setUserProfile((prev) => ({
      ...prev,
      id:
        (session?.user as { id?: number } | undefined)?.id?.toString?.() ??
        prev.id,
      fullName: sessionName,
      email: sessionEmail,
      image: session?.user?.image || prev.image,
    }));
  }, [sessionName, sessionEmail, session]);

  useEffect(() => {
    if (!transactions.length) return;
    const totalOrders = transactions.length;
    const totalSpent = transactions.reduce((acc, t) => acc + (t.total ?? 0), 0);
    setUserProfile((prev) => ({ ...prev, totalOrders, totalSpent }));
  }, [transactions]);

  const { data: currentUserResp, refetch: refetchCurrentUser } =
    useGetCurrentUserQuery();

  useEffect(() => {
    const u = currentUserResp;
    if (!u) return;

    const apiImage =
      (u as { image?: string }).image ||
      (u as { media?: Array<{ original_url?: string }> }).media?.[0]
        ?.original_url ||
      "";

    setUserProfile((prev) => ({
      ...prev,
      id: String(u.id ?? prev.id),
      fullName: u.name ?? prev.fullName,
      email: u.email ?? prev.email,
      phone: u.phone ?? prev.phone,
      joinDate: u.created_at ?? prev.joinDate,
      image: apiImage || prev.image,
    }));
  }, [currentUserResp]);

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    { id: "profile", label: "Profile", icon: <UserIcon className="w-5 h-5" /> },
    { id: "addresses", label: "Alamat", icon: <MapPin className="w-5 h-5" /> },
    { id: "orders", label: "Pesanan", icon: <Package className="w-5 h-5" /> },
  ] as const;

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50";
      case "shipped":
        return "text-blue-600 bg-blue-50";
      case "processing":
        return "text-yellow-600 bg-yellow-50";
      case "pending":
        return "text-orange-600 bg-orange-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };
  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "Diterima";
      case "shipped":
        return "Dikirim";
      case "processing":
        return "Diproses";
      case "pending":
        return "Menunggu";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const openEditProfileModal = async () => {
    setIsPrefillingProfile(true);
    try {
      const result = await refetchCurrentUser();
      const u = result.data ?? currentUserResp;

      setProfileForm({
        name: u?.name ?? userProfile.fullName ?? "",
        email: u?.email ?? userProfile.email ?? "",
        phone: u?.phone ?? userProfile.phone ?? "",
        password: "",
        password_confirmation: "",
        imageFile: null,
      });

      setProfileModalOpen(true);
    } finally {
      setIsPrefillingProfile(false);
    }
  };

  const handleSubmitProfile = async () => {
    try {
      const fd = new FormData();
      // wajib/umum
      fd.append("name", profileForm.name ?? "");
      fd.append("email", profileForm.email ?? "");
      fd.append("phone", profileForm.phone ?? "");
      // password opsional (hanya kirim jika diisi)
      if (profileForm.password) {
        fd.append("password", profileForm.password);
        fd.append(
          "password_confirmation",
          profileForm.password_confirmation || ""
        );
      }
      // image opsional
      if (profileForm.imageFile) {
        fd.append("image", profileForm.imageFile);
      }

      await updateCurrentUser(fd).unwrap();
      await refetchCurrentUser();

      // sinkronkan tampilan lokal
      setUserProfile((prev) => ({
        ...prev,
        fullName: profileForm.name || prev.fullName,
        email: profileForm.email || prev.email,
        phone: profileForm.phone || prev.phone,
        // avatar akan ikut dari current user ketika di-SSR/CSR fetch; di sini cukup refetch
      }));

      setProfileModalOpen(false);
      await Swal.fire("Berhasil", "Profil berhasil diperbarui.", "success");
    } catch (err: unknown) {
      const e = err as FetchBaseQueryError;
      const data = e.data as { message?: string } | undefined;
      const msg = data?.message || "Terjadi kesalahan saat menyimpan profil.";
      Swal.fire("Gagal", msg, "error");
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    try {
      await logoutReq().unwrap();
      await Swal.fire("Berhasil!", "Anda telah keluar.", "success");
    } catch (e) {
      console.error("Logout API error:", e);
      await Swal.fire("Gagal!", "Terjadi kesalahan saat logout.", "error");
    } finally {
      await signOut({ callbackUrl: "/login" });
    }
  };

  const DEFAULT_AVATAR =
    "https://8nc5ppykod.ufs.sh/f/H265ZJJzf6brRRAfCOa62KGLnZzEJ8j0tpdrMSvRcPXiYUsh";

  const normalizeUrl = (u?: string) => {
    if (!u) return "";
    try {
      // encode karakter spesial, tapi tetap pertahankan slash
      return encodeURI(u);
    } catch {
      return u;
    }
  };
  // Avatar source dengan fallback otomatis
  const rawAvatar = (userProfile.image ?? "").trim();
  const wantedAvatar = normalizeUrl(rawAvatar);

  // pegang src di state supaya bisa diganti saat onError
  const [imgSrc, setImgSrc] = useState<string>(
    wantedAvatar ? wantedAvatar : DEFAULT_AVATAR
  );

  // update kalau userProfile.image berubah
  useEffect(() => {
    setImgSrc(wantedAvatar ? wantedAvatar : DEFAULT_AVATAR);
  }, [wantedAvatar]);

  /* --------------------- UI --------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DFF19D]/10 pt-24">
      <div className="container mx-auto px-6 lg:px-12 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#6B6B6B]/10 px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-medium text-[#6B6B6B]">
                Profil Pengguna
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Selamat Datang,{" "}
              <span className="text-[#6B6B6B]">
                {userProfile.fullName.split(" ")[0]}
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kelola profil, alamat, dan pesanan Anda dengan mudah
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={imgSrc}
                    alt={userProfile.fullName || "Avatar"}
                    fill
                    className="object-cover rounded-full"
                    onError={() => setImgSrc(DEFAULT_AVATAR)}
                    unoptimized
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#6B6B6B] rounded-full flex items-center justify-center">
                    <Camera
                      onClick={openEditProfileModal}
                      className="w-3 h-3 text-white cursor-pointer"
                    />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">
                  {userProfile.fullName}
                </h3>
                <p className="text-sm text-gray-600">{userProfile.email}</p>
              </div>

              <nav className="space-y-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-[#6B6B6B] text-white shadow-lg"
                        : "text-gray-700 hover:bg-[#6B6B6B]/10 hover:text-[#6B6B6B]"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                title={isLoggingOut ? "Sedang keluar..." : "Keluar"}
              >
                <LogOut className="w-5 h-5" />
                {isLoggingOut ? "Keluar..." : "Keluar"}
              </button>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              {/* Dashboard */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#6B6B6B] rounded-2xl flex items-center justify-center text-white">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Dashboard
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-[#6B6B6B] to-[#DFF19D] rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <Package className="w-6 h-6" />
                        <span className="font-semibold">Total Pesanan</span>
                      </div>
                      <div className="text-3xl font-bold">
                        {userProfile.totalOrders}
                      </div>
                      <div className="text-white/80 text-sm">
                        Sejak bergabung
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#F6CCD0] to-[#BFF0F5] rounded-2xl p-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <CreditCard className="w-6 h-6" />
                        <span className="font-semibold">Total Belanja</span>
                      </div>
                      <div className="text-3xl font-bold">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(userProfile.totalSpent)}
                      </div>
                      <div className="text-white/80 text-sm">
                        Lifetime value
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Pesanan Terbaru
                      </h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-[#6B6B6B] font-semibold hover:underline"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(orders || []).slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-2xl p-4 hover:border-[#6B6B6B] transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                #{order.orderNumber}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {new Date(order.date).toLocaleDateString(
                                  "id-ID"
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-[#6B6B6B]">
                                Rp {order.grand_total.toLocaleString("id-ID")}
                              </div>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={`${order.id}-${item.id}-${index}`}
                                className="w-10 h-10 relative rounded-lg overflow-hidden"
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <span className="text-sm text-gray-500">
                                +{order.items.length - 3} lainnya
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Profile */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#6B6B6B] rounded-2xl flex items-center justify-center text-white">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Informasi Profil
                      </h2>
                    </div>
                    <button
                      onClick={openEditProfileModal}
                      disabled={isPrefillingProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-[#6B6B6B] text-white rounded-2xl font-semibold hover:bg-[#6B6B6B]/90 transition-colors disabled:opacity-60"
                    >
                      <Edit3 className="w-4 h-4" />
                      {isPrefillingProfile ? "Memuat..." : "Edit"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={userProfile.fullName}
                          onChange={(e) =>
                            setUserProfile((prev) => ({
                              ...prev,
                              fullName: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) =>
                            setUserProfile((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) =>
                            setUserProfile((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Tanggal Lahir
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={userProfile.birthDate}
                          onChange={(e) =>
                            setUserProfile((prev) => ({
                              ...prev,
                              birthDate: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#6B6B6B]/5 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Informasi Akun
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Bergabung sejak:</span>
                        <div className="font-semibold text-gray-900">
                          {new Date(userProfile.joinDate).toLocaleDateString(
                            "id-ID",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Status Akun:</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">
                            Terverifikasi
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses */}
              {activeTab === "addresses" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#6B6B6B] rounded-2xl flex items-center justify-center text-white">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Alamat Pengiriman
                      </h2>
                    </div>
                    <button
                      onClick={openCreateAddress}
                      className="flex items-center gap-2 px-4 py-2 bg-[#6B6B6B] text-white rounded-2xl font-semibold hover:bg-[#6B6B6B]/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Alamat
                    </button>
                  </div>

                  {isFetchingAddressList ? (
                    <div className="text-gray-600">Memuat alamat...</div>
                  ) : (
                    (() => {
                      const addressData: ReadonlyArray<UserAddress> =
                        userAddressList?.data ?? [];
                      if (addressData.length === 0) {
                        return (
                          <div className="text-gray-600">Belum ada alamat.</div>
                        );
                      }
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {addressData.map((a) => {
                            const provName = findName(
                              provinceList,
                              a.rajaongkir_province_id
                            );
                            const cityName = findName(
                              cityList,
                              a.rajaongkir_city_id
                            );
                            const distName = findName(
                              districtList,
                              a.rajaongkir_district_id
                            );
                            return (
                              <div
                                key={a.id}
                                className={`border-2 rounded-2xl p-6 transition-all ${
                                  a.is_default
                                    ? "border-[#6B6B6B] bg-[#6B6B6B]/5"
                                    : "border-gray-200 hover:border-[#6B6B6B]/50"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-bold text-gray-900">
                                        Alamat
                                      </h3>
                                      {a.is_default && (
                                        <span className="px-2 py-1 bg-[#6B6B6B] text-white text-xs font-semibold rounded-full">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        openEditAddress(Number(a.id))
                                      }
                                      className="p-2 text-gray-400 hover:text-[#6B6B6B] transition-colors"
                                      title="Edit alamat"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteAddressApi(Number(a.id))
                                      }
                                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                      title={
                                        isDeletingAddr
                                          ? "Menghapus..."
                                          : "Hapus alamat"
                                      }
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <div className="text-sm text-gray-600 mb-4">
                                  <p className="text-gray-800 font-medium">
                                    {a.address_line_1}
                                  </p>
                                  {a.address_line_2 && (
                                    <p>{a.address_line_2}</p>
                                  )}
                                  <p>
                                    {distName ? `${distName}, ` : ""}
                                    {cityName ? `${cityName}, ` : ""}
                                    {provName
                                      ? provName
                                      : `Prov ID ${a.rajaongkir_province_id}`}
                                    {a.postal_code ? `, ${a.postal_code}` : ""}
                                  </p>
                                </div>

                                {!a.is_default && (
                                  <button
                                    onClick={async () => {
                                      try {
                                        await updateUserAddress({
                                          id: Number(a.id),
                                          payload: { is_default: true },
                                        }).unwrap();
                                        await refetchUserAddressList();
                                      } catch {
                                        Swal.fire(
                                          "Gagal",
                                          "Tidak dapat menjadikan default.",
                                          "error"
                                        );
                                      }
                                    }}
                                    className="text-[#6B6B6B] text-sm font-semibold hover:underline"
                                  >
                                    Jadikan Default
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()
                  )}

                  {/* Modal Create / Edit */}
                  {addrModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => {
                          setAddrModalOpen(false);
                          setAddrEditId(null);
                        }}
                      />
                      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            {addrEditId ? "Edit Alamat" : "Tambah Alamat"}
                          </h3>
                          <button
                            onClick={() => {
                              setAddrModalOpen(false);
                              setAddrEditId(null);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-4">
                          {/* Province */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Provinsi
                            </label>
                            <select
                              className="w-full border border-gray-200 rounded-2xl px-3 py-2"
                              value={addrForm.rajaongkir_province_id ?? ""}
                              onChange={(e) => {
                                const v = e.target.value
                                  ? Number(e.target.value)
                                  : null;
                                setAddrForm((p) => ({
                                  ...p,
                                  rajaongkir_province_id: v,
                                  rajaongkir_city_id: null,
                                  rajaongkir_district_id: null,
                                }));
                              }}
                            >
                              <option value="">-- Pilih Provinsi --</option>
                              {provinceList.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* City */}
                          <div>
                            <label className="block text sm font-semibold text-gray-900 mb-2">
                              Kota/Kabupaten
                            </label>
                            <select
                              className="w-full border border-gray-200 rounded-2xl px-3 py-2"
                              value={addrForm.rajaongkir_city_id ?? ""}
                              onChange={(e) => {
                                const v = e.target.value
                                  ? Number(e.target.value)
                                  : null;
                                setAddrForm((p) => ({
                                  ...p,
                                  rajaongkir_city_id: v,
                                  rajaongkir_district_id: null,
                                }));
                              }}
                              disabled={!addrForm.rajaongkir_province_id}
                            >
                              <option value="">
                                -- Pilih Kota/Kabupaten --
                              </option>
                              {cityList.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* District */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Kecamatan
                            </label>
                            <select
                              className="w-full border border-gray-200 rounded-2xl px-3 py-2"
                              value={addrForm.rajaongkir_district_id ?? ""}
                              onChange={(e) =>
                                setAddrForm((p) => ({
                                  ...p,
                                  rajaongkir_district_id: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                }))
                              }
                              disabled={!addrForm.rajaongkir_city_id}
                            >
                              <option value="">-- Pilih Kecamatan --</option>
                              {districtList.map((d) => (
                                <option key={d.id} value={d.id}>
                                  {d.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Address line 1 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Alamat (Baris 1)
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-2xl px-3 py-2"
                              value={addrForm.address_line_1 ?? ""}
                              onChange={(e) =>
                                setAddrForm((p) => ({
                                  ...p,
                                  address_line_1: e.target.value,
                                }))
                              }
                            />
                          </div>

                          {/* Address line 2 */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Alamat (Baris 2) – opsional
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-2xl px-3 py-2"
                              value={addrForm.address_line_2 ?? ""}
                              onChange={(e) =>
                                setAddrForm((p) => ({
                                  ...p,
                                  address_line_2: e.target.value,
                                }))
                              }
                            />
                          </div>

                          {/* Postal code */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Kode Pos
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-2xl px-3 py-2"
                              value={addrForm.postal_code ?? ""}
                              onChange={(e) =>
                                setAddrForm((p) => ({
                                  ...p,
                                  postal_code: e.target.value,
                                }))
                              }
                            />
                          </div>

                          {/* Default */}
                          <div className="flex items-center gap-2">
                            <input
                              id="is_default"
                              type="checkbox"
                              className="w-4 h-4"
                              checked={Boolean(addrForm.is_default)}
                              onChange={(e) =>
                                setAddrForm((p) => ({
                                  ...p,
                                  is_default: e.target.checked,
                                }))
                              }
                            />
                            <label
                              htmlFor="is_default"
                              className="text-sm text-gray-800"
                            >
                              Jadikan alamat default
                            </label>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              setAddrModalOpen(false);
                              setAddrEditId(null);
                            }}
                            className="px-4 py-2 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            Batal
                          </button>
                          <button
                            onClick={handleSubmitAddress}
                            disabled={isCreatingAddr || isUpdatingAddr}
                            className="px-4 py-2 rounded-2xl bg-[#6B6B6B] text-white font-semibold hover:bg-[#6B6B6B]/90 disabled:opacity-60"
                          >
                            {addrEditId
                              ? isUpdatingAddr
                                ? "Menyimpan..."
                                : "Simpan Perubahan"
                              : isCreatingAddr
                              ? "Menyimpan..."
                              : "Simpan"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders */}
              {activeTab === "orders" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#6B6B6B] rounded-2xl flex items-center justify-center text-white">
                      <Package className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Riwayat Pesanan
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {(orders || []).map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-2xl p-6 hover:border-[#6B6B6B] transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              #{order.orderNumber}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(order.date).toLocaleDateString(
                                    "id-ID"
                                  )}
                                </span>
                              </div>
                              {order.trackingNumber && (
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  <span>{order.trackingNumber}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                            <div className="text-right">
                              <div className="font-bold text-xl text-[#6B6B6B]">
                                Rp {order.grand_total.toLocaleString("id-ID")}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <div className="w-16 h-16 relative rounded-xl overflow-hidden">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  Rp{" "}
                                  {(item.price * item.quantity).toLocaleString(
                                    "id-ID"
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @Rp {item.price.toLocaleString("id-ID")}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => openOrderDetailModal(order.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-[#6B6B6B] text-[#6B6B6B] rounded-2xl hover:bg-[#6B6B6B] hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Detail
                          </button>
                          {order.status === "delivered" && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#6B6B6B] text-white rounded-2xl hover:bg-[#6B6B6B]/90 transition-colors">
                              <Download className="w-4 h-4" />
                              Invoice
                            </button>
                          )}
                          {order.trackingNumber && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors">
                              <Truck className="w-4 h-4" />
                              Lacak
                            </button>
                          )}
                          {order.status === "delivered" && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-2xl hover:bg-yellow-200 transition-colors">
                              <Star className="w-4 h-4" />
                              Beri Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-[#6B6B6B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-12 h-12 text-[#6B6B6B]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Belum Ada Pesanan
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Anda belum memiliki riwayat pesanan. Mulai belanja
                        sekarang!
                      </p>
                      <button
                        onClick={() => router.push("/product")}
                        className="bg-[#6B6B6B] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#6B6B6B]/90 transition-colors"
                      >
                        Mulai Berbelanja
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setProfileModalOpen(false)}
          />
          <ProfileEditModal
            open={profileModalOpen}
            onClose={() => setProfileModalOpen(false)}
            values={profileForm}
            onChange={(patch) =>
              setProfileForm((prev) => ({ ...prev, ...patch }))
            }
            onSubmit={handleSubmitProfile}
            isSubmitting={isUpdatingProfile}
          />
        </div>
      )}

      {/* Order Detail Modal */}
      {orderDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeOrderDetailModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Detail Pesanan #{selectedOrder.orderNumber}
              </h3>
              <button
                onClick={closeOrderDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Informasi Pesanan
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nomor Pesanan:</span>
                      <span className="font-medium">
                        #{selectedOrder.orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.date).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Metode Pembayaran:</span>
                      <span className="font-medium uppercase">
                        {selectedOrder.payment_method || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Rincian Pembayaran
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        Rp {selectedOrder.total.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {!isJasaOrder &&
                      selectedOrder.shipment_cost !== undefined &&
                      selectedOrder.shipment_cost !== null && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ongkos Kirim:</span>
                          <span className="font-medium">
                            Rp{" "}
                            {selectedOrder.shipment_cost.toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      )}
                    {selectedOrder.cod && selectedOrder.cod > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee COD:</span>
                        <span className="font-medium">
                          Rp {selectedOrder.cod.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                    {selectedOrder.discount_total &&
                      selectedOrder.discount_total > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Diskon:</span>
                          <span className="font-medium text-green-600">
                            -Rp{" "}
                            {selectedOrder.discount_total.toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">
                          Total:
                        </span>
                        <span className="font-bold text-[#6B6B6B]">
                          Rp {selectedOrder.grand_total.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Alamat Pengiriman
                  </h4>
                  <div className="text-sm">
                    <p className="text-gray-800">{addressLine1}</p>
                    {postalCode && (
                      <p className="text-gray-600">{postalCode}</p>
                    )}
                  </div>
                </div>

                {/* Payment Proof Section */}
                {selectedOrder.payment_method === "manual" && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Bukti Pembayaran
                    </h4>
                    {selectedOrder.payment_proof ? (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Bukti pembayaran telah diupload
                          </span>
                        </div>
                        <div className="mt-2">
                          <Image
                            src={selectedOrder.payment_proof}
                            alt="Bukti Pembayaran"
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-3">
                          Belum ada bukti pembayaran
                        </p>
                        <button
                          onClick={openPaymentProofModal}
                          className="flex items-center gap-2 px-4 py-2 bg-[#6B6B6B] text-white rounded-lg font-medium hover:bg-[#6B6B6B]/90 transition-colors mx-auto"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Bukti
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                Produk Pesanan
              </h4>
              <div className="space-y-4">
                {isLoadingReceiptCode ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-[#6B6B6B] rounded-full animate-spin" />
                    <span className="ml-2 text-gray-500">Memuat produk...</span>
                  </div>
                ) : shopDetailResp?.details &&
                  shopDetailResp.details.length > 0 ? (
                  shopDetailResp.details.map((detail, index) => {
                    const product = detail.product;
                    const productName = product?.name || "Produk";
                    const productImage =
                      getProductImageFromShopDetails(product);

                    return (
                      <div
                        key={detail.id || index}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                          <Image
                            src={productImage}
                            alt={productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">
                            {productName}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Qty: {detail.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            Rp {detail.total.toLocaleString("id-ID")}
                          </div>
                          <div className="text-sm text-gray-500">
                            @Rp {detail.price.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Tidak ada produk ditemukan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Upload Modal */}
      {paymentProofModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closePaymentProofModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Upload Bukti Pembayaran
              </h3>
              <button
                onClick={closePaymentProofModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih File Bukti Pembayaran
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPaymentProofFile(e.target.files?.[0] || null)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B6B6B] focus:border-transparent"
                />
              </div>

              {paymentProofFile && (
                <div className="text-sm text-gray-600">
                  File dipilih: {paymentProofFile.name}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Catatan:</strong> Pastikan file yang diupload adalah
                  bukti pembayaran yang valid dan jelas terbaca.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closePaymentProofModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handlePaymentProofUpload}
                disabled={!paymentProofFile || isUploadingProof}
                className="flex-1 px-4 py-2 bg-[#6B6B6B] text-white rounded-lg hover:bg-[#6B6B6B]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploadingProof ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}