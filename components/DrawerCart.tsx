"use client";

import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

// Definisikan tipe props
interface DrawerCartProps {
  onClose: () => void;
  isOpen: boolean; // Tambahan: Prop untuk mengontrol animasi
}

const DrawerCart = ({ onClose, isOpen }: DrawerCartProps) => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);

  const subTotal = cartItems.reduce((acc, item) => acc + item.total, 0);

  // Class untuk animasi slide-in/slide-out pada drawer
  const drawerClasses = `
    fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-50 flex flex-col
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `;

  // Class untuk overlay gelap (backdrop)
  const overlayClasses = `
    fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out
    ${
      isOpen
        ? "opacity-50 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }
  `;

  return (
    <>
      {/* Overlay Gelap */}
      <div
        className={overlayClasses}
        onClick={onClose} // Tutup drawer saat klik overlay
        aria-hidden="true"
      />

      {/* Konten Drawer */}
      <div className={drawerClasses}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <Link
            href="/cart"
            className="font-bold text-primary hover:text-green-700"
            onClick={onClose} // Tutup drawer saat klik link
          >
            Lihat Semua
          </Link>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Tutup
          </button>
        </div>

        {/* Isi Cart */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center">Keranjang kosong</p>
          ) : (
            cartItems.map((item, idx) => {
              const hasDiscount =
                item.price_discount != null &&
                Number(item.price_discount) < Number(item.price);
              const displayUnit = (item.price_discount ?? item.price) as number;

              return (
                <div
                  key={`${item.productName}-${item.flavourId}-${item.sizeId}-${idx}`}
                  className="flex items-start space-x-3"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.productName}</h3>
                    <p className="text-xs text-gray-500">
                      {item.sizeName} - {item.flavourName}
                    </p>

                    {/* Harga */}
                    {hasDiscount ? (
                      <div className="flex items-center space-x-2">
                        <span className="line-through text-gray-400 text-sm">
                          Rp {Number(item.price).toLocaleString()}
                        </span>
                        <span className="text-gray-800 font-semibold text-sm">
                          Rp {Number(displayUnit).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-800 font-semibold text-sm">
                        Rp {Number(displayUnit).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    x{item.quantity}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-300">
            <div className="flex justify-between mb-3">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">
                Rp {subTotal.toLocaleString()}
              </span>
            </div>
            <Link
              href="/checkout"
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-center block hover:bg-primary/90 transition-colors"
              onClick={onClose}
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default DrawerCart;
