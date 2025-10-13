export type Berita = {
  id: number;
  title: string;
  image: string;
  content: string;
  date: string;
  kategori: string;
  isPopular?: boolean;
};