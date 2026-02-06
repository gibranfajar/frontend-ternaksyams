"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// --- 1. Konfigurasi Environment ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  status: "published" | "draft";
}

// Fungsi helper untuk memastikan URL gambar benar
const getFullImageUrl = (path: string) => {
  if (!path) return "/placeholder-image.jpg"; // Fallback jika image kosong
  if (path.startsWith("http")) return path; // Jika API sudah memberikan full URL
  return `${IMAGE_BASE_URL}${path}`;
};

const cleanExcerpt = (html: string) => {
  if (typeof window === "undefined") return ""; // SSR Guard
  const div = document.createElement("div");
  div.innerHTML = html;
  return (
    (div.textContent || div.innerText || "").trim().substring(0, 150) + "..."
  );
};

// --- 2. Komponen Card Artikel Sederhana ---
const ArticleGridCard: React.FC<{ article: Article }> = ({ article }) => (
  <Link
    href={`/articles/${article.slug}`}
    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col"
  >
    <img
      src={getFullImageUrl(article.thumbnail)}
      alt={article.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4 grow">
      <span className="inline-block text-xs font-semibold py-1 px-2 rounded-sm text-white bg-primary uppercase mb-2">
        {article.category}
      </span>
      <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
        {article.title}
      </h3>
    </div>
    <div className="p-4 pt-0">
      <span className="text-sm font-semibold text-primary hover:text-green-900 transition-colors">
        Selengkapnya
      </span>
    </div>
  </Link>
);

// --- 3. Komponen Card Artikel Utama (Hero) ---
const ArticleHeroCard: React.FC<{ article: Article }> = ({ article }) => (
  <div className="grid md:grid-cols-2 bg-white rounded-lg overflow-hidden shadow-xl mb-12 border border-gray-100">
    <div className="h-64 md:h-96 w-full">
      <img
        src={getFullImageUrl(article.thumbnail)}
        alt={article.title}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="p-8 flex flex-col justify-between bg-neutral bg-linear-to-b from-neutral to-[#187863]  text-white">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
          {article.title}
        </h2>
        <div className="text-sm opacity-90 line-clamp-4 mb-6">
          {/* Menggunakan dangerouslySetInnerHTML jika excerpt mengandung HTML, 
              atau gunakan cleanExcerpt jika ingin text murni */}
          <p>{cleanExcerpt(article.excerpt || article.content)}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-4">
        <Link
          href={`/articles/${article.slug}`}
          className="bg-primary hover:bg-secondary text-white font-bold py-2 px-8 rounded-2xl transition-colors"
        >
          Selengkapnya
        </Link>
      </div>
    </div>
  </div>
);

// --- 4. Halaman Utama ---
const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Menggunakan endpoint /articles sesuai instruksi
        const response = await axios.get(`${API_BASE_URL}/articles`);

        // Menyesuaikan dengan struktur data Laravel/CMS (biasanya response.data.data)
        const result = response.data.data || response.data;

        if (Array.isArray(result)) {
          setArticles(result);
        } else {
          throw new Error("Format data API tidak sesuai.");
        }
        setError(null);
      } catch (err) {
        setError(
          "Gagal memuat artikel. Pastikan koneksi dan konfigurasi API benar."
        );
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const articlesForGrid = articles.slice(startIndex, startIndex + itemsPerPage);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Hero Card dari artikel terbaru */}
      {articles.length > 0 && currentPage === 1 && (
        <ArticleHeroCard article={articles[0]} />
      )}

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articlesForGrid.map((article) => (
          <ArticleGridCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => {
                setCurrentPage(i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
