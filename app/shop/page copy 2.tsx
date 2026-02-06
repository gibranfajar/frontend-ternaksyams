"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/thunks/productThunk";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories } from "@/redux/thunks/categoriesThunk";
import Link from "next/link";
import { Search, Leaf, ShieldCheck, Heart } from "lucide-react";

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector(
    (state: RootState) => state.product
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  const [selectedCategoryName, setSelectedCategoryName] =
    useState<string>("All Product");
  const [searchQuery, setSearchQuery] = useState<string>(" ");

  const imageUrl = process.env.NEXT_PUBLIC_API_IMAGE_URL;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const filteredProducts = products.filter((product: any) => {
    const categoryMatch =
      selectedCategoryName === "All Product" ||
      product.category === selectedCategoryName;
    const searchMatch = product.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="bg-[#fdfcf9] min-h-screen font-sans text-[#2c3e50]">
      {/* 🌿 Hero Decor */}
      <div className="bg-[#14433c] text-[#f1f8e9] py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <Leaf size={300} strokeWidth={1} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <span className="bg-[#e8f5e9] text-[#14433c] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              100% Organic Etawa
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            Kemurnian dari Alam <br />
            untuk Kesehatan Anda
          </h1>
          <p className="text-[#a5d6a7] max-w-xl text-sm md:text-base">
            Susu kambing pilihan dengan kualitas premium, diproses secara
            higienis untuk menjaga nutrisi terbaik bagi tubuh.
          </p>
        </div>
      </div>

      {/* 🛠️ Toolbar Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center justify-between border border-[#e0e0e0]/50">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {["All Product", ...categories.map((c: any) => c.name)].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryName(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategoryName === cat
                      ? "bg-[#14433c] text-white shadow-md shadow-[#14433c]/30"
                      : "bg-[#f5f5f5] text-gray-500 hover:bg-[#e8f5e9] hover:text-[#14433c]"
                  }`}
                >
                  {cat === "All Product" ? "Semua Produk" : cat}
                </button>
              )
            )}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari varian susu..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f9f9f9] border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#14433c]/10 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 📦 Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product: any) => (
              <div key={product.id} className="group">
                <div className="bg-white rounded-[2rem] p-4 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-transparent hover:border-[#e8f5e9]">
                  {/* Image wrapper */}
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-[#f1f8e9]/50 mb-6">
                    <img
                      src={imageUrl + product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-[#ff8a65] text-white text-[10px] font-bold px-3 py-1 rounded-lg">
                        DISKON {product.discount}%
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="px-2 pb-2">
                    <div className="flex items-center gap-1 text-[#14433c] mb-1">
                      <ShieldCheck size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Quality Verified
                      </span>
                    </div>
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="text-lg font-bold text-gray-800 leading-snug hover:text-[#14433c] transition-colors line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-4 flex flex-col">
                      {product.discount > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 line-through">
                            Rp {Number(product.price).toLocaleString()}
                          </span>
                          <span className="text-xl font-extrabold text-[#14433c]">
                            Rp {Number(product.price_discount).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-extrabold text-[#14433c]">
                          Rp {Number(product.price).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/shop/${product.slug}`}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-[#f1f8e9] text-[#14433c] group-hover:bg-[#14433c] group-hover:text-white py-3 rounded-xl text-sm font-bold transition-all duration-300"
                    >
                      Lihat Produk
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 italic">
              Maaf, varian susu yang Anda cari belum tersedia.
            </p>
          </div>
        )}
      </div>

      {/* 🍃 Footer Benefit */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-[#e8f5e9]/30 rounded-[2.5rem] border border-[#e8f5e9]">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#14433c] shadow-sm mb-4">
              <Leaf size={24} />
            </div>
            <h4 className="font-bold text-sm">Alami & Segar</h4>
            <p className="text-xs text-gray-500 mt-1">
              Tanpa bahan pengawet buatan.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4 border-y md:border-y-0 md:border-x border-[#e8f5e9]">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#14433c] shadow-sm mb-4">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-bold text-sm">Sertifikasi BPOM</h4>
            <p className="text-xs text-gray-500 mt-1">
              Aman dan teruji secara klinis.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#14433c] shadow-sm mb-4">
              <Heart size={24} />
            </div>
            <h4 className="font-bold text-sm">Padat Nutrisi</h4>
            <p className="text-xs text-gray-500 mt-1">
              Baik untuk tulang dan imun tubuh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
