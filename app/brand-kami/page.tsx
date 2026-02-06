"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// --- KONSTANTA LINGKUNGAN ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

// --- DEFINISI TIPE DATA ---

interface BrandSize {
  id: number;
  brand_id: number;
  size: string;
}

interface BrandVariant {
  id: number;
  brand_id: number;
  variant: string;
  image: string;
  description: string;
}

interface Brand {
  id: number;
  brand: string;
  slug: string;
  description: string;
  image: string;
  sizes: BrandSize[];
  variants: BrandVariant[];
}

// --- SUB KOMPONEN: THUMBNAIL VARIAN ---

interface VariantThumbnailProps {
  variant: BrandVariant;
}

const VariantThumbnail: React.FC<VariantThumbnailProps> = ({ variant }) => (
  <div className="flex flex-col items-center p-1">
    <div className="w-16 md:w-20 h-auto bg-white rounded-lg overflow-hidden hover:shadow-lg transition duration-200 cursor-pointer">
      <img
        src={`${API_IMAGE_URL}/${variant.image}`}
        alt={`Varian ${variant.variant}`}
        className="object-contain w-full h-full"
      />
    </div>
  </div>
);

// --- SUB KOMPONEN: BLOK PRODUK ---

interface ProductBlockProps {
  product: Brand;
  isLast: boolean;
  index: number;
}

const ProductBlock: React.FC<ProductBlockProps> = ({
  product,
  isLast,
  index,
}) => {
  const isOdd = index % 2 !== 0;
  const layoutClass = isOdd ? "md:flex-row-reverse" : "";
  const productUrl = `/brand-kami/${product.slug}`;
  const mainImageUrl = `${API_IMAGE_URL}/${product.image}`;

  return (
    <div className="py-8 md:py-10">
      {/* Detail Utama Produk */}
      <div
        className={`flex flex-col md:flex-row gap-6 md:gap-8 items-start ${layoutClass}`}
      >
        {/* Gambar Produk */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <div className="w-4/5 sm:w-2/3 md:w-full h-auto ">
            <img
              src={mainImageUrl}
              alt={`Produk ${product.brand}`}
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        {/* Deskripsi & Ukuran */}
        <div className="w-full md:w-2/3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 md:mb-4 leading-tight">
            {product.brand}
          </h2>

          <div
            className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6 text-justify leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <p className="font-bold text-base md:text-lg text-gray-700 mt-3 md:mt-4 mb-1 md:mb-2">
            Tersedia dalam ukuran :
          </p>
          <ul className="list-none space-y-1 text-gray-600">
            {product.sizes.map((size) => (
              <li key={size.id} className="text-sm md:text-base font-medium">
                {size.size}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bagian Varian */}
      <div className="mt-8 md:mt-12">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 border-b border-gray-200 pb-2">
          Varian
        </h3>

        <div className="flex flex-wrap gap-4 justify-start">
          {product.variants.map((variant) => (
            <VariantThumbnail key={variant.id} variant={variant} />
          ))}
        </div>

        {/* Tombol Selengkapnya */}
        <div className="mt-6 md:mt-8">
          <Link
            href={productUrl}
            className="inline-block px-6 py-2 md:px-8 md:py-3 bg-primary text-white font-semibold text-base md:text-lg rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 no-underline text-center"
          >
            Tentang {product.brand}
          </Link>
        </div>
      </div>
      {!isLast && <hr className="my-8 md:my-10 border-t border-gray-200" />}
    </div>
  );
};

// --- KOMPONEN UTAMA: ProductPage ---

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<{ data: Brand[] }>(
          `${API_URL}/brands`
        );
        setProducts(response.data.data);
      } catch (err) {
        console.error("Gagal mengambil data produk:", err);
        setError("Gagal memuat data produk. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Halaman */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-primary tracking-tight">
            Brand Kami
          </h1>
        </header>

        <main>
          {/* Loading State */}
          {loading && (
            <div className="text-center py-10 text-xl text-gray-500">
              <p className="loading loading-dots loading-lg"></p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-10 text-sm">Error: {error}</div>
          )}

          {/* Konten Produk Utama */}
          {!loading &&
            !error &&
            products.length > 0 &&
            products.map((product, index) => (
              <ProductBlock
                key={product.id}
                product={product}
                isLast={index === products.length - 1}
                index={index}
              />
            ))}

          {/* No Data State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-10 text-xl text-gray-500">
              Tidak ada data produk yang tersedia.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
