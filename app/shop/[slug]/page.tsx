"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

// Redux & Toast
import { useAppDispatch } from "@/redux/hooks";
import { addItemToCart } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();

  const [productDetail, setProductDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [selectedFlavourId, setSelectedFlavourId] = useState<number | null>(
    null
  );
  const [selectedFlavourName, setSelectedFlavourName] = useState<string | null>(
    null
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedSizeName, setSelectedSizeName] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const imageUrl = process.env.NEXT_PUBLIC_API_IMAGE_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_PROD_DETAIL_URL;

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${slug}`);
        const product = response.data.data[0];
        setProductDetail(product);

        if (product.flavours.length > 0) {
          const defaultFlavour =
            product.flavours.find(
              (flavour: any) => flavour.id === product.flavour_id
            ) || product.flavours[0];

          if (defaultFlavour) {
            setSelectedFlavourId(defaultFlavour.id);
            setSelectedFlavourName(defaultFlavour.name);

            // Cari variant default
            const firstVariant = product.variants.find(
              (v: any) => v.flavour_id === defaultFlavour.id
            );

            if (firstVariant && firstVariant.sizes.length > 0) {
              // URUTKAN UKURAN DARI TERKECIL (Sorting Logic)
              const sortedSizes = [...firstVariant.sizes].sort(
                (a, b) => a.size - b.size
              );
              const defaultSize = sortedSizes[0];

              setSelectedSizeId(String(defaultSize.id));
              setSelectedSizeName(defaultSize.size);
              setSelectedPrice(defaultSize.price_discount ?? defaultSize.price);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Gagal memuat detail produk");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProductDetail();
  }, [slug, apiUrl]);

  // Memoisasi variant yang aktif
  const activeVariant = useMemo(() => {
    return productDetail?.variants.find(
      (v: any) => v.flavour_id === selectedFlavourId
    );
  }, [productDetail, selectedFlavourId]);

  // Urutkan ukuran yang tampil di UI (Sorting Logic)
  const sortedSizes = useMemo(() => {
    if (!activeVariant?.sizes) return [];
    return [...activeVariant.sizes].sort((a, b) => a.size - b.size);
  }, [activeVariant]);

  const galleryImages = useMemo(() => {
    if (activeVariant?.images && activeVariant.images.length > 0) {
      return activeVariant.images.map((img: any) => ({
        original: img.url,
        thumbnail: img.url,
      }));
    }
    return productDetail?.gizi_path
      ? [
          {
            original: `${imageUrl}/${productDetail.gizi_path}`,
            thumbnail: `${imageUrl}/${productDetail.gizi_path}`,
          },
        ]
      : [];
  }, [activeVariant, productDetail, imageUrl]);

  const handleFlavourChange = (flavourId: number, flavourName: string) => {
    setSelectedFlavourId(flavourId);
    setSelectedFlavourName(flavourName);

    const newVariant = productDetail.variants.find(
      (v: any) => v.flavour_id === flavourId
    );
    if (newVariant && newVariant.sizes.length > 0) {
      // Saat ganti rasa, otomatis pilih ukuran terkecil dari rasa tersebut
      const sorted = [...newVariant.sizes].sort((a, b) => a.size - b.size);
      const firstSize = sorted[0];
      setSelectedSizeId(String(firstSize.id));
      setSelectedSizeName(firstSize.size);
      setSelectedPrice(firstSize.price_discount ?? firstSize.price);
    }
  };

  const handleSizeChange = (sizeId: string, sizeName: string) => {
    setSelectedSizeId(sizeId);
    setSelectedSizeName(sizeName);
    const sizeObj = activeVariant?.sizes.find(
      (s: any) => String(s.id) === sizeId
    );
    if (sizeObj) {
      setSelectedPrice(sizeObj.price_discount ?? sizeObj.price);
    }
  };

  const handleAddToCart = () => {
    if (!selectedFlavourId || !selectedSizeId || !activeVariant) {
      toast.warning("Silahkan pilih rasa dan ukuran.");
      return;
    }

    const currentSize = activeVariant.sizes.find(
      (s: any) => String(s.id) === selectedSizeId
    );

    dispatch(
      addItemToCart({
        productName: activeVariant.name,
        flavourId: selectedFlavourId,
        flavourName: selectedFlavourName || "",
        sizeId: selectedSizeId,
        sizeName: `${selectedSizeName} gr`,
        price: currentSize.price,
        discount: currentSize.discount,
        price_discount: currentSize.price_discount,
        imageId: activeVariant.images[0]?.id || 0,
        imageUrl: activeVariant.images[0]?.url || "",
        quantity: 1,
        total: selectedPrice || 0,
      })
    );

    toast.success(
      <div className="flex flex-col">
        <span>Berhasil masuk keranjang!</span>
        <Link
          href="/cart"
          className="text-emerald-600 font-bold underline mt-1"
        >
          Lihat Keranjang
        </Link>
      </div>
    );
  };

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-emerald-600 animate-pulse text-xl">
        Memuat Produk...
      </div>
    );
  if (error || !productDetail)
    return (
      <div className="text-center py-20 text-gray-500">
        {error || "Produk tidak ditemukan"}
      </div>
    );

  const activeSizeObj = activeVariant?.sizes.find(
    (s: any) => String(s.id) === selectedSizeId
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* GALLERY */}
          <div className="relative">
            <ImageGallery
              items={galleryImages}
              showPlayButton={false}
              thumbnailPosition="bottom"
            />
          </div>

          {/* INFO PRODUK */}
          <div className="space-y-8">
            <div>
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-1">
                {productDetail.brand || "Premium Quality"}
              </p>
              <h1 className="text-4xl font-black text-slate-900 leading-tight">
                {activeVariant?.name}
              </h1>
              <div className="flex items-center gap-4 mt-6">
                <span className="text-4xl font-black text-emerald-600">
                  Rp {selectedPrice?.toLocaleString("id-ID")}
                </span>
                {activeSizeObj?.discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-400 line-through">
                      Rp {activeSizeObj.price.toLocaleString("id-ID")}
                    </span>
                    <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                      -{activeSizeObj.discount}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* PILIHAN RASA */}
            <div className="space-y-4">
              <p className="font-bold text-slate-800">
                Pilih Rasa:{" "}
                <span className="text-emerald-600">{selectedFlavourName}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {productDetail.flavours.map((f: any) => (
                  <button
                    key={f.id}
                    onClick={() => handleFlavourChange(f.id, f.name)}
                    className={`px-4 py-2 min-w-[100px] rounded-xl border-2 transition-all font-bold text-sm ${
                      selectedFlavourId === f.id
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
                        : "border-gray-100 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* PILIHAN UKURAN (Sudah Terurut) */}
            <div className="space-y-4">
              <p className="font-bold text-slate-800">Pilih Ukuran:</p>
              <div className="flex flex-wrap gap-3">
                {sortedSizes.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => handleSizeChange(String(s.id), s.size)}
                    className={`px-4 py-2 min-w-20 rounded-xl border-2 transition-all font-bold text-sm ${
                      selectedSizeId === String(s.id)
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
                        : "border-gray-100 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {s.size} gr
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95"
            >
              TAMBAH KE KERANJANG
            </button>
          </div>
        </div>

        {/* DESKRIPSI & MANFAAT */}
        <div className="mt-20 border-t pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 border-b-4 border-emerald-500 w-fit">
                Deskripsi Produk
              </h2>
              <div
                className="text-slate-600 leading-relaxed prose prose-emerald max-w-none"
                dangerouslySetInnerHTML={{ __html: productDetail.description }}
              />
            </section>
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 border-b-4 border-emerald-500 w-fit">
                Manfaat Utama
              </h2>
              <div
                className="text-slate-600 leading-relaxed prose prose-emerald max-w-none"
                dangerouslySetInnerHTML={{ __html: productDetail.benefits }}
              />
            </section>
          </div>

          {/* GIZI */}
          <div className="bg-slate-50 p-8 rounded-3xl h-fit border border-slate-100 sticky top-10">
            <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wider text-center">
              Informasi Nilai Gizi
            </h2>
            <img
              src={`${imageUrl}/${productDetail.gizi_path}`}
              alt="Informasi Gizi"
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* RELATED PRODUCTS (Mapping Sesuai JSON) */}
        {productDetail.related && productDetail.related.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-black text-slate-900 mb-10">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {productDetail.related.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/shop/${item.slug || "#"}`}
                  className="group"
                >
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 group-hover:shadow-2xl group-hover:border-emerald-100 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-square overflow-hidden rounded-xl mb-4 bg-gray-50">
                      <img
                        src={`${imageUrl}/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 mb-1 uppercase">
                      {item.brand}
                    </p>
                    <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {item.name}
                    </h4>
                    <div className="mt-auto pt-3">
                      <p className="text-emerald-600 font-black text-lg">
                        Rp{" "}
                        {(
                          item.price_discount ??
                          item.price ??
                          0
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
