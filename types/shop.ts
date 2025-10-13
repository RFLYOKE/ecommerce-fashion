export interface Shop {
  id: number;
  name: string;
  phone: number | string;
  email: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  status: boolean;
  logo: File | string | null;
  banner: File | string | null;
  rajaongkir_province_id: number;
  rajaongkir_city_id: number;
  rajaongkir_district_id: number;
}

export interface Region {
  id: number;
  name: string;
}