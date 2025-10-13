export interface RajaOngkriCost {
  shop_id: number; // Populate by shop id nanti pas mau transaksi
  destination: string; // Dari get district
  weight: number; // Total weight dari product yang mau di checkout
  height: number; // Total
  length: number; // Total
  width: number; // Total
  diameter: number; // Total
  courier: string; // jne,pos,tiki
}