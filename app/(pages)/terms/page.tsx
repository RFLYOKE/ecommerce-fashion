"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileCheck2,
  UserCircle2,
  Banknote,
  Tag,
  Truck,
  RotateCcw,
  ShieldAlert,
  Copyright,
  FileText,
  Ban,
  Scale,
  Gavel,
  Mail,
  MessageCircle,
  MapPin,
} from "lucide-react";

/*
  Terms & Conditions – white background, black accents, elegant & scroll‑animated.
  Drop as: app/terms/page.tsx (Next.js App Router)
  TailwindCSS + Framer Motion.
*/

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const Section = ({
  icon: Icon,
  title,
  id,
  children,
}: {
  icon: React.ElementType;
  title: string;
  id: string;
  children: React.ReactNode;
}) => (
  <motion.section
    id={id}
    variants={fadeUp}
    className="rounded-2xl border border-gray-200 bg-white p-6"
  >
    <div className="mb-3 flex items-center gap-2">
      <span className="rounded-lg border border-gray-200 bg-white p-2">
        <Icon className="h-4 w-4 text-gray-900" />
      </span>
      <h2 className="text-lg font-semibold text-black">{title}</h2>
    </div>
    <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-black prose-li:marker:text-gray-600">
      {children}
    </div>
  </motion.section>
);

const WHATSAPP_1 = "+62895622717884"; // 0895 6227 17884
const WHATSAPP_2 = "+6281299848516"; // 0812 9984 8516
const ADDRESS = "Jatijajar, Depok, Jawa Barat 16455";

