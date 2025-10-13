"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/admin/product";
import { Combobox } from "@/components/ui/combo-box";
import { useGetProductCategoryListQuery } from "@/services/master/product-category.service";
import { useGetProductMerkListQuery } from "@/services/master/product-merk.service";
import Image from "next/image";
import { formatNumber } from "@/lib/format";

interface FormProductProps {
  form: Partial<Product>;
  setForm: (data: Partial<Product>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  readonly?: boolean;
  isLoading?: boolean;
}

// parse "1,2", "1.2", "1.234,56", "1,234.56" → number
function parseFlexibleDecimal(input: string): number | undefined {
  const s = input.replace(/[^\d.,-]/g, "").trim();
  if (s === "" || s === "-" || s === "," || s === ".") return undefined;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  const lastSep = Math.max(lastComma, lastDot);
  if (lastSep === -1) {
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  }
  const intPart = s.slice(0, lastSep).replace(/[.,]/g, "");
  const fracPart = s.slice(lastSep + 1).replace(/[.,]/g, "");
  const normalized = `${intPart}.${fracPart}`;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

type ImageKey =
  | "image"
  | "image_2"
  | "image_3"
  | "image_4"
  | "image_5"
  | "image_6"
  | "image_7";
const IMAGE_KEYS: ImageKey[] = [
  "image",
  "image_2",
  "image_3",
  "image_4",
  "image_5",
  "image_6",
  "image_7",
];

export default function FormProduct({
  form,
  setForm,
  onCancel,
  onSubmit,
  readonly = false,
  isLoading = false,
}: FormProductProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [weightText, setWeightText] = useState<string>("");

  // Preview URL per image key (bisa URL asli atau blob:)
  const [previews, setPreviews] = useState<Record<ImageKey, string>>({
    image: "",
    image_2: "",
    image_3: "",
    image_4: "",
    image_5: "",
    image_6: "",
    image_7: "",
  });

  // simpan blob url lama agar bisa direvoke saat diganti
  const revokeIfBlob = (url?: string) => {
    if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Seed default & previews awal dari form.* (string URL dari API)
  useEffect(() => {
    if (mounted && !isInitialized) {
      if (!form.id) {
        setForm({ ...form, status: form.status ?? true });
      }
      if (form.weight !== undefined && form.weight !== null) {
        setWeightText(String(form.weight).replace(".", ","));
      }
      // set previews dari URL jika ada
      setPreviews((prev) => {
        const next = { ...prev };
        IMAGE_KEYS.forEach((k) => {
          const val = form[k as keyof Product];
          if (typeof val === "string" && val) {
            next[k] = val;
          }
        });
        return next;
      });
      setIsInitialized(true);
    }
  }, [mounted, isInitialized, form, setForm]);

  // Revoke blob URL saat unmount
  useEffect(() => {
    return () => {
      IMAGE_KEYS.forEach((k) => revokeIfBlob(previews[k]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: categoryResponse, isLoading: categoryLoading } =
    useGetProductCategoryListQuery({ page: 1, paginate: 100 });

  const { data: merkResponse, isLoading: merkLoading } =
    useGetProductMerkListQuery({ page: 1, paginate: 100 });

  const categoryData = categoryResponse?.data ?? [];
  const merkData = merkResponse?.data ?? [];

  const selectedMerk = useMemo(
    () => merkData.find((m) => m.id === form.product_merk_id),
    [merkData, form.product_merk_id]
  );
  const isJasaMerk = selectedMerk?.name?.toLowerCase() === "jasa";

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0">
          <h2 className="text-lg font-semibold">Loading...</h2>
          <Button variant="ghost" onClick={onCancel}>
            ✕
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Helper render preview + input file
  const renderImageField = (
    imageKey: ImageKey,
    label: string,
    required = false
  ) => {
    const previewUrl = previews[imageKey];
    const imageValue = form[imageKey as keyof Product];
    const isFileSelected = imageValue instanceof File;

    return (
      <div className="flex flex-col gap-y-2">
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        {/* Preview */}
        {previewUrl ? (
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 relative border rounded overflow-hidden bg-muted">
              <Image
                src={previewUrl}
                alt={label}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            {!readonly && (
              <span className="text-xs text-gray-500">
                {isFileSelected
                  ? "(belum diunggah, file baru dipilih)"
                  : "(gambar saat ini)"}
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500">Belum ada gambar</span>
        )}

        {/* Input file (edit only) */}
        {!readonly && (
          <Input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              // Revoke blob lama kalau ada
              revokeIfBlob(previews[imageKey]);
              // Set file ke form (agar submit kirim file baru)
              setForm({ ...form, [imageKey]: file });
              // Buat blob preview baru
              const url = URL.createObjectURL(file);
              setPreviews((p) => ({ ...p, [imageKey]: url }));
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-700 flex-shrink-0">
        <h2 className="text-lg font-semibold">
          {readonly
            ? "Detail Produk"
            : form.id
            ? "Edit Produk"
            : "Tambah Produk"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-y-1">
            <Label>Kategori Produk</Label>
            {readonly ? (
              <Input
                readOnly
                value={
                  categoryData.find((c) => c.id === form.product_category_id)
                    ?.name ?? "-"
                }
              />
            ) : (
              <Combobox
                value={form.product_category_id ?? null}
                onChange={(val) =>
                  setForm({ ...form, product_category_id: val })
                }
                data={categoryData}
                isLoading={categoryLoading}
                getOptionLabel={(item) => item.name}
                placeholder="Pilih Kategori Produk"
                key={`category-${mounted}`}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>Merk Produk</Label>
            {readonly ? (
              <Input
                readOnly
                value={
                  merkData.find((m) => m.id === form.product_merk_id)?.name ??
                  "-"
                }
              />
            ) : (
              <Combobox
                value={form.product_merk_id ?? null}
                onChange={(val) => setForm({ ...form, product_merk_id: val })}
                data={merkData}
                isLoading={merkLoading}
                getOptionLabel={(item) => item.name}
                placeholder="Pilih Merk Produk"
                key={`merk-${mounted}`}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-1 col-span-2">
            <Label>Nama</Label>
            <Input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1 col-span-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>
              Harga {isJasaMerk && <span className="text-red-500">*</span>}
            </Label>
            <Input
              type="text"
              inputMode="numeric"
              value={
                form.price !== undefined &&
                form.price !== null &&
                form.price > 0
                  ? formatNumber(form.price)
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/\./g, "");
                const numberValue = Number(raw);
                setForm({ ...form, price: raw === "" ? 0 : numberValue });
              }}
              readOnly={readonly}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <Label>{isJasaMerk ? "Durasi" : "Stok"}</Label>
            <Input
              type="number"
              value={form.duration ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              readOnly={readonly}
            />
          </div>

          {/* Non-Jasa fields */}
          {!isJasaMerk && (
            <>
              <div className="flex flex-col gap-y-1">
                <Label>Berat</Label>
                {readonly ? (
                  <Input
                    readOnly
                    value={
                      form.weight !== undefined && form.weight !== null
                        ? String(form.weight)
                        : ""
                    }
                  />
                ) : (
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="contoh: 1,2 atau 1.2"
                    value={weightText}
                    onChange={(e) => {
                      const v = e.target.value;
                      setWeightText(v);
                      const parsed = parseFlexibleDecimal(v);
                      setForm({ ...form, weight: parsed });
                    }}
                  />
                )}
              </div>

              <div className="flex flex-col gap-y-1">
                <Label>Panjang</Label>
                <Input
                  type="number"
                  value={form.length ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      length: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  readOnly={readonly}
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label>Width</Label>
                <Input
                  type="number"
                  value={form.width ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      width: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  readOnly={readonly}
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label>Height</Label>
                <Input
                  type="number"
                  value={form.height ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      height: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  readOnly={readonly}
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label>Diameter</Label>
                <Input
                  type="number"
                  value={form.diameter ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      diameter: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  readOnly={readonly}
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-y-1">
            <Label>Status</Label>
            <select
              className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600"
              value={form.status ? "1" : "0"}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value === "1" })
              }
              disabled={readonly}
            >
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>
          </div>

          {/* Image Upload + Preview */}
          {IMAGE_KEYS.map((k, idx) =>
            renderImageField(k, `Gambar ${idx + 1}`, idx === 0)
          )}
        </div>
      </div>

      {/* Footer */}
      {!readonly && (
        <div className="p-6 border-t border-gray-200 dark:border-zinc-700 flex justify-end gap-2 flex-shrink-0">
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      )}
    </div>
  );
}