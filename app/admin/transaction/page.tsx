"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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
  useGetTransactionListQuery,
  useDeleteTransactionMutation,
  useUpdateTransactionStatusMutation,
  useGetTransactionByIdQuery,
  useUpdateReceiptCodeMutation,
} from "@/services/admin/transaction.service";
import { Transaction } from "@/types/admin/transaction";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Status enum mapping
type TransactionStatusKey = 0 | 1 | 2 | -1 | -2 | -3;
type TransactionStatusInfo = { label: string; variant: "secondary" | "default" | "success" | "destructive" };

const TRANSACTION_STATUS: Record<TransactionStatusKey, TransactionStatusInfo> = {
  0: { label: "PENDING", variant: "secondary" },
  1: { label: "CAPTURED", variant: "default" },
  2: { label: "SETTLEMENT", variant: "success" },
  [-1]: { label: "DENY", variant: "destructive" },
  [-2]: { label: "EXPIRED", variant: "destructive" },
  [-3]: { label: "CANCEL", variant: "destructive" },
};

export default function TransactionPage() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [receiptCode, setReceiptCode] = useState<string>("");
  const [shipmentStatus, setShipmentStatus] = useState<string>("0");
  const [isUpdatingReceipt, setIsUpdatingReceipt] = useState(false);

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

  // Helper function to handle payment link click
  const handlePaymentLinkClick = (paymentLink: string | null) => {
    if (paymentLink && paymentLink.trim()) {
      window.open(paymentLink, '_blank', 'noopener,noreferrer');
    }
  };

  const { data, isLoading, refetch } = useGetTransactionListQuery({
    page: currentPage,
    paginate: itemsPerPage,
  });

  const {
    data: transactionDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetTransactionByIdQuery(
    selectedTransactionId !== null ? selectedTransactionId.toString() : "",
    { skip: !selectedTransactionId }
  );
  // transactionDetail may be undefined, so add type assertion or optional chaining

  const categoryList = useMemo(() => data?.data || [], [data]);
  const lastPage = useMemo(() => data?.last_page || 1, [data]);

  const [deleteTransaction] = useDeleteTransactionMutation();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [updateReceiptCode] = useUpdateReceiptCodeMutation();

  const handleDelete = async (item: Transaction) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus Transaction?",
      text: item.reference,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteTransaction(item.id.toString()).unwrap();
        await refetch();
        Swal.fire("Berhasil", "Transaction dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus Transaction", "error");
        console.error(error);
      }
    }
  };

  const handleStatusClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewStatus(transaction.status.toString());
    setIsStatusModalOpen(true);
  };

  const handleDetailClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setIsDetailModalOpen(true);
  };

  const handleReceiptCodeClick = (storeId: number, currentReceiptCode: string | null, currentShipmentStatus: number = 0) => {
    setSelectedStoreId(storeId);
    setReceiptCode(currentReceiptCode || "");
    setShipmentStatus(currentShipmentStatus.toString());
    setIsReceiptModalOpen(true);
  };

  const handleReceiptCodeUpdate = async () => {
    if (!selectedStoreId || !receiptCode.trim()) {
      Swal.fire("Error", "Nomor resi tidak boleh kosong", "error");
      return;
    }

    const parsedShipmentStatus = parseInt(shipmentStatus);
    if (isNaN(parsedShipmentStatus)) {
      Swal.fire("Error", "Status pengiriman tidak valid", "error");
      return;
    }

    const payload = {
      id: selectedStoreId,
      receipt_code: receiptCode.trim(),
      shipment_status: parsedShipmentStatus,
    };


    setIsUpdatingReceipt(true);
    try {
      await updateReceiptCode(payload).unwrap();

      // Close the receipt modal first
      setIsReceiptModalOpen(false);
      setSelectedStoreId(null);
      setReceiptCode("");
      setShipmentStatus("0");
      
      // Wait a bit for modal to close, then show success message
      setTimeout(() => {
        Swal.fire("Berhasil", "Nomor resi dan status pengiriman berhasil diperbarui", "success");
      }, 100);
      
      await refetch();
    } catch (error) {
      console.error("Error updating receipt code:", error);
      
      // Close the receipt modal first
      setIsReceiptModalOpen(false);
      setSelectedStoreId(null);
      setReceiptCode("");
      setShipmentStatus("0");
      
      // Wait a bit for modal to close, then show error message
      setTimeout(() => {
        Swal.fire("Gagal", "Gagal memperbarui nomor resi", "error");
      }, 100);
    } finally {
      setIsUpdatingReceipt(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedTransaction) return;

    setIsUpdatingStatus(true);
    try {
      await updateTransactionStatus({
        id: selectedTransaction.id.toString(),
        status: parseInt(newStatus),
      }).unwrap();

      // Close the status modal first
      setIsStatusModalOpen(false);
      setSelectedTransaction(null);
      
      // Wait a bit for modal to close, then show success message
      setTimeout(() => {
        Swal.fire("Berhasil", "Status transaction berhasil diubah", "success");
      }, 100);
      
      await refetch();
    } catch (error) {
      // Close the status modal first
      setIsStatusModalOpen(false);
      setSelectedTransaction(null);
      
      // Wait a bit for modal to close, then show error message
      setTimeout(() => {
        Swal.fire("Gagal", "Gagal mengubah status transaction", "error");
      }, 100);
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusInfo = (status: number) => {
    return TRANSACTION_STATUS[status as TransactionStatusKey] || { label: "UNKNOWN", variant: "secondary" };
  };

  const getShipmentStatusInfo = (status: number) => {
    const statusMap: Record<number, { label: string; variant: "secondary" | "default" | "success" | "destructive" }> = {
      0: { label: "PENDING", variant: "secondary" },
      1: { label: "SHIPPED", variant: "default" },
      2: { label: "DELIVERED", variant: "success" },
      3: { label: "RETURNED", variant: "destructive" },
      4: { label: "CANCELLED", variant: "destructive" },
    };
    return statusMap[status] || { label: "UNKNOWN", variant: "secondary" };
  };

  const formatProductDetail = (detailString: string) => {
    try {
      const detail = JSON.parse(detailString);
      return detail.name || "Nama Produk Tidak Diketahui";
    } catch {
      return "Data Produk Rusak";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Data Transaksi</h1>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">Aksi</th>
                <th className="px-2 py-2 whitespace-nowrap">ID</th>
                <th className="px-4 py-2 whitespace-nowrap">Customer</th>
                <th className="px-4 py-2 whitespace-nowrap">Harga</th>
                <th className="px-4 py-2 whitespace-nowrap">Diskon</th>
                <th className="px-4 py-2 whitespace-nowrap">Biaya Pengiriman</th>
                <th className="px-4 py-2 whitespace-nowrap">Total harga</th>
                <th className="px-4 py-2 whitespace-nowrap">Payment Link</th>
                {/* <th className="px-4 py-2 whitespace-nowrap">Nomor Resi</th> */}
                <th className="px-4 py-2 whitespace-nowrap">Tanggal</th>
                <th className="px-4 py-2 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="text-center p-4">
                    Memuat data...
                  </td>
                </tr>
              ) : categoryList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center p-4">
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
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleDetailClick(item.id)}
                          >
                            Detail
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.reference}</td>
                      <td className="px-4 py-2">{item.user_name}</td>
                      <td className="px-4 py-2 font-medium text-green-600">
                        {formatRupiah(item.total)}
                      </td>
                      <td className="px-4 py-2 font-medium text-orange-600">
                        {formatRupiah(item.discount_total)}
                      </td>
                      <td className="px-4 py-2 font-medium text-blue-600">
                        {formatRupiah(item.shipment_cost)}
                      </td>
                      <td className="px-4 py-2 font-bold text-green-700">
                        {formatRupiah(item.grand_total)}
                      </td>
                      <td className="px-4 py-2">
                        {item.payment_link ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-auto"
                            onClick={() => handlePaymentLinkClick(item.payment_link)}
                          >
                            Buka Link
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Tidak ada link
                          </span>
                        )}
                      </td>
                      {/* <td className="px-4 py-2">
                        {item.stores && item.stores.length > 0 ? (
                          item.stores.map((store, index) => (
                            <div key={index} className="mb-1">
                              {store.receipt_code ? (
                                <span 
                                  className="text-sm font-medium text-green-600 cursor-pointer hover:underline"
                                  onClick={() => handleReceiptCodeClick(store.id, store.receipt_code, store.shipment_status)}
                                  title="Klik untuk mengedit nomor resi"
                                >
                                  {store.receipt_code}
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-1 h-auto"
                                  onClick={() => handleReceiptCodeClick(store.id, store.receipt_code, store.shipment_status)}
                                >
                                  Input Resi
                                </Button>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Tidak ada data
                          </span>
                        )}
                      </td> */}
                      <td className="px-4 py-2 text-sm whitespace-nowrap">
                        {formatDateTime(item.created_at)}
                      </td>
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
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Status Transaksi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Transaksi: {selectedTransaction?.reference}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Customer: {selectedTransaction?.user_name}
              </p>
              {selectedTransaction?.stores && selectedTransaction.stores.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Nomor Resi:</strong>
                  </p>
                  {selectedTransaction.stores.filter(store => store).map((store, index) => (
                    <div key={index} className="mb-2 p-2 border rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          Toko {store.shop?.name || store.shop_id || 'Unknown'}:
                        </span>
                        <Badge variant={getShipmentStatusInfo(store.shipment_status).variant} className="text-xs">
                          {getShipmentStatusInfo(store.shipment_status).label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Resi:</span>
                        {store.receipt_code ? (
                          <span 
                            className="text-sm font-medium text-green-600 cursor-pointer hover:underline"
                            onClick={() => handleReceiptCodeClick(store.id, store.receipt_code, store.shipment_status)}
                            title="Klik untuk mengedit nomor resi"
                          >
                            {store.receipt_code}
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-auto"
                            onClick={() => handleReceiptCodeClick(store.id, store.receipt_code, store.shipment_status)}
                          >
                            Input Resi
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  <SelectItem value="0">PENDING</SelectItem>
                  <SelectItem value="1">CAPTURED</SelectItem>
                  <SelectItem value="2">SETTLEMENT</SelectItem>
                  <SelectItem value="-1">DENY</SelectItem>
                  <SelectItem value="-2">EXPIRED</SelectItem>
                  <SelectItem value="-3">CANCEL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsStatusModalOpen(false)}
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
      
      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>
          {isDetailLoading ? (
            <div className="text-center p-8">Memuat detail...</div>
          ) : isDetailError || !transactionDetail ? (
            <div className="text-center p-8 text-red-500">
              Gagal memuat detail transaksi.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ringkasan Transaksi</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>ID Transaksi:</strong> {transactionDetail.reference}</p>
                  <p><strong>Nama Pelanggan:</strong> {transactionDetail.user_name}</p>
                  <p><strong>Tanggal:</strong> {formatDateTime(transactionDetail.created_at)}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <Badge variant={getStatusInfo(transactionDetail.status).variant}>
                      {getStatusInfo(transactionDetail.status).label}
                    </Badge>
                  </p>
                  <p><strong>Metode Pembayaran:</strong> {transactionDetail.payment_method}</p>
                  {transactionDetail.expires_at && (
                    <p><strong>Kedaluwarsa:</strong> {formatDateTime(transactionDetail.expires_at)}</p>
                  )}
                </div>
                
                {/* Payment Proof */}
                {transactionDetail.payment_proof && (
                  <div className="mt-4">
                    <h4 className="text-base font-semibold">Bukti Pembayaran</h4>
                    <a href={transactionDetail.payment_proof} target="_blank" rel="noopener noreferrer">
                      <Image 
                        src={transactionDetail.payment_proof} 
                        alt="Bukti Pembayaran" 
                        width={400}
                        height={300}
                        className="w-full h-auto mt-2 rounded-lg object-contain border" 
                      />
                    </a>
                  </div>
                )}
              </div>
              
              {/* Right Column: Items and Shipping */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Produk</h3>
                  <div className="space-y-2">
                    {transactionDetail.stores.flatMap(store => store.details).map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                        <div>
                          <p className="font-medium">{formatProductDetail(item.product_detail)}</p>
                          <p className="text-muted-foreground">Jumlah: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{formatRupiah(item.total)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Shipping Details */}
                {transactionDetail.stores.length > 0 && transactionDetail.stores[0] && (
                  <div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Alamat:</strong> {transactionDetail.address_line_1} {transactionDetail.postal_code}</p>
                      <p><strong>Kurir:</strong> {JSON.parse(transactionDetail.stores[0].shipment_detail).name} ({JSON.parse(transactionDetail.stores[0].shipment_detail).service})</p>
                      <p><strong>Biaya:</strong> {formatRupiah(transactionDetail.shipment_cost)}</p>
                      <div className="flex items-center gap-2">
                        <p><strong>Status Pengiriman:</strong></p>
                        <Badge variant={getShipmentStatusInfo(transactionDetail.stores[0].shipment_status).variant}>
                          {getShipmentStatusInfo(transactionDetail.stores[0].shipment_status).label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <p><strong>Nomor Resi:</strong></p>
                        {transactionDetail.stores[0].receipt_code ? (
                        <span 
                          className="text-sm font-medium text-green-600 cursor-pointer hover:underline"
                          onClick={() => handleReceiptCodeClick(transactionDetail.stores[0].id, transactionDetail.stores[0].receipt_code, transactionDetail.stores[0].shipment_status)}
                          title="Klik untuk mengedit nomor resi"
                        >
                            {transactionDetail.stores[0].receipt_code}
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1 h-auto"
                            onClick={() => handleReceiptCodeClick(transactionDetail.stores[0].id, transactionDetail.stores[0].receipt_code, transactionDetail.stores[0].shipment_status)}
                          >
                            Input Resi
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Totals */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-base font-medium">
                    <span>Total Harga:</span>
                    <span>{formatRupiah(transactionDetail.total)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-orange-600">
                    <span>Diskon:</span>
                    <span>{formatRupiah(transactionDetail.discount_total)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2">
                    <span>Total Akhir:</span>
                    <span>{formatRupiah(transactionDetail.grand_total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Code Modal */}
      <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Input Nomor Resi & Status Pengiriman</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Nomor Resi:
              </label>
              <Input
                value={receiptCode}
                onChange={(e) => setReceiptCode(e.target.value)}
                placeholder="Masukkan nomor resi"
                disabled={isUpdatingReceipt}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Status Pengiriman:
              </label>
              <Select value={shipmentStatus} onValueChange={setShipmentStatus} disabled={isUpdatingReceipt}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status pengiriman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">PENDING</SelectItem>
                  <SelectItem value="1">SHIPPED</SelectItem>
                  <SelectItem value="2">DELIVERED</SelectItem>
                  <SelectItem value="3">RETURNED</SelectItem>
                  <SelectItem value="4">CANCELLED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsReceiptModalOpen(false)}
                disabled={isUpdatingReceipt}
              >
                Batal
              </Button>
              <Button
                onClick={handleReceiptCodeUpdate}
                disabled={isUpdatingReceipt}
              >
                {isUpdatingReceipt ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}