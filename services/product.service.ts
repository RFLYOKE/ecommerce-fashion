// services/api/product-category.ts
import { apiSlice } from "./base-query";
import { Product } from "@/types/admin/product";
import { ProductCategory } from "@/types/master/product-category";

/* ========= Helpers ========= */
function addArrayParams<K extends "product_category_id" | "product_merk_id">(
  base: Record<string, string | number>,
  key: K,
  values?: number[]
) {
  if (!values || values.length === 0) return base;
  const withArrays: Record<string, string | number> = { ...base };
  values.forEach((v, i) => {
    withArrays[`${key}[${i}]`] = v;
  });
  return withArrays;
}

function sanitizeParams(
  params: Record<string, string | number | undefined>
): Record<string, string | number> {
  const clean: Record<string, string | number> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== ("" as unknown))
      clean[k] = v as string | number;
  });
  return clean;
}

/* ========= API ========= */
export const productCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Parent categories
    getCategoryList: builder.query<
      {
        data: ProductCategory[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/public/product-categories`,
        method: "GET",
        params: sanitizeParams({
          page,
          paginate,
          is_parent: 1,
        }),
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: ProductCategory[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    /**
     * Products (full filters)
     * Contoh pakai sorting backend terbaru/terlaris:
     * - Terbaru: orderBy: "updated_at", order: "desc"
     * - Terlaris (sesuai info backend): orderBy: "products.sales", order: "desc"
     */
    getProductList: builder.query<
      {
        data: Product[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      {
        page: number;
        paginate: number;
        orderBy?: string; // e.g. "updated_at" atau "products.sales"
        order?: "asc" | "desc"; // default diset di pemanggil
        searchBySpecific?: string;
        search?: string;
        product_category_id?: number[]; // dikirim sbg product_category_id[0]=...
        product_merk_id?: number[]; // dikirim sbg product_merk_id[0]=...
        shop_id?: number;
      }
    >({
      query: ({
        page,
        paginate,
        orderBy,
        order,
        searchBySpecific,
        search,
        product_category_id,
        product_merk_id,
        shop_id,
      }) => {
        // base scalar params
        let params = sanitizeParams({
          page,
          paginate,
          orderBy,
          order,
          searchBySpecific,
          search,
          shop_id,
        });

        // array params dalam bracket notation
        params = addArrayParams(
          params,
          "product_category_id",
          product_category_id
        );
        params = addArrayParams(params, "product_merk_id", product_merk_id);

        return {
          url: `/public/products`,
          method: "GET",
          params,
        };
      },
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Product[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // Product by slug
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => ({
        url: `/public/products/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Product;
      }) => response.data,
    }),

    // Variants by slug (shop scope)
    getProductVariantBySlug: builder.query<Product, string>({
      query: (slug) => ({
        url: `/shop/products/${slug}/variants`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Product;
      }) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoryListQuery,
  useGetProductListQuery,
  useGetProductBySlugQuery,
  useGetProductVariantBySlugQuery,
} = productCategoryApi;