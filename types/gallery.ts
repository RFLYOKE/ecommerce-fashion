export interface GaleriItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  published_at: string;
  image: File | string | null;
}