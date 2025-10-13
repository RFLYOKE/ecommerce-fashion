// Expense interface based on API response
export interface Expense {
  id: number;
  expense_category_id: number | null;
  source_type: string | null;
  source_id: number | null;
  amount: number;
  incurred_at: string;
  note: string;
  created_at: string;
  updated_at: string;
  category: ExpenseCategory | null;
  source: any | null; // Can be expanded based on source_type
}

// Expense Category interface
export interface ExpenseCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Expense list query parameters
export interface ExpenseListParams {
  page?: number;
  paginate?: number;
  search?: string;
  category_id?: number;
  start_date?: string;
  end_date?: string;
}

// Expense list response structure
export interface ExpenseListResponse {
  data: Expense[];
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

// API response wrapper
export interface ExpenseApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
