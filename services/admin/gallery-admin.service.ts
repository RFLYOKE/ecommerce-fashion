// src/services/admin/gallery.service.ts
import { apiSlice } from "../base-query";
import { GaleriItem } from "@/types/gallery";

export const galleryAdminApi = apiSlice.injectEndpoints({
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
        url: `/web/galleries`,
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
        url: `/web/galleries/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: GaleriItem;
      }) => response.data,
    }),

    // ➕ Create Gallery
    createGallery: builder.mutation<GaleriItem, FormData>({
      query: (payload) => ({
        url: `/web/galleries`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: GaleriItem;
      }) => response.data,
    }),

    // ✏️ Update Gallery by Slug
    updateGallery: builder.mutation<
      GaleriItem,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/web/galleries/${slug}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: GaleriItem;
      }) => response.data,
    }),

    // ❌ Delete Gallery by Slug
    deleteGallery: builder.mutation<{ code: number; message: string }, string>({
      query: (slug) => ({
        url: `/web/galleries/${slug}`,
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
  useGetGalleryListQuery,
  useGetGalleryBySlugQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} = galleryAdminApi;