import { ArrowRight } from "lucide-react";

export default function KoperasiOverview() {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-10 text-center md:text-left">
        {/* Judul dan Deskripsi */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1D] leading-tight">
            Menyediakan Solusi Ekonomi untuk Anggota
          </h2>
          <p className="text-neutral-700 text-base md:text-lg">
            BLACKBOXINC berkomitmen untuk memberdayakan masyarakat melalui
            layanan simpan pinjam yang adil, transparan, dan berbasis teknologi.
            Kami percaya bahwa setiap anggota berhak mendapatkan akses terhadap
            peluang ekonomi yang setara dan berkelanjutan. Didukung oleh tim
            profesional dan sistem digital modern, kami siap melayani kebutuhan
            finansial masyarakat dengan sepenuh hati.
          </p>
        </div>

        {/* Statistik */}
        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-8 text-center border-t border-b py-6">
          <div className="flex-1">
            <p className="text-3xl font-bold text-green-600">500+</p>
            <p className="text-sm text-gray-600">Anggota Aktif</p>
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold text-green-600">1000+</p>
            <p className="text-sm text-gray-600">Transaksi Tercatat</p>
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold text-green-600">5+</p>
            <p className="text-sm text-gray-600">Tahun Pengalaman</p>
          </div>
        </div>

        {/* Tombol */}
        <div>
          <button className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md text-sm hover:bg-[#7a002a] transition">
            Selengkapnya
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
