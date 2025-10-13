import { apiSlice } from "../base-query";
import { 
  ExpenseCategory, 
  ExpenseCategoryListResponse,
  ExpenseCategoryListParams,
  CreateExpenseCategoryRequest,
  UpdateExpenseCategoryRequest,
  ExpenseCategoryApiResponse
} from "@/types/admin/expense-category";

export const expenseCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Expense Categories (with pagination)
    getExpenseCategoryList: builder.query<
      ExpenseCategoryListResponse,
      ExpenseCategoryListParams
    >({
      query: ({ page = 1, paginate = 10, search }) => ({
        url: `/master/expense-categories`,
        method: "GET",
        params: {
          page,
          paginate,
          ...(search && { search }),
        },
      }),
      transformResponse: (response: ExpenseCategoryApiResponse<ExpenseCategoryListResponse>) => response.data,
    }),

    // 🔍 Get Expense Category by ID
    getExpenseCategoryById: builder.query<ExpenseCategory, number>({
      query: (id) => ({
        url: `/master/expense-categories/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ExpenseCategoryApiResponse<ExpenseCategory>) => response.data,
    }),

    // ➕ Create Expense Category
    createExpenseCategory: builder.mutation<
      ExpenseCategory,
      CreateExpenseCategoryRequest
    >({
      query: (payload) => ({
        url: `/master/expense-categories`,
        method: "POST",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: ExpenseCategoryApiResponse<ExpenseCategory>) => response.data,
    }),

    // ✏️ Update Expense Category by ID
    updateExpenseCategory: builder.mutation<
      ExpenseCategory,
      { id: number; payload: UpdateExpenseCategoryRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/master/expense-categories/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: ExpenseCategoryApiResponse<ExpenseCategory>) => response.data,
    }),

    // ❌ Delete Expense Category by ID
    deleteExpenseCategory: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/expense-categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ExpenseCategoryApiResponse<null>) => ({
        code: response.code,
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExpenseCategoryListQuery,
  useGetExpenseCategoryByIdQuery,
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApi;
