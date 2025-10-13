// Expense Category interface based on API response
export interface ExpenseCategory {
  id: number;
  name: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

// Expense Category list query parameters
export interface ExpenseCategoryListParams {
  page?: number;
  paginate?: number;
  search?: string;
}

// Expense Category list response structure
export interface ExpenseCategoryListResponse {
  data: ExpenseCategory[];
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

// Create Expense Category request
export interface CreateExpenseCategoryRequest {
  name: string;
  description: string;
  status: number; // 1 for active, 0 for inactive
}

// Update Expense Category request
export interface UpdateExpenseCategoryRequest {
  name: string;
  description: string;
  status: number; // 1 for active, 0 for inactive
}

// API response wrapper
export interface ExpenseCategoryApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
