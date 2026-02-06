"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/thunks/productThunk";
import { AppDispatch } from "@/redux/store";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { fetchCategories } from "@/redux/thunks/categoriesThunk";

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector(
    (state: RootState) => state.product
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  // State untuk Kategori yang Dipilih (Menggunakan Nama Kategori/String)
  const [selectedCategoryName, setSelectedCategoryName] =
    useState<string>("All Product"); // Menggunakan string "All Product" sebagai nilai default

  // ✨ STATE BARU UNTUK PENCARIAN PRODUK
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Konfigurasi API
  const imageUrl = process.env.NEXT_PUBLIC_API_IMAGE_URL;

  // Mengambil data produk dan kategori ketika status adalah 'idle'
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  // Event Handler untuk Mengubah Filter Kategori (Tombol Desktop)
  const handleCategoryFilter = (categoryName: string) => {
    setSelectedCategoryName(categoryName);
    // Opsional: reset pencarian saat kategori berubah
    // setSearchQuery("");
  };

  // Event Handler untuk Dropdown Select (Mobile)
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryName(e.target.value);
    // Opsional: reset pencarian saat kategori berubah
    // setSearchQuery("");
  };

  // ✨ EVENT HANDLER UNTUK INPUT PENCARIAN
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Logika untuk Memfilter Produk
  const filteredProducts = products.filter((product: any) => {
    // 1. Filter Kategori
    const categoryMatch =
      selectedCategoryName === "All Product" ||
      product.category === selectedCategoryName;

    // 2. Filter Pencarian (Case-insensitive)
    const searchMatch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Produk harus lolos kedua filter
    return categoryMatch && searchMatch;
  });

  // Menampilkan loading jika statusnya loading
  if (status === "loading") {
    return (
      <section className="w-full">
        <div className="mx-auto max-w-screen-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center min-h-screen flex flex-col justify-center">
          <div className="text-lg sm:text-xl text-[#1E8A6E] font-semibold">
            Memuat produk...
          </div>
          <div className="mt-4 w-8 h-8 border-4 border-[#1E8A6E] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  // Menampilkan error jika statusnya failed
  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  // Fungsi untuk Menentukan Kelas Tombol (Styling) - Hanya untuk Desktop
  const getButtonClasses = (name: string) => {
    const isActive = selectedCategoryName === name;

    // ✅ PERBAIKAN: Menggunakan warna primary yang seragam untuk semua tombol aktif
    const activeClasses = "bg-[#14433c] text-white shadow-md"; // Hijau gelap (primary)

    const inactiveClasses =
      "border-2 shadow-sm bg-white border-[#14433c] text-[#14433c] hover:bg-stone-50"; // Putih dengan border hijau gelap

    // Ukuran font yang lebih kecil untuk mobile
    const baseClasses =
      "p-2 px-4 text-sm sm:text-base rounded-full whitespace-nowrap transition-colors duration-200";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Menampilkan produk setelah statusnya succeeded
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl md:text-3xl font-bold text-primary my-4">
        Etawa Goat Milk
      </h2>

      {/* Product Filter and Search Area */}
      <div
        className="font-bold my-4 py-3 px-2 sm:px-4 md:px-6 rounded-lg"
        style={{ backgroundColor: "#f9f5ed", border: "1px solid #f9f5ed" }}
      >
        {/*
          =====================================
          0. Search Input Field
          =====================================
        */}
        <div className="mb-4">
          <input
            type="text"
            id="product-search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari produk"
            className="w-full p-2 border border-gray-300 bg-white rounded-md text-sm  font-normal"
          />
        </div>

        {/*
          =====================================
          1. Dropdown Filter (Tampilan Mobile)
          =====================================
        */}
        <div className="md:hidden">
          <select
            id="category-select"
            value={selectedCategoryName}
            onChange={handleDropdownChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm shadow-sm focus:border-[#14433c] focus:ring focus:ring-[#14433c]/50 font-normal"
          >
            <option value="All Product">Semua Produk</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {/*
          =====================================
          2. Tombol Filter (Tampilan Desktop)
          =====================================
          Menggunakan 'hidden md:flex' untuk menyembunyikan pada mobile dan menampilkan pada desktop
        */}
        <div className="hidden md:flex space-x-3 overflow-x-auto">
          {/* Tombol 'All Product' */}
          <button
            onClick={() => handleCategoryFilter("All Product")} // Menggunakan string "All Product"
            className={getButtonClasses("All Product")} // Menggunakan fungsi kelas, tidak perlu inline style lagi
          >
            Semua Produk
          </button>

          {/* Tombol Kategori Lainnya */}
          {categories.map((category: any) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.name)} // Menggunakan category.name (string)
              className={getButtonClasses(category.name)} // Menggunakan fungsi kelas
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - Menggunakan filteredProducts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 my-8">
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          filteredProducts.map((product: any) => (
            <div key={product.id} className="card relative">
              <Link href={`/shop/${product.slug}`} className="block">
                <img
                  src={imageUrl + product.image}
                  alt={product.product}
                  className="rounded-lg w-full h-auto"
                />

                <div className="my-3 sm:my-4">
                  {/* Ukuran font judul produk disesuaikan untuk mobile (text-base) */}
                  <span className="text-base sm:text-lg font-bold text-primary block truncate">
                    {product.name}
                  </span>
                  <div className="mt-1 text-sm sm:text-base">
                    {product.discount > 0 ? (
                      <>
                        {/* Ukuran font harga dicoret disesuaikan */}
                        <span className="line-through text-gray-400 pr-1 text-xs sm:text-sm">
                          Rp. {Number(product.price).toLocaleString()}
                        </span>
                        {/* Ukuran font harga diskon disesuaikan */}
                        <span className="text-gray-600 font-medium text-sm sm:text-base">
                          Rp. {Number(product.price_discount).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Rp. {Number(product.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    {product.discount > 0 && (
                      <span className="bg-accent py-1 px-2 text-white text-sm font-bold rounded-lg">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-600 text-base sm:text-lg">
            {/* Pesan No Product disesuaikan */}
            Tidak ada produk yang tersedia untuk kategori{" "}
            <span className="font-bold">{selectedCategoryName}</span>
            {searchQuery && (
              <>
                {" "}
                dengan kata kunci "
                <span className="font-bold">{searchQuery}</span>"
              </>
            )}
            .
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
