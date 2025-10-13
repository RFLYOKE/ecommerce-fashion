export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const mapTxnStatusToOrderStatus = (s?: number): OrderStatus => {
  switch (s) {
    case 0: // PENDING
      return "pending";
    case 1: // CAPTURED
      return "processing";
    case 2: // SETTLEMENT
      return "delivered";
    case -1: // DENY
    case -2: // EXPIRED
    case -3: // CANCEL
      return "cancelled";
    default:
      return "pending";
  }
};