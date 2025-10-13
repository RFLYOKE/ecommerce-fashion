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
  useGetCustomerListQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "@/services/admin/customer.service";
import { Customer } from "@/types/admin/customer";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CustomerPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState<Customer>({
    id: 0,
    name: "",
    role_id: 0,
    phone: 0,
    email: "",
    password: "",
    password_confirmation: "",
    email_verified_at: "",
    status: 1,
    created_at: "",
    updated_at: "",
    roles: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to format datetime to Indonesian format
  const formatDateTime = (dateString: string) => {
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

  const { data, isLoading, refetch } = useGetCustomerListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  // Filter customer list to show only users with "user" role
  const customerList = useMemo(() => {
    const customers = data?.data || [];
    return customers.filter((customer: Customer) =>
      customer.roles && customer.roles.some((role: { name: string }) => role.name === "user")
    );
  }, [data]);

  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      role_id: 0,
      phone: 0,
      email: "",
      password: "",
      password_confirmation: "",
      email_verified_at: "",
      status: 1,
      created_at: "",
      updated_at: "",
      roles: [],
    });
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: Customer) => {
    setForm({
      id: user.id,
      name: user.name,
      role_id: user.role_id,
      phone: user.phone,
      email: user.email,
      password: user.password,
      password_confirmation: user.password_confirmation,
      email_verified_at: user.email_verified_at || "",
      created_at: user.created_at || "",
      updated_at: user.updated_at || "",
      roles: user.roles || [],
      status: user.status || 1,
    });
    setIsEditMode(true);
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.role_id) {
      Swal.fire("Error", "Nama, Email, dan Role harus diisi", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && editingId) {
        await updateCustomer({
          id: editingId,
          payload: form,
        }).unwrap();
        Swal.fire("Berhasil", "Customer berhasil diperbarui", "success");
      } else {
        await createCustomer(form).unwrap();
        Swal.fire("Berhasil", "Customer berhasil ditambahkan", "success");
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

  const handleDelete = async (user: Customer) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Customer?",
      text: `"${user.name}" akan dihapus secara permanen`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCustomer(user.id).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Customer berhasil dihapus", "success");
      } catch (error: unknown) {
        const errorMessage = error && typeof error === 'object' && 'data' in error &&
          error.data && typeof error.data === 'object' && 'message' in error.data
          ? String(error.data.message)
          : "Gagal menghapus Customer";
        Swal.fire("Gagal", errorMessage, "error");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Data Customer</h1>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Customer
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">Aksi</th>
                <th className="px-4 py-2 whitespace-nowrap">Nama</th>
                <th className="px-4 py-2 whitespace-nowrap">No. Hanphone</th>
                <th className="px-4 py-2 whitespace-nowrap">Email</th>
                <th className="px-4 py-2 whitespace-nowrap">Role</th>
                <th className="px-4 py-2 whitespace-nowrap">Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : customerList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Tidak ada data customer
                  </td>
                </tr>
              ) : (
                customerList.map((item) => {
                  const roleName = (item.roles as { name: string }[] | undefined)?.[0]?.name;
                  return (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">
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
                            className="h-8 px-3"
                          >
                            <Trash2 className="h-3 w-3" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.phone || "-"}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.email}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Badge variant="secondary">{roleName || "-"}</Badge>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{formatDateTime(item.created_at || "")}</td>
                    </tr>
                  );
                })
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

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Tag className="h-5 w-5 text-blue-600" />
              </div>
              {isEditMode ? 'Edit Customer' : 'Tambah Customer'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nama
              </Label>
              <Input
                id="name"
                placeholder="Masukkan nama..."
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email..."
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                No. Handphone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Masukkan nomor handphone..."
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: Number(e.target.value) })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password..."
                value={form.password || ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                Password Konfirmasi
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Masukkan password konfirmasi..."
                value={form.password_confirmation || ""}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <Select
                  onValueChange={(value) => setForm({ ...form, role_id: parseInt(value, 10) })}
                  value={form.role_id?.toString() || ""}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2" aria-selected={form.role_id === 2}>User</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="1" aria-selected={form.status === 1}>Aktif</SelectItem>
                    <SelectItem value="0" aria-selected={form.status === 0}>Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              disabled={isSubmitting || !form.name || !form.email || !form.role_id}
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