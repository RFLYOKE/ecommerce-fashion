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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetTokoListQuery,
  useDeleteTokoMutation,
  useUpdateTokoStatusMutation,
} from "@/services/admin/toko.service";
import { Toko } from "@/types/admin/toko";
import { Badge } from "@/components/ui/badge";

// Status mapping for boolean values
type TokoStatusInfo = { 
  label: string; 
  variant: "secondary" | "default" | "success" | "destructive" 
};

const TOKO_STATUS: Record<string, TokoStatusInfo> = {
  "false": { label: "Pending", variant: "secondary" },
  "true": { label: "Diterima", variant: "success" },
};

export default function TokoPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedToko, setSelectedToko] = useState<Toko | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { data, isLoading, refetch } = useGetTokoListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [deleteToko] = useDeleteTokoMutation();
  const [updateTokoStatus] = useUpdateTokoStatusMutation();

  const handleDelete = async (item: Toko) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Toko?",
      text: item.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteToko(item.id.toString()).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Toko dihapus", "success");
      } catch (error) {
        console.log(error);
        Swal.fire("Gagal", "Gagal menghapus Toko", "error");
      }
    }
  };

  const handleStatusClick = (toko: Toko) => {
    setSelectedToko(toko);
    // Convert status to string for the select component
    setNewStatus(toko.status.toString());
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedToko) return;

    setIsUpdatingStatus(true);
    try {
      // Convert string to boolean for API
      const booleanStatus = newStatus === "true";
      
      await updateTokoStatus({
        slug: selectedToko.slug.toString(),
        status: booleanStatus,
      }).unwrap();

      await refetch();
      setIsModalOpen(false);
      setSelectedToko(null);
      Swal.fire("Berhasil", "Status toko berhasil diubah", "success");
    } catch (error) {
      Swal.fire("Gagal", "Gagal mengubah status toko", "error");
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusInfo = (status: number | boolean) => {
    // Convert status to string for lookup
    const statusKey = status.toString();
    return TOKO_STATUS[statusKey] || { label: "Unknown", variant: "secondary" };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Data Toko</h1>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">Aksi</th>
                <th className="px-2 py-2 whitespace-nowrap">Nama</th>
                <th className="px-2 py-2 whitespace-nowrap">No. Hanphone</th>
                <th className="px-2 py-2 whitespace-nowrap">Email</th>
                <th className="px-2 py-2 whitespace-nowrap">Alamat</th>
                <th className="px-2 py-2 whitespace-nowrap">Rating</th>
                <th className="px-2 py-2 whitespace-nowrap">Total Ulasan</th>
                <th className="px-4 py-2 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : categoryList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                categoryList.map((item) => {
                  const statusInfo = getStatusInfo(item.status);
                  return (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.user_name}</td>
                      <td className="px-4 py-2">{item.phone}</td>
                      <td className="px-4 py-2">{item.email}</td>
                      <td className="px-4 py-2">{item.address}</td>
                      <td className="px-4 py-2">{item.rating}</td>
                      <td className="px-4 py-2">{item.total_reviews}</td>
                      <td className="px-4 py-2">
                        <Badge 
                          variant={statusInfo.variant}
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => handleStatusClick(item)}
                        >
                          {statusInfo.label}
                        </Badge>
                      </td>
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

      {/* Status Update Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Status Toko</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Toko: {selectedToko?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Customer: {selectedToko?.user_name}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Pilih Status Baru:
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Pending</SelectItem>
                  <SelectItem value="true">Diterima</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isUpdatingStatus}
              >
                Batal
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Memperbarui..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}