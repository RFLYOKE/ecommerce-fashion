export interface ProductCategory {
  id: number;
  parent_id: number | string | null;
  name: string;
  slug: string;
  description: string;
  status: boolean | number;
  image: File | string;
}