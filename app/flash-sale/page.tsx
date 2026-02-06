"use client";

import React, { useState, useEffect } from "react";
import goat from "@/public/images/ilustration/sheep-sad.png";
import Link from "next/link";
import axios from "axios";

// 1. Interface lengkap sesuai struktur API
interface FlashSaleProduct {
  id: number;
  title: string;
  slug: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  variant_id: number;
  variant_name: string;
  variant_slug: string;
  product_name: string;
  brand: string;
  category: string;
  size: number;
  price_original: number;
  price_flash_sale: number;
  discount: number;
  stock_flash_sale: number;
  image: string;
}

export default function MilkFlashSale() {
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

  // 2. Fetch Data dari API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/flash-sale-products`);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const result = await response.json();
        setProducts(result.data || []);
      } catch (error) {
        console.error("Error fetching flash sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  // 3. Logic Countdown Dinamis berdasarkan end_date produk pertama
  useEffect(() => {
    if (products.length === 0) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(products[0].end_date).getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ h: 0, m: 0, s: 0 });
      } else {
        setTimeLeft({
          h: Math.floor(difference / (1000 * 60 * 60)), // Menghitung total jam (bisa > 24 jam)
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [products]);

  // 4. State: Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-emerald-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Memuat Promo Flash Sale...</p>
        </div>
      </div>
    );
  }

  // 5. State: Data Kosong (Jika API [] atau error)
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100">
          <div className="bg-gray-100 w-80 h-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={goat.src} alt="empty" className="w-full h-auto" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            Flash Sale Tidak Tersedia
          </h2>
          <p className="text-slate-500 mb-8">
            Saat ini belum ada promo flash sale. Pantau terus halaman ini untuk
            diskon menarik lainnya!
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-[#00a67e] text-white py-3 rounded-xl font-bold shadow-lg"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // 6. State: Tampilan Utama Flash Sale
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl border border-blue-50">
        {/* Banner Header */}
        <div className="relative bg-[#00a67e] p-6 flex flex-col md:flex-row items-center justify-between overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>

          <div className="flex items-center gap-4 z-10">
            <div className="bg-yellow-400 p-2 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-black fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V2L5 14h7v8l8-12h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                Flash Sale
              </h2>
              <div className="flex items-center gap-1 mt-1">
                <span className="h-1 w-12 bg-yellow-400 rounded-full"></span>
                <p className="text-[12px] text-white/80 font-bold uppercase tracking-[0.2em] pl-2">
                  {products[0]?.title}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 md:mt-0 z-10">
            <span className="hidden sm:block text-white font-bold text-sm uppercase tracking-widest opacity-90">
              Berakhir Dalam:
            </span>
            <div className="flex items-center gap-3 bg-[#f43f5e] px-6 py-3 rounded-2xl shadow-[0_10px_20px_rgba(244,63,94,0.3)] border border-white/20">
              {[timeLeft.h, timeLeft.m, timeLeft.s].map((unit, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-2xl text-white w-8 text-center">
                      {unit.toString().padStart(2, "0")}
                    </span>
                  </div>
                  {idx < 2 && (
                    <span className="text-white/50 font-bold text-xl animate-pulse">
                      :
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative p-8 hover:bg-gray-50 overflow-hidden"
            >
              {/* Badge Diskon */}
              <div className="absolute top-6 right-6 z-20">
                <div className="bg-[#f43f5e] text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg">
                  -{product.discount}%
                </div>
              </div>

              {/* Box Gambar */}
              <div className="relative aspect-square mb-8 flex items-center justify-center">
                <img
                  src={`${IMAGE_BASE_URL}${product.image}`}
                  alt={product.variant_name}
                  className="w-full h-auto object-contain relative z-10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400?text=No+Image";
                  }}
                />
              </div>

              {/* Info Produk */}
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#00a67e]"></div>
                  <span className="text-[10px] font-bold text-[#00a67e] uppercase tracking-wider">
                    Sisa: {product.stock_flash_sale} Pcs
                  </span>
                </div>

                <h3 className="font-extrabold text-[#1a4d3c] text-xl leading-tight h-14 line-clamp-2">
                  {product.variant_name}
                </h3>

                <div className="flex flex-col">
                  <span className="text-gray-300 line-through text-sm font-medium">
                    Rp {product.price_original.toLocaleString("id-ID")}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800">
                      Rp {product.price_flash_sale.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <Link href={`flash-sale/${product.variant_slug}`}>
                  <button className="w-full mt-4 bg-[#00a67e] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 hover:bg-[#008d6b]">
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Beli Sekarang
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-green-50/50 p-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-8">
          {["100% Organik", "Tanpa Pengawet", "Izin BPOM & Halal"].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"
              >
                <span className="text-[#00a67e]">✓</span> {item}
              </div>
            )
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
