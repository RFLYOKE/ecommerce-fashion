"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function JoinAnggotaPage() {
  return (
    <section
      className="max-h-[700px] bg-green-800 py-10 md:py-0 lg:pt-16"
    >
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:items-end lg:items-center -translate-y-44">
        {/* Left Image Section */}
        <div className="hidden md:flex justify-center bottom-0">
          <Image
            src="https://8nc5ppykod.ufs.sh/f/H265ZJJzf6breBD8pDYoGnIOWsFHm8Cc2aREpdLo36xh9NA7"
            alt="Gabung Koperasi"
            width={800}
            height={800}
            className="w-full max-w-2xl md:max-w-6xl object-cover"
            priority
          />
        </div>

        {/* Right Form Section */}
        <div className="md:py-10">
          <div className="bg-neutral-50 p-8 rounded-xl shadow-lg w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-6 text-center">
              Formulir Pendaftaran Alumni
            </h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-2">
                  Nama Lengkap
                </Label>
                <Input id="name" placeholder="Masukkan nama lengkap" />
              </div>
              <div>
                <Label htmlFor="email" className="mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email aktif"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="mb-2">
                  Nomor Telepon
                </Label>
                <Input id="phone" type="tel" placeholder="08xxxxxxxxxx" />
              </div>
              <div>
                <Label htmlFor="address" className="mb-2">
                  Alamat
                </Label>
                <Textarea id="address" placeholder="Tulis alamat lengkap" />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 text-white hover:bg-[#7a002a] transition"
                >
                  Daftar Sekarang
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}