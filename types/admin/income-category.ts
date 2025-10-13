// Income Category interface based on API response
export interface IncomeCategory {
  id: number;
  name: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

// Income Category list query parameters
export interface IncomeCategoryListParams {
  page?: number;
  paginate?: number;
  search?: string;
}

// Income Category list response structure
export interface IncomeCategoryListResponse {
  data: IncomeCategory[];
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

// Create Income Category request
export interface CreateIncomeCategoryRequest {
  name: string;
  description: string;
  status: number; // 1 for active, 0 for inactive
}

// Update Income Category request
export interface UpdateIncomeCategoryRequest {
  name: string;
  description: string;
  status: number; // 1 for active, 0 for inactive
}

// API response wrapper
export interface IncomeCategoryApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
