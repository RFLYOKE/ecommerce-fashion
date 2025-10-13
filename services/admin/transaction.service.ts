import { apiSlice } from "../base-query";
import { 
  Transaction, 
  CreateTransactionPayload,
  CreateTransactionRequest, 
  CreateTransactionResponse, 
  CreateTransactionFrontendRequest,
  CreateTransactionFrontendResponse
} from "@/types/admin/transaction";

type Shipment = Record<string, unknown>;

type ProductSummary = {
  id: number;
  shop_id: number;
  product_category_id?: number;
  product_merk_id?: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  rating: number | string;
  total_reviews: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  duration?: number;
  image?: string;
  image_2?: string;
  media?: Array<{
    id: number;
    original_url: string;
  }>;
};

type TransactionStoreDetail = {
  id: number;
  transaction_id: number;
  shop_id: number;
  receipt_code: string | null;
  courier: string;
  shipment_detail: string;
  shipment_cost: number;
  total: number;
  shipment_status: number;
  created_at: string;
  updated_at: string;
  shipment_parameter: string;
  shop: {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    phone: string;
    email: string;
    address: string;
    description: string;
    latitude: string | null;
    longitude: string | null;
    rating: string;
    total_reviews: number;
    status: boolean;
    created_at: string;
    updated_at: string;
    rajaongkir_province_id: number;
    rajaongkir_city_id: number;
    rajaongkir_district_id: number;
  };
  shipments: Shipment[];
  details: Array<{
    id: number;
    transaction_id: number;
    transaction_store_id: number;
    product_id: number;
    product_detail: string;
    quantity: number;
    price: number;
    total: number;
    created_at: string;
    updated_at: string;
    product: ProductSummary;
  }>;
};

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Transaction Categories (with pagination)
    getTransactionList: builder.query<
      {
        data: Transaction[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; user_id?: number }
    >({
      query: ({ page, paginate, user_id }) => ({
        url: `/transaction`,
        method: "GET",
        params: {
          page,
          paginate,
          user_id,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Transaction[];
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

    // 🔍 Get Transaction Category by Slug
    getTransactionBySlug: builder.query<Transaction, string>({
      query: (slug) => ({
        url: `/transaction/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction;
      }) => response.data,
    }),

    getTransactionById: builder.query<Transaction, string>({
      query: (id) => ({
        url: `/transaction/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction;
      }) => response.data,
    }),

    // ➕ Create Transaction (Updated for checkout payload)
    createTransaction: builder.mutation<
      CreateTransactionResponse,
      CreateTransactionRequest 
    >({
      query: (payload) => ({
        url: `/transaction`,
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction | Transaction[];
      }): CreateTransactionResponse => ({
        success: response.code === 200 || response.code === 201,
        message: response.message,
        data: response.data,
      }),
    }),

    createTransactionFrontend: builder.mutation<
      CreateTransactionFrontendResponse,
      CreateTransactionFrontendRequest
    >({
      query: (payload) => ({
        url: `/transaction`,
        method: "POST",
        body: payload, // Send JSON object instead of FormData
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: CreateTransactionPayload | CreateTransactionPayload[];
      }): CreateTransactionFrontendResponse => ({
        success: response.code === 200 || response.code === 201,
        message: response.message,
        data: response.data,
      }),
    }),

    // ➕ Create Transaction with FormData (for admin panel if needed)
    createTransactionFormData: builder.mutation<Transaction, FormData>({
      query: (payload) => ({
        url: `/transaction`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction;
      }) => response.data,
    }),

    // ✏️ Update Transaction Category by Slug
    updateTransaction: builder.mutation<
      Transaction,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/transaction/${slug}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction;
      }) => response.data,
    }),

    // 🔄 Update Transaction Status by ID
    updateTransactionStatus: builder.mutation<
      Transaction,
      { id: string; status: number }
    >({
      query: ({ id, status }) => ({
        url: `/transaction/${id}`,
        method: "PUT",
        body: {
          status,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction;
      }) => response.data,
    }),

    // 🔍 Get Transaction Shop Details by ID
    getTransactionShopById: builder.query<TransactionStoreDetail, number>({
      query: (id) => ({
        url: `/transaction/shop/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: TransactionStoreDetail;
      }) => response.data,
    }),

    // ✏️ Update Receipt Code
    updateReceiptCode: builder.mutation<
      { code: number; message: string },
      { id: number; receipt_code: string; shipment_status: number }
    >({
      query: ({ id, receipt_code, shipment_status }) => ({
        url: `/transaction/shop/${id}`,
        method: "PUT",
        body: {
          receipt_code,
          shipment_status,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction;
      }) => response,
    }),

    // ❌ Delete Transaction Category by Slug
    deleteTransaction: builder.mutation<
      { code: number; message: string },
      string
    >({
      query: (slug) => ({
        url: `/transaction/${slug}`,
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
  useGetTransactionListQuery,
  useGetTransactionBySlugQuery,
  useGetTransactionByIdQuery,
  useGetTransactionShopByIdQuery,
  useCreateTransactionMutation,
  useCreateTransactionFrontendMutation,
  useCreateTransactionFormDataMutation, // New export for FormData version
  useUpdateTransactionMutation,
  useUpdateTransactionStatusMutation,
  useUpdateReceiptCodeMutation,
  useDeleteTransactionMutation,
} = transactionApi;