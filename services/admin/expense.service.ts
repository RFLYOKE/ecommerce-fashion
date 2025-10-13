import { apiSlice } from "../base-query";
import { 
  Expense, 
  ExpenseListResponse,
  ExpenseListParams,
  ExpenseApiResponse
} from "@/types/admin/expense";

// Create Expense request
export interface CreateExpenseRequest {
  amount: number;
  incurred_at: string;
  note: string;
  category?: string;
  expense_category_id?: number;
  source_type?: string;
  source_id?: number;
}

// Update Expense request
export interface UpdateExpenseRequest {
  amount: number;
  incurred_at: string;
  note: string;
  category?: string;
  expense_category_id?: number;
  source_type?: string;
  source_id?: number;
}

export const expenseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Expense Data (with pagination)
    getExpenseList: builder.query<
      ExpenseListResponse,
      ExpenseListParams
    >({
      query: ({ page = 1, paginate = 10, search, category_id, start_date, end_date }) => ({
        url: `/cash/expense`,
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
      transformResponse: (response: ExpenseApiResponse<ExpenseListResponse>) => response.data,
    }),

    // 🔍 Get Expense Detail by ID
    getExpenseById: builder.query<Expense, number>({
      query: (id) => ({
        url: `/cash/expense/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ExpenseApiResponse<Expense>) => response.data,
    }),

    // ➕ Create Expense
    createExpense: builder.mutation<
      Expense,
      CreateExpenseRequest
    >({
      query: (payload) => ({
        url: `/cash/expense`,
        method: "POST",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: ExpenseApiResponse<Expense>) => response.data,
    }),

    // ✏️ Update Expense by ID
    updateExpense: builder.mutation<
      Expense,
      { id: number; payload: UpdateExpenseRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/cash/expense/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: ExpenseApiResponse<Expense>) => response.data,
    }),

    // ❌ Delete Expense by ID
    deleteExpense: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/cash/expense/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ExpenseApiResponse<null>) => ({
        code: response.code,
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExpenseListQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
