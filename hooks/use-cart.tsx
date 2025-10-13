import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/admin/product";

// Tambahkan properti 'quantity' ke tipe Product untuk menyimpan jumlah produk di keranjang.
export type CartItem = Product & {
  quantity: number;
};

type CartStore = {
  isOpen: boolean;
  cartItems: CartItem[]; // Ubah tipe menjadi CartItem[]
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  increaseItemQuantity: (id: number) => void; // Fungsi baru untuk menambah kuantitas
  decreaseItemQuantity: (id: number) => void; // Fungsi baru untuk mengurangi kuantitas
  clearCart: () => void; // Fungsi baru untuk menghapus semua item dan clear cache
  getTotalItems: () => number; // Fungsi tambahan untuk mendapatkan total item
  getTotalPrice: () => number; // Fungsi tambahan untuk mendapatkan total harga
};

const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      cartItems: [],
      
      open: () => set({ isOpen: true }),
      
      close: () => set({ isOpen: false }),
      
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addItem: (product) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === product.id
          );
          
          if (existingItem) {
            // Jika produk sudah ada, tambahkan kuantitasnya
            const updatedCartItems = state.cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            return { cartItems: updatedCartItems };
          } else {
            // Jika produk belum ada, tambahkan produk baru dengan kuantitas 1
            return {
              cartItems: [...state.cartItems, { ...product, quantity: 1 }],
            };
          }
        });
      },
      
      removeItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
      
      increaseItemQuantity: (id) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));
      },
      
      decreaseItemQuantity: (id) => {
        set((state) => {
          const itemToDecrease = state.cartItems.find((item) => item.id === id);
          
          if (itemToDecrease && itemToDecrease.quantity > 1) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            };
          } else {
            // Jika kuantitas 1, hapus item dari keranjang
            return {
              cartItems: state.cartItems.filter((item) => item.id !== id),
            };
          }
        });
      },
      
      // Fungsi untuk menghapus semua item dari keranjang
      clearCart: () => set({ cartItems: [] }),
      
      // Fungsi tambahan untuk mendapatkan total jumlah item
      getTotalItems: () => {
        const state = get();
        return state.cartItems.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Fungsi tambahan untuk mendapatkan total harga (asumsi ada properti price di Product)
      getTotalPrice: () => {
        const state = get();
        return state.cartItems.reduce(
          (total, item) => total + (item.price || 0) * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);


export default useCart;