"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Search } from "lucide-react";

// --- 1. Definisikan Interface untuk Struktur Data API ---

interface TrackingHistory {
  desc: string;
  date: string;
  code: string;
  status: string;
}

interface TrackingData {
  airway_bill: string;
  last_status: string;
  history: TrackingHistory[];
}

interface TransactionDetailItem {
  id: number;
  name: string;
  variant: string;
  size: string;
  original_price: number;
  discount: number;
  price: number;
  qty: number;
  total: number;
}

interface Transaction {
  id: number;
  invoice: string;
  qty_item: number;
  total: number;
  status: string;
  created_at: string;
  details: TransactionDetailItem[];
  courier: string;
  service: string;
  cost: string;
  address: string;
  resi: string | null;
  payment_method: string;
}

// --- 2. Helper Functions ---

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const sanitizedDateString = dateString.replace("T", " ").replace("Z", "");
  const date = new Date(sanitizedDateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
};

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "success":
      return "bg-green-50 text-green-700 border border-green-200";
    case "shipped":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "expired":
      return "bg-red-50 text-red-700 border border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

const calculateTotalItems = (details: TransactionDetailItem[]) => {
  return details.reduce((sum, item) => sum + item.total, 0);
};

// --- 3. Komponen Baru: TrackingModal ---

