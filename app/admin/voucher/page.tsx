"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import useModal from "@/hooks/use-modal";
import { Voucher } from "@/types/voucher";
import {
  useGetVoucherListQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} from "@/services/voucher.service";
import VoucherForm from "@/components/form-modal/voucher-form";

export default function VoucherPage() {
  const [form, setForm] = useState<Partial<Voucher>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"semua" | "aktif" | "tidak">(
    "semua"
  );
  const [page, setPage] = useState(1);
  const { isOpen, openModal, closeModal } = useModal();

  const { data, isLoading, refetch } = useGetVoucherListQuery({
    page,
    paginate: 10,
  });

  const [createVoucher] = useCreateVoucherMutation();
  const [updateVoucher] = useUpdateVoucherMutation();
  const [deleteVoucher] = useDeleteVoucherMutation();

  const handleSubmit = async () => {
    try {
      const payload = {
        code: form.code ?? "",
        name: form.name ?? "",
        description: form.description ?? "",
        fixed_amount: form.fixed_amount ?? 0,
        percentage_amount: form.percentage_amount ?? 0,
        type: form.type ?? "fixed",
        start_date: form.start_date ?? "",
        end_date: form.end_date ?? "",
        usage_limit: form.usage_limit ?? 0,
        status: form.status ?? true,
      };

      if (editingId !== null) {
        await updateVoucher({ id: editingId, payload });
        Swal.fire("Berhasil", "Data berhasil diperbarui.", "success");
      } else {
        await createVoucher(payload);
        Swal.fire("Berhasil", "Data berhasil ditambahkan.", "success");
      }

      setForm({});
      setEditingId(null);
      closeModal();
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  const handleEdit = (item: Voucher) => {
    setForm({ ...item });
    setEditingId(item.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteVoucher(id);
      refetch();
      Swal.fire("Terhapus", "Data berhasil dihapus.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
    }
  };

  const toggleStatus = async (item: Voucher) => {
    try {
      await updateVoucher({
        id: item.id,
        payload: { status: !item.status },
      });
      refetch();
      Swal.fire("Berhasil", "Status berhasil diperbarui.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal mengubah status.", "error");
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as typeof filterStatus;
    setFilterStatus(value);
  };

  const list = data?.data || [];
  const lastPage = data?.pageTotal || 1;

  const filteredList = list.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "semua" ||
      (filterStatus === "aktif" && item.status === true) ||
      (filterStatus === "tidak" && item.status === false);
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Voucher</h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Input
          placeholder="Cari nama voucher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={filterStatus}
            onChange={handleStatusChange}
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak">Tidak Aktif</option>
          </select>
          <Button
            onClick={() => {
              setForm({});
              setEditingId(null);
              openModal();
            }}
          >
            + Tambah Voucher
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Aksi</th>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Kode</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Deskripsi</th>
                <th className="px-4 py-2">Tipe</th>
                <th className="px-4 py-2">Jumlah</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Tidak ada data yang cocok.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2 space-x-2">
                      <Button size="sm" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        Hapus
                      </Button>
                    </td>
                    <td className="px-4 py-2">{(page - 1) * 10 + idx + 1}</td>
                    <td className="px-4 py-2">{item.code}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2 capitalize">{item.type}</td>
                    <td className="px-4 py-2">
                      {item.type === "fixed"
                        ? `Rp${item.fixed_amount.toLocaleString("id-ID")}`
                        : `${item.percentage_amount}%`}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={item.status ? "success" : "destructive"}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(item)}
                      >
                        {item.status ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>

        <div className="p-4 flex items-center justify-between gap-2 bg-muted">
          <div className="text-sm text-muted-foreground">
            Halaman <strong>{page}</strong> dari <strong>{lastPage}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <VoucherForm
            form={form}
            setForm={setForm}
            onCancel={closeModal}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}