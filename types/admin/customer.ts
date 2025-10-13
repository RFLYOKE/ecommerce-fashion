// Base Transaction interface (for responses)
export interface Customer {
  id: number;
  role_id: number;
  name: string;
  phone: number;
  email: string;
  email_verified_at?: string;
  password: string;
  password_confirmation: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  roles?: [];
}

export interface UpdateCustomerStatusRequest {
  id: string;
  email_verified_at: string; // Changed from number to boolean
}

// Customer list query parameters
export interface CustomerListParams {
  page?: number;
  paginate?: number;
  search?: string;
}

// Income Category list response structure
export interface CustomerListResponse {
  data: Customer[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Create Customer request
export interface CreateCustomerRequest {
  role_id: number;
  name: string;
  phone: number;
  email: string;
  password: string;
  password_confirmation: string;
  status: number;
}

// Update Customer request
export interface UpdateCustomerRequest {
  role_id: number;
  name: string;
  phone: number;
  email: string;
  password: string;
  password_confirmation: string;
  status: number;
}

// API response wrapper
export interface CustomerApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
