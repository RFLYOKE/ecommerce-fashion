import { apiSlice } from "../base-query";
import { ProductMerk } from "@/types/master/product-merk";

export const productMerkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Product Merks (with pagination)
    getProductMerkList: builder.query<
      {
        data: ProductMerk[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/master/product-merks`,
        method: "GET",
        params: {
          page,
          paginate,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: ProductMerk[];
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

    // 🔍 Get Product Merk by Slug
    getProductMerkBySlug: builder.query<ProductMerk, string>({
      query: (slug) => ({
        url: `/master/product-merks/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductMerk;
      }) => response.data,
    }),

    // ➕ Create Product Merk
    createProductMerk: builder.mutation<ProductMerk, FormData>({
      query: (payload) => ({
        url: `/master/product-merks`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductMerk;
      }) => response.data,
    }),

    // ✏️ Update Product Merk by Slug
    updateProductMerk: builder.mutation<
      ProductMerk,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/master/product-merks/${slug}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductMerk;
      }) => response.data,
    }),

    // ❌ Delete Product Merk by Slug
    deleteProductMerk: builder.mutation<
      { code: number; message: string },
      string
    >({
      query: (slug) => ({
        url: `/master/product-merks/${slug}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductMerkListQuery,
  useGetProductMerkBySlugQuery,
  useCreateProductMerkMutation,
  useUpdateProductMerkMutation,
  useDeleteProductMerkMutation,
} = productMerkApi;