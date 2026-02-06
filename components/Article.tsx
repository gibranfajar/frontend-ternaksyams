"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  thumbnail: string; // Menggunakan 'thumbnail' agar konsisten dengan articles.tsx
  status: "published" | "draft";
}

// --- 2. Tipe Props untuk Komponen Induk ---
type Props = {
  heading?: string;
  ctaText?: string;
  // Menghapus 'articles' dari props karena data akan diambil secara internal
  onClickAll?: () => void;
};

// --- 3. Komponen Card Artikel Sederhana (Mengadopsi ArticleGridCard) ---
const LatestArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <a
    href={`/articles/${article.slug}`} // Menggunakan <a> tag sebagai ganti Link
    // Menggunakan style ArticleGridCard: border, rounded, shadow-sm, hover:shadow-lg, bg-white
    className="block border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
  >
    <img
      src={article.thumbnail}
      alt={article.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      {/* Badge Category (Menggunakan bg-green-800 dari ArticleGridCard) */}
      <span className="inline-block text-xs font-semibold py-1 px-2 rounded-sm text-white bg-green-800 uppercase mb-2">
        {article.category}
      </span>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
        {article.title}
      </h3>

      {/* Selengkapnya CTA (Mengganti button dengan span untuk tautan) */}
      <span className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors mt-2 block">
        Selengkapnya
      </span>
    </div>
  </a>
);

// --- 4. Komponen Utama LatestArticlesSection ---
export default function LatestArticlesSection({
  heading = "Artikel Terbaru",
  ctaText = "Lihat Semua Artikel",
  onClickAll,
}: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const API_URL = `${BASE_API_URL}/articles`;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Mengambil data artikel
        const response = await axios.get<{ data: Article[] }>(API_URL);

        if (Array.isArray(response.data.data)) {
          // Ambil 3 artikel terbaru (mengambil 3 data teratas dari hasil API)
          const latestThree = response.data.data.slice(0, 3);
          setArticles(latestThree);
        } else {
          throw new Error("Struktur data API tidak valid.");
        }

        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          // Implementasi backoff sederhana, mencoba lagi setelah 1 detik jika gagal
          // Logikanya dihilangkan untuk menjaga kode tetap sederhana di Canvas, hanya menampilkan error
          setError(`Gagal mengambil artikel: ${err.message}.`);
        } else {
          setError("Terjadi kesalahan tak terduga saat memuat data.");
        }
        console.error("Error fetching latest articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // --- Render Status ---

  if (loading) {
    return (
      <section className="w-full bg-[#F5F6EE]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10 md:py-14 text-center">
          <div className="text-xl text-[#1E8A6E] font-semibold">
            Memuat artikel terbaru...
          </div>
          <div className="mt-4 w-8 h-8 border-4 border-[#1E8A6E] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-[#F5F6EE]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10 md:py-14 text-center">
          <p className="text-red-600">🚨 {error}</p>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="w-full bg-[#F5F6EE]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10 md:py-14 text-center">
          <p className="text-gray-500">
            Tidak ada artikel terbaru yang ditemukan.
          </p>
        </div>
      </section>
    );
  }

  // --- Render Utama ---
  return (
    <section className="w-full bg-[#F5F6EE]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10 md:py-14">
        {/* Header row */}
        <div className="mb-8 flex items-center justify-between mt-52">
          <h2 className="text-primary text-3xl md:text-[36px] font-extrabold tracking-tight">
            {heading}
          </h2>

          <a
            href="/articles" // Menggunakan <a> tag sebagai ganti Link
            className="rounded-full bg-primary px-6 py-3 text-white font-semibold shadow-md hover:bg-[#19A974] transition inline-flex items-center"
            onClick={onClickAll}
          >
            {ctaText}
          </a>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <LatestArticleCard
              key={`${article.id}-${article.slug}`}
              article={article}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
