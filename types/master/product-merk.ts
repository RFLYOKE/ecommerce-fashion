export interface ProductMerk {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: boolean | number;
  image: File | string;
}