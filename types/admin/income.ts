// Income interface based on API response
export interface Income {
  id: number;
  income_category_id: number | null;
  source_type: string | null;
  source_id: number | null;
  amount: number;
  received_at: string;
  note: string;
  created_at: string;
  updated_at: string;
  category: IncomeCategory | null;
  source: any | null; // Can be expanded based on source_type
}

// Income Category interface
export interface IncomeCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Income list query parameters
export interface IncomeListParams {
  page?: number;
  paginate?: number;
  search?: string;
  category_id?: number;
  start_date?: string;
  end_date?: string;
}

// Income list response structure
export interface IncomeListResponse {
  data: Income[];
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
export interface IncomeApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
