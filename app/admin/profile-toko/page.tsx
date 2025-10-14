"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import {
  useGetCitiesQuery,
  useGetDistrictsQuery,
  useGetProvincesQuery,
} from "@/services/shop/open-shop/open-shop.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Shop = {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: string | number | null;
  total_reviews: number | null;
  status: boolean;
  rajaongkir_province_id: number | null;
  rajaongkir_city_id: number | null;
  rajaongkir_district_id: string | number | null;
  logo: string | null;
  banner: string | null;
};

type BankAccount = {
  id?: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  is_primary?: boolean;
};

type UserSession = {
  user: {
    name: string;
    email: string;
    id: number;
    token: string;
    roles: Array<{ id: number; name: string }>;
    shop: Shop | null;
  };
  expires: string;
};

const DEFAULT_LOGO = "/favicon.ico";

export default function ShopProfilePage() {
  const { data: sessionData } = useSession() as unknown as {
    data: UserSession | null;
  };
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    kecamatan: "",
    rajaongkir_province_id: 0,
    rajaongkir_city_id: 0,
    rajaongkir_district_id: 0,
  });

  // === Data wilayah (provinsi/kota/kecamatan) ===
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

  const shopFromSession = sessionData?.user?.shop ?? null;

  // ===== Tabs =====
  const [tab, setTab] = useState<"info" | "settings" | "bank">("info");

  // ===== Form States (initialized from session) =====
  const [infoForm, setInfoForm] = useState<
    Pick<
      Shop,
      | "name"
      | "slug"
      | "phone"
      | "email"
      | "address"
      | "description"
      | "logo"
      | "banner"
    >
  >({
    name: "",
    slug: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    logo: "",
    banner: "",
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [settingsForm, setSettingsForm] = useState<
    Pick<
      Shop,
      | "status"
      | "latitude"
      | "longitude"
      | "rajaongkir_province_id"
      | "rajaongkir_city_id"
      | "rajaongkir_district_id"
    >
  >({
    status: true,
    latitude: null,
    longitude: null,
    rajaongkir_province_id: null,
    rajaongkir_city_id: null,
    rajaongkir_district_id: null,
  });

  const [banks, setBanks] = useState<BankAccount[]>([]);

  // ===== Hydrate from session =====
  useEffect(() => {
    if (!shopFromSession) return;

    setInfoForm({
      name: shopFromSession.name ?? "",
      slug: shopFromSession.slug ?? "",
      phone: shopFromSession.phone ?? "",
      email: shopFromSession.email ?? "",
      address: shopFromSession.address ?? "",
      description: shopFromSession.description ?? "",
      logo: shopFromSession.logo ?? "",
      banner: shopFromSession.banner ?? "",
    });

    setLogoPreview(
      shopFromSession.logo && shopFromSession.logo.trim() !== ""
        ? shopFromSession.logo
        : DEFAULT_LOGO
    );
    setBannerPreview(shopFromSession.banner ?? "");

    setSettingsForm({
      status: !!shopFromSession.status,
      latitude:
        shopFromSession.latitude === null
          ? null
          : Number(shopFromSession.latitude),
      longitude:
        shopFromSession.longitude === null
          ? null
          : Number(shopFromSession.longitude),
      rajaongkir_province_id: shopFromSession.rajaongkir_province_id ?? null,
      rajaongkir_city_id: shopFromSession.rajaongkir_city_id ?? null,
      rajaongkir_district_id: shopFromSession.rajaongkir_district_id ?? null,
    });

    // Jika kamu sudah punya endpoint bank akun, bisa fetch di sini.
    // Untuk sekarang kosong dulu.
    setBanks((prev) => (prev.length ? prev : []));
  }, [shopFromSession]);

  // ===== Helpers =====
  const shopUrl = useMemo(() => {
    const slug = shopFromSession?.slug ?? "";
    return slug ? `/shop/${slug}` : "#";
  }, [shopFromSession]);

  const displayShopName = useMemo(() => {
    // Sesuai instruksi: tampilkan judul berasal dari shop.name
    return shopFromSession?.name ?? "Superadmin";
  }, [shopFromSession]);

  // ===== Handlers - Info =====
  const handleInfoChange =
    (field: keyof typeof infoForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInfoForm((s) => ({ ...s, [field]: e.target.value }));
    };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    // kamu bisa simpan File ini di state lain untuk upload ke server saat submit
    // mis: setInfoFiles((s)=>({...s, logo: file}))
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBannerPreview(url);
  };

  const saveInfo = async () => {
    // TODO: panggil API update info toko, kirim Bearer token: sessionData?.user.token
    // contoh payload: {...infoForm, logo: fileLogo, banner: fileBanner}
    alert(
      "Info Toko disimpan (mock). Implementasikan panggilan API sesuai backend kamu."
    );
  };

  // ===== Handlers - Settings =====
  const handleSettingsChange =
    (field: keyof typeof settingsForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setSettingsForm((s) => {
        // cast angka bila perlu
        if (
          field === "rajaongkir_province_id" ||
          field === "rajaongkir_city_id"
        ) {
          const v = value === "" ? null : Number(value);
          return { ...s, [field]: Number.isNaN(v) ? null : v };
        }
        if (field === "latitude" || field === "longitude") {
          const v = value === "" ? null : Number(value);
          return { ...s, [field]: Number.isNaN(v) ? null : v };
        }
        if (field === "rajaongkir_district_id") {
          if (typeof value !== "string") {
            return { ...s, rajaongkir_district_id: null };
          }
          const v =
            value === "" ? null : /^\d+$/.test(value) ? Number(value) : value;
          return { ...s, rajaongkir_district_id: v };
        }
        if (field === "status") {
          return { ...s, status: Boolean(value) };
        }
        return { ...s, [field]: value as unknown as (typeof s)[typeof field] };
      });
    };

  const saveSettings = async () => {
    // TODO: panggil API update settings toko
    alert(
      "Pengaturan Toko disimpan (mock). Implementasikan panggilan API sesuai backend kamu."
    );
  };

  // ===== Handlers - Banks =====
  const addBank = () => {
    setBanks((s) => [
      ...s,
      {
        bank_name: "",
        account_name: "",
        account_number: "",
        is_primary: s.length === 0,
      },
    ]);
  };

  const removeBank = (idx: number) => {
    setBanks((s) => s.filter((_, i) => i !== idx));
  };

  const handleBankChange =
    (idx: number, field: keyof BankAccount) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;

      setBanks((s) =>
        s.map((b, i) =>
          i === idx
            ? {
                ...b,
                [field]:
                  field === "is_primary" ? Boolean(value) : (value as string),
              }
            : b
        )
      );
    };

  const markPrimary = (idx: number) => {
    setBanks((s) => s.map((b, i) => ({ ...b, is_primary: i === idx })));
  };

  const saveBanks = async () => {
    // TODO: panggil API simpan bank rekening (create/update/delete)
    // kirim array `banks`
    alert(
      "Bank Rekening disimpan (mock). Implementasikan panggilan API sesuai backend kamu."
    );
  };

  // ====== UI ======
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={shopUrl} className="flex-shrink-0" prefetch={false}>
          <Image
            src={DEFAULT_LOGO}
            alt="Logo Toko"
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-black/5 dark:ring-white/10"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_LOGO;
            }}
          />
        </Link>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            BLACKBOXINC
          </h1>
          <p className="text-sm text-gray-500">
            <span className="mr-2">Manajemen Toko</span>
            <span className="mx-3">•</span>
            <span className="mr-2">Rating:</span>
            <span className="font-medium">
              {shopFromSession?.rating ?? "0.0"} (
              {shopFromSession?.total_reviews ?? 0})
            </span>
            <span className="mx-3">•</span>
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                shopFromSession?.status
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {shopFromSession?.status ? "Aktif" : "Nonaktif"}
            </span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <TabButton active={tab === "info"} onClick={() => setTab("info")}>
          Data Informasi Toko
        </TabButton>
        <TabButton
          active={tab === "settings"}
          onClick={() => setTab("settings")}
        >
          Pengaturan Toko
        </TabButton>
        <TabButton active={tab === "bank"} onClick={() => setTab("bank")}>
          Bank Rekening
        </TabButton>
      </div>

      {/* Content */}
      {tab === "info" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Data Informasi Toko
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                id="name"
                label="Nama Toko"
                value={infoForm.name}
                onChange={handleInfoChange("name")}
              />
              {/* <TextField
                id="slug"
                label="Slug"
                value={infoForm.slug}
                onChange={handleInfoChange("slug")}
              /> */}
              <TextField
                id="phone"
                label="No. HP"
                value={infoForm.phone ?? ""}
                onChange={handleInfoChange("phone")}
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                value={infoForm.email ?? ""}
                onChange={handleInfoChange("email")}
              />
              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={infoForm.address ?? ""}
                  onChange={handleInfoChange("address")}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={infoForm.description ?? ""}
                  onChange={handleInfoChange("description")}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Image
                    src={logoPreview || DEFAULT_LOGO}
                    alt="Preview Logo"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-xl object-cover ring-1 ring-black/5 dark:ring-white/10"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_LOGO;
                    }}
                  />
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="banner">Banner</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-[240px] h-[80px] relative overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10 bg-gray-50 dark:bg-gray-900">
                    {bannerPreview ? (
                      // Pakai img biasa agar URL.createObjectURL aman tanpa domain config
                      // (Next/Image butuh domain config jika remote)
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={bannerPreview}
                        alt="Preview Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        Belum ada banner
                      </div>
                    )}
                  </div>
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={saveInfo}>Simpan Informasi</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "settings" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Pengaturan Toko
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={settingsForm.status ? "1" : "0"}
                  onValueChange={(val) => {
                    setSettingsForm((s) => ({ ...s, status: val === "1" }));
                  }}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="1">Aktif</SelectItem>
                    <SelectItem value="0">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* <TextField
                id="latitude"
                label="Latitude"
                type="number"
                step="any"
                value={settingsForm.latitude ?? ""}
                onChange={handleSettingsChange("latitude")}
              />
              <TextField
                id="longitude"
                label="Longitude"
                type="number"
                step="any"
                value={settingsForm.longitude ?? ""}
                onChange={handleSettingsChange("longitude")}
              /> */}

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
                  onChange={(id) =>
                    setShippingInfo((prev) => ({
                      ...prev,
                      rajaongkir_city_id: id,
                      rajaongkir_district_id: 0,
                    }))
                  }
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
                  onChange={(id) =>
                    setShippingInfo((prev) => ({
                      ...prev,
                      rajaongkir_district_id: id,
                    }))
                  }
                  data={districts}
                  isLoading={loadingDistrict}
                  getOptionLabel={(item) => item.name}
                  disabled={!shippingInfo.rajaongkir_city_id}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={saveSettings}>Simpan Pengaturan</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "bank" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Bank Rekening
            </CardTitle>
            <Button variant="secondary" onClick={addBank}>
              + Tambah Rekening
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {banks.length === 0 && (
              <p className="text-sm text-gray-500">Belum ada data rekening.</p>
            )}
            {banks.map((b, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextField
                    id={`bank_name_${idx}`}
                    label="Nama Bank"
                    value={b.bank_name}
                    onChange={handleBankChange(idx, "bank_name")}
                  />
                  <TextField
                    id={`account_name_${idx}`}
                    label="Atas Nama"
                    value={b.account_name}
                    onChange={handleBankChange(idx, "account_name")}
                  />
                  <TextField
                    id={`account_number_${idx}`}
                    label="No. Rekening"
                    value={b.account_number}
                    onChange={handleBankChange(idx, "account_number")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      id={`primary_${idx}`}
                      type="checkbox"
                      checked={!!b.is_primary}
                      onChange={() => markPrimary(idx)}
                    />
                    <Label htmlFor={`primary_${idx}`}>Jadikan utama</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => removeBank(idx)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Button onClick={saveBanks}>Simpan Rekening</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ========= UI Helpers ========= */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px px-4 py-2 text-sm border-b-2 transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function TextField({
  id,
  label,
  type = "text",
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  step?: string | number;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        step={step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
