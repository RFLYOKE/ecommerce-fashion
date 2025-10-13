import { apiSlice } from "../base-query";
import { 
  IncomeCategory, 
  IncomeCategoryListResponse,
  IncomeCategoryListParams,
  CreateIncomeCategoryRequest,
  UpdateIncomeCategoryRequest,
  IncomeCategoryApiResponse
} from "@/types/admin/income-category";

export const incomeCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Income Categories (with pagination)
    getIncomeCategoryList: builder.query<
      IncomeCategoryListResponse,
      IncomeCategoryListParams
    >({
      query: ({ page = 1, paginate = 10, search }) => ({
        url: `/master/income-categories`,
        method: "GET",
        params: {
          page,
          paginate,
          ...(search && { search }),
        },
      }),
      transformResponse: (response: IncomeCategoryApiResponse<IncomeCategoryListResponse>) => response.data,
    }),

    // 🔍 Get Income Category by ID
    getIncomeCategoryById: builder.query<IncomeCategory, number>({
      query: (id) => ({
        url: `/master/income-categories/${id}`,
        method: "GET",
      }),
      transformResponse: (response: IncomeCategoryApiResponse<IncomeCategory>) => response.data,
    }),

    // ➕ Create Income Category
    createIncomeCategory: builder.mutation<
      IncomeCategory,
      CreateIncomeCategoryRequest
    >({
      query: (payload) => ({
        url: `/master/income-categories`,
        method: "POST",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: IncomeCategoryApiResponse<IncomeCategory>) => response.data,
    }),

    // ✏️ Update Income Category by ID
    updateIncomeCategory: builder.mutation<
      IncomeCategory,
      { id: number; payload: UpdateIncomeCategoryRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/master/income-categories/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: IncomeCategoryApiResponse<IncomeCategory>) => response.data,
    }),

    // ❌ Delete Income Category by ID
    deleteIncomeCategory: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/income-categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: IncomeCategoryApiResponse<null>) => ({
        code: response.code,
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIncomeCategoryListQuery,
  useGetIncomeCategoryByIdQuery,
  useCreateIncomeCategoryMutation,
  useUpdateIncomeCategoryMutation,
  useDeleteIncomeCategoryMutation,
} = incomeCategoryApi;