export default function TermsPage() {
  const updated = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="relative min-h-screen bg-white">
      {/* HERO */}
      <section className="container mx-auto px-6 pb-14 md:pt-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-black"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-3 text-base md:text-lg text-gray-600"
          >
            Syarat & Ketentuan penggunaan layanan BLACKBOXINC. Harap baca dengan
            saksama sebelum menggunakan situs dan melakukan pemesanan.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-2 text-xs text-gray-500">
            Terakhir diperbarui: {updated}
          </motion.p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="container mx-auto grid grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">
        {/* Left rail */}
        <motion.aside
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="md:col-span-1"
        >
          <motion.nav
            variants={fadeUp}
            className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-4"
          >
            <h3 className="text-sm font-semibold text-black">Navigasi Cepat</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {[
                ["penerimaan", "Penerimaan Ketentuan"],
                ["akun", "Akun & Keamanan"],
                ["pesanan", "Pesanan & Harga"],
                ["voucher", "Voucher & Promo"],
                ["pengiriman", "Pengiriman"],
                ["retur", "Retur & Refund"],
                ["ip", "Hak Kekayaan Intelektual"],
                ["konten", "Konten Pengguna"],
                ["larangan", "Penggunaan Terlarang"],
                ["disclaimer", "Disclaimers"],
                ["liability", "Batas Tanggung Jawab"],
                ["indemnity", "Ganti Rugi"],
                ["perubahan", "Perubahan Ketentuan"],
                ["hukum", "Hukum yang Berlaku"],
                ["kontak", "Kontak"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={`#${href}`}
                    className="inline-block rounded px-2 py-1 hover:bg-black hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </motion.aside>

        {/* Main content */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="md:col-span-2 space-y-6"
        >
          <Section
            id="penerimaan"
            icon={FileCheck2}
            title="Penerimaan Ketentuan"
          >
            <p>
              Dengan mengakses atau menggunakan situs/layanan BLACKBOXINC, Anda
              menyatakan telah membaca, memahami, dan menyetujui Syarat &
              Ketentuan ini beserta kebijakan terkait (termasuk{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                Privacy Policy
              </Link>
              ). Jika Anda tidak setuju, harap hentikan penggunaan layanan.
            </p>
          </Section>

          <Section id="akun" icon={UserCircle2} title="Akun & Keamanan">
            <ul>
              <li>
                Anda bertanggung jawab menjaga kerahasiaan kredensial (email,
                kata sandi) dan semua aktivitas pada akun Anda.
              </li>
              <li>
                Informasi yang Anda berikan harus akurat, lengkap, dan terbaru.
                Kami berhak menangguhkan/menutup akun atas dugaan pelanggaran.
              </li>
              <li>
                Segera beri tahu kami jika ada akses tidak sah atau pelanggaran
                keamanan pada akun.
              </li>
            </ul>
          </Section>

          <Section id="pesanan" icon={Banknote} title="Pesanan & Harga">
            <ul>
              <li>
                Harga ditampilkan dalam Rupiah kecuali dinyatakan lain, dan
                dapat berubah sewaktu‑waktu.
              </li>
              <li>
                Pemesanan dianggap berhasil setelah pembayaran terverifikasi.
                Kami dapat menolak/membatalkan pesanan (mis. stok tidak
                tersedia, kecurigaan penipuan).
              </li>
              <li>
                Kesalahan pengetikan/penayangan (typographical error) terkait
                harga/stok dapat diperbaiki; jika sudah dibayar, Anda dapat
                memilih pengembalian dana penuh atau konfirmasi ulang pesanan.
              </li>
            </ul>
          </Section>

          <Section id="voucher" icon={Tag} title="Voucher & Promo">
            <ul>
              <li>
                Setiap voucher/promo tunduk pada ketentuan spesifik (masa
                berlaku, kuota penggunaan, tipe diskon). Satu pesanan hanya
                dapat menggunakan 1 voucher kecuali disebutkan lain.
              </li>
              <li>
                Voucher tidak dapat diuangkan. Jika pesanan dibatalkan, nilai
                voucher tidak dikembalikan kecuali diatur secara eksplisit.
              </li>
              <li>
                Kami berhak menolak transaksi yang menggunakan voucher secara
                tidak wajar/menyalahi ketentuan.
              </li>
            </ul>
          </Section>

          <Section id="pengiriman" icon={Truck} title="Pengiriman">
            <ul>
              <li>
                Estimasi pengiriman bergantung pada alamat, kurir, dan
                ketersediaan stok. Keterlambatan kurir di luar kendali kami.
              </li>
              <li>
                Risiko kehilangan beralih kepada pembeli saat barang diserahkan
                ke kurir, kecuali diatur berbeda oleh hukum yang berlaku.
              </li>
              <li>Pastikan alamat pengiriman benar dan lengkap.</li>
            </ul>
          </Section>

          <Section id="retur" icon={RotateCcw} title="Retur & Refund">
            <ul>
              <li>
                Ajukan retur dalam jangka waktu yang ditentukan pada halaman
                produk/kebijakan retur (barang cacat, salah kirim, size tidak
                sesuai spesifikasi).
              </li>
              <li>
                Barang harus tidak terpakai, lengkap dengan label/kemasan, dan
                bukti pembelian.
              </li>
              <li>
                Proses refund mengikuti metode pembayaran awal atau sesuai
                kebijakan yang diberitahukan.
              </li>
            </ul>
          </Section>

          <Section id="ip" icon={Copyright} title="Hak Kekayaan Intelektual">
            <p>
              Seluruh konten situs (desain, logo, foto, teks, layout, kode)
              adalah milik BLACKBOXINC atau pihak berlisensi, dilindungi oleh
              undang‑undang hak cipta dan/atau merek. Dilarang menyalin,
              memodifikasi, mendistribusikan, atau mengeksploitasi tanpa izin
              tertulis.
            </p>
          </Section>

          <Section id="konten" icon={FileText} title="Konten Pengguna">
            <ul>
              <li>
                Anda bertanggung jawab atas konten yang Anda unggah (ulasan,
                foto, komentar), dan menjamin tidak melanggar hukum/hak pihak
                ketiga.
              </li>
              <li>
                Dengan mengunggah, Anda memberi kami lisensi non‑eksklusif,
                bebas royalti, dapat dialihkan, dan berlaku global untuk
                menggunakan, mereproduksi, memodifikasi, dan menampilkan konten
                tersebut dalam rangka layanan.
              </li>
            </ul>
          </Section>

          <Section id="larangan" icon={Ban} title="Penggunaan Terlarang">
            <ul>
              <li>
                Aktivitas ilegal, penipuan, atau pelanggaran hak pihak lain.
              </li>
              <li>
                Upaya mengganggu/merusak sistem (malware, scraping berlebihan,
                akses tidak sah).
              </li>
              <li>
                Konten yang menyesatkan, melecehkan, berbau SARA, atau melanggar
                hukum.
              </li>
            </ul>
          </Section>

          <Section id="disclaimer" icon={ShieldAlert} title="Disclaimers">
            <p>
             {` Layanan disediakan "sebagaimana adanya" dan "sebagaimana tersedia"
              tanpa jaminan eksplisit/implisit apa pun, termasuk namun tidak
              terbatas pada kelayakan untuk diperjualbelikan, kesesuaian untuk
              tujuan tertentu, dan non‑pelanggaran.`}
            </p>
          </Section>

          <Section id="liability" icon={Scale} title="Batas Tanggung Jawab">
            <p>
              Sejauh diizinkan hukum, BLACKBOXINC tidak bertanggung jawab atas
              kerugian tidak langsung, insidental, khusus, konsekuensial, atau
              hukuman; termasuk kehilangan keuntungan, pendapatan, data, atau
              goodwill, yang timbul dari penggunaan atau ketidakmampuan
              menggunakan layanan.
            </p>
          </Section>

          <Section id="indemnity" icon={Gavel} title="Ganti Rugi">
            <p>
              Anda setuju untuk membebaskan, mengganti rugi, dan menjaga
              BLACKBOXINC beserta afiliasi/mitra/karyawan dari klaim, tuntutan,
              kewajiban, termasuk biaya hukum wajar yang timbul akibat
              pelanggaran Anda terhadap Ketentuan ini atau pelanggaran hukum/hak
              pihak ketiga.
            </p>
          </Section>

          <Section id="perubahan" icon={FileText} title="Perubahan Ketentuan">
            <p>
              Kami dapat memperbarui Ketentuan ini sewaktu‑waktu. Perubahan
              material akan diberitahukan melalui email atau pemberitahuan di
              situs. Tanggal pembaruan terakhir tercantum di bagian atas halaman
              ini.
            </p>
          </Section>

          <Section id="hukum" icon={Gavel} title="Hukum yang Berlaku">
            <p>
              Ketentuan ini diatur oleh hukum Republik Indonesia. Sengketa akan
              diselesaikan terlebih dahulu melalui musyawarah; jika tidak
              tercapai, tunduk pada yurisdiksi pengadilan yang berwenang di
              Indonesia.
            </p>
          </Section>

          <Section id="kontak" icon={Mail} title="Kontak">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-black">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </div>
                <p className="text-sm text-gray-700">
                  0895 6227 17884 / 0812 9984 8516
                </p>
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`https://wa.me/${WHATSAPP_1}`}
                    target="_blank"
                    className="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-900"
                  >
                    Chat WA 1
                  </Link>
                  <Link
                    href={`https://wa.me/${WHATSAPP_2}`}
                    target="_blank"
                    className="rounded-lg border border-black px-3 py-1.5 text-xs font-semibold text-black hover:bg-black hover:text-white"
                  >
                    Chat WA 2
                  </Link>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-black">
                  <MapPin className="h-4 w-4" /> Alamat
                </div>
                <p className="text-sm text-gray-700">
                  Jatijajar, Depok, Jawa Barat 16455
                </p>
                <div className="mt-2">
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      ADDRESS
                    )}`}
                    target="_blank"
                    className="rounded-lg border border-black px-3 py-1.5 text-xs font-semibold text-black hover:bg-black hover:text-white"
                  >
                    Lihat di Maps
                  </Link>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-700">
              Email:{" "}
              <Link
                href="mailto:hello@blackboxinc.example"
                className="underline underline-offset-4"
              >
                hello@blackboxinc.example
              </Link>
            </p>
          </Section>

          <div className="flex items-center justify-end">
            <Link
              href="/"
              className="rounded-lg border border-black px-4 py-2 text-sm font-semibold text-black hover:bg-black hover:text-white"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}