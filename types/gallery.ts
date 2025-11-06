export interface Media {
  id: number;
  original_url: string;
}

export interface GaleriItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  published_at: string;
  created_at: string;
  image?: File | string | null;
  media?: Media[];
}
