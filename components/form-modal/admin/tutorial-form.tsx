"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tutorial } from "@/types/admin/tutorial";
import Image from "next/image";

interface FormTutorialProps {
  form: Partial<Tutorial> | undefined;
  setForm: (data: Partial<Tutorial>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  readonly?: boolean;
  isLoading?: boolean;
}

export default function FormTutorial({
  form,
  setForm,
  onCancel,
  onSubmit,
  readonly = false,
  isLoading = false,
}: FormTutorialProps) {
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Function to convert title to slug format
  const createSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  // Initialize form if it's empty
  useEffect(() => {
    if (!form) {
      setForm({
        order: 1,
        title: "",
        content: "",
        link_youtube: "",
        slug: "",
        published_at: "",
      });
    }
  }, [form, setForm]);

  // Handle title change and auto-generate slug
  const handleTitleChange = (newTitle: string) => {
    const updatedForm = { ...form, title: newTitle };
    
    // Auto-generate slug only if:
    // 1. Not in readonly mode
    // 2. Slug hasn't been manually edited
    // 3. It's a new tutorial (no ID) or slug is empty
    if (!readonly && !isSlugManuallyEdited && (!form?.id || !form?.slug)) {
      updatedForm.slug = createSlug(newTitle);
    }
    
    setForm(updatedForm);
  };

  // Handle manual slug change
  const handleSlugChange = (newSlug: string) => {
    setIsSlugManuallyEdited(true);
    setForm({ ...form, slug: newSlug });
  };

  // Reset slug editing state when form changes (new tutorial)
  useEffect(() => {
    if (!form?.id) {
      setIsSlugManuallyEdited(false);
    }
  }, [form?.id]);

  if (!form) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {readonly
            ? "Detail Tutorial"
            : form.id
            ? "Edit Tutorial"
            : "Tambah Tutorial"}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Order</Label>
          <Input
            type="number"
            value={form.order || ""}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            readOnly={readonly}
            placeholder="Urutan tutorial"
          />
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Judul</Label>
          <Input
            value={form.title || ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            readOnly={readonly}
            placeholder="Masukkan judul tutorial"
          />
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Slug</Label>
          <Input
            value={form.slug || ""}
            onChange={(e) => handleSlugChange(e.target.value)}
            readOnly={readonly}
            placeholder="slug-otomatis-dari-judul"
          />
          {!readonly && (
            <p className="text-xs text-gray-500">
              Slug akan otomatis dibuat dari judul. Anda bisa mengubahnya secara manual jika diperlukan.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Deskripsi</Label>
          <Textarea
            value={form.content || ""}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            readOnly={readonly}
            placeholder="Masukkan deskripsi tutorial"
            rows={4}
          />
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Link Youtube</Label>
          <Input
            value={form.link_youtube || ""}
            onChange={(e) => setForm({ ...form, link_youtube: e.target.value })}
            readOnly={readonly}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Published At</Label>
          <Input
            type="datetime-local"
            value={form.published_at || ""}
            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            readOnly={readonly}
          />
        </div>

        <div className="flex flex-col gap-y-1 col-span-2">
          <Label>Upload Gambar</Label>
          {readonly ? (
            form.image && typeof form.image === "string" ? (
              <div className="border rounded-lg p-2">
                <Image
                  src={form.image}
                  alt="Preview"
                  className="h-32 w-auto object-contain mx-auto"
                  width={300}
                  height={128}
                />
              </div>
            ) : (
              <span className="text-sm text-gray-500 p-2 border rounded-lg">
                Tidak ada gambar
              </span>
            )
          ) : (
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, image: file });
                }}
              />
              {form.image && (
                <div className="border rounded-lg p-2">
                  {typeof form.image === "string" ? (
                    <Image
                      src={form.image}
                      alt="Current image"
                      className="h-20 w-auto object-contain"
                      width={200}
                      height={80}
                    />
                  ) : (
                    <span className="text-sm text-green-600">
                      File baru dipilih: {form.image.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!readonly && (
        <div className="pt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      )}
    </div>
  );
}