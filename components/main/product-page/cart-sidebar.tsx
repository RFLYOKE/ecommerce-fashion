// File: components/main/product-page/cart-sidebar.tsx
import React from 'react';
import { CartItem } from '@/hooks/use-cart'; // Import the CartItem type

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[]; // Use the CartItem type from your hook
  onRemove: (id: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove 
}) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Keranjang Belanja</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Keranjang kosong
              </p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      Rp {((item.price || 0) * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
          
          {/* Total */}
          {items.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-green-600">
                  Rp {items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0).toLocaleString('id-ID')}
                </span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;