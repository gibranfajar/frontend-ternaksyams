// src/components/PromoInfo.tsx (Komponen Promo Tunggal)
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- KONSTANTA & TIPE DATA ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * @description Interface untuk data Promo dari API
 */
interface Promotion {
  id: number;
  name: string;
  title: string;
  description: string;
  thumbnail: string;
  status: "active" | "inactive";
  start_date: string;
  end_date: string;
}

// --- KOMPONEN BANTUAN INTERNAL ---

/**
 * @description Membersihkan tag HTML dari string deskripsi.
 */
const cleanDescription = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

/**
 * @description Komponen yang menampilkan detail satu Promo (menggantikan PromotionCard).
 */
function PromoCard({ promotion }: { promotion: Promotion }) {
  const descriptionText = cleanDescription(promotion.description);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg mb-8">
      <Link href="/promo">
        {/* Gambar Promo: Mirip Ilustrasi Ramadhan */}
        <div className="relative bg-cover bg-center  flex items-center justify-center text-white">
          <img
            src={`${promotion.thumbnail}`}
            alt={promotion.name || "Nama Promo"}
            className="inset-0 w-full object-cover"
          />
        </div>
      </Link>

      {/* Detail Promo di Bawah Gambar */}
      <div className="p-4 md:p-6 bg-white">
        <h3 className="text-xl md:text-2xl font-bold text-[#155E49] mb-2">
          {promotion.name || "Nama Promo"}
        </h3>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {descriptionText}
        </p>

        {/* Info Tambahan */}
        <div className="text-xs text-gray-500">
          <p>
            Berlaku:{" "}
            {new Date(promotion.start_date).toLocaleDateString("id-ID")} s/d{" "}
            {new Date(promotion.end_date).toLocaleDateString("id-ID")}
          </p>
          {/* <p className="mt-1">
            Status:{" "}
            <span
              className={`font-semibold ${
                promotion.status === "active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {promotion.status.toUpperCase()}
            </span>
          </p> */}
        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN UTAMA (menggantikan PromotionInfo) ---

/**
 * @description Komponen untuk mengambil dan menampilkan daftar Promo.
 */
export default function PromoInfo() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // Menggunakan API_URL dari .env
        const response = await fetch(`${API_URL}/promotions`);

        if (!response.ok) {
          throw new Error(`Gagal mengambil data promo: ${response.statusText}`);
        }

        const data = await response.json();
        setPromotions(data.data || []);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // --- UI Loading State ---
  if (loading) {
    return (
      <div>
        <p className="mt-4 text-gray-500">Memuat daftar promo...</p>
      </div>
    );
  }

  // --- UI Error State ---
  if (error) {
    return (
      <div>
        <h2 className="text-2xl md:text-[28px] font-bold text-red-600">
          Promo Info
        </h2>
        <p className="mt-4 text-red-500">❌ Error: {error}</p>
      </div>
    );
  }

  const activePromotions = promotions.filter(
    (promo) => promo.status === "active"
  );

  // --- UI Empty State ---
  if (activePromotions.length === 0) {
    return (
      <div className="p-10 border border-gray-200 bg-gray-50 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-gray-700">Promo Info</h2>
        <p className="mt-2 text-gray-500">Belum ada info promo tersedia.</p>
      </div>
    );
  }

  // --- UI Success State ---
  return (
    <div>
      <h2 className="text-2xl md:text-[28px] font-bold text-gray-900">
        Promo Info
      </h2>
      <p className="mt-2 text-gray-500 mb-6">
        Lihat promo terbaru dan manfaatkan penawaran spesial!
      </p>

      {/* List Promo Aktif */}
      <div className="space-y-6">
        {activePromotions.map((promo) => (
          <PromoCard key={promo.id} promotion={promo} />
        ))}
      </div>
    </div>
  );
}
