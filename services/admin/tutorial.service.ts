import { apiSlice } from "../base-query";
import { Tutorial } from "@/types/admin/tutorial"; 

export const alumniApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Tutorial Categories (with pagination)
    getTutorialList: builder.query<
      {
        data: Tutorial[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/web/tutorials`,
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
          data: Tutorial[];
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

    // 🔍 Get Tutorial Category by Slug
    getTutorialBySlug: builder.query<Tutorial, string>({
      query: (slug) => ({
        url: `/web/tutorials/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Tutorial;
      }) => response.data,
    }),

    // ➕ Create Tutorial Category
    createTutorial: builder.mutation<Tutorial, FormData>({
      query: (payload) => ({
        url: `/web/tutorials`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Tutorial;
      }) => response.data,
    }),

    // ✏️ Update Tutorial Category by Slug
    updateTutorial: builder.mutation<
      Tutorial,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/web/tutorial/${slug}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Tutorial;
      }) => response.data,
    }),

    // ❌ Delete Tutorial Category by Slug
    deleteTutorial: builder.mutation<
      { code: number; message: string },
      string
    >({
      query: (slug) => ({
        url: `/web/tutorials/${slug}`,
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
  useGetTutorialListQuery,
  useGetTutorialBySlugQuery,
  useCreateTutorialMutation,
  useUpdateTutorialMutation,
  useDeleteTutorialMutation,
} = alumniApi;