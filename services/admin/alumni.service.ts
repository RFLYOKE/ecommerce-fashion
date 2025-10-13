import { apiSlice } from "../base-query";
import { Alumni } from "@/types/admin/alumni"; 

export const alumniApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Alumni Categories (with pagination)
    getAlumniList: builder.query<
      {
        data: Alumni[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/web/alumni`,
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
          data: Alumni[];
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

    // 🔍 Get Alumni Category by Slug
    getAlumniBySlug: builder.query<Alumni, string>({
      query: (slug) => ({
        url: `/web/alumni/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Alumni;
      }) => response.data,
    }),

    // ➕ Create Alumni Category
    createAlumni: builder.mutation<Alumni, FormData>({
      query: (payload) => ({
        url: `/web/alumni`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Alumni;
      }) => response.data,
    }),

    // ✏️ Update Alumni Category by Slug
    updateAlumni: builder.mutation<
      Alumni,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/web/alumni/${slug}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Alumni;
      }) => response.data,
    }),

    // ❌ Delete Alumni Category by Slug
    deleteAlumni: builder.mutation<
      { code: number; message: string },
      string
    >({
      query: (slug) => ({
        url: `/web/alumni/${slug}`,
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
  useGetAlumniListQuery,
  useGetAlumniBySlugQuery,
  useCreateAlumniMutation,
  useUpdateAlumniMutation,
  useDeleteAlumniMutation,
} = alumniApi;