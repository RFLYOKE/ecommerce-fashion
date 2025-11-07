"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Cookie,
  Database,
  Bell,
  Globe2,
  CalendarClock,
  FileText,
  Mail,
  MessageCircle,
  MapPin,
} from "lucide-react";

/*
  Privacy Policy – white background, black accents, elegant & scroll‑animated.
  Drop this file as: app/privacy/page.tsx (Next.js App Router)
  TailwindCSS + Framer Motion only.
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
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <motion.section
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

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-3 text-base md:text-lg text-gray-600"
          >
            Privasi Anda penting bagi kami. Dokumen ini menjelaskan bagaimana
            kami mengumpulkan, menggunakan, menyimpan, dan melindungi data
            pribadi Anda saat menggunakan layanan BLACKBOXINC.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-2 text-xs text-gray-500">
            Terakhir diperbarui: {updated}
          </motion.p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="container mx-auto grid grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-3">
        {/* Left rail: quick nav */}
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
                ["pengantar", "Pengantar"],
                ["data-yang-dikumpulkan", "Data yang Dikumpulkan"],
                ["cara-penggunaan", "Cara Penggunaan"],
                ["cookies", "Cookies & Teknologi Serupa"],
                ["pemasaran", "Pemasaran & Komunikasi"],
                ["berbagi-pihak-ketiga", "Berbagi ke Pihak Ketiga"],
                ["keamanan", "Keamanan Data"],
                ["retensi", "Retensi Data"],
                ["hak-pengguna", "Hak Pengguna"],
                ["anak", "Privasi Anak"],
                ["perubahan", "Perubahan Kebijakan"],
                ["kontak", "Kontak Kami"],
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
          <Section icon={Shield} title="Pengantar">
            <div id="pengantar">
              <p>
                {`Kebijakan Privasi ini berlaku untuk seluruh layanan, situs web,
                dan fitur BLACKBOXINC. Dengan mengakses atau
                menggunakan layanan, Anda menyetujui praktik yang dijelaskan di
                sini.`}
              </p>
            </div>
          </Section>

          <Section icon={Database} title="Data yang Dikumpulkan">
            <div id="data-yang-dikumpulkan">
              <ul>
                <li>
                  <strong>Data Akun</strong>: nama, email, nomor telepon, alamat
                  pengiriman.
                </li>
                <li>
                  <strong>Data Transaksi</strong>: produk yang dibeli, metode
                  pembayaran (tokenized), total, status.
                </li>
                <li>
                  <strong>Data Teknis</strong>: alamat IP, jenis
                  perangkat/OS/browser, log aktivitas.
                </li>
                <li>
                  <strong>Data Komunikasi</strong>: pesan/keluhan, preferensi
                  notifikasi.
                </li>
                <li>
                  <strong>Media</strong>: gambar atau berkas yang Anda unggah
                  (misalnya bukti pembayaran, ulasan), sesuai kebutuhan fitur.
                </li>
              </ul>
            </div>
          </Section>

          <Section icon={FileText} title="Cara Penggunaan">
            <div id="cara-penggunaan">
              <ul>
                <li>
                  Pemrosesan pesanan, pengiriman, dan dukungan purna jual.
                </li>
                <li>
                  Personalisasi konten, rekomendasi produk, dan peningkatan
                  pengalaman pengguna.
                </li>
                <li>
                  Keamanan, pencegahan penipuan, audit, dan kepatuhan hukum.
                </li>
                <li>
                  Analitik performa situs dan metrik penggunaan untuk perbaikan
                  layanan.
                </li>
              </ul>
            </div>
          </Section>

          <Section icon={Cookie} title="Cookies & Teknologi Serupa">
            <div id="cookies">
              <p>
                Kami menggunakan cookies, local storage, dan teknologi serupa
                untuk fungsi inti (login, keranjang), preferensi, dan analitik.
                Anda dapat mengatur preferensi melalui pengaturan browser.
                Menonaktifkan cookies tertentu dapat membatasi fitur.
              </p>
            </div>
          </Section>

          <Section icon={Bell} title="Pemasaran & Komunikasi">
            <div id="pemasaran">
              <p>
                Kami dapat mengirimkan email/notifikasi terkait pesanan,
                pembaruan produk, promo, atau survei. Anda dapat berhenti
                berlangganan kapan saja melalui tautan di email atau pengaturan
                akun.
              </p>
            </div>
          </Section>

          <Section icon={Globe2} title="Berbagi ke Pihak Ketiga">
            <div id="berbagi-pihak-ketiga">
              <ul>
                <li>
                  <strong>Penyedia Layanan</strong>: pembayaran,
                  logistik/pengiriman, cloud/hosting, analitik—hanya sebatas
                  yang diperlukan.
                </li>
                <li>
                  <strong>Kepatuhan Hukum</strong>: jika diwajibkan oleh hukum,
                  proses hukum, atau permintaan pemerintah yang sah.
                </li>
                <li>
                  <strong>Transfer Bisnis</strong>: sehubungan dengan merger,
                  akuisisi, atau penjualan aset.
                </li>
              </ul>
              <p className="mt-2 text-sm text-gray-600">
                Kami tidak menjual data pribadi Anda.
              </p>
            </div>
          </Section>

          <Section icon={Lock} title="Keamanan Data">
            <div id="keamanan">
              <p>
                Kami menerapkan kontrol keamanan teknis dan organisatoris yang
                wajar untuk melindungi data pribadi. Namun, tidak ada metode
                transmisi atau penyimpanan yang sepenuhnya aman; risiko residu
                tetap ada.
              </p>
            </div>
          </Section>

          <Section icon={CalendarClock} title="Retensi Data">
            <div id="retensi">
              <p>
                Kami menyimpan data selama diperlukan untuk memenuhi tujuan di
                atas, mematuhi kewajiban hukum, menyelesaikan sengketa, dan
                menegakkan kebijakan. Setelah itu, data akan dihapus atau
                dianonimkan secara aman.
              </p>
            </div>
          </Section>

          <Section icon={Shield} title="Hak Pengguna">
            <div id="hak-pengguna">
              <ul>
                <li>Akses, koreksi, atau pembaruan data pribadi.</li>
                <li>
                  Penghapusan data, pembatasan pemrosesan, atau penarikan
                  persetujuan (jika berlaku).
                </li>
                <li>Portabilitas data dalam format yang wajar.</li>
                <li>
                  Keberatan atas pemrosesan tertentu, termasuk pemasaran
                  langsung.
                </li>
              </ul>
              <p className="mt-2">
                Untuk menjalankan hak Anda, lihat bagian{" "}
                <a href="#kontak" className="underline underline-offset-4">
                  Kontak Kami
                </a>
                .
              </p>
            </div>
          </Section>

          <Section icon={Shield} title="Privasi Anak">
            <div id="anak">
              <p>
                Layanan kami tidak ditujukan untuk anak di bawah 13 tahun (atau
                usia setara menurut hukum lokal). Kami tidak dengan sengaja
                mengumpulkan data anak. Jika Anda percaya kami tanpa sengaja
                menyimpan data anak, hubungi kami untuk penghapusan.
              </p>
            </div>
          </Section>

          <Section icon={Globe2} title="Transfer Internasional">
            <div>
              <p>
                Jika data diproses di luar negara tempat Anda tinggal, kami akan
                memastikan perlindungan yang setara sesuai hukum yang berlaku
                dan perjanjian pemrosesan data dengan pihak ketiga terkait.
              </p>
            </div>
          </Section>

          <Section icon={FileText} title="Perubahan Kebijakan">
            <div id="perubahan">
              <p>
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke
                waktu. Perubahan material akan diberitahukan melalui email atau
                pemberitahuan di situs. Tanggal pembaruan terakhir tercantum di
                atas.
              </p>
            </div>
          </Section>

          <Section icon={Mail} title="Kontak Kami">
            <div id="kontak">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-black">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </div>
                  <p className="text-sm text-gray-700">
                    0895 6227 17884 / 0812 9984 8516
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-black">
                    <MapPin className="h-4 w-4" /> Alamat
                  </div>
                  <p className="text-sm text-gray-700">
                    Jatijajar, Depok, Jawa Barat 16455
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-700">
                Anda juga dapat menghubungi kami via email di{" "}
                <Link
                  href="mailto:hello@blackboxinc.example"
                  className="underline underline-offset-4"
                >
                  hello@blackboxinc.example
                </Link>
                .
              </p>
            </div>
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