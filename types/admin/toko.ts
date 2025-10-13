// Base Transaction interface (for responses)
export interface Toko {
  id: number;
  user_id: number | string | null;
  name: string;
  slug: string;
  phone: number;
  email: string;
  address: string;
  description: string;
  latitude: string;
  longitude: string;
  rating: string;
  total_reviews: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  rajaongkir_province_id: string;
  rajaongkir_city_id: string;
  user_name: string;
  logo: string;
  banner: string;
  media: string[];
}

export interface UpdateTokoStatusRequest {
  id: string;
  status: boolean; // Changed from number to boolean
}