export interface News {
  id: number;
  title: string;
  slug?: string;
  content: string;
  published_at: string;
  image: File | string;
}