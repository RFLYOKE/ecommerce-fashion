import { apiSlice } from "./base-query";

export interface ShopProduct {
  id: number;
  shop_id: number;
  product_category_id: number;
  product_merk_id: number;
  category_name: string;
  category_slug: string;
  merk_name: string;
  merk_slug: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  rating: string;
  total_reviews: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  duration?: number;
  image: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
  image_6: string;
  image_7: string;
  media: Array<{
    id: number;
    model_type: string;
    model_id: number;
    uuid: string;
    collection_name: string;
    name: string;
    file_name: string;
    mime_type: string;
    disk: string;
    conversions_disk: string;
    size: number;
    manipulations: unknown[];
    custom_properties: unknown[];
    generated_conversions: unknown[];
    responsive_images: unknown[];
    order_column: number;
    created_at: string;
    updated_at: string;
    original_url: string;
    preview_url: string;
  }>;
}

export interface ShopProductResponse {
  current_page: number;
  data: ShopProduct[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const shopProductApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get shop products (services)
    getShopProducts: builder.query<
      ShopProductResponse,
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/shop/products`,
        method: "GET",
        params: {
          page,
          paginate,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ShopProductResponse;
      }) => response.data,
    }),
  }),
});

export const { useGetShopProductsQuery } = shopProductApi;
