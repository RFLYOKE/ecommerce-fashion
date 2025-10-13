import { apiSlice } from "../base-query";
import { ProductCategory } from "@/types/master/product-category"; 

export const productCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Product Categories (with pagination)
    getProductCategoryList: builder.query<
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
        url: `/master/product-categories`,
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

    // 🔍 Get Product Category by Slug
    getProductCategoryBySlug: builder.query<ProductCategory, string>({
      query: (slug) => ({
        url: `/master/product-categories/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductCategory;
      }) => response.data,
    }),

    // ➕ Create Product Category
    createProductCategory: builder.mutation<ProductCategory, FormData>({
      query: (payload) => ({
        url: `/master/product-categories`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductCategory;
      }) => response.data,
    }),

    // ✏️ Update Product Category by Slug
    updateProductCategory: builder.mutation<
      ProductCategory,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/master/product-categories/${slug}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductCategory;
      }) => response.data,
    }),

    // ❌ Delete Product Category by Slug
    deleteProductCategory: builder.mutation<
      { code: number; message: string },
      string
    >({
      query: (slug) => ({
        url: `/master/product-categories/${slug}`,
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
  useGetProductCategoryListQuery,
  useGetProductCategoryBySlugQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = productCategoryApi;