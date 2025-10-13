"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useModal from "@/hooks/use-modal";
import {
  useGetTutorialListQuery,
  useCreateTutorialMutation,
  useUpdateTutorialMutation,
  useDeleteTutorialMutation,
} from "@/services/admin/tutorial.service";
import { Tutorial } from "@/types/admin/tutorial";
import FormTutorial from "@/components/form-modal/admin/tutorial-form";
import Image from "next/image";

export default function TutorialPage() {
  const [form, setForm] = useState<Partial<Tutorial>>();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [readonly, setReadonly] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useGetTutorialListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const tutorialList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [createTutorial, { isLoading: isCreating }] =
    useCreateTutorialMutation();
  const [updateTutorial, { isLoading: isUpdating }] =
    useUpdateTutorialMutation();
  const [deleteTutorial] = useDeleteTutorialMutation();

  const handleSubmit = async () => {
    try {
      if (!form) {
        Swal.fire("Gagal", "Form tidak boleh kosong", "error");
        return;
      }
      const payload = new FormData();
      if (form.order) payload.append("order", form.order.toString());
      if (form.title) payload.append("title", form.title);
      if (form.slug) payload.append("slug", form.slug);
      if (form.content) payload.append("content", form.content);
      if (form.link_youtube) payload.append("link_youtube", form.link_youtube);
      if (form.published_at) payload.append("published_at", form.published_at);
      if (form.image instanceof File) {
        payload.append("image", form.image);
      }

      if (editingSlug) {
        await updateTutorial({ slug: editingSlug, payload }).unwrap();
        Swal.fire("Sukses", "Tutorial diperbarui", "success");
      } else {
        await createTutorial(payload).unwrap();
        Swal.fire("Sukses", "Tutorial ditambahkan", "success");
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

  const handleEdit = (item: Tutorial) => {
    setForm(item); // Fix: Added missing parameter
    setEditingSlug(item.slug.toString());
    setReadonly(false);
    openModal();
  };

  const handleDetail = (item: Tutorial) => {
    setForm(item);
    setReadonly(true);
    openModal();
  };

  const handleLink = (link: string) => {
    if (link) {
      window.open(link, "_blank");
    } else {
      Swal.fire("Info", "Link tidak tersedia", "info");
    }
  };

  const handleDelete = async (item: Tutorial) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Tutorial?",
      text: item.title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteTutorial(item.id.toString()).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Tutorial dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Tutorial", "error");
        console.error(error);
      }
    }
  };

  const handleAddNew = () => {
    setForm(undefined); // Reset form for new tutorial
    setEditingSlug(null);
    setReadonly(false);
    openModal();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Tutorial</h1>
        <Button onClick={handleAddNew}>Tambah Tutorial</Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Link Youtube</th>
                <th className="px-4 py-2">Gambar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : tutorialList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                tutorialList.map((item) => (
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
                    <td className="px-4 py-2">{item.order}</td>
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.content}</td>
                    <td className="px-4 py-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleLink(item.link_youtube)}
                      >
                        [🎬] Tonton
                      </Button>
                    </td>
                    <td className="px-4 py-2">
                      {typeof item.image === "string" && item.image !== "" ? (
                        <Image
                          src={item.image}
                          alt={item.title}
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
          <FormTutorial
            form={form}
            setForm={setForm}
            onCancel={() => {
              setForm(undefined); // Fix: Reset form properly
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