const TrackingModal: React.FC<{
  trackingData: TrackingData | null;
  onClose: () => void;
  isLoading: boolean;
}> = ({ trackingData, onClose, isLoading }) => {
  if (!trackingData && !isLoading) return null;

  return (
    <dialog className="modal" open={!!trackingData || isLoading}>
      <div className="modal-box p-0 max-w-md shadow-2xl rounded-xl">
        <div className="bg-[#155E49] py-4 px-6 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-bold text-white">Lacak Pengiriman</h3>
          <button className="text-white hover:opacity-70" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center py-10">
              <span className="loading loading-spinner loading-lg text-green-600"></span>
              <p className="mt-4 text-gray-500">Mencari informasi paket...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-gray-600 font-bold tracking-wider">
                  Tracking ID / No. Resi
                </p>
                <p className="text-lg font-black text-green-900">
                  {trackingData?.airway_bill}
                </p>
                <div className="mt-2 inline-block px-2 py-1 bg-green-600 text-white text-xs rounded">
                  {trackingData?.last_status}
                </div>
              </div>

              <div className="relative">
                {trackingData?.history.map((step, index) => {
                  // Mengecek apakah ini adalah item terakhir dalam array
                  const isLastItem = index === trackingData.history.length - 1;

                  return (
                    <div key={index} className="flex gap-4 mb-6 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            isLastItem
                              ? "bg-[#155E49] ring-4 ring-green-100" // Aktif jika item terakhir
                              : "bg-gray-300"
                          }`}
                        ></div>
                        {/* Garis penghubung tidak muncul setelah item terakhir */}
                        {!isLastItem && (
                          <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                        )}
                      </div>
                      <div className="-mt-1">
                        <p
                          className={`text-sm font-bold ${
                            isLastItem ? "text-[#155E49]" : "text-gray-700"
                          }`}
                        >
                          {step.status}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {step.desc}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 italic">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

// --- 4. Komponen Bersarang: TransactionDetailModal ---

const TransactionDetailModal: React.FC<{
  transaction: Transaction | null;
  onClose: () => void;
}> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const totalItems = calculateTotalItems(transaction.details);
  const shippingCost = parseInt(transaction.cost) || 0;
  const grandTotal = transaction.total;
  const shippingDiscount = 0;
  const voucherDiscount = 0;

  const statusDisplay =
    transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);

  return (
    <dialog
      id={`transaction_modal_${transaction.id}`}
      className="modal"
      open={!!transaction}
    >
      <div className="modal-box p-0 max-w-lg max-h-[90vh] shadow-2xl rounded-xl overflow-scroll">
        <div className="bg-[#E8F5E9] py-4 px-6 flex justify-between items-center border-b border-gray-200 sticky top-0 z-10">
          <h3 className="text-xl font-bold text-[#155E49] w-full text-center">
            Detail Transaksi
          </h3>
          <button
            className="text-gray-500 hover:text-gray-900 absolute right-4 top-4 transition-colors"
            onClick={onClose}
            aria-label="Tutup Modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 text-gray-700">
          <div className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
            <h4 className="text-lg font-bold text-[#155E49] pb-2 mb-3 border-b border-gray-100">
              Informasi Umum
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="shrink-0 font-medium">Status Pesanan</span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                    transaction.status,
                  )} uppercase`}
                >
                  {statusDisplay}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="shrink-0">No. Invoice</span>
                <span className="font-semibold text-gray-900">
                  {transaction.invoice}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="shrink-0">Tanggal Pembelian</span>
                <span>{formatDate(transaction.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-md font-bold text-[#155E49] border-b border-b-gray-200 pb-2 mb-4">
              Rincian Produk
            </h4>
            <div className="space-y-4 text-sm">
              {transaction.details.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
                >
                  <div className="pr-4">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.variant} | {item.size}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.qty} x {formatRupiah(item.price)}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-800 shrink-0">
                    {formatRupiah(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-md font-bold text-[#155E49] border-b border-b-gray-200 pb-2 mb-4">
              Informasi Pengiriman
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="shrink-0 w-32">Kurir / Layanan</span>
                <span className="font-medium text-right">
                  {transaction.courier} - {transaction.service}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="shrink-0 w-32">Biaya Kirim</span>
                <span className="font-medium text-right">
                  {formatRupiah(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="shrink-0 w-32">No. Resi</span>
                <span className="font-medium text-[#155E49] text-right">
                  {transaction.resi || "Belum Tersedia"}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="font-medium mb-1">Alamat Pengiriman:</p>
                <p className="text-xs text-gray-600 warp-break-words">
                  {transaction.address}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-md font-bold text-[#155E49] border-b border-b-gray-200 pb-2 mb-4">
              Rincian Pembayaran
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Metode Pembayaran</span>
                <span className="font-medium">
                  {transaction.payment_method}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Harga Produk</span>
                <span className="font-medium">{formatRupiah(totalItems)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Kirim</span>
                <span className="font-medium">
                  {formatRupiah(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Diskon Pengiriman</span>
                <span className="font-medium">
                  - {formatRupiah(shippingDiscount)}
                </span>
              </div>
              <div className="flex justify-between text-red-600 pb-3">
                <span>Voucher / Kupon</span>
                <span className="font-medium">
                  - {formatRupiah(voucherDiscount)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t font-extrabold text-base text-gray-900">
                <span>TOTAL PEMBAYARAN</span>
                <span>{formatRupiah(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>tutup</button>
      </form>
    </dialog>
  );
};

// --- 5. Komponen Utama: OrderHistory ---

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const ENDPOINT = `${API_URL}/transaction`;

  const handleOpenModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };

  // --- Fungsi Payment Gateway (Midtrans) ---

  // --- Fungsi Lacak API Dinamis ---
  const handleTrack = async (resi: string, courier: string) => {
    setIsTrackingLoading(true);
    try {
      // Membersihkan nama kurir agar dinamis
      // .trim() menghapus spasi di depan/belakang
      // .toLowerCase() memastikan format seragam untuk API
      const sanitizedCourier = courier.trim().toLowerCase();

      const response = await axios.get(`${API_URL}/track-order`, {
        params: {
          courier: sanitizedCourier,
          resi: resi,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ambil data dari path response: tracking.data
      if (response.data?.tracking?.data) {
        setTrackingData(response.data.tracking.data);
      } else {
        alert("Data pelacakan tidak ditemukan.");
      }
    } catch (err) {
      alert("Gagal melacak pesanan. Silakan coba lagi nanti.");
      console.error("Tracking Error:", err);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!token) {
        setError("Token autentikasi tidak ditemukan. Silakan login kembali.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get<{ data: Transaction[] }>(ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedOrders = [...response.data.data].sort(
          (a, b) => b.id - a.id,
        );

        setOrders(sortedOrders);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Gagal mengambil riwayat pesanan.",
          );
        } else {
          setError("Terjadi kesalahan yang tidak diketahui.");
        }
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, [token, ENDPOINT]);

  if (isLoading) {
    return (
      <div>
        <p className="mt-4 text-gray-500">Memuat riwayat pesanan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-6 border border-red-300 bg-red-50 rounded-xl shadow-lg">
        <p className="font-bold text-lg">⚠️ Gagal Memuat Data</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-10 border border-gray-200 bg-gray-50 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-gray-700">Order History</h2>
        <p className="mt-2 text-gray-500">Belum ada riwayat pesanan.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Riwayat Pesanan 📦
        </h2>
        <p className="mb-8 text-gray-500">
          Semua transaksi Anda tercatat di sini.
        </p>

        <div className="space-y-6">
          {orders.map((order) => {
            const mainProduct = order.details[0];
            const shippingCost = parseInt(order.cost) || 0;
            const isPending = order.status.toLowerCase() === "pending";
            const hasResi = !!order.resi;

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4">
                  <div className="mb-3 md:mb-0">
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#155E49]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <h3 className="text-lg font-bold text-gray-900">
                        {order.invoice}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 pl-7">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusBadgeClass(
                      order.status,
                    )} uppercase tracking-wider shrink-0`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div className="w-full md:w-3/5 pr-0 md:pr-6 mb-4 md:mb-0">
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-1">
                          {mainProduct.name} - {mainProduct.variant}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {mainProduct.qty} x {formatRupiah(mainProduct.price)}
                        </p>
                        {order.qty_item > 1 && (
                          <p className="text-sm text-[#155E49] mt-1 font-medium italic">
                            + {order.qty_item - 1} produk lainnya
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-4">
                          Kurir: {order.courier} - {order.service} (
                          {formatRupiah(shippingCost)})
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="flex justify-between md:justify-end items-center mb-3">
                      <span className="text-xs text-gray-500 md:text-right pr-2">
                        Total Belanja :
                      </span>
                      <span className="text-xl font-bold text-[#155E49] shrink-0">
                        {formatRupiah(order.total)}
                      </span>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                      {isPending && (
                        <button className="text-sm px-4 py-2 bg-[#0E5A45] text-white rounded-lg hover:bg-[#177158] transition-colors shadow-md font-semibold">
                          Bayar Sekarang
                        </button>
                      )}

                      {hasResi && (
                        <button
                          onClick={() =>
                            handleTrack(order.resi!, order.courier)
                          }
                          className="text-sm flex px-4 py-2 bg-[#0E5A45] text-white rounded-lg hover:bg-[#177158] transition-colors shadow-md font-semibold"
                        >
                          <Search strokeWidth={1.75} size={18} /> &nbsp; Lacak
                        </button>
                      )}

                      <button
                        className="text-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-semibold"
                        onClick={() => handleOpenModal(order)}
                      >
                        Lihat Detail
                      </button>
                    </div>
                    <div className="w-full text-right">
                      {order.resi && (
                        <div className="text-xs text-gray-400 mt-4 -mb-3">
                          <p>Tracking ID : {order.resi}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={handleCloseModal}
      />

      <TrackingModal
        trackingData={trackingData}
        isLoading={isTrackingLoading}
        onClose={() => setTrackingData(null)}
      />
    </>
  );
};

export default OrderHistory;
