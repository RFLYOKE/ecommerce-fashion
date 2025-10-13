"use client";

import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetIncomeCategoryListQuery,
  useCreateIncomeCategoryMutation,
  useUpdateIncomeCategoryMutation,
  useDeleteIncomeCategoryMutation,
} from "@/services/admin/income-category.service";
import { IncomeCategory, CreateIncomeCategoryRequest } from "@/types/admin/income-category";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

export default function KategoriPemasukanPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState<CreateIncomeCategoryRequest>({
    name: "",
    description: "",
    status: 1,
  });

  const { data, isLoading, refetch } = useGetIncomeCategoryListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [createCategory] = useCreateIncomeCategoryMutation();
  const [updateCategory] = useUpdateIncomeCategoryMutation();
  const [deleteCategory] = useDeleteIncomeCategoryMutation();


  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      status: 1,
    });
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: IncomeCategory) => {
    setForm({
      name: category.name,
      description: category.description,
      status: category.status ? 1 : 0,
    });
    setIsEditMode(true);
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Swal.fire("Error", "Nama kategori harus diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && editingId) {
        await updateCategory({
          id: editingId,
          payload: form,
        }).unwrap();
        Swal.fire("Berhasil", "Kategori pemasukan berhasil diperbarui", "success");
      } else {
        await createCategory(form).unwrap();
        Swal.fire("Berhasil", "Kategori pemasukan berhasil ditambahkan", "success");
      }
      
      await refetch();
      handleCloseModal();
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error && 
        error.data && typeof error.data === 'object' && 'message' in error.data
        ? String(error.data.message)
        : "Terjadi kesalahan";
      Swal.fire("Gagal", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: IncomeCategory) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus kategori?",
      text: `"${category.name}" akan dihapus secara permanen`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCategory(category.id).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Kategori pemasukan berhasil dihapus", "success");
      } catch (error: unknown) {
        const errorMessage = error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'message' in error.data
          ? String(error.data.message)
          : "Gagal menghapus kategori";
        Swal.fire("Gagal", errorMessage, "error");
      }
    }
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Aktif
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        Nonaktif
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori Pemasukan</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola kategori untuk data pemasukan</p>
        </div>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>


      {/* Category List */}
      <Card className="shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Kategori</h2>
          <p className="text-sm text-gray-600 mt-1">
            {data ? `Total ${data.total} kategori` : 'Memuat data...'}
          </p>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Aksi</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">ID</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Nama</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Deskripsi</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Dibuat</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Diperbarui</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : categoryList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Tag className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="text-gray-500">Tidak ada kategori</span>
                    </div>
                  </td>
                </tr>
              ) : (
                categoryList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEditModal(item)}
                          className="flex items-center gap-1 h-8 px-3"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                          className="flex items-center gap-1 h-8 px-3"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-sm text-gray-600" title={item.description}>
                        {item.description || <span className="text-gray-400 italic">-</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {new Date(item.updated_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        <div className="px-6 py-4 flex items-center justify-between bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Menampilkan halaman <span className="font-semibold text-gray-900">{currentPage}</span> dari{" "}
            <span className="font-semibold text-gray-900">{lastPage}</span>
            {data && (
              <span className="ml-2">
                • Total <span className="font-semibold text-gray-900">{data.total}</span> kategori
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-9 px-4"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={currentPage >= lastPage}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-9 px-4"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Tag className="h-5 w-5 text-blue-600" />
              </div>
              {isEditMode ? 'Edit Kategori Pemasukan' : 'Tambah Kategori Pemasukan'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nama Kategori *
              </Label>
              <Input
                id="name"
                placeholder="Masukkan nama kategori..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi kategori..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <Select
                value={form.status.toString()}
                onValueChange={(value) => setForm({ ...form, status: parseInt(value) })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Aktif</SelectItem>
                  <SelectItem value="0">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="h-10 px-6"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !form.name.trim()}
              className="h-10 px-6"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditMode ? 'Memperbarui...' : 'Menyimpan...'}
                </div>
              ) : (
                isEditMode ? 'Perbarui' : 'Simpan'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
