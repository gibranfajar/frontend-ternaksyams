"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { useAppDispatch } from "@/redux/hooks";
import { addItemToCart } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { slug } = useParams();
  const [productDetail, setProductDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [selectedFlavourId, setSelectedFlavourId] = useState<number | null>(
    null
  );
  const [selectedFlavourName, setSelectedFlavourName] = useState<string | null>(
    null
  );

  // >>> KEMBALI ke string | null agar cocok dgn CartItem.sizeId
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedSizeName, setSelectedSizeName] = useState<string | null>(null);

  // Simpan harga satuan efektif (price_discount ?? price)
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const [cart, setCart] = useState<any[]>([]); // testing local

  const imageUrl = process.env.NEXT_PUBLIC_API_IMAGE_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_PROD_DETAIL_URL;

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${slug}`);
        const product = response.data.data[0];
        setProductDetail(product);

        if (product.flavours.length > 0) {
          const defaultFlavour = product.flavours.find(
            (flavour: any) => flavour.id === product.flavour_id
          );
          if (defaultFlavour) {
            setSelectedFlavourId(defaultFlavour.id);
            setSelectedFlavourName(defaultFlavour.name);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product detail:", error);
        setError("Failed to fetch product detail");
        setLoading(false);
      }
    };

    if (slug) fetchProductDetail();
  }, [slug, apiUrl]);

  // Filter variants berdasarkan flavour_id yang dipilih
  const filteredVariants = productDetail
    ? productDetail.variants.filter(
        (variant: any) => variant.flavour_id === selectedFlavourId
      )
    : [];

  // Images untuk gallery
  const galleryImages =
    filteredVariants.length > 0
      ? filteredVariants[0]?.images.map((image: any) => ({
          original: image.url,
          thumbnail: image.url,
        }))
      : [];

  const handleFlavourChange = (flavourId: number, flavourName: string) => {
    setSelectedFlavourId(flavourId);
    setSelectedFlavourName(flavourName);

    // reset pilihan size & harga saat flavour berubah
    setSelectedSizeId(null);
    setSelectedSizeName(null);
    setSelectedPrice(null);
  };

  const handleSizeChange = (sizeId: string, sizeName: string) => {
    setSelectedSizeId(sizeId);
    setSelectedSizeName(sizeName);

    // Cari object size by id (bandingkan dengan String(size.id))
    const selectedSize = filteredVariants[0]?.sizes.find(
      (size: any) => String(size.id) === sizeId
    );

    if (selectedSize) {
      const unitPrice =
        selectedSize.price_discount ?? selectedSize.price ?? null;
      setSelectedPrice(unitPrice);
    }
  };

  const handleAddToCart = () => {
    if (selectedFlavourId && selectedSizeId && selectedPrice !== null) {
      const selectedVariant = filteredVariants.find(
        (variant: any) => variant.flavour_id === selectedFlavourId
      );

      const selectedSize = selectedVariant?.sizes.find(
        (size: any) => String(size.id) === selectedSizeId
      );

      if (selectedVariant && selectedSize) {
        const quantity = 1;
        const unitPrice =
          selectedSize.price_discount ?? selectedSize.price ?? 0;

        const itemToAdd = {
          productName: selectedVariant.name,
          flavourId: selectedFlavourId,
          flavourName: selectedFlavourName,
          sizeId: selectedSizeId, // string, sesuai CartItem
          sizeName: selectedSizeName,
          price: selectedSize.price, // harga normal
          discount: selectedSize.discount, // diskon (sesuai server)
          price_discount: selectedSize.price_discount, // harga setelah diskon (jika ada)
          imageId: selectedVariant.images[0]?.id,
          imageUrl: selectedVariant.images[0]?.url,
          quantity,
          total: unitPrice * quantity, // subtotal per item
        };

        dispatch(addItemToCart(itemToAdd));

        const toastContent = (
          <div>
            {selectedVariant.name} - {selectedSizeName} berhasil ditambahkan ke
            keranjang!
            <br />
            {/* Menggunakan Link langsung di dalam konten toast */}
            <Link
              href="/cart" // Ganti '/cart' dengan path keranjang Anda
              className="underline text-secondary hover:text-primary font-bold leading-loose"
              onClick={() => toast.dismiss()} // Opsional: tutup toast saat link diklik
            >
              Lihat Keranjang
            </Link>
          </div>
        );

        toast.success(
          toastContent,
          { autoClose: 3000 } // Naikkan autoClose agar user sempat mengklik
        );
      }
    } else {
      toast.warning("Silahkan pilih rasa dan ukuran.", { autoClose: 3000 });
      console.log("Please select both flavour and size.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-green-700 font-semibold">
            Memuat produk...
          </p>
          <div className="mt-4 w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  // Untuk tampilan harga di UI
  const currentSize =
    filteredVariants[0]?.sizes.find(
      (s: any) => String(s.id) === selectedSizeId
    ) ?? filteredVariants[0]?.sizes[0];

  const hasDiscount =
    (currentSize?.discount ?? 0) > 0 && currentSize?.price_discount;

  const displayUnitPrice =
    selectedPrice ?? currentSize?.price_discount ?? currentSize?.price ?? 0;

  return (
    <div className="container mx-auto px-3 md:px-5 lg:px-10 my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gambar Produk */}
        <div className="w-full">
          <ImageGallery items={galleryImages} />
        </div>

        {/* Detail Produk */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {filteredVariants[0]?.name}
          </h1>

          <div className="mt-2 md:mt-3 text-lg md:text-xl py-1 flex items-center">
            {hasDiscount && (
              <span className="line-through text-gray-400 pr-2">
                Rp {Number(currentSize?.price ?? 0).toLocaleString()}
              </span>
            )}
            <span className="text-gray-600 font-medium text-2xl">
              Rp {Number(displayUnitPrice).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="bg-accent text-white rounded-sm px-2 py-1 ml-3 text-sm font-semibold">
                -{currentSize.discount}%
              </span>
            )}
          </div>

          {/* Pilihan Rasa */}
          <div className="my-4 md:my-6 border-t border-b border-gray-300 py-6">
            <div className="flex flex-col">
              <div className="flex justify-between space-x-2 mb-5">
                <label className="font-bold">Rasa:</label>
                <div className="flex space-x-2 text-right">
                  {productDetail.flavours.map((flavour: any) => (
                    <div key={flavour.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`flavour-${flavour.id}`}
                        name="flavour"
                        value={flavour.id}
                        checked={selectedFlavourId === flavour.id}
                        onChange={() =>
                          handleFlavourChange(flavour.id, flavour.name)
                        }
                        className="hidden peer"
                      />
                      <label
                        htmlFor={`flavour-${flavour.id}`}
                        className="cursor-pointer px-4 py-2 text-gray-500 rounded-md border-2 border-primary peer-checked:bg-primary peer-checked:text-white hover:bg-zinc-300 transition duration-200"
                      >
                        {flavour.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pilihan Ukuran */}
              <div className="flex justify-between space-x-2">
                <label className="font-bold">Ukuran:</label>
                <div className="flex space-x-2 justify-end">
                  {filteredVariants[0]?.sizes.map((size: any) => (
                    <div key={size.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`size-${size.id}`}
                        name="size"
                        value={size.size}
                        checked={selectedSizeId === String(size.id)} // konsisten string
                        onChange={() =>
                          handleSizeChange(String(size.id), size.size)
                        }
                        className="hidden peer"
                      />
                      <label
                        htmlFor={`size-${size.id}`}
                        className="cursor-pointer px-4 py-2 text-gray-500 rounded-md border-2 border-primary peer-checked:bg-primary peer-checked:text-white hover:bg-zinc-300 transition duration-200"
                      >
                        {size.size} gr
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="py-4">
            <button
              onClick={handleAddToCart}
              className="cursor-pointer bg-primary text-white p-4 rounded-md w-full"
            >
              Tambahkan ke Keranjang
            </button>
          </div>

          {/* Informasi Gizi */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-6">Informasi Nilai Gizi</h2>
            <img
              src={`${imageUrl}/${productDetail.gizi_path}`}
              alt="Informasi Gizi"
              className="w-md h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Deskripsi & Manfaat */}
      <div className="py-6">
        <h2 className="text-lg font-semibold my-4 border-b border-gray-300 leading-loose">
          Deskripsi
        </h2>
        <div dangerouslySetInnerHTML={{ __html: productDetail.description }} />

        <h2 className="text-lg font-semibold my-4 border-b border-gray-300 leading-loose">
          Manfaat
        </h2>
        <div dangerouslySetInnerHTML={{ __html: productDetail.benefits }} />
      </div>

      {/* Produk Terkait */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Produk Terkait</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {productDetail.related_products &&
          productDetail.related_products.length > 0 ? (
            productDetail.related_products.map((relatedProduct: any) => (
              <div key={relatedProduct.id} className="border rounded-lg p-4">
                <img
                  src={`${imageUrl}/${relatedProduct.image}`}
                  alt={relatedProduct.product}
                  className="w-full h-auto mb-4"
                />
                <h3 className="text-sm font-semibold">
                  {relatedProduct.product}
                </h3>
                <p className="text-sm text-gray-500">
                  Rp{" "}
                  {Number(
                    relatedProduct.price_discount ?? relatedProduct.price ?? 0
                  ).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>Belum ada produk terkait.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
