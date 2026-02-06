// VoucherList.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// Asumsikan path import store sudah benar
import { RootState } from "@/redux/store";
import { formatToIDR } from "@/utils/formatToIdr";

// Import ikon dari library icon (asumsi Anda menggunakan salah satu, misal 'lucide-react' atau sejenisnya)
// Jika Anda tidak menggunakan library icon, ganti ini dengan elemen SVG sederhana atau hapus.
// import { X, Zap, ShoppingBag, Truck } from "lucide-react";

// --- KONSTANTA DARI .env ---
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;
const VOUCHER_API_URL = `${BASE_API_URL}/vouchers`;

const formatExpiryDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function Placeholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl md:text-[28px] font-bold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-gray-500">{subtitle}</p>
    </div>
  );
}

// --- INTERFACES (Tetap) ---
interface Voucher {
  id: number;
  user_id: number;
  voucher_id: number;
  title: string;
  thumbnail: string;
  content: string;
  created_at: string;
  updated_at: string;
  voucher: {
    id: number;
    code: string;
    type: "transaction" | "shipping";
    target: string;
    amount_type: "percent" | "value";
    amount: number;
    max_value: number | null;
    min_transaction_value: number;
    quota: number;
    limit: number;
    start_date: string;
    end_date: string;
    status: string;
  };
}

