"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  ShieldCheck,
  FlaskConical,
  Heart,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// SESUAIKAN path ini dengan project-mu
import { useGetGalleryListQuery } from "@/services/gallery.service";
import type { GaleriItem } from "@/types/gallery";

/* =========================
   Animations
========================= */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* =========================
   Small UI Atoms
========================= */
const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="mx-auto max-w-3xl text-center">
    <motion.h2
      variants={fadeUp}
      className="text-3xl md:text-4xl font-extrabold tracking-tight text-black"
    >
      {title}
    </motion.h2>
    {subtitle ? (
      <motion.p
        variants={fadeUp}
        className="mt-3 text-sm md:text-base text-gray-600"
      >
        {subtitle}
      </motion.p>
    ) : null}
  </div>
);

const FeatureCard = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -4 }}
    className="rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 shadow-[0_1px_0_0_rgba(0,0,0,0.04)_inset]"
  >
    <div className="flex items-center gap-3">
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <Icon className="h-5 w-5 text-gray-900" />
      </div>
      <h4 className="text-black font-semibold text-lg">{title}</h4>
    </div>
    <p className="mt-3 text-gray-600 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <motion.div
    variants={fadeUp}
    className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center"
  >
    <p className="text-3xl md:text-4xl font-extrabold text-black">{value}</p>
    <p className="mt-2 text-xs uppercase tracking-wider text-gray-500">
      {label}
    </p>
  </motion.div>
);

const TeamCard = ({
  name,
  role,
  src,
}: {
  name: string;
  role: string;
  src: string;
}) => (
  <motion.div variants={fadeUp} className="text-center">
    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full ring-1 ring-gray-200">
      <Image
        src={src}
        alt={name}
        width={96}
        height={96}
        className="h-full w-full object-cover grayscale"
      />
    </div>
    <p className="mt-3 text-sm font-semibold text-black">{name}</p>
    <p className="text-xs text-gray-500">{role}</p>
  </motion.div>
);

const TimelineItem = ({
  year,
  title,
  desc,
  last,
}: {
  year: string;
  title: string;
  desc: string;
  last?: boolean;
}) => (
  <motion.div variants={fadeUp} className="relative pl-8">
    <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-gray-300 to-transparent" />
    <div className="absolute -left-[7px] top-0 h-3.5 w-3.5 rounded-full border border-gray-300 bg-white" />
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-xs text-gray-500">{year}</p>
      <h4 className="mt-1 text-black font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
    {!last && (
      <div className="absolute -left-[1px] bottom-0 h-6 w-px bg-gray-200" />
    )}
  </motion.div>
);

/* =========================
   Helpers for File -> URL
========================= */
function useObjectUrl(file?: File): string | undefined {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!file) {
      setUrl(undefined);
      return;
    }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}

function useGalleryImageUrl(item?: GaleriItem): string | undefined {
  // 1) string url in `image`
  const imageStr = typeof item?.image === "string" ? item?.image : undefined;

  // 2) file -> object url (client only)
  const file = item?.image instanceof File ? item.image : undefined;
  const objectUrl = useObjectUrl(file);

  // 3) media original_url
  const mediaUrl = item?.media?.[0]?.original_url;

  return imageStr || objectUrl || mediaUrl || undefined;
}

