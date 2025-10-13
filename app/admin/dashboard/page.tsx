"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Clock, 
  Truck, 
  CheckCircle, 
  MousePointer, 
  DollarSign,
  Users,
  Package,
  HeartHandshake
} from "lucide-react";

// Mock data - replace with actual API calls
const mockDashboardData = {
  totalOrders: 1247,
  pendingOrders: 23,
  shippedOrders: 156,
  completedOrders: 1068,
  totalSales: 125430000,
  totalCustomers: 850,
  totalProducts: 54,
  totalServices: 12
};

// Dashboard card configuration
const dashboardCards = [
  {
    title: "Total Pesanan",
    value: mockDashboardData.totalOrders,
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    formatType: "number"
  },
  {
    title: "Pesanan Menunggu",
    value: mockDashboardData.pendingOrders,
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    formatType: "number"
  },
  {
    title: "Pesanan Dikirim",
    value: mockDashboardData.shippedOrders,
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    formatType: "number"
  },
  {
    title: "Pesanan Selesai",
    value: mockDashboardData.completedOrders,
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    formatType: "number"
  },
  {
    title: "Total Penjualan",
    value: mockDashboardData.totalSales,
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    formatType: "currency"
  },
  {
    title: "Total Customer",
    value: mockDashboardData.totalCustomers,
    icon: Users,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    formatType: "number"
  },
  {
    title: "Total Produk",
    value: mockDashboardData.totalProducts,
    icon: Package,
    color: "text-red-600",
    bgColor: "bg-red-100",
    formatType: "number"
  },
  {
    title: "Total Layanan",
    value: mockDashboardData.totalServices,
    icon: HeartHandshake,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    formatType: "number"
  }
];

export default function DashboardPage() {
  // Helper function to format currency in Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('IDR', '');
  };

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Format value based on type
  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return formatRupiah(value);
      case 'number':
      default:
        return formatNumber(value);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Ringkasan data toko Anda
        </p>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${card.bgColor}`}>
                    <IconComponent className={`h-4 w-4 ${card.color}`} />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-gray-900 mt-[-25px] text-center">
                  {formatValue(card.value, card.formatType)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Status Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pesanan Aktif</span>
                <span className="font-semibold">
                  {formatNumber(mockDashboardData.pendingOrders + mockDashboardData.shippedOrders)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tingkat Penyelesaian</span>
                <span className="font-semibold text-green-600">
                  {((mockDashboardData.completedOrders / mockDashboardData.totalOrders) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rata-rata Penjualan per Pesanan</span>
                <span className="font-semibold">
                  {formatRupiah(mockDashboardData.totalSales / mockDashboardData.totalOrders)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Statistik Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Produk</span>
                <span className="font-semibold">
                  {formatNumber(mockDashboardData.totalProducts)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Customer</span>
                <span className="font-semibold">
                  {formatNumber(mockDashboardData.totalCustomers)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Layanan</span>
                <span className="font-semibold">
                  {formatNumber(mockDashboardData.totalServices)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}