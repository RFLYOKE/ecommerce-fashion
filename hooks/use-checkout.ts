"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import {
  useCreateTransactionMutation,
  useCreatePublicTransactionMutation,
} from "@/services/admin/transaction.service";

import type {
  CheckoutDeps,
  StoredCartItem,
  ShippingCostOption,
  PrivateDetailItem,
  PublicDetailItem,
} from "@/types/checkout";
import type { CreateTransactionRequest } from "@/types/admin/transaction";

const STORAGE_KEY = "cart-storage";
const GUEST_INFO_KEY = "__guest_checkout_info__";

/* =========================
   Utils & Type Guards
========================= */

type GuestInfo = {
  fullName: string;
  phone: string;
  email?: string;
  address_line_1: string;
  address_line_2?: string;
  postal_code: string;
  rajaongkir_province_id: number;
  rajaongkir_city_id: number;
  rajaongkir_district_id: number;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function hasPaymentLink(
  v: unknown
): v is { payment: { account_number?: string | null } } {
  if (!isRecord(v)) return false;
  const p = v["payment"];
  if (!isRecord(p)) return false;
  const acc = (p as Record<string, unknown>)["account_number"];
  return typeof acc === "string" || acc === null;
}
function hasReference(v: unknown): v is { reference: string } {
  return isRecord(v) && typeof v["reference"] === "string";
}

function parseStorage(): StoredCartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as {
      state?: { cartItems?: StoredCartItem[] };
    };
    return Array.isArray(parsed?.state?.cartItems)
      ? parsed.state!.cartItems!
      : [];
  } catch {
    return [];
  }
}

function buildShipmentPayload(
  courier: string | null,
  method: ShippingCostOption | null,
  destinationDistrictId: number
) {
  return {
    parameter: JSON.stringify({
      destination: String(destinationDistrictId),
      weight: 1000,
      height: 0,
      length: 0,
      width: 0,
      diameter: 0,
      courier: courier ?? "jne",
    }),
    shipment_detail: JSON.stringify(method ?? null),
    courier: courier ?? "jne",
    cost: method?.cost ?? 0,
  };
}

function saveGuestInfo(info: GuestInfo): void {
  try {
    localStorage.setItem(GUEST_INFO_KEY, JSON.stringify(info));
  } catch {}
}

