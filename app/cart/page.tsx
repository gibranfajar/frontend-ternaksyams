"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  removeItemFromCart,
  updateItemQuantity,
} from "@/redux/slices/cartSlice";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (id: string, type: "increase" | "decrease") => {
    const item = cartItems.find((cartItem) => cartItem.sizeId === id);
    if (!item) return;

    let newQuantity =
      type === "increase" ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity < 1) newQuantity = 1;

    dispatch(
      updateItemQuantity({ sizeId: item.sizeId, quantity: newQuantity })
    );
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItemFromCart(id));
  };

  const subTotal = cartItems.reduce(
    (acc, item) =>
      acc + Number((item.price_discount ?? item.price) * item.quantity),
    0
  );

  const proceedCheckout = async (asGuest: boolean) => {
    try {
      setLoading(true);
      router.push("/checkout");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Gagal memproses checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }
    await proceedCheckout(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <h1 className="text-2xl font-semibold mb-4">Keranjang Kosong</h1>
          <p className="text-gray-600 mb-8">
            Tidak ada produk dalam keranjang.
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-primary text-white rounded-lg inline-block"
          >
            Lanjutkan Belanja
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

          {/* --- DESKTOP VIEW: Table (Hidden on Mobile) --- */}
          <div className="hidden md:block overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    PRODUK
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    HARGA
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">
                    JUMLAH
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    TOTAL
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const unit = Number(item.price_discount ?? item.price);
                  return (
                    <tr key={item.sizeId}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.sizeName} | {item.flavourName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">
                          Rp {unit.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center space-x-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.sizeId, "decrease")
                            }
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.sizeId, "increase")
                            }
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        Rp {(unit * item.quantity).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRemoveItem(item.sizeId)}
                          className="text-red-500 hover:underline text-sm font-medium"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE VIEW: Card List (Hidden on Desktop) --- */}
          <div className="md:hidden space-y-4">
            {cartItems.map((item) => {
              const unit = Number(item.price_discount ?? item.price);
              return (
                <div
                  key={item.sizeId}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 leading-tight">
                          {item.productName}
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item.sizeId)}
                          className="text-red-500 p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.sizeName} • {item.flavourName}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        Rp {unit.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.sizeId, "decrease")
                          }
                          className="w-8 h-8 text-xl text-gray-600"
                        >
                          -
                        </button>
                        <span className="px-3 font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.sizeId, "increase")
                          }
                          className="w-8 h-8 text-xl text-gray-600"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold text-gray-900">
                        Total: Rp {(unit * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- FOOTER: Summary & Actions --- */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-gray-600">
                Total Pembayaran
              </span>
              <span className="text-2xl font-bold text-primary">
                Rp {subTotal.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Link
                href="/shop"
                className="w-full md:w-auto text-center order-2 md:order-1 text-gray-600 hover:text-primary font-medium text-sm"
              >
                ← Lanjutkan Belanja
              </Link>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full md:flex-1 md:max-w-xs ml-auto order-1 md:order-2 px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Checkout Sekarang"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal remains the same but with responsive p-6 vs md:p-8 */}
      {showModal && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-[500px] rounded-2xl bg-white p-6 md:p-10 shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Konten Modal Anda */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#0E5A45] mb-4 text-center">
              Hai, Belum Masuk Akun?
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Silakan masuk untuk mempermudah pelacakan pesanan Anda.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  router.push("/login?redirect=/checkout");
                }}
                className="w-full py-4 bg-[#0E5A45] text-white rounded-xl font-bold"
              >
                Masuk Akun
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  router.push("/register?redirect=/checkout");
                }}
                className="w-full py-4 border-2 border-[#0E5A45] text-[#0E5A45] rounded-xl font-bold"
              >
                Daftar Akun
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  proceedCheckout(true);
                }}
                className="w-full py-4 text-gray-500 text-sm font-medium hover:underline"
              >
                Lanjut sebagai tamu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
