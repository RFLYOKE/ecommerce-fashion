"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import {
  useGetProductListQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/services/admin/product.service";
import { useGetProductMerkListQuery } from "@/services/master/product-merk.service";
import { Product } from "@/types/admin/product";
import FormProduct from "@/components/form-modal/admin/product-form";
import { Badge } from "@/components/ui/badge";
import { formatRupiahWithRp } from "@/lib/format-utils";

export default function ProductPage() {
  const [form, setForm] = useState<Partial<Product>>({
    status: true,
  });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [readonly, setReadonly] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useGetProductListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const { data: merkData } = useGetProductMerkListQuery({
    page: 1,
    paginate: 100,
  });

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);
  const merkList = useMemo(() => merkData?.data || [], [merkData]);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleSubmit = async () => {
    try {
      const payload = new FormData();

      // === VALIDATION ===
      if (!form.name || form.name.trim() === "") {
        throw new Error("Nama produk wajib diisi");
      }
      if (!form.product_category_id) {
        throw new Error("Kategori produk wajib dipilih");
      }
      if (!form.product_merk_id) {
        throw new Error("Merk produk wajib dipilih");
      }

      const selectedMerk = merkList?.find((m) => m.id === form.product_merk_id);
      const isJasaMerk = selectedMerk?.name?.toLowerCase() === "jasa";
      if (isJasaMerk) {
        if (!form.price || form.price <= 0) {
          throw new Error(
            "Harga wajib diisi dan harus lebih dari 0 untuk layanan Jasa"
          );
        }
      }

      // === REQUIRED & SCALAR FIELDS ===
      payload.append("shop_id", "1");
      payload.append("name", form.name!);
      if (form.description) payload.append("description", form.description);
      payload.append("product_category_id", String(form.product_category_id));
      payload.append("product_merk_id", String(form.product_merk_id));
      if (typeof form.status === "boolean") {
        payload.append("status", form.status ? "1" : "0");
      }

      payload.append("price", String(form.price ?? 0));
      const durationValue = isJasaMerk
        ? form.duration ?? 0
        : form.duration ?? 1;
      payload.append("duration", String(durationValue));
      payload.append("weight", String(form.weight ?? 0));
      payload.append("length", String(form.length ?? 0));
      payload.append("width", String(form.width ?? 0));
      payload.append("height", String(form.height ?? 0));
      payload.append("diameter", String(form.diameter ?? 0));

      // === IMAGE HANDLING ===
      // Kirim HANYA file baru. Jangan kirim string URL lama.
      const imageFields = [
        "image",
        "image_2",
        "image_3",
        "image_4",
        "image_5",
        "image_6",
        "image_7",
      ] as const;

      if (editingSlug) {
        payload.append("_method", "PUT");
        imageFields.forEach((fieldName) => {
          const val = form[fieldName];
          if (val instanceof File) {
            payload.append(fieldName, val);
          }
        });

        await updateProduct({ slug: editingSlug, payload }).unwrap();
        Swal.fire("Sukses", "Produk diperbarui", "success");
      } else {
        // CREATE: butuh minimal 1 gambar utama
        if (!(form.image instanceof File)) {
          throw new Error("Minimal 1 gambar wajib diisi untuk produk baru");
        }
        imageFields.forEach((fieldName) => {
          const val = form[fieldName];
          if (val instanceof File) {
            payload.append(fieldName, val);
          }
        });

        await createProduct(payload).unwrap();
        Swal.fire("Sukses", "Produk ditambahkan", "success");
      }

      setForm({ status: true });
      setEditingSlug(null);
      await refetch();
      closeModal();
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire(
        "Gagal",
        error instanceof Error ? error.message : "Terjadi kesalahan",
        "error"
      );
    }
  };

  const handleEdit = (item: Product) => {
    setForm({ ...item, status: item.status === true || item.status === 1 });
    setEditingSlug(item.slug);
    setReadonly(false);
    openModal();
  };

  const handleDetail = (item: Product) => {
    setForm(item);
    setReadonly(true);
    openModal();
  };

  const handleDelete = async (item: Product) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Produk?",
      text: item.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteProduct(item.slug.toString()).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Produk dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Produk", "error");
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Data Produk</h1>
        <Button onClick={() => openModal()}>Tambah Produk</Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">Kategori</th>
                <th className="px-4 py-2">Merk</th>
                <th className="px-4 py-2">Produk</th>
                <th className="px-4 py-2">Harga</th>
                <th className="px-4 py-2">Stok</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2 whitespace-nowrap">T. Views</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : categoryList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                categoryList.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleDetail(item)}>
                          Detail
                        </Button>
                        <Button size="sm" onClick={() => handleEdit(item)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.category_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.merk_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatRupiahWithRp(item.price)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.duration}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.rating}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.total_reviews}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge variant={item.status ? "success" : "destructive"}>
                        {item.status ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

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
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <FormProduct
            form={form}
            setForm={setForm}
            onCancel={() => {
              setForm({ status: true });
              setEditingSlug(null);
              setReadonly(false);
              closeModal();
            }}
            onSubmit={handleSubmit}
            readonly={readonly}
            isLoading={isCreating || isUpdating}
          />
        </div>
      )}
    </div>
  );
}
