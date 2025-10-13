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
  useGetExpenseListQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from "@/services/admin/expense.service";
import { useGetExpenseCategoryListQuery } from "@/services/admin/expense-category.service";
import { Expense } from "@/types/admin/expense";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Calendar, CreditCard, Plus, Edit, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";

export default function DataPengeluaranPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

  // Form state
  const [form, setForm] = useState<CreateExpenseRequest>({
    amount: 0,
    incurred_at: "",
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

  const { data, isLoading, refetch } = useGetExpenseListQuery({
    page: currentPage,
    paginate: itemsPerPage,
    search: searchTerm || undefined,
  });

  // Get expense categories for form
  const { data: categoryData } = useGetExpenseCategoryListQuery({
    page: 1,
    paginate: 100, // Get all categories
  });

  // Get expense detail when selectedExpenseId is set
  const { data: expenseDetail, isLoading: isLoadingDetail } = useGetExpenseByIdQuery(
    selectedExpenseId!,
    {
      skip: !selectedExpenseId,
    }
  );

  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();

  const expenseList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const handleViewDetail = (expense: Expense) => {
    setSelectedExpense(expense);
    setSelectedExpenseId(expense.id);
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
      incurred_at: "",
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

  const handleOpenEditModal = (expense: Expense) => {
    setForm({
      amount: expense.amount,
      incurred_at: expense.incurred_at.split('T')[0], // Convert to YYYY-MM-DD format
      note: expense.note,
      category: expense.category?.name || "",
    });
    setIsEditMode(true);
    setEditingId(expense.id);
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
    if (!form.incurred_at) {
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
        await updateExpense({
          id: editingId,
          payload: payload as UpdateExpenseRequest,
        }).unwrap();
        Swal.fire("Berhasil", "Data pengeluaran berhasil diperbarui", "success");
      } else {
        await createExpense(payload).unwrap();
        Swal.fire("Berhasil", "Data pengeluaran berhasil ditambahkan", "success");
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

  const handleDelete = async (expense: Expense) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus data pengeluaran?",
      text: `Pengeluaran sebesar ${formatRupiah(expense.amount)} akan dihapus secara permanen`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteExpense(expense.id).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Data pengeluaran berhasil dihapus", "success");
      } catch (error: unknown) {
        const errorMessage = error && typeof error === 'object' && 'data' in error && 
          error.data && typeof error.data === 'object' && 'message' in error.data
          ? String(error.data.message)
          : "Gagal menghapus data pengeluaran";
        Swal.fire("Gagal", errorMessage, "error");
      }
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pengeluaran</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola dan pantau semua data pengeluaran</p>
        </div>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Pengeluaran
        </Button>
      </div>

      {/* Search Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Cari Pengeluaran
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Cari berdasarkan catatan, kategori, atau ID pengeluaran
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

      {/* Expense List */}
      <Card className="shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Pengeluaran</h2>
          <p className="text-sm text-gray-600 mt-1">
            {data ? `Total ${data.total} data pengeluaran` : 'Memuat data...'}
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
                <th className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Tanggal Terjadi</th>
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
              ) : expenseList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="text-gray-500">Tidak ada data pengeluaran</span>
                    </div>
                  </td>
                </tr>
              ) : (
                expenseList.map((item) => (
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
                    <td className="px-6 py-4 font-semibold text-red-600">
                      {formatRupiah(item.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                      {formatDate(item.incurred_at)}
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
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>
              Detail Pengeluaran #{selectedExpense?.id}
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingDetail ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-500">Memuat detail pengeluaran...</span>
              </div>
            </div>
          ) : expenseDetail ? (
            <div className="space-y-6">
              {/* Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    ID Pengeluaran
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-mono text-lg font-semibold">#{expenseDetail.id}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Jumlah
                  </Label>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {formatRupiah(expenseDetail.amount)}
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
                    {expenseDetail.category ? (
                      <Badge variant="secondary" className="text-sm">
                        {expenseDetail.category.name}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 italic">Tidak ada kategori</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Tanggal Terjadi
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      {formatDate(expenseDetail.incurred_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Source Info */}
              {expenseDetail.source_type && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Sumber
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">
                        {expenseDetail.source_type}
                      </Badge>
                      {expenseDetail.source_id && (
                        <span className="text-sm text-gray-600">
                          ID: {expenseDetail.source_id}
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
                  {expenseDetail.note ? (
                    <p className="text-gray-700 leading-relaxed">{expenseDetail.note}</p>
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
                    <p className="text-sm text-gray-600">{formatDateTime(expenseDetail.created_at)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Diperbarui
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{formatDateTime(expenseDetail.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-red-400" />
                </div>
                <span className="text-gray-500">Gagal memuat detail pengeluaran</span>
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
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>
              {isEditMode ? 'Edit Data Pengeluaran' : 'Tambah Data Pengeluaran'}
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
                <Label htmlFor="incurred_at" className="text-sm font-medium text-gray-700">
                  Tanggal Terjadi *
                </Label>
                <Input
                  id="incurred_at"
                  type="date"
                  value={form.incurred_at}
                  onChange={(e) => setForm({ ...form, incurred_at: e.target.value })}
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
              disabled={isSubmitting || !form.amount || !form.incurred_at}
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
