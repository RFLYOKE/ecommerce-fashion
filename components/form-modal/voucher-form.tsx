"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Voucher } from "@/types/voucher";

interface VoucherFormProps {
  form: Partial<Voucher>;
  setForm: (form: Partial<Voucher>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function VoucherForm({
  form,
  setForm,
  onCancel,
  onSubmit,
}: VoucherFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-4xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Form Voucher</h2>
        <Button variant="ghost" onClick={onCancel} aria-label="Tutup">
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kode Voucher */}
        <div className="flex flex-col gap-y-1">
          <Label>Kode Voucher</Label>
          <Input
            value={form.code || ""}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="Masukkan kode voucher"
          />
        </div>

        {/* Nama Voucher */}
        <div className="flex flex-col gap-y-1">
          <Label>Nama Voucher</Label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Masukkan nama voucher"
          />
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-y-1">
          <Label>Deskripsi</Label>
          <Input
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Masukkan deskripsi"
          />
        </div>

        {/* Jenis Voucher */}
        <div className="flex flex-col gap-y-1">
          <Label>Jenis Voucher</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.type || ""}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Pilih jenis voucher</option>
            <option value="fixed">Diskon Tetap (Fixed)</option>
            <option value="percentage">Diskon Persentase</option>
          </select>
        </div>

        {/* Nominal Diskon (Fixed) */}
        {form.type === "fixed" && (
          <div className="flex flex-col gap-y-1">
            <Label>Nominal Diskon</Label>
            <Input
              type="number"
              min={0}
              value={form.fixed_amount || ""}
              onChange={(e) =>
                setForm({ ...form, fixed_amount: Number(e.target.value) })
              }
              placeholder="Masukkan nominal diskon"
            />
          </div>
        )}

        {/* Diskon Persentase */}
        {form.type === "percentage" && (
          <div className="flex flex-col gap-y-1">
            <Label>Diskon (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={form.percentage_amount || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  percentage_amount: Number(e.target.value),
                })
              }
              placeholder="Masukkan persentase diskon"
            />
          </div>
        )}

        {/* Start Date */}
        <div className="flex flex-col gap-y-1">
          <Label>Tanggal Mulai</Label>
          <Input
            type="date"
            value={form.start_date || ""}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-y-1">
          <Label>Tanggal Berakhir</Label>
          <Input
            type="date"
            value={form.end_date || ""}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />
        </div>

        {/* Usage Limit */}
        <div className="flex flex-col gap-y-1">
          <Label>Batas Penggunaan</Label>
          <Input
            type="number"
            min={1}
            value={form.usage_limit || ""}
            onChange={(e) =>
              setForm({ ...form, usage_limit: Number(e.target.value) })
            }
            placeholder="Masukkan batas penggunaan"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Status</Label>
          <select
            className="border rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800"
            value={form.status === false ? "0" : "1"}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value === "1" })
            }
          >
            <option value="1">Aktif</option>
            <option value="0">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={onSubmit}>Simpan</Button>
      </div>
    </div>
  );
}