import { apiSlice } from "./base-query";
import type { Address } from "@/types/address";

export const userAddressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All User Addresses (with pagination)
    getUserAddressList: builder.query<
      {
        data: Address[];
        total: number;
        pageTotal: number;
        currentPage: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) =>
        `/user-address?page=${page}&paginate=${paginate}`,
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Address[];
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

    // ✅ Get Address by ID
    getUserAddressById: builder.query<Address, number>({
      query: (id) => `/user-address/${id}`,
      transformResponse: (response: {
        code: number;
        message: string;
        data: Address;
      }) => response.data,
    }),

    // ✅ Create Address
    // Note: user_id bisa diisi dari session (session.user.id) saat memanggil mutation ini.
    createUserAddress: builder.mutation<Address, Partial<Omit<Address, "id">>>({
      query: (payload) => ({
        url: `/user-address`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Address;
      }) => response.data,
    }),

    // ✅ Update Address
    updateUserAddress: builder.mutation<
      Address,
      { id: number; payload: Partial<Omit<Address, "id">> }
    >({
      query: ({ id, payload }) => ({
        url: `/user-address/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Address;
      }) => response.data,
    }),

    // ✅ Delete Address
    deleteUserAddress: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/user-address/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => ({ message: response.message }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserAddressListQuery,
  useGetUserAddressByIdQuery,
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} = userAddressApi;