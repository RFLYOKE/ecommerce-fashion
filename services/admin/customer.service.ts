import { apiSlice } from "../base-query";
import { 
  Customer, 
  CustomerListResponse,
  CustomerListParams,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerApiResponse
} from "@/types/admin/customer";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Customers (with pagination)
    getCustomerList: builder.query<
      CustomerListResponse,
      CustomerListParams
    >({
      query: ({ page = 1, paginate = 10, search }) => ({
        url: `/user`,
        method: "GET",
        params: {
          page,
          paginate,
          ...(search && { search }),
        },
      }),
      transformResponse: (response: CustomerApiResponse<CustomerListResponse>) => response.data,
    }),

    // 🔍 Get Income Category by ID
    getCustomerById: builder.query<Customer, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      transformResponse: (response: CustomerApiResponse<Customer>) => response.data,
    }),

    // ➕ Create Income Category
    createCustomer: builder.mutation<
      Customer,
      CreateCustomerRequest
    >({
      query: (payload) => ({
        url: `/user`,
        method: "POST",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: CustomerApiResponse<Customer>) => response.data,
    }),

    // ✏️ Update Income Category by ID
    updateCustomer: builder.mutation<
      Customer,
      { id: number; payload: UpdateCustomerRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: CustomerApiResponse<Customer>) => response.data,
    }),

    // ❌ Delete Income Category by ID
    deleteCustomer: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: CustomerApiResponse<null>) => ({
        code: response.code,
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCustomerListQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
