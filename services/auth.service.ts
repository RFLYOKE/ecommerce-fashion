import { apiSlice } from "./base-query";
import { User } from "@/types/user";

// Define a type for the shipping cost payload and response
interface ShippingCostPayload {
  shop_id: number;
  destination: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  diameter: number;
  courier: string;
}

interface ShippingCostResponse {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔑 Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // 📝 Register
    register: builder.mutation({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload,
      }),
    }),

    // 📧 Resend Verification Email
    resendVerification: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: "/email/resend",
        method: "POST",
        body: { email },
      }),
    }),

    // 🚪 Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // 👤 Get current user
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: User;
      }) => response.data,
    }),

    // ✏️ Update current user profile
    updateCurrentUser: builder.mutation<User, FormData>({
      query: (payload) => ({
        url: "/me?_method=PUT",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: User;
      }) => response.data,
    }),

    // 📦 Check shipping cost (newly added endpoint)
    checkShippingCost: builder.query<ShippingCostResponse[], ShippingCostPayload>({
      query: (payload) => ({
        url: "/rajaongkir/cost",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ShippingCostResponse[];
      }) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Failed to fetch shipping costs.");
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useResendVerificationMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useCheckShippingCostQuery,
} = authApi;