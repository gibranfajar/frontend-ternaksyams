"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Konstanta URL dari .env
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;
// --- 1. Konfigurasi dan Tipe Data ---

const ITEMS_PER_PAGE = 9; // Untuk mencocokkan layout 3x3 yang Anda inginkan

interface Tutorial {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  link: string;
  category: string;
  status: string;
}

// --- 2. Komponen Card Tutorial ---

interface TutorialCardProps {
  tutorial: Tutorial;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
      {/* Gambar Thumbnail */}
      <div className="h-48 overflow-hidden">
        <img
          src={tutorial.thumbnail}
          alt={tutorial.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Konten Card */}
      <div className="p-4">
        {/* Label Kategori */}
        <div className="text-xs font-bold uppercase py-1 px-2 mb-3 inline-block tracking-wider bg-green-100 text-green-700 rounded-full">
          {tutorial.category}
        </div>

        {/* Judul Tutorial */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4 h-16 overflow-hidden leading-snug">
          {tutorial.title}
        </h3>

        {/* Tonton Video Link */}
        <a
          href={tutorial.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors block"
        >
          Tonton video
        </a>
      </div>
    </div>
  );
};

// --- 3. Komponen Pagination Fungsional ---

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Komponen untuk menampilkan navigasi halaman (Pagination) yang dinamis dan fungsional.
 */
const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  // Hanya tampilkan tombol halaman jika ada lebih dari 1 halaman
  if (totalPages <= 1) return null;

  // Membuat array nomor halaman yang akan ditampilkan (misalnya 1, 2, 3, 4)
  // Di sini kita hanya menampilkan semua halaman karena jumlahnya mungkin tidak terlalu banyak.
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Fungsi untuk merender tombol halaman
  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                ${
                  page === currentPage
                    ? "bg-green-600 text-white border-0 shadow-lg"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
    >
      {page}
    </button>
  );

  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      {/* Tombol Sebelumnya (←) */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors border border-gray-300
                    ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
      >
        ←
      </button>

      {/* Tombol Nomor Halaman */}
      {pageNumbers.map(renderPageButton)}

      {/* Tombol Selanjutnya (→) */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors border border-gray-300
                    ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
      >
        →
      </button>
    </div>
  );
};

// --- 4. Komponen Utama Arsip Tutorial ---

const TutorialArchive: React.FC = () => {
  const [allTutorials, setAllTutorials] = useState<Tutorial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- State untuk Pencarian dan Filter ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

  // --- Pengambilan Data (Fetching) ---
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await axios.get<{ data: Tutorial[] }>(
          `${API_URL}/tutorials`
        );
        // Filter tutorial dengan status 'published' atau yang sesuai
        const publishedTutorials = response.data.data.filter(
          (t) => t.status === "published"
        );
        setAllTutorials(publishedTutorials);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(`Gagal mengambil data: ${err.message}`);
        } else {
          setError("Terjadi kesalahan tak terduga saat mengambil data.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTutorials();
  }, []);

  // --- Daftar Kategori Unik (untuk Dropdown) ---
  const uniqueCategories = useMemo(() => {
    const categories = new Set(allTutorials.map((t) => t.category));
    return ["Semua Kategori", ...Array.from(categories)].sort();
  }, [allTutorials]);

  // --- Logika Filter dan Pencarian (Memoized untuk kinerja) ---
  const filteredTutorials = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    return allTutorials.filter((tutorial) => {
      // Filter berdasarkan Kategori
      const categoryMatch =
        selectedCategory === "Semua Kategori" ||
        tutorial.category === selectedCategory;

      // Filter berdasarkan Judul/Nama
      const searchMatch =
        tutorial.title.toLowerCase().includes(lowerCaseSearch) ||
        tutorial.category.toLowerCase().includes(lowerCaseSearch); // Memungkinkan pencarian kategori melalui input teks

      return categoryMatch && searchMatch;
    });
  }, [allTutorials, searchTerm, selectedCategory]);

  // --- Logika Pagination ---

  // Reset halaman ke 1 setiap kali filter/search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTutorials]);

  // Menghitung jumlah halaman total BERDASARKAN HASIL FILTER
  const totalPages = Math.ceil(filteredTutorials.length / ITEMS_PER_PAGE);

  // Menghitung item yang akan ditampilkan pada halaman saat ini (Memoized untuk kinerja)
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    // Menggunakan filteredTutorials sebagai sumber data
    return filteredTutorials.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredTutorials, currentPage]);

  // Fungsi untuk mengubah halaman saat tombol pagination diklik
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Opsional: Gulir ke atas daftar card setelah ganti halaman
      document
        .getElementById("tutorial-grid")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="text-center p-12 text-xl text-gray-600">
        Memuat arsip tutorial...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12 text-xl text-red-600">❌ {error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:p-12 min-h-screen bg-white">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 md:mb-12 text-primary">
        Arsip Video Tutorial
      </h1>

      {/* --- Filter dan Search Bar --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 p-4 bg-gray-50 rounded-lg shadow-inner">
        {/* Input Pencarian */}
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Cari Tutorial
          </label>
          <input
            id="search"
            type="text"
            placeholder="Cari judul atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors"
          />
        </div>

        {/* Dropdown Kategori */}
        <div className="w-full md:w-56">
          <label htmlFor="category-select" className="sr-only">
            Filter Kategori
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors cursor-pointer appearance-none"
          >
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Hasil Pencarian/Filter --- */}
      {currentItems.length === 0 ? (
        <div className="text-center p-12 text-xl text-gray-600 border-2 border-dashed border-gray-200 rounded-lg">
          😔 Tidak ada tutorial yang cocok dengan kriteria pencarian Anda.
        </div>
      ) : (
        <>
          <p className="text-right text-sm text-gray-500 mb-4">
            Menampilkan {filteredTutorials.length} tutorial yang ditemukan.
          </p>
          {/* Grid Layout (3 Kolom) */}
          <div
            id="tutorial-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {currentItems.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>

          {/* Navigasi Halaman */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default TutorialArchive;
