// data/galeriList.ts
export type GaleriItem = {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
};

export const galeriList: GaleriItem[] = [
  {
    id: 1,
    title: "Rapat Tahunan",
    image: "/images/galeri/rapat.jpeg",
    category: "Kegiatan",
    description: "Dokumentasi rapat tahunan koperasi.",
  },
  {
    id: 2,
    title: "Pelatihan Anggota",
    image: "/images/galeri/program-desa.jpeg",
    category: "Kegiatan",
    description: "Pelatihan pengembangan usaha bagi anggota.",
  },
  {
    id: 3,
    title: "Gotong Royong",
    image: "/images/galeri/gotong-royong.jpeg",
    category: "Kegiatan",
    description: "Kegiatan bersih-bersih lingkungan kantor koperasi.",
  },
  {
    id: 4,
    title: "Produk Kerajinan",
    image: "/images/galeri/kerajinan.jpeg",
    category: "Produk",
    description: "Kerajinan tangan dari anggota koperasi.",
  },
  {
    id: 5,
    title: "Pameran Produk",
    image: "/images/galeri/pameran.jpeg",
    category: "Produk",
    description: "Pameran produk lokal unggulan.",
  },
  {
    id: 6,
    title: "Makanan Olahan",
    image: "/images/galeri/makanan.jpeg",
    category: "Produk",
    description: "Produk makanan olahan buatan anggota.",
  },
  {
    id: 7,
    title: "Kunjungan ke Desa Wisata",
    image: "/images/galeri/wisata.jpeg",
    category: "Wisata",
    description: "Kegiatan wisata edukatif di desa binaan.",
  },
  {
    id: 8,
    title: "Outbound Bersama",
    image: "/images/galeri/outbond.jpeg",
    category: "Wisata",
    description: "Kegiatan outbound dan team building.",
  },
  {
    id: 9,
    title: "Family Gathering",
    image: "/images/galeri/family.jpeg",
    category: "Wisata",
    description: "Acara kumpul keluarga besar koperasi.",
  },
  {
    id: 10,
    title: "Forum Diskusi",
    image: "/images/galeri/forum.jpeg",
    category: "Kegiatan",
    description: "Diskusi terbuka untuk pengembangan koperasi.",
  },
];