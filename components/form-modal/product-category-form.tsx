"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ProductCategory } from "@/types/master/product-category";
import Image from "next/image";

interface FormProductCategoryProps {
  form: Partial<ProductCategory>;
  setForm: (data: Partial<ProductCategory>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  readonly?: boolean;
  isLoading?: boolean;
}

export default function FormProductCategory({
  form,
  setForm,
  onCancel,
  onSubmit,
  readonly = false,
  isLoading = false,
}: FormProductCategoryProps) {
  useEffect(() => {
    if (!form.id && (form.status === undefined || form.parent_id === undefined)) {
      setForm({
        ...form,
        status: form.status ?? true,
        parent_id: form.parent_id ?? null,
      });
    }
  });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {readonly
            ? "Detail Kategori Produk"
            : form.id
            ? "Edit Kategori Produk"
            : "Tambah Kategori Produk"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            readOnly={readonly}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <Label>Status</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
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

        <div className="flex flex-col gap-y-1">
          <Label>Parent ID (optional)</Label>
          <Input
            type="number"
            value={form.parent_id ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                parent_id: e.target.value ? Number(e.target.value) : null,
              })
            }
            readOnly={readonly}
          />
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Upload Gambar</Label>
          {readonly ? (
            form.image && typeof form.image === "string" ? (
              <Image
                src={form.image}
                alt="Preview"
                className="h-20 object-contain"
                width={200}
                height={200}
              />
            ) : (
              <span className="text-sm text-gray-500">Tidak ada gambar</span>
            )
          ) : (
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setForm({ ...form, image: file });
              }}
            />
          )}
        </div>
      </div>

      {!readonly && (
        <div className="pt-4 flex justify-end gap-2">
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