"use client";

import { useSession, signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, ShoppingCart, LogOut } from "lucide-react";
import useCart from "@/hooks/use-cart";

import {
  useGetTransactionListQuery,
} from "@/services/admin/transaction.service";

// Lazy load CreateShopForm
const CreateShopForm = dynamic(() => import("@/components/create-shop-form"), {
  ssr: false,
});

type TabType = "profile" | "history" | "cart" | "logout";

export default function SettingsPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const userRole = session?.user?.roles?.[0]?.name;
  const userShop = session?.user?.shop;
  const { cartItems, removeItem, increaseItemQuantity, decreaseItemQuantity } = useCart();

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  // Function to check if user should see Admin Settings button
  const shouldShowAdminSettings = () => {
    return userRole === "duration" || userShop;
  };

  // Function to check if user should see "Tambah Toko" button
  const shouldShowTambahToko = () => {
    return !shouldShowAdminSettings() && session;
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin logout?",
      text: "Anda akan keluar dari akun Anda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      await signOut({ callbackUrl: "/" });
    }
  };

  const handleUpdatePassword = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleTabClick = (tab: TabType) => {
    if (tab === "logout") {
      handleLogout();
    } else {
      setActiveTab(tab);
    }
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const tabs = [
    {
      id: "profile" as TabType,
      label: "Profile",
      icon: User,
    },
    {
      id: "history" as TabType,
      label: "Riwayat Pembelian",
      icon: ShoppingBag,
    },
    {
      id: "cart" as TabType,
      label: "Keranjang",
      icon: ShoppingCart,
    },
    {
      id: "logout" as TabType,
      label: "Logout",
      icon: LogOut,
    },
  ];

    const { data, isLoading } = useGetTransactionListQuery({
      page: currentPage,
      paginate: itemsPerPage,
      user_id: session?.user?.id,
    });
  
    const transactionList = useMemo(() => data?.data || [], [data]);
    const lastPage = useMemo(() => data?.last_page || 1, [data]);
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Function to get status badge color
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0: // PENDING
        return {
          text: 'Menunggu Pembayaran',
          class: 'bg-yellow-100 text-yellow-800'
        };
      case 1: // CAPTURED
        return {
          text: 'Pembayaran Berhasil',
          class: 'bg-blue-100 text-blue-800'
        };
      case 2: // SETTLEMENT
        return {
          text: 'Selesai',
          class: 'bg-green-100 text-green-800'
        };
      case -1: // DENY
        return {
          text: 'Pembayaran Ditolak',
          class: 'bg-red-100 text-red-800'
        };
      case -2: // EXPIRED
        return {
          text: 'Kedaluwarsa',
          class: 'bg-gray-100 text-gray-800'
        };
      case -3: // CANCEL
        return {
          text: 'Dibatalkan',
          class: 'bg-red-100 text-red-800'
        };
      default:
        return {
          text: 'Status Tidak Diketahui',
          class: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const renderProfileTab = () => (
    <div
      className={`grid gap-6 ${
        showCreateForm ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
      }`}
    >
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">My Profile</h2>
        
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src={session?.user?.image || "/images/profile-icon.jpeg"}
              alt="Profile"
              width={80}
              height={80}
              className="w-40 h-40 rounded-full object-cover"
            />
            <div>
              <Button variant="outline" className="mr-2">
                Change Image
              </Button>
              <Button variant="ghost">Remove Image</Button>
              <p className="text-sm text-muted-foreground mt-1">
                We support PNGs, JPEGs and GIFs under 2MB
              </p>
            </div>
          </div>
          <div className="my-4 flex flex-wrap gap-2">
            {shouldShowAdminSettings() && (
              <Button
                onClick={() => router.push("/admin/dashboard")}
                variant="outline"
              >
                Halaman Toko
              </Button>
            )}
            
            {shouldShowTambahToko() && (
              <Button
                variant="default"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? "Tutup Form" : "Tambah Toko"}
              </Button>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Full Name
            </label>
            <Input value={session?.user?.name || ""} disabled />
          </div>
        </div>

        {/* Security */}
        <h2 className="text-lg font-semibold mb-4">Account Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <Input value={session?.user?.email || ""} disabled />
          </div>
        </div>
        
        {session && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                New Password
              </label>
              <Input
                type="password"
                placeholder="Masukkan password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <Button onClick={handleUpdatePassword} disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow border p-6">
          <CreateShopForm
            defaultEmail={session?.user?.email || ""}
            onClose={() => setShowCreateForm(false)}
          />
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Riwayat Pembelian</h2>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Memuat riwayat pembelian...</p>
          </div>
        </div>
      );
    }
    if (!transactionList || transactionList.length === 0) {
      return (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Riwayat Pembelian</h2>
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Riwayat Pembelian
            </h3>
            <p className="text-gray-500 mb-4">
              Anda belum melakukan pembelian apapun.
            </p>
            <Button onClick={() => router.push("/product")}>
              Mulai Belanja
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Riwayat Pembelian</h2>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          
          {transactionList.map((transaction) => (
            <div
              key={transaction.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-blue-600">
                      {transaction.reference}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(
                        transaction.status || 0
                      ).class}`}
                    >
                      {getStatusInfo(transaction.status || 0).text}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Tanggal:</span>{" "}
                      {transaction.created_at ? formatDate(transaction.created_at) : 'N/A'}
                    </p>
                    {transaction.discount_total > 0 && (
                      <p>
                        <span className="font-medium">Diskon:</span>{" "}
                        {formatCurrency(transaction.discount_total)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(transaction.total)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      // You can implement view detail functionality here
                      console.log('View transaction detail:', transaction.id);
                    }}
                  >
                    Lihat Detail
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 flex items-center justify-between bg-muted">
          <div className="text-sm">
            Halaman <strong>{currentPage}</strong> dari{" "}
            <strong>{lastPage}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={currentPage >= lastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCartTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Keranjang Belanja</h2>
        <span className="text-sm text-gray-500">
          {cartItems.length} item
        </span>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keranjang Kosong
          </h3>
          <p className="text-gray-500 mb-4">
            Belum ada produk di keranjang Anda.
          </p>
          <Button onClick={() => router.push("/product")}>
            Lanjutkan Belanja
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={
                    typeof item.image === "string"
                      ? item.image
                      : item.image instanceof File
                      ? URL.createObjectURL(item.image)
                      : "/placeholder.png"
                  }
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.merk_name}</p>
                <p className="text-green-600 font-bold text-sm">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => decreaseItemQuantity(item.id)}
                  className="w-8 h-8 p-0"
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center text-sm">
                  {item.quantity}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => increaseItemQuantity(item.id)}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-sm">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </Button>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold text-green-600">
                Rp {calculateCartTotal().toLocaleString("id-ID")}
              </span>
            </div>
            <Button
              onClick={() => router.push("/checkout")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : tab.id === "logout"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-600 hover:bg-white/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow border p-6">
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "history" && renderHistoryTab()}
        {activeTab === "cart" && renderCartTab()}
      </div>
    </div>
  );
}