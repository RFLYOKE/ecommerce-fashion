"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Berita } from "@/types/berita"; // gunakan tipe yang benar

type NewsDetailModalProps = {
  berita: Berita;
  isOpen: boolean;
  onClose: () => void;
};

export default function NewsDetailModal({
  berita,
  isOpen,
  onClose,
}: NewsDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 px-4 transition-opacity duration-300">
      <div className="bg-white max-w-3xl w-full rounded-md shadow-lg p-6 relative overflow-y-auto max-h-[90vh] animate-fade-in">
        {/* Tombol Close */}
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X size={24} />
        </Button>

        {/* Konten Detail */}
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          {berita.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {berita.kategori} • {berita.date}
        </p>

        <Image
          src={berita.image}
          alt={berita.title}
          width={800}
          height={400}
          className="rounded-md object-cover mb-4 w-full h-64"
        />

        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {berita.content}
        </div>
      </div>
    </div>
  );
}