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

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null,
  );
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

  const imageUrl = process.env.NEXT_PUBLIC_API_IMAGE_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/flash-sale-products/${slug}`,
        );
        const product = response.data.data[0];
        setProductDetail(product);

        // Inisialisasi variant berdasarkan slug atau ambil yang pertama
        const initialVariant =
          product.variants.find((v: any) => v.variant_slug === slug) ||
          product.variants[0];

        if (initialVariant) {
          setSelectedVariantId(initialVariant.variant_id);
          if (initialVariant.sizes?.length > 0) {
            setSelectedSizeId(initialVariant.sizes[0].variant_size_id);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Gagal memuat detail produk");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProductDetail();
  }, [slug, apiUrl]);

  const activeVariant = useMemo(() => {
    return productDetail?.variants.find(
      (v: any) => v.variant_id === selectedVariantId,
    );
  }, [productDetail, selectedVariantId]);

  const activeSize = useMemo(() => {
    return activeVariant?.sizes.find(
      (s: any) => s.variant_size_id === selectedSizeId,
    );
  }, [activeVariant, selectedSizeId]);

  const galleryImages = useMemo(() => {
    const images = activeVariant?.images;

    if (images && images.length > 0) {
      return images.map((img: any) => ({
        original: `${imageUrl}/${img.image_path}`,
        thumbnail: `${imageUrl}/${img.image_path}`,
      }));
    }

    // fallback ke gambar gizi
    if (productDetail?.data?.[0]?.gizi_path) {
      return [
        {
          original: `${imageUrl}/${productDetail.data[0].gizi_path}`,
          thumbnail: `${imageUrl}/${productDetail.data[0].gizi_path}`,
        },
      ];
    }

    return [];
  }, [activeVariant, productDetail, imageUrl]);

  const handleAddToCart = () => {
    if (!activeSize || !activeVariant) return;

    const flavourInfo = productDetail.flavours?.find((f: any) =>
      activeVariant.variant_name.toLowerCase().includes(f.name.toLowerCase()),
    );

    const firstImage = activeVariant.images?.[0];

    dispatch(
      addItemToCart({
        productName: activeVariant.variant_name,
        flavourId: flavourInfo?.id || 0,
        flavourName: flavourInfo?.name || "Original",
        sizeId: String(activeSize.variant_size_id),
        sizeName: `${activeSize.size} gr`,
        price: activeSize.price_original,
        discount: activeSize.discount,
        price_discount: activeSize.price_flash_sale,
        imageId: firstImage?.id || 0,
        imageUrl: firstImage
          ? `${imageUrl}/${firstImage.image_path}`
          : `${imageUrl}/${productDetail.gizi_path}`,
        quantity: 1,
        total: activeSize.price_flash_sale,
      }),
    );

    toast.success("Berhasil masuk keranjang!");
  };

  if (loading)
    return <div className="text-center py-20 font-bold">Memuat Produk...</div>;
  if (!productDetail)
    return <div className="text-center py-20">Produk tidak ditemukan</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* BAGIAN KIRI: GALLERY */}
          <div className="relative">
            {/* BADGE DISCOUNT di atas gambar */}
            {activeSize?.discount > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-red-600 text-white font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
                SAVE {activeSize.discount}%
              </div>
            )}
            <ImageGallery
              items={galleryImages}
              showPlayButton={false}
              thumbnailPosition="bottom"
            />
          </div>

          {/* BAGIAN KANAN: INFO */}
          <div className="space-y-6">
            <div>
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs">
                {productDetail.brand}
              </p>
              <h1 className="text-4xl font-black text-slate-900 mt-2">
                {activeVariant?.variant_name}
              </h1>

              <div className="flex items-center gap-4 mt-4">
                <span className="text-4xl font-black text-emerald-600">
                  Rp {activeSize?.price_flash_sale.toLocaleString("id-ID")}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  Rp {activeSize?.price_original.toLocaleString("id-ID")}
                </span>
                {activeSize?.discount > 0 && (
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                    -{activeSize.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* RASA */}
            <div className="space-y-3">
              <p className="font-bold text-slate-800">Pilih Rasa:</p>
              <div className="flex flex-wrap gap-2">
                {productDetail.variants.map((v: any) => (
                  <button
                    key={v.variant_id}
                    onClick={() => {
                      setSelectedVariantId(v.variant_id);
                      setSelectedSizeId(v.sizes[0].variant_size_id);
                    }}
                    className={`px-4 py-2 w-28 rounded-xl border-2 transition-all font-bold text-sm ${
                      selectedVariantId === v.variant_id
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {v.variant_name.split(" - ")[1] || v.variant_name}
                  </button>
                ))}
              </div>
            </div>

            {/* UKURAN */}
            <div className="space-y-3">
              <p className="font-bold text-slate-800">Pilih Ukuran:</p>
              <div className="flex gap-2">
                {activeVariant?.sizes.map((s: any) => (
                  <button
                    key={s.variant_size_id}
                    onClick={() => setSelectedSizeId(s.variant_size_id)}
                    className={`px-4 py-2 w-24 rounded-xl border-2 transition-all font-bold text-sm ${
                      selectedSizeId === s.variant_size_id
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    {s.size} gr
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary mt-4 hover:bg-[#008a69] text-white py-5 rounded-xl font-black text-lg shadow-xl  transition-all active:scale-95"
            >
              TAMBAH KE KERANJANG
            </button>
          </div>
        </div>

        {/* --- BAGIAN BAWAH: DESKRIPSI, MANFAAT & GIZI --- */}
        <div className="mt-16 border-t pt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* DESCRIPTION */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 border-b-4 border-emerald-500 w-fit">
                Deskripsi Produk
              </h2>
              <div
                className="text-slate-600 leading-relaxed prose prose-emerald"
                dangerouslySetInnerHTML={{ __html: productDetail.description }}
              />
            </section>

            {/* BENEFITS */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 border-b-4 border-emerald-500 w-fit">
                Manfaat Utama
              </h2>
              <div
                className="text-slate-600 leading-relaxed prose prose-emerald"
                dangerouslySetInnerHTML={{ __html: productDetail.benefits }}
              />
            </section>
          </div>

          {/* GIZI PATH */}
          <div className="bg-slate-50 p-6 rounded-3xl h-fit border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wider text-center">
              Informasi Nilai Gizi
            </h2>
            <img
              src={`${imageUrl}/${productDetail.gizi_path}`}
              alt="Informasi Gizi"
              className="w-full h-auto rounded-xl shadow-sm hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* --- RELATED PRODUCTS --- */}
        {productDetail.related && productDetail.related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-black text-slate-900 mb-8">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {productDetail.related.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/flash-sale/${item.slug}`}
                  className="group"
                >
                  <div className="bg-white p-4 rounded-xl border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                    <img
                      src={`${imageUrl}/${item.image}`}
                      alt={item.name}
                      className="w-full aspect-square object-contain mb-4 transition-transform"
                    />
                    <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600">
                      {item.name}
                    </h4>
                    <p className="text-emerald-600 font-black mt-1">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
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
