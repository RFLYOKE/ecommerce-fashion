"use client";
import React, { useState, useEffect } from "react";
import {
  Database,
  Store,
  ShoppingCart,
  Users,
  Package,
  Tag,
  BookDashed,
} from "lucide-react";
import Header from "@/components/admin-components/header";
import Sidebar from "@/components/admin-components/sidebar";
import { AdminLayoutProps, MenuItem } from "@/types";
import { IconLibraryPhoto, IconNews } from "@tabler/icons-react";
import { FaMoneyBill } from "react-icons/fa";
import { useSession } from "next-auth/react";
import type { User } from "@/types/user";

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let menuItems: MenuItem[] = [];

  // Menu items untuk superadmin (semua menu)
  const superadminMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BookDashed className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      id: "profile-toko",
      label: "Profile Toko",
      icon: <Store className="h-5 w-5" />,
      href: "/admin/profile-toko",
    },
    {
      id: "master",
      label: "Master",
      icon: <Database className="h-5 w-5" />,
      href: "#", 
      children: [
        {
          id: "master-product-category",
          label: "Kategori Produk",
          href: "/admin/product-category",
        },
        {
          id: "master-product-merk",
          label: "Tipe Produk",
          href: "/admin/product-merk",
        },
      ],
    },
    {
      id: "product",
      label: "Produk",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/product-list", 
    },
    {
      id: "gallery",
      label: "Galeri",
      icon: <IconLibraryPhoto className="h-5 w-5" />,
      href: "/admin/gallery", 
    },
    {
      id: "news",
      label: "Berita",
      icon: <IconNews className="h-5 w-5" />,
      href: "/admin/news", 
    },
    {
      id: "voucher",
      label: "Voucher",
      icon: <Tag className="h-5 w-5" />,
      href: "/admin/voucher", 
    },
    {
      id: "transaction",
      label: "Transaksi",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/admin/transaction",
    },
    // {
    //   id: "pemasukan",
    //   label: "Pemasukan",
    //   icon: <FaMoneyBill className="h-5 w-5" />,
    //   href: "/admin/pemasukan",
    //   children: [
    //     {
    //       id: "data pemasukan",
    //       label: "Data Pemasukan",
    //       href: "/admin/pemasukan/data-pemasukan",
    //     },
    //     {
    //       id: "kategori pemasukan",
    //       label: "Kategori Pemasukan",
    //       href: "/admin/pemasukan/kategori-pemasukan",
    //     },
    //   ],
    // },
    // {
    //   id: "pengeluaran",
    //   label: "Pengeluaran",
    //   icon: <FaMoneyBill className="h-5 w-5" />,
    //   href: "/admin/pengeluaran",
    //   children: [
    //     {
    //       id: "data pengeluaran",
    //       label: "Data Pengeluaran",
    //       href: "/admin/pengeluaran/data-pengeluaran",
    //     },
    //     {
    //       id: "kategori pengeluaran",
    //       label: "Kategori Pengeluaran",
    //       href: "/admin/pengeluaran/kategori-pengeluaran",
    //     },
    //   ],
    // },
    {
      id: "customer",
      label: "Data Customer",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/customer",
    },
    {
      id: "pengelola",
      label: "Data Pengelola",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/pengelola",
    },
  ];

  // Menu items untuk admin (terbatas)
  const adminMenuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BookDashed className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      id: "master",
      label: "Master",
      icon: <Database className="h-5 w-5" />,
      href: "#", 
      children: [
        {
          id: "master-product-category",
          label: "Kategori Produk",
          href: "/admin/product-category",
        },
        {
          id: "master-product-merk",
          label: "Tipe Produk",
          href: "/admin/product-merk",
        },
      ],
    },
    {
      id: "product",
      label: "Produk",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/product-list", 
    },
    {
      id: "transaction",
      label: "Transaksi",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/admin/transaction",
    },
    {
      id: "customer",
      label: "Data Customer",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/customer",
    },
  ];

  // Tentukan menu items berdasarkan role pengguna
  if (!user || user?.roles[0].name === "superadmin") {
    menuItems = superadminMenuItems;
  } else if (user?.roles[0].name === "admin") {
    menuItems = adminMenuItems;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
      />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;