/** Hindari `any`: guard aman utk baca `product_variant_id` jika ada */
type MaybeVariant = { product_variant_id?: unknown };
function getVariantId(item: StoredCartItem): number | null {
  const v = (item as unknown as MaybeVariant).product_variant_id;
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/* =========================
   Hook Utama
========================= */
export function useCheckout() {
  const router = useRouter();
  const [createPrivateTx] = useCreateTransactionMutation();
  const [createPublicTx] = useCreatePublicTransactionMutation();

  const handleCheckout = useCallback(
    async (deps: CheckoutDeps) => {
      const {
        sessionEmail,
        shippingCourier,
        shippingMethod,
        shippingInfo,
        paymentType, // reserved
        paymentMethod,
        paymentChannel,
        clearCart,
      } = deps;

      // Validasi dasar
      if (
        !shippingMethod ||
        !shippingInfo.fullName ||
        !shippingInfo.address_line_1 ||
        !shippingInfo.postal_code
      ) {
        await Swal.fire({
          icon: "warning",
          title: "Lengkapi Data",
          text: "Harap lengkapi semua informasi yang diperlukan untuk melanjutkan.",
        });
        return;
      }

      const stored = parseStorage();

      /* =========================
         LOGIN → /transaction
         ========================= */
      if (sessionEmail) {
        // details utk endpoint private: WAJIB keduanya ada (number)
        const privateDetails: PrivateDetailItem[] = stored.map((item) => {
          const variantId = getVariantId(item) ?? item.id; // fallback aman
          return {
            product_id: item.id,
            product_variant_id: variantId,
            quantity: item.quantity ?? 1,
          };
        });

        const payload: CreateTransactionRequest = {
          address_line_1: shippingInfo.address_line_1,
          postal_code: shippingInfo.postal_code,
          payment_type: "automatic",
          payment_method: paymentMethod,
          payment_channel: paymentChannel,
          data: [
            {
              shop_id: 1,
              details: privateDetails,
              shipment: buildShipmentPayload(
                shippingCourier,
                shippingMethod,
                shippingInfo.rajaongkir_district_id
              ),
              customer_info: {
                name: shippingInfo.fullName,
                phone: shippingInfo.phone,
                address_line_1: shippingInfo.address_line_1,
                postal_code: shippingInfo.postal_code,
                province_id: shippingInfo.rajaongkir_province_id,
                city_id: shippingInfo.rajaongkir_city_id,
                district_id: shippingInfo.rajaongkir_district_id,
              },
            },
          ],
        };

        const result = await createPrivateTx(payload).unwrap();

        if (
          typeof result === "object" &&
          result !== null &&
          "data" in result &&
          result.data &&
          !Array.isArray(result.data)
        ) {
          const dataUnknown: unknown = result.data;

          if (hasPaymentLink(dataUnknown)) {
            const paymentLink = dataUnknown.payment.account_number ?? null;
            if (paymentLink) {
              await Swal.fire({
                icon: "success",
                title: "Pesanan Berhasil Dibuat",
                text: "Silakan lanjutkan ke halaman pembayaran.",
                confirmButtonText: "Lanjut ke Pembayaran",
                confirmButtonColor: "#000000",
              });
              window.open(paymentLink, "_blank");
              clearCart();
              router.push("/me");
              return;
            }
          }

          if (hasReference(dataUnknown)) {
            await Swal.fire({
              icon: "success",
              title: "Pesanan Dibuat",
              text: `Pesanan #${dataUnknown.reference} berhasil dibuat. Silakan cek halaman Pesanan Anda.`,
              confirmButtonText: "Lihat Pesanan Saya",
              confirmButtonColor: "#000000",
            });
            clearCart();
            router.push("/me");
            return;
          }
        }

        await Swal.fire({
          icon: "info",
          title: "Pesanan Dibuat",
          text: "Pesanan berhasil dibuat, silakan cek profil Anda.",
          confirmButtonColor: "#000000",
        });
        clearCart();
        router.push("/me");
        return;
      }

      /* =========================
         GUEST → /public/transaction
         ========================= */
      if (!shippingInfo.email) {
        await Swal.fire({
          icon: "warning",
          title: "Email diperlukan",
          text: "Masukkan alamat email untuk mengirimkan detail pesanan.",
        });
        return;
      }

      // union detail utk endpoint public
      type PublicDetailItemFixed = {
        product_id: number;
        quantity: number;
        product_variant_id?: number;
      };

      const publicDetails: PublicDetailItemFixed[] = stored.map((item) => {
        const variantId = getVariantId(item);
        const base: PublicDetailItemFixed = {
          product_id: item.id,
          quantity: item.quantity ?? 1,
        };
        if (variantId && variantId > 0) base.product_variant_id = variantId;
        return base;
      });

      type PublicTransactionRequest = {
        address_line_1: string;
        address_line_2?: string | null;
        postal_code: string;
        guest_name: string;
        guest_email: string;
        guest_phone: string;
        payment_type: "automatic" | "saldo";
        wallet_id?: number;
        data: Array<{
          shop_id: number;
          details: PublicDetailItem[];
          shipment: {
            parameter: string;
            shipment_detail: string;
            courier: string;
            cost: number;
          };
        }>;
        voucher?: number[];
      };

      const publicPayload: PublicTransactionRequest = {
        address_line_1: shippingInfo.address_line_1,
        address_line_2: shippingInfo.address_line_2 ?? null,
        postal_code: shippingInfo.postal_code,
        guest_name: shippingInfo.fullName,
        guest_email: shippingInfo.email!,
        guest_phone: shippingInfo.phone,
        payment_type: "automatic",
        data: [
          {
            shop_id: 1,
            details: publicDetails,
            shipment: buildShipmentPayload(
              shippingCourier,
              shippingMethod,
              shippingInfo.rajaongkir_district_id
            ),
          },
        ],
      };

      // Kirim ke endpoint public
      await createPublicTx(
        publicPayload as unknown as Parameters<typeof createPublicTx>[0]
      ).unwrap();

      // Prefill next time
      saveGuestInfo({
        fullName: shippingInfo.fullName,
        phone: shippingInfo.phone,
        email: shippingInfo.email,
        address_line_1: shippingInfo.address_line_1,
        address_line_2: shippingInfo.address_line_2 ?? "",
        postal_code: shippingInfo.postal_code,
        rajaongkir_province_id: shippingInfo.rajaongkir_province_id,
        rajaongkir_city_id: shippingInfo.rajaongkir_city_id,
        rajaongkir_district_id: shippingInfo.rajaongkir_district_id,
      });

      // ✅ ALERT KHUSUS GUEST
      await Swal.fire({
        icon: "success",
        title: "Pesanan Berhasil Dibuat",
        text: `Silakan cek email ${shippingInfo.email} untuk mendapatkan detail & link pembayaran. Jika tidak terlihat, periksa folder Spam/Promotions.`,
        confirmButtonColor: "#000000",
      });

      clearCart();
      router.push("/me");
    },
    [createPrivateTx, createPublicTx, router]
  );

  return { handleCheckout };
}
