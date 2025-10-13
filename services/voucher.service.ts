import { apiSlice } from "./base-query";
import { Voucher } from "@/types/voucher";

export const voucherApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All Vouchers (with pagination)
    getVoucherList: builder.query<
      {
        data: Voucher[];
        total: number;
        pageTotal: number;
        currentPage: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) =>
        `/voucher?page=${page}&paginate=${paginate}`,
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Voucher[];
          total: number;
          last_page: number;
        };
      }) => ({
        data: response.data.data,
        total: response.data.total,
        pageTotal: response.data.last_page,
        currentPage: response.data.current_page,
      }),
    }),

    // ✅ Get Voucher by ID
    getVoucherById: builder.query<Voucher, number>({
      query: (id) => `/voucher/${id}`,
      transformResponse: (response: {
        code: number;
        message: string;
        data: Voucher;
      }) => response.data,
    }),

    // ✅ Create Voucher
    createVoucher: builder.mutation<
      Voucher,
      Partial<Omit<Voucher, "id" | "created_at" | "updated_at">>
    >({
      query: (payload) => ({
        url: `/voucher`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Voucher;
      }) => response.data,
    }),

    // ✅ Update Voucher
    updateVoucher: builder.mutation<
      Voucher,
      {
        id: number;
        payload: Partial<Omit<Voucher, "id" | "created_at" | "updated_at">>;
      }
    >({
      query: ({ id, payload }) => ({
        url: `/voucher/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Voucher;
      }) => response.data,
    }),

    // ✅ Delete Voucher
    deleteVoucher: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/voucher/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => ({
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVoucherListQuery,
  useGetVoucherByIdQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} = voucherApi;