/* =========================
   Page
========================= */
export default function AboutPage() {
  // Ambil galeri terbaru
  const {
    data: galleryResp,
    isLoading: galleryLoading,
    isError: galleryError,
  } = useGetGalleryListQuery({ page: 1, paginate: 8 });

  const galleryItems = galleryResp?.data ?? [];
  const heroItem = galleryItems[0];
  const heroImageUrl = useGalleryImageUrl(heroItem);
  const heroAlt = heroItem?.title ?? "Gallery";

  return (
    <main className="relative min-h-screen bg-white">
      {/* BG accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[32rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,0,0,0.05),transparent)] blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[28rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(0,0,0,0.04),transparent)] blur-3xl" />
      </div>

      {/* HERO */}
      <section className="container mx-auto px-6 pb-20 pt-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="grid grid-cols-1 items-center gap-10 md:grid-cols-2"
        >
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs text-gray-700">
              <BadgeCheck className="h-4 w-4" /> Tentang Kami
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-black md:text-6xl">
              Label Fashion Premium untuk Gaya Timeless & Modern
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base text-gray-600">
              Kami fokus pada craftmanship dan detail. Material pilihan,
              konstruksi presisi, dan proses produksi yang bertanggung
              jawab—menghasilkan koleksi yang nyaman dipakai serta tahan lama.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-4 py-2 text-xs text-gray-700">
                <ShieldCheck className="h-4 w-4" /> Quality Craftsmanship
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-4 py-2 text-xs text-gray-700">
                <Heart className="h-4 w-4" /> Ethically Made
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-4 py-2 text-xs text-gray-700">
                <Sparkles className="h-4 w-4" /> Clean & Minimal
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                href="/collection"
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-900"
              >
                Shop Collection
              </Link>
              <Link
                href="/lookbook"
                className="rounded-xl border border-black bg-transparent px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
              >
                Lihat Lookbook
              </Link>
            </div>
          </motion.div>

          {/* HERO MEDIA – ambil dari galeri */}
          <motion.div
            variants={fadeUp}
            className="relative mx-auto w-full max-w-md rounded-3xl border border-gray-200 bg-white p-4 shadow-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              {heroImageUrl && !galleryLoading && !galleryError ? (
                <Image
                  src={heroImageUrl}
                  alt={heroAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full animate-pulse bg-[radial-gradient(60%_60%_at_50%_40%,rgba(0,0,0,0.06),transparent)]" />
              )}
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/5" />
            <div className="absolute -left-3 -top-3 rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] text-gray-700">
              BLACKBOXINC · Story
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* VISION & MISSION */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h3 className="text-xl font-bold text-black">Visi</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Menjadi brand fashion monokrom yang dipercaya, menghadirkan desain
              timeless dengan kualitas pembuatan tinggi—tanpa gimmick, hanya
              esensi.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <h3 className="text-xl font-bold text-black">Misi</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Menciptakan koleksi fungsional dengan pola yang presisi, material
              bertanggung jawab, dan pengalaman layanan yang ramah.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* VALUES */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionTitle
            title="Nilai Utama"
            subtitle="Prinsip yang membentuk identitas desain kami."
          />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={FlaskConical}
              title="Tailoring Presisi"
              desc="Pola rapi, potongan proporsional, jatuh kain lebih bagus."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Material Pilihan"
              desc="Kain premium dengan kenyamanan dan durabilitas yang terjaga."
            />
            <FeatureCard
              icon={Heart}
              title="Produksi Etis"
              desc="Rantai pasok transparan dan proses yang bertanggung jawab."
            />
            <FeatureCard
              icon={Award}
              title="Desain Fungsional"
              desc="Estetika minimalis, mudah dipadu-padankan untuk berbagai momen."
            />
          </div>
        </motion.div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionTitle
            title="Pencapaian"
            subtitle="Dukungan komunitas yang tumbuh bersama koleksi kami."
          />
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            <Stat label="Pelanggan" value="10.000+" />
            <Stat label="Koleksi" value="50+" />
            <Stat label="Kolaborasi" value="15+" />
            <Stat label="Tahun" value="5" />
          </div>
        </motion.div>
      </section>

      {/* TEAM */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionTitle
            title="Tim Kami"
            subtitle="Profesional yang berdedikasi di balik setiap produk."
          />
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-5">
            <TeamCard
              name="Ayu Pratama"
              role="Founder & Creative Director"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop"
            />
            <TeamCard
              name="Rina Cahya"
              role="Pattern Maker"
              src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=300&auto=format&fit=crop"
            />
            <TeamCard
              name="Nanda Putri"
              role="Head of Production"
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop"
            />
            <TeamCard
              name="Dewi Lestari"
              role="Brand Manager"
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop"
            />
            <TeamCard
              name="Rafi Seto"
              role="Stylist"
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop"
            />
          </div>
        </motion.div>
      </section>

      {/* TIMELINE */}
      <section className="container mx-auto px-6 pb-24 pt-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionTitle
            title="Perjalanan"
            subtitle="Tonggak penting brand sejak debut."
          />
          <div className="mt-10 space-y-8">
            <TimelineItem
              year="2018"
              title="Debut Koleksi"
              desc="Peluncuran koleksi kapsul pertama; fokus siluet minimalis."
            />
            <TimelineItem
              year="2020"
              title="Runway & Produksi"
              desc="Showcase terbatas dan peningkatan kapasitas produksi."
            />
            <TimelineItem
              year="2023"
              title="Ekspansi & Kolaborasi"
              desc="Kolaborasi dengan kreator lokal dan perluasan distribusi."
            />
            <TimelineItem
              year="2025"
              title="Flagship & Sustainability"
              desc="Pembukaan flagship store dan lini bahan berkelanjutan."
              last
            />
          </div>
        </motion.div>
      </section>
    </main>
  );
}