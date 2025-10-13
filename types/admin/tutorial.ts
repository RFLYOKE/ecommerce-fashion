export interface Tutorial {
  id: number;
  order: number;
  title: string;
  slug: string;
  content: string;
  link_youtube: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  image: File | string;
}