// --- VoucherCard Component (Layout Diperbaiki) ---
function VoucherCard({
  voucher,
  onClick,
}: {
  voucher: Voucher;
  onClick: (v: Voucher) => void;
}) {
  const { title, voucher: details } = voucher;
  const { amount_type, amount, min_transaction_value, end_date, code } =
    details;

  const formattedAmount =
    amount_type === "percent" ? `${amount}%` : formatToIDR(amount);
  const maxDiscount = details.max_value
    ? `Maks. ${formatToIDR(details.max_value)}`
    : "";
  const minTransaction =
    min_transaction_value > 0
      ? `Min. Belanja ${formatToIDR(min_transaction_value)}`
      : "Tanpa Min. Belanja";
  const expiryDate = new Date(end_date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "numeric", // Ubah ke numeric agar lebih ringkas
    year: "numeric",
  });

  // Warna dan ikon yang lebih tegas
  const primaryColor = "#126e55"; // Warna hijau yang sudah Anda suka
  const lightColor = "#e6f2ee"; // Background hijau muda
  const typeLabel =
    details.type === "transaction" ? "DISKON HARGA" : "GRATIS ONGKIR";
  const typeIcon = details.type === "transaction" ? "🛍️" : "🚚"; // Ganti dengan ikon jika menggunakan library

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
      onClick={() => onClick(voucher)}
    >
      {/* Kolom Atas - Informasi Diskon (Lebih Berani & Simpel) */}
      <div
        className="flex flex-col items-center justify-center p-3 text-center"
        style={{
          background: `linear-gradient(to bottom right, ${primaryColor} 0%, #0a4837 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="absolute inset-0 bg-white opacity-10 mix-blend-overlay"></div>
        <div className="text-white relative z-10">
          <p className="text-lg uppercase font-medium leading-tight opacity-90">
            {typeIcon} {typeLabel}
          </p>
          <p className="text-4xl md:text-5xl font-extrabold leading-none mt-1">
            {formattedAmount}
          </p>
          {amount_type === "percent" && (
            <p className="text-xs mt-1 font-semibold opacity-90">OFF</p>
          )}
        </div>
      </div>

      {/* Kolom Bawah - Detail Voucher */}
      <div className=" p-4 flex flex-col justify-between relative">
        <div className="pl-2">
          <h3 className="text-base md:text-xl font-bold text-gray-900 line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 font-medium">
            {minTransaction}
          </p>
          {maxDiscount && (
            <p className="text-xs text-gray-500 mt-1 font-normal italic">
              {maxDiscount}
            </p>
          )}
        </div>

        <div className="mt-3 flex justify-between items-end text-sm pl-2">
          {/* Tanggal Kedaluwarsa */}
          <span className="text-xs text-red-600 font-semibold flex items-center">
            <span className="mr-1">⚠️</span> Exp: {expiryDate}
          </span>
          {/* Kode Voucher - Lebih Menonjol */}
          <span
            className="px-3 py-1 text-xs font-extrabold rounded-full border-2"
            style={{
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: lightColor,
            }}
          >
            {code}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- VoucherDetailModal Component (Modal Diperbaiki menggunakan daisyUI) ---
function VoucherDetailModal({
  isOpen,
  onClose,
  voucher,
}: {
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher | null;
}) {
  const modalRef = useRef<HTMLDialogElement>(null);

  // Efek untuk mengontrol status 'modal-open'
  useEffect(() => {
    if (modalRef.current) {
      if (isOpen) {
        // Menggunakan showModal untuk menangani focus trap dan interaksi
        modalRef.current.showModal();
        // Menambahkan event listener untuk menutup modal saat klik di luar
        const handleClickOutside = (e: MouseEvent) => {
          if (modalRef.current && e.target === modalRef.current) {
            onClose();
          }
        };
        modalRef.current.addEventListener("click", handleClickOutside);

        return () => {
          modalRef.current?.removeEventListener("click", handleClickOutside);
        };
      } else {
        // Menggunakan close untuk transisi keluar yang smooth
        modalRef.current.close();
      }
    }
  }, [isOpen, onClose]);

  if (!voucher) return null;

  const expiryDate = formatExpiryDate(voucher.voucher.end_date);
  const minTransactionFormatted = formatToIDR(
    voucher.voucher.min_transaction_value
  );
  const imageUrl = `${BASE_IMAGE_URL}${voucher.thumbnail}`;
  const primaryColor = "#126e55";

  // Mengganti div luar dengan elemen <dialog> daisyUI
  return (
    <dialog
      ref={modalRef}
      className={`modal ${isOpen ? "modal-open" : ""}`}
      // Menambahkan event untuk menutup ketika menekan tombol Escape (sudah ada di showModal, tapi ini untuk jaga-jaga)
      onCancel={(e) => {
        e.preventDefault(); // Mencegah perilaku default browser (jika ada)
        onClose();
      }}
    >
      <div className="modal-box p-0 max-w-lg max-h-[90vh] overflow-y-auto transform shadow-2xl">
        {/* Close Button & Header - Dibuat Lebih Bersih dan pindah ke form method="dialog" */}
        <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Detail Voucher</h2>
          {/* Tombol tutup dengan method="dialog" agar bekerja otomatis di dalam <dialog> */}
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </form>
        </div>

        {/* Image (Thumbnail) */}
        {/* Ganti div ini dengan komponen Image dari next/image jika menggunakan Next.js secara optimal */}
        <div className="w-full h-auto">
          <img
            src={imageUrl}
            alt={voucher.title}
            className="w-full h-auto object-cover max-h-48" // Batasi tinggi agar tidak terlalu besar
          />
        </div>

        {/* Detail Konten */}
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
            {voucher.title}
          </h2>

          {/* Badge & Kode Voucher */}
          <div
            className="flex justify-between items-center mb-6 p-4 rounded-lg border-2 border-dashed"
            style={{ borderColor: primaryColor, backgroundColor: "#f6fffb" }}
          >
            <div>
              <p className="text-xs text-gray-600 font-semibold mb-1">
                Berlaku hingga:
              </p>
              <p className="text-sm font-bold text-red-600">{expiryDate}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Kode Voucher:</p>
              <span
                className="text-2xl font-extrabold tracking-wider px-3 py-1 rounded"
                style={{ color: primaryColor, backgroundColor: "#e6f2ee" }}
              >
                {voucher.voucher.code}
              </span>
            </div>
          </div>

          {/* Deskripsi Promosi */}
          <div className="text-gray-700 leading-relaxed mb-6">
            <h3 className="font-bold text-lg mb-2 text-gray-800">Deskripsi</h3>
            <div dangerouslySetInnerHTML={{ __html: voucher.content }} />
          </div>

          {/* Syarat & Ketentuan */}
          <h3 className="font-bold text-lg mb-2 text-gray-800 border-t pt-4">
            Syarat & Ketentuan Utama
          </h3>
          <ul className="list-disc list-outside text-gray-600 space-y-2 pl-5">
            <li>
              Tipe Diskon:
              <span className="font-bold ml-1">
                {voucher.voucher.type === "transaction"
                  ? "Potongan Harga"
                  : "Gratis Ongkir"}
              </span>
            </li>
            <li>
              Minimal belanja:
              <span className="font-bold ml-1">{minTransactionFormatted}</span>
            </li>
            <li>
              Batas Penggunaan:
              <span className="font-bold ml-1">
                {voucher.voucher.limit} kali per pengguna
              </span>
            </li>
            <li>
              Berlaku di:
              <span className="font-bold ml-1">
                Website, dan aplikasi mobile (jika tersedia).
              </span>
            </li>
          </ul>
        </div>

        {/* Footer/CTA (Opsional, tapi bagus) */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-white font-semibold shadow-md transition hover:opacity-90 btn"
            style={{ backgroundColor: primaryColor }}
          >
            Tutup & Gunakan
          </button>
        </div>
      </div>
    </dialog>
  );
}

// --- Komponen Utama Daftar Voucher (Tetap) ---
export default function VoucherList() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const handleVoucherClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    // Karena daisyUI/showModal mengelola transisi, kita hanya perlu menutup status
    setIsModalOpen(false);
    // Tambahkan delay untuk memberikan waktu bagi animasi daisyUI (opsional, tapi disarankan)
    setTimeout(() => {
      setSelectedVoucher(null);
    }, 300);
  };

  const token = useSelector((state: RootState) => state.auth.token);
  const expiresAt = useSelector((state: RootState) => state.auth.expiresAt);

  useEffect(() => {
    const fetchVouchers = async () => {
      setIsLoading(true);
      setError(null);

      // Cek BASE_API_URL
      if (!BASE_API_URL) {
        setError("Kesalahan konfigurasi: NEXT_PUBLIC_API_URL tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      if (!token) {
        setIsLoading(false);
        setError("Autentikasi diperlukan. Token tidak ditemukan.");
        return;
      }
      if (expiresAt && Date.now() > Number(expiresAt)) {
        setIsLoading(false);
        setError("Sesi kedaluwarsa. Silakan login kembali.");
        return;
      }

      try {
        // 💡 Menggunakan VOUCHER_API_URL dari .env
        const response = await axios.get<Voucher[]>(VOUCHER_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setVouchers(response.data);
      } catch (err) {
        console.error("Error fetching vouchers:", err);
        if (
          axios.isAxiosError(err) &&
          (err.response?.status === 401 || err.response?.status === 403)
        ) {
          setError(
            "Sesi habis atau tidak memiliki izin. Silakan login kembali."
          );
        } else if (axios.isAxiosError(err)) {
          setError(
            `Gagal memuat: ${err.message}. Status: ${
              err.response?.status || "N/A"
            }`
          );
        } else {
          setError("Terjadi kesalahan tak terduga saat memuat data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchVouchers();
  }, [token, expiresAt]);

  // --- RENDER BERSYARAT ---

  if (isLoading) {
    return (
      <div>
        <p className="mt-4 text-gray-500">Memuat daftar voucher...</p>
      </div>
    );
  }
  if (error) {
    return <Placeholder title="Terjadi Kesalahan 🙁" subtitle={error} />;
  }
  if (vouchers.length === 0) {
    return (
      <div className="p-10 border border-gray-200 bg-gray-50 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-gray-700">Voucher</h2>
        <p className="mt-2 text-gray-500">Belum ada voucher aktif saat ini.</p>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 mb-2">
        Daftar Voucher Aktif Saya 🎫
      </h2>
      <p className="mt-2 text-gray-500 mb-6">
        Klik voucher untuk melihat detail dan syarat & ketentuan.
      </p>

      <div className="mt-6 md:mt-8">
        {vouchers.map((v) => (
          <VoucherCard key={v.id} voucher={v} onClick={handleVoucherClick} />
        ))}
      </div>

      <VoucherDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        voucher={selectedVoucher}
      />
    </div>
  );
}
