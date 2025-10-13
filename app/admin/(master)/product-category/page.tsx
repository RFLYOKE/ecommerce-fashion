"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import {
  useGetProductCategoryListQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} from "@/services/master/product-category.service";
import { ProductCategory } from "@/types/master/product-category";
import FormProductCategory from "@/components/form-modal/product-category-form";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProductCategoryPage() {
  const [form, setForm] = useState<Partial<ProductCategory>>({
    status: true,
  });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [readonly, setReadonly] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useGetProductCategoryListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [createCategory, { isLoading: isCreating }] =
    useCreateProductCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateProductCategoryMutation();
  const [deleteCategory] = useDeleteProductCategoryMutation();

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      if (form.name) payload.append("name", form.name);
      if (form.description) payload.append("description", form.description);
      if (form.parent_id) payload.append("parent_id", `${form.parent_id}`);
      if (typeof form.status === "boolean") {
        payload.append("status", form.status ? "1" : "0");
      }
      if (form.image instanceof File) {
        payload.append("image", form.image);
      }

      if (editingSlug) {
        await updateCategory({ slug: editingSlug, payload }).unwrap();
        Swal.fire("Sukses", "Kategori diperbarui", "success");
      } else {
        await createCategory(payload).unwrap();
        Swal.fire("Sukses", "Kategori ditambahkan", "success");
      }

      setForm({ status: true });
      setEditingSlug(null);
      await refetch();
      closeModal();
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal", "Gagal menyimpan data", "error");
    }
  };

  const handleEdit = (item: ProductCategory) => {
    setForm({ ...item, status: item.status === true || item.status === 1 });
    setEditingSlug(item.slug.toString());
    setReadonly(false);
    openModal();
  };

  const handleDetail = (item: ProductCategory) => {
    setForm(item);
    setReadonly(true);
    openModal();
  };

  const handleDelete = async (item: ProductCategory) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus kategori?",
      text: item.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCategory(item.slug.toString()).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Kategori dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus kategori", "error");
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Kategori Produk</h1>
        <Button onClick={() => openModal()}>Tambah Kategori</Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Gambar</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : categoryList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">
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
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">
                      {typeof item.image === "string" && item.image !== "" ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 object-cover rounded"
                          width={48}
                          height={48}
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Tidak ada gambar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
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
          <FormProductCategory
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