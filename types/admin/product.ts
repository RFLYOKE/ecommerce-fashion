import { ProductCategory } from "../master/product-category";
import { ProductMerk } from "../master/product-merk";

export interface Product {
  id: number;
  shop_id: number | string | null;
  product_category_id: number | null;
  product_category: ProductCategory;
  product_merk_id: number | null;
  product_merk: ProductMerk;
  category_name: string;
  category_slug: string;
  postal_code: string;
  address_line_1: string;
  merk_name: string;
  merk_slug: string;
  name: string;
  slug: string;
  quantity: number;
  description: string;
  price: number;
  rating: number | string;
  total_reviews: number;
  duration: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  diameter: number;
  status: boolean | number;
  image: File | string | null;
  image_2: File | string | null;
  image_3: File | string | null;
  image_4: File | string | null;
  image_5: File | string | null;
  image_6: File | string | null;
  image_7: File | string | null;

  kecamatan?: string;
  terlaris?: boolean;
  terbaru?: boolean;
}