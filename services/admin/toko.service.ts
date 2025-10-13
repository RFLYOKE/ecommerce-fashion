import { apiSlice } from "../base-query";
import { Toko } from "@/types/admin/toko"; 

export const tokoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Toko Categories (with pagination)
    getTokoList: builder.query<
      {
        data: Toko[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/shop`,
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
          data: Toko[];
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

    // 🔍 Get Toko Category by Slug
    getTokoBySlug: builder.query<Toko, string>({
      query: (slug) => ({
        url: `/shop/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Toko;
      }) => response.data,
    }),

    // ➕ Create Toko Category
    createToko: builder.mutation<Toko, FormData>({
      query: (payload) => ({
        url: `/shop`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Toko;
      }) => response.data,
    }),

    // ✏️ Update Toko Category by Slug
    updateToko: builder.mutation<
      Toko,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/shop/${slug}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Toko;
      }) => response.data,
    }),

    // 🔄 Update Toko Status by ID
    updateTokoStatus: builder.mutation<
      Toko,
      { slug: string; status: boolean } // Changed from number to boolean
    >({
      query: ({ slug, status }) => ({
        url: `/shop/${slug}/status`,
        method: "PUT",
        body: {
          status,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Toko;
      }) => response.data,
    }),

    // ❌ Delete Toko Category by Slug
    deleteToko: builder.mutation<
      { code: number; message: string },
      string
    >({
      query: (slug) => ({
        url: `/shop/${slug}`,
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
  useGetTokoListQuery,
  useGetTokoBySlugQuery,
  useCreateTokoMutation,
  useUpdateTokoMutation,
  useUpdateTokoStatusMutation,
  useDeleteTokoMutation,
} = tokoApi;