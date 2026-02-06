"use client";

// src/pages/ArticleDetail.tsx
import React, { useState, useEffect } from "react";

import { useParams } from "next/navigation";
import axios from "axios";
import DOMPurify from "dompurify";

// --- 1. Definisi Tipe Data (Interface) ---

interface RelatedArticle {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  status: "published" | "draft";
  related: RelatedArticle[];
}

// --- 2. Komponen ArticleDetailPage ---
const ArticleDetail: React.FC = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Menggunakan API URL dari env
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const getArticleUrl = (articleSlug: string) => `/articles/${articleSlug}`;

  useEffect(() => {
    if (!slug) {
      setError("❌ Slug artikel tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        // Memanggil endpoint: https://cms.ternaksyams.co.id/api/article/{slug}
        const response = await axios.get(`${apiUrl}/article/${slug}`);

        // Berdasarkan data Anda, struktur responsnya adalah { data: ArticleObject }
        setArticle(response.data.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(`Gagal memuat artikel: ${err.message}`);
        } else {
          setError("Terjadi kesalahan tak terduga.");
        }
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [slug, apiUrl]);

  const renderSafeHTML = (htmlContent: string) => {
    if (!htmlContent) return { __html: "" };
    const cleanHtml = DOMPurify.sanitize(htmlContent, {
      USE_PROFILES: { html: true },
    });
    return { __html: cleanHtml };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-green-700 font-semibold">
            Memuat detail artikel...
          </p>
          <div className="mt-4 w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-100 border border-red-400 rounded-lg m-4">
        <h1 className="text-2xl font-bold mb-2">
          🚨 Error atau Artikel Tidak Ditemukan
        </h1>
        <p>{error || "Artikel tidak ditemukan."}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Hero Section & Thumbnail */}
        <div className="relative mb-10 overflow-hidden rounded-lg shadow-xl">
          <div className="h-64 sm:h-80 md:h-96 w-full bg-gray-200">
            <img
              // ✨ PENYESUAIAN: Karena API sudah memberikan URL lengkap,
              // langsung gunakan article.thumbnail tanpa tambahan base URL.
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black opacity-50 flex items-end p-6 md:p-10"></div>

          <div className="absolute inset-0 flex items-end p-6 md:p-10">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-lg shadow-lg">
            {/* Bagikan (Share) */}
            <div className="flex items-center space-x-2 text-gray-500 mb-6 border-b pb-4">
              <span className="font-semibold text-sm">Bagikan:</span>
              <button className="bg-blue-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-700">
                F
              </button>
              <button className="bg-green-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-green-600">
                X
              </button>
              <button className="bg-green-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-green-700">
                WA
              </button>
              <button className="bg-red-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700">
                G
              </button>
              <button className="bg-gray-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-700">
                @
              </button>
              <button className="bg-blue-400 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-500">
                +
              </button>
            </div>

            {/* Quote/Excerpt */}
            <blockquote className="my-8 p-4 md:p-6 border-l-4 border-green-500 bg-gray-50 italic text-gray-700 text-lg rounded-r-lg">
              <div dangerouslySetInnerHTML={renderSafeHTML(article.excerpt)} />
            </blockquote>

            {/* Konten Utama Artikel */}
            <div
              className="prose max-w-none text-gray-800 leading-relaxed article-content"
              dangerouslySetInnerHTML={renderSafeHTML(article.content)}
            />
          </div>

          {/* Kolom Kanan: Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                Artikel Lainnya
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {article.related && article.related.length > 0 ? (
                  article.related.map((relatedArticle) => (
                    <li key={relatedArticle.id}>
                      <a
                        href={getArticleUrl(relatedArticle.slug)}
                        className="hover:text-green-600 transition-colors"
                      >
                        {relatedArticle.title}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>Tidak ada artikel terkait yang ditemukan.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .article-content h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            color: #10B981;
        }
        .article-content ul, .article-content ol {
            margin-left: 1.5rem;
            padding-left: 0;
            list-style-type: disc;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }
        .article-content li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default ArticleDetail;
