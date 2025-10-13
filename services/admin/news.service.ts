import { apiSlice } from "../base-query";
import { News } from "@/types/admin/news"; 

export const alumniApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All News Categories (with pagination)
    getNewsList: builder.query<
      {
        data: News[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/web/news`,
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
          data: News[];
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

    // 🔍 Get News Category by Slug
    getNewsBySlug: builder.query<News, string>({
      query: (slug) => ({
        url: `/web/news/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: News;
      }) => response.data,
    }),

    // ➕ Create News Category
    createNews: builder.mutation<News, FormData>({
      query: (payload) => ({
        url: `/web/news`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: News;
      }) => response.data,
    }),

    // ✏️ Update News Category by Slug
    updateNews: builder.mutation<
      News,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/web/news/${slug}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: News;
      }) => response.data,
    }),

    // ❌ Delete News Category by Slug
    deleteNews: builder.mutation<
      { code: number; message: string },
      string
    >({
      query: (slug) => ({
        url: `/web/news/${slug}`,
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
  useGetNewsListQuery,
  useGetNewsBySlugQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = alumniApi;