// src/services/news.service.ts
import { apiSlice } from "./base-query";
import { News } from "@/types/admin/news";

export const newsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All News (with pagination)
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
        url: `/public/news`,
        method: "GET",
        params: { page, paginate },
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

    // 🔍 Get News by Slug (detail)
    getNewsBySlug: builder.query<News, string>({
      query: (slug) => ({
        url: `/public/news/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: News;
      }) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetNewsListQuery, useGetNewsBySlugQuery } = newsApi;