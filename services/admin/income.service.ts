import { apiSlice } from "../base-query";
import { 
  Income, 
  IncomeListResponse,
  IncomeListParams,
  IncomeApiResponse
} from "@/types/admin/income";

// Create Income request
export interface CreateIncomeRequest {
  amount: number;
  received_at: string; // Changed from incurred_at to received_at
  note: string;
  category?: string;
  income_category_id?: number; // Changed from expense_category_id to income_category_id
  source_type?: string;
  source_id?: number;
}

// Update Income request
export interface UpdateIncomeRequest {
  amount: number;
  received_at: string; // Changed from incurred_at to received_at
  note: string;
  category?: string;
  income_category_id?: number; // Changed from expense_category_id to income_category_id
  source_type?: string;
  source_id?: number;
}

export const incomeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Income Data (with pagination)
    getIncomeList: builder.query<
      IncomeListResponse,
      IncomeListParams
    >({
      query: ({ page = 1, paginate = 10, search, category_id, start_date, end_date }) => ({
        url: `/cash/income`,
        method: "GET",
        params: {
          page,
          paginate,
          ...(search && { search }),
          ...(category_id && { category_id }),
          ...(start_date && { start_date }),
          ...(end_date && { end_date }),
        },
      }),
      transformResponse: (response: IncomeApiResponse<IncomeListResponse>) => response.data,
    }),

    // 🔍 Get Income Detail by ID
    getIncomeById: builder.query<Income, number>({
      query: (id) => ({
        url: `/cash/income/${id}`,
        method: "GET",
      }),
      transformResponse: (response: IncomeApiResponse<Income>) => response.data,
    }),

    // ➕ Create Income
    createIncome: builder.mutation<
      Income,
      CreateIncomeRequest
    >({
      query: (payload) => ({
        url: `/cash/income`,
        method: "POST",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: IncomeApiResponse<Income>) => response.data,
    }),

    // ✏️ Update Income by ID
    updateIncome: builder.mutation<
      Income,
      { id: number; payload: UpdateIncomeRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/cash/income/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: IncomeApiResponse<Income>) => response.data,
    }),

    // ❌ Delete Income by ID
    deleteIncome: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/cash/income/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: IncomeApiResponse<null>) => ({
        code: response.code,
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIncomeListQuery,
  useGetIncomeByIdQuery,
  useCreateIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
} = incomeApi;
