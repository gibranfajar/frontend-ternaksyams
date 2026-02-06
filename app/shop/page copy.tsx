"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/thunks/productThunk";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories } from "@/redux/thunks/categoriesThunk";
import Link from "next/link";
import { Search, Shield, Leaf, Star, ChevronRight } from "lucide-react";

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, status, error } = useSelector(
    (state: RootState) => state.product
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  const [selectedCategoryName, setSelectedCategoryName] =
    useState<string>("All Product");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      .includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[#14433c]/20 border-t-[#14433c] rounded-full animate-spin"></div>
        <p className="text-sm tracking-widest uppercase text-gray-400">
          Loading Collection
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFBFA] min-h-screen text-[#1A1A1A]">
      {/* --- Section Header --- */}
      <header className="max-w-7xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-8 bg-[#14433c]"></span>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#14433c] font-bold">
            Premium Etawa
          </p>
          <span className="h-px w-8 bg-[#14433c]"></span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Nutrisi Murni{" "}
          <span className="text-[#14433c] font-light italic">Dari Alam</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Koleksi susu kambing etawa pilihan yang diproses secara tradisional
          namun modern untuk menjaga keaslian nutrisi di setiap kemasan.
        </p>
      </header>

      {/* --- Filter & Search Bar --- */}
      <nav className="sticky top-0 z-40 bg-[#FCFBFA]/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-6 items-center justify-between">
          {/* Categories Navigation */}
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              onClick={() => setSelectedCategoryName("All Product")}
              className={`text-xs uppercase tracking-widest transition-all pb-1 whitespace-nowrap border-b-2 ${
                selectedCategoryName === "All Product"
                  ? "border-[#14433c] text-[#14433c] font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Semua Produk
            </button>
            {categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryName(category.name)}
                className={`text-xs uppercase tracking-widest transition-all pb-1 whitespace-nowrap border-b-2 ${
                  selectedCategoryName === category.name
                    ? "border-[#14433c] text-[#14433c] font-bold"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Minimal Search */}
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#14433c] transition-colors" />
            <input
              type="text"
              placeholder="Cari varian susu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-gray-200 py-2 pl-7 pr-4 text-sm outline-none focus:border-[#14433c] transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
      </nav>

      {/* --- Product Grid --- */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map((product: any) => (
              <div
                key={product.id}
                className="group relative bg-white border border-gray-50 rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
              >
                {/* Image Area */}
                <Link
                  href={`/shop/${product.slug}`}
                  className="block relative aspect-square overflow-hidden rounded-xl bg-[#F9F9F7]"
                >
                  <img
                    src={imageUrl + product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                  />

                  {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-[#14433c] text-white text-[10px] font-bold px-2 py-1 tracking-tighter uppercase">
                      Special Offer {product.discount}%
                    </div>
                  )}

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-[#14433c]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <span className="bg-white text-[#14433c] text-[10px] font-bold px-6 py-2 rounded-full shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 uppercase tracking-widest">
                      View Product
                    </span>
                  </div>
                </Link>

                {/* Info Area */}
                <div className="mt-6 text-center px-2">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star size={10} className="fill-[#14433c] text-[#14433c]" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                      Verified Organic
                    </span>
                  </div>

                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#14433c] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-3 flex items-center justify-center gap-3">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-gray-300 line-through text-xs">
                          Rp {Number(product.price).toLocaleString()}
                        </span>
                        <span className="text-[#14433c] font-bold">
                          Rp {Number(product.price_discount).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-700 font-bold">
                        Rp {Number(product.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-gray-100 rounded-3xl">
            <p className="text-sm uppercase tracking-widest text-gray-400 italic">
              No matches found in our collection.
            </p>
          </div>
        )}
      </main>

      {/* --- Mini Footer --- */}
      <footer className="max-w-7xl mx-auto px-4 pb-20">
        <div className="border-t border-gray-100 pt-12 flex flex-wrap justify-center gap-12">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-[#14433c] stroke-[1px]" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Lab Tested
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Leaf size={18} className="text-[#14433c] stroke-[1px]" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Ethically Sourced
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Star size={18} className="text-[#14433c] stroke-[1px]" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Premium Quality
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductList;
