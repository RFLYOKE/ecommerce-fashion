"use client";

import { useMemo, useState } from "react";
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
import {
  useGetIncomeListQuery,
  useGetIncomeByIdQuery,
  useCreateIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
  CreateIncomeRequest,
  UpdateIncomeRequest,
} from "@/services/admin/income.service";
import { useGetIncomeCategoryListQuery } from "@/services/admin/income-category.service";
import { Income } from "@/types/admin/income";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Calendar, DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";

export default function DataPemasukanPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncomeId, setSelectedIncomeId] = useState<number | null>(null);

  // Form state
  const [form, setForm] = useState<CreateIncomeRequest>({
    amount: 0,
    received_at: "", // Changed from incurred_at to received_at
    note: "",
    category: "",
  });

  // Helper function to format currency in Rupiah
  const formatRupiah = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return 'Rp 0';
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount).replace('IDR', 'Rp');
  };

  // Helper function to format datetime to Indonesian format
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(date);
    } catch (error) {
      return String(error);
    }
  };

  // Helper function to format date only
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    } catch (error) {
      return String(error);
    }
  };

  const { data, isLoading, refetch } = useGetIncomeListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: searchTerm || undefined,
  });

  // Get income categories for form
  const { data: categoryData } = useGetIncomeCategoryListQuery({
    page: 1,
    paginate: 100, // Get all categories
  });

  // Get income detail when selectedIncomeId is set
  const { data: incomeDetail, isLoading: isLoadingDetail } = useGetIncomeByIdQuery(
    selectedIncomeId!,
    {
      skip: !selectedIncomeId,
    }
  );

  const [createIncome] = useCreateIncomeMutation();
  const [updateIncome] = useUpdateIncomeMutation();
  const [deleteIncome] = useDeleteIncomeMutation();

  const incomeList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const handleViewDetail = (income: Income) => {
    setSelectedIncome(income);
    setSelectedIncomeId(income.id);
    setIsDetailModalOpen(true);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    refetch();
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetForm = () => {
    setForm({
      amount: 0,
      received_at: "", // Changed from incurred_at to received_at
      note: "",
      category: "",
    });
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (income: Income) => {
    setForm({
      amount: income.amount,
      received_at: income.received_at.split('T')[0], // Convert to YYYY-MM-DD format
      note: income.note,
      category: income.category?.name || "",
    });
    setIsEditMode(true);
    setEditingId(income.id);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!form.amount || form.amount <= 0) {
      Swal.fire("Error", "Jumlah harus diisi dan lebih dari 0", "error");
      return;
    }
    if (!form.received_at) { // Changed from incurred_at to received_at
      Swal.fire("Error", "Tanggal harus diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (isEditMode && editingId) {
        await updateIncome({
          id: editingId,
          payload: payload as UpdateIncomeRequest,
        }).unwrap();
        Swal.fire("Berhasil", "Data pemasukan berhasil diperbarui", "success");
      } else {
        await createIncome(payload).unwrap();
        Swal.fire("Berhasil", "Data pemasukan berhasil ditambahkan", "success");
      }
      
      await refetch();
      handleCloseFormModal();
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

  const handleDelete = async (income: Income) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus data pemasukan?",
      text: `Pemasukan sebesar ${formatRupiah(income.amount)} akan dihapus secara permanen`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteIncome(income.id).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Data pemasukan berhasil dihapus", "success");
      } catch (error: unknown) {
        const errorMessage = error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'message' in error.data
          ? String(error.data.message)
          : "Gagal menghapus data pemasukan";
        Swal.fire("Gagal", errorMessage, "error");
      }
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pemasukan</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola dan pantau semua data pemasukan</p>
        </div>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Pemasukan
        </Button>
      </div>

      {/* Search Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Cari Pemasukan
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Cari berdasarkan catatan, kategori, atau ID pemasukan
              </p>
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Masukkan kata kunci pencarian..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearch} 
                className="flex items-center gap-2 h-11 px-6"
              >
                <Search className="h-4 w-4" />
                Cari
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income List */}
      <Card className="shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Pemasukan</h2>
          <p className="text-sm text-gray-600 mt-1">
            {data ? `Total ${data.total} data pemasukan` : 'Memuat data...'}
          </p>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Aksi</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">ID</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Kategori</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Jumlah</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Tanggal Diterima</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Catatan</th>
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Tanggal Dibuat</th>
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
              ) : incomeList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="text-gray-500">Tidak ada data pemasukan</span>
                    </div>
                  </td>
                </tr>
              ) : (
                incomeList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(item)}
                          className="flex items-center gap-1 h-8 px-3"
                        >
                          <Eye className="h-3 w-3" />
                          Detail
                        </Button>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        #{item.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.category ? (
                        <Badge variant="secondary" className="text-xs">
                          {item.category.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      {formatRupiah(item.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                      {formatDate(item.received_at)}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      {item.note ? (
                        <p className="truncate text-sm text-gray-700" title={item.note}>
                          {item.note}
                        </p>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {formatDateTime(item.created_at)}
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
                • Total <span className="font-semibold text-gray-900">{data.total}</span> data
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

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              Detail Pemasukan #{selectedIncome?.id}
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingDetail ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-500">Memuat detail pemasukan...</span>
              </div>
            </div>
          ) : incomeDetail ? (
            <div className="space-y-6">
              {/* Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    ID Pemasukan
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-mono text-lg font-semibold">#{incomeDetail.id}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Jumlah
                  </Label>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {formatRupiah(incomeDetail.amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Kategori
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {incomeDetail.category ? (
                      <Badge variant="secondary" className="text-sm">
                        {incomeDetail.category.name}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 italic">Tidak ada kategori</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Tanggal Diterima
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      {formatDate(incomeDetail.received_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Source Info */}
              {incomeDetail.source_type && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Sumber
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">
                        {incomeDetail.source_type}
                      </Badge>
                      {incomeDetail.source_id && (
                        <span className="text-sm text-gray-600">
                          ID: {incomeDetail.source_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Catatan
                </Label>
                <div className="p-4 bg-gray-50 rounded-lg min-h-[80px]">
                  {incomeDetail.note ? (
                    <p className="text-gray-700 leading-relaxed">{incomeDetail.note}</p>
                  ) : (
                    <span className="text-gray-500 italic">Tidak ada catatan</span>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Dibuat
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{formatDateTime(incomeDetail.created_at)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Diperbarui
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{formatDateTime(incomeDetail.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-red-400" />
                </div>
                <span className="text-gray-500">Gagal memuat detail pemasukan</span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
              className="h-10 px-6"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              {isEditMode ? 'Edit Data Pemasukan' : 'Tambah Data Pemasukan'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Jumlah *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Masukkan jumlah..."
                  value={form.amount || ""}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="received_at" className="text-sm font-medium text-gray-700">
                  Tanggal Diterima *
                </Label>
                <Input
                  id="received_at"
                  type="date"
                  value={form.received_at}
                  onChange={(e) => setForm({ ...form, received_at: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Kategori
              </Label>
              <Select
                value={form.category || "none"}
                onValueChange={(value) => setForm({ ...form, category: value === "none" ? "" : value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Pilih kategori (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada kategori</SelectItem>
                  {categoryData?.data?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium text-gray-700">
                Catatan
              </Label>
              <Textarea
                id="note"
                placeholder="Masukkan catatan..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCloseFormModal}
              disabled={isSubmitting}
              className="h-10 px-6"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !form.amount || !form.received_at}
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
