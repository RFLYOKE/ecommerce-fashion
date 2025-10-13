"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useModal from "@/hooks/use-modal";

import {
  useGetGalleryListQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} from "@/services/admin/gallery-admin.service";
import { GaleriItem } from "@/types/gallery";
import FormGallery from "@/components/form-modal/admin/gallery-form";

export default function GalleryPage() {
  const [form, setForm] = useState<Partial<GaleriItem>>();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [readonly, setReadonly] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useGetGalleryListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const list = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [createGallery, { isLoading: isCreating }] = useCreateGalleryMutation();
  const [updateGallery, { isLoading: isUpdating }] = useUpdateGalleryMutation();
  const [deleteGallery] = useDeleteGalleryMutation();

  const toText = (val?: string) => (val || "").replace(/\s+/g, " ").trim();

  const handleSubmit = async () => {
    try {
      if (!form) return;

      const payload = new FormData();
      if (form.title) payload.append("title", form.title);
      if (form.description) payload.append("description", form.description);
      if (form.published_at) payload.append("published_at", form.published_at);
      if (form.image instanceof File) payload.append("image", form.image);

      if (editingSlug) {
        await updateGallery({ slug: editingSlug, payload }).unwrap();
        Swal.fire("Sukses", "Galeri diperbarui", "success");
      } else {
        await createGallery(payload).unwrap();
        Swal.fire("Sukses", "Galeri ditambahkan", "success");
      }

      setForm(undefined);
      setEditingSlug(null);
      await refetch();
      closeModal();
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal", "Gagal menyimpan data", "error");
    }
  };

  const handleCreate = () => {
    setForm({
      title: "",
      description: "",
      published_at: "",
      image: "",
    });
    setEditingSlug(null);
    setReadonly(false);
    openModal();
  };

  const handleEdit = (item: GaleriItem) => {
    setForm(item);
    setEditingSlug(item.slug);
    setReadonly(false);
    openModal();
  };

  const handleDetail = (item: GaleriItem) => {
    setForm(item);
    setReadonly(true);
    setEditingSlug(item.slug);
    openModal();
  };

  const handleDelete = async (item: GaleriItem) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus galeri?",
      text: item.title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteGallery(item.slug).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Galeri dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus galeri", "error");
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Data Galeri</h1>
        <Button onClick={handleCreate}>Tambah Galeri</Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">Gambar</th>
                <th className="px-4 py-2">Judul</th>
                <th className="px-4 py-2">Published</th>
                <th className="px-4 py-2">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                list.map((item) => (
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
                    <td className="px-4 py-2">
                      {typeof item.image === "string" && item.image ? (
                        <div className="relative w-16 h-10 rounded overflow-hidden border">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Badge variant="secondary">–</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap max-w-[260px]">
                      <div className="font-medium">{item.title}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleString("id-ID")
                        : "—"}
                    </td>
                    <td className="px-4 py-2 max-w-[380px]">
                      <div className="text-muted-foreground line-clamp-2">
                        {toText(item.description)}
                      </div>
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
          <FormGallery
            form={form}
            setForm={(f) => setForm({ ...(form || {}), ...f })}
            onCancel={() => {
              setForm(undefined);
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