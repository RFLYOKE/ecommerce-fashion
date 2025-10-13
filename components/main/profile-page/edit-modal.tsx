"use client";

import { ChangeEvent } from "react";

export type ProfileEditValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  imageFile: File | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  values: ProfileEditValues;
  onChange: (patch: Partial<ProfileEditValues>) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export default function ProfileEditModal({
  open,
  onClose,
  values,
  onChange,
  onSubmit,
  isSubmitting = false,
}: Props) {
  if (!open) return null;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    onChange({ imageFile: file ?? null });
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Edit Profil</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Nama
          </label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-2xl px-3 py-2"
            value={values.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-200 rounded-2xl px-3 py-2"
            value={values.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Phone
          </label>
          <input
            type="tel"
            className="w-full border border-gray-200 rounded-2xl px-3 py-2"
            value={values.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password (opsional)
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-2xl px-3 py-2"
              value={values.password}
              onChange={(e) => onChange({ password: e.target.value })}
              placeholder="Kosongkan jika tidak diubah"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Konfirmasi Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-2xl px-3 py-2"
              value={values.password_confirmation}
              onChange={(e) =>
                onChange({ password_confirmation: e.target.value })
              }
              placeholder="Ulangi password"
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Image (avatar)
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-200 rounded-2xl px-3 py-2"
            onChange={handleFile}
          />
          {values.imageFile && (
            <p className="text-xs text-gray-500 mt-1">
              File dipilih: {values.imageFile.name}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-2xl bg-[#A3B18A] text-white font-semibold hover:bg-[#A3B18A]/90 disabled:opacity-60"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}