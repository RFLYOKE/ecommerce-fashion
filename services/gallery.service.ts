import { apiSlice } from "./base-query";
import { GaleriItem } from "@/types/gallery";

export const galleryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Galleries (with pagination)
    getGalleryList: builder.query<
      {
        data: GaleriItem[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/public/galleries`,
        method: "GET",
        params: { page, paginate },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: GaleriItem[];
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

    // 🔍 Get Gallery by Slug
    getGalleryBySlug: builder.query<GaleriItem, string>({
      query: (slug) => ({
        url: `/public/galleries/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: GaleriItem;
      }) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetGalleryListQuery, useGetGalleryBySlugQuery } = galleryApi;