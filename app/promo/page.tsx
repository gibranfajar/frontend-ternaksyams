"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Countdown from "react-countdown";
import goatsad from "@/public/images/ilustration/sheep-sad.png";

// --- 1. DEFINISI TIPE ---
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

interface ApiResponse {
  data: Promotion[];
}

// --- 2. CUSTOM HOOK UNTUK DATA FETCHING ---
const usePromotions = () => {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // Gunakan fallback jika API_URL tidak terdefinisi (meskipun seharusnya ada check di useEffect)
  const PROMOTIONS_ENDPOINT = `${API_URL || ""}/promotions`;

  useEffect(() => {
    const fetchPromotion = async () => {
      if (!API_URL) {
        // Menggunakan console.error agar developer tahu jika ada masalah konfigurasi
        console.error("NEXT_PUBLIC_API_URL tidak terdefinisi di .env");
        setError("Kesalahan Konfigurasi API.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(PROMOTIONS_ENDPOINT);
        // Mencari promo aktif pertama
        const activePromo = response.data.data.find(
          (p) => p.status === "active"
        );

        if (activePromo) {
          setPromotion(activePromo);
        } else {
          // Set error ke null, tapi set promotion ke null agar NoPromoFound terpanggil
          setPromotion(null);
        }
      } catch (err) {
        console.error("Gagal mengambil data promo:", err);
        setError("Gagal memuat data. Periksa koneksi atau API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotion();
  }, [API_URL, PROMOTIONS_ENDPOINT]);

  return { promotion, isLoading, error };
};

// --- 3. RENDERER UNTUK COUNTDOWN (LOGIKA HARI & JAM) ---
const CountdownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  if (completed) {
    return (
      <span className="text-white text-base md:text-xl font-bold p-2">
        Promo Berakhir
      </span>
    );
  }

  // Jika masih berhari-hari, tampilkan jumlah hari
  if (days > 0) {
    return (
      <div className="text-white p-2 text-base md:text-xl font-bold leading-none">
        {/* Contoh output: 28 HARI LAGI */}
        {days} hari lagi
      </div>
    );
  }

  // Jika kurang dari 24 jam (days = 0), tampilkan HH:MM:SS
  const formatTime = (time: number) => String(time).padStart(2, "0");
  return (
    <div className="text-white text-base md:text-xl font-bold leading-none">
      {/* Contoh output: 10:25:02 */}
      {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
    </div>
  );
};

// --- 4. KOMPONEN JIKA TIDAK ADA PROMO (Elegan) ---
const NoPromoFound = () => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-white">
    <div className="text-center p-10 max-w-lg mx-auto bg-white rounded-xl shadow-2xl border-t-4 border-[#10a56e] transition-all duration-300 transform hover:scale-[1.02]">
      {/* Ikon untuk menarik perhatian */}
      <img src={goatsad.src} alt="Attention Icon" className="mx-auto mb-4" />
      <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
        Aww, Sayang Sekali!
      </h2>
      <p className="text-lg text-gray-600 font-medium">
        belum ada promo aktif saat ini.
      </p>
      <p className="text-sm text-gray-500 mt-3">
        Cek kembali secara berkala, ya! Siapa tahu ada kejutan. ✨
      </p>
    </div>
  </div>
);

// --- 5. KOMPONEN UTAMA PROMO PAGE ---
const PromoPage: React.FC = () => {
  const { promotion, isLoading, error } = usePromotions();

  if (isLoading)
    return (
      <div className="text-center p-8 text-lg font-semibold">
        Memuat promo...
      </div>
    );

  // Kasus Error
  if (error)
    return (
      <div className="text-center p-8 bg-red-50 text-red-700 border-l-4 border-red-500 font-semibold shadow-md mx-auto max-w-md mt-10">
        ⚠️ Error: {error}
      </div>
    );

  // Kasus Tidak Ada Promo (Menggunakan komponen elegan yang baru)
  if (!promotion) {
    return <NoPromoFound />;
  }

  // --- RENDERING PROMO AKTIF ---

  // Mendapatkan waktu berakhir dalam milidetik
  const endDate = new Date(promotion.end_date).getTime();
  const imageBaseUrl = process.env.NEXT_PUBLIC_API_IMAGE_URL || "";

  // Penyesuaian URL gambar agar selalu lengkap
  const imageUrl = promotion.thumbnail.startsWith("http")
    ? promotion.thumbnail
    : `${imageBaseUrl}/${promotion.thumbnail.replace(imageBaseUrl, "")}`;

  return (
    // Container menyesuaikan lebar konten pada gambar
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* HEADER PROMO GREEN */}
        <header className="w-full sticky top-0 z-10 bg-[#10a56e] py-3 px-4 flex justify-between items-center shadow-lg">
          <h1 className="text-white text-xl font-extrabold tracking-wider">
            PROMO
          </h1>
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-white font-semibold pr-2 text-sm hidden sm:block">
              Berakhir dalam
            </span>
            {/* Box Countdown */}
            <div className="bg-[#a30b02] p-1 rounded-md min-w-[100px] text-center">
              <Countdown date={endDate} renderer={CountdownRenderer} />
            </div>
          </div>
        </header>

        {/* MAIN BANNER SECTION */}
        <main className="bg-white">
          <div className="px-4 py-8 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              {promotion.name}
            </h2>
          </div>

          {/* BANNER CONTENT (GAMBAR PROMO) */}
          <div className="relative overflow-hidden">
            <img
              src={imageUrl}
              alt={promotion.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* PROMO DETAILS DESCRIPTION */}
          <div className="px-4 py-10">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Title can Add
            </h3>
            {/* Menggunakan dangerouslySetInnerHTML karena deskripsi berupa HTML string */}
            <div
              className="text-sm text-gray-600 leading-relaxed mb-5"
              dangerouslySetInnerHTML={{ __html: promotion.description }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PromoPage;
