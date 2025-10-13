export interface Voucher {
  code: string;
  name: string;
  description: string;
  fixed_amount: number;
  percentage_amount: number;
  type: string; // case FIXED = 'fixed'; case PERCENTAGE = 'percentage';
  start_date: string;
  end_date: string;
  usage_limit: number;
  status: boolean;
  updated_at: string;
  created_at: string;
  id: number;
}