export interface Address {
  id: number;
  user_id: number;
  rajaongkir_province_id: number | null;
  rajaongkir_city_id: number | null;
  rajaongkir_district_id: number | null;
  address_line_1: string;
  address_line_2?: string | null;
  postal_code: string;
  is_default: boolean;
}
