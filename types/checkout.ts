import type { Product } from "@/types/admin/product";
import type { PaymentMethod, PaymentChannel } from "@/types/admin/transaction";

export type PaymentType = "automatic" | "manual" | "cod";

export type StoredCartItem = Product & { quantity: number };

export interface CartItemView {
  id: number;
  product_variant_id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  inStock: boolean;
}

export interface ShippingCostOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface ShippingInfoState {
  fullName: string;
  phone: string;
  address_line_1: string;
  postal_code: string;
  rajaongkir_province_id: number;
  rajaongkir_city_id: number;
  rajaongkir_district_id: number;
  email?: string;
  address_line_2?: string;
}


/** Detail utk endpoint private (/transaction) — keduanya WAJIB */
export interface PrivateDetailItem {
  product_id: number;
  product_variant_id: number;
  quantity: number;
}

/** Detail utk endpoint public (/public/transaction) — salah satu */
export type PublicDetailItem = {
  product_id: number;
  quantity: number;
  product_variant_id?: number;
};

export interface CheckoutDeps {
  sessionEmail: string | null;
  shippingCourier: string | null;
  shippingMethod: ShippingCostOption | null;
  shippingInfo: ShippingInfoState;

  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  paymentChannel: PaymentChannel;

  clearCart: () => void;
}