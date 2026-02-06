import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type ApiProduct = {
  id: number;
  brand: string;
  variant: string;
  image: string;
  description: string;
};

type ApiResponse = {
  data: ApiProduct[];
};

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${BASE_API_URL}/variant-all-brand`;

export default function ProductSliderEmbla() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!BASE_API_URL) {
      console.error(
        "Variabel lingkungan NEXT_PUBLIC_API_URL tidak terdefinisi.",
      );
      setError("Konfigurasi API tidak lengkap.");
      setIsLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ApiResponse>(API_URL);
        setProducts(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Gagal mengambil data produk:", err);
        if (axios.isAxiosError(err) && err.response) {
          setError(`Gagal memuat produk. Kode Status: ${err.response.status}`);
        } else {
          setError("Gagal memuat produk. Silakan coba lagi nanti.");
        }
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "start",
      skipSnaps: true,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })],
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, products.length]);

  const scrollTo = (i: number) => emblaApi && emblaApi.scrollTo(i);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl text-center font-bold text-emerald-900 mb-6">
          Category produk
        </h2>

        {isLoading && <p className="loading loading-dots loading-lg"></p>}
        {error && (
          <p className="text-center text-red-600 font-medium">Error: {error}</p>
        )}

        {!isLoading && products.length === 0 && !error && (
          <p className="text-center text-slate-600">
            Tidak ada produk ditemukan.
          </p>
        )}

        {!isLoading && products.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 p-2">
                {products.map((p: ApiProduct, i: number) => (
                  <article
                    key={p.id}
                    className="shrink-0 w-[50%] sm:w-[30%] md:w-[25%] lg:w-[20%] xl:w-[18%] bg-white rounded-2xl shadow-md border border-slate-100 transition-transform duration-300 data-[active=true]:scale-[1.02]"
                    data-active={i === selectedIndex}
                  >
                    <div className="">
                      <div className="flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={`${p.brand} ${p.variant}`}
                          className="h-full p-5 object-contain"
                          width={300}
                          height={300}
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        {/* <h3 className=" text-emerald-900 font-bold leading-tight">
                          {p.brand}
                        </h3> */}
                        <p className="text-emerald-900 font-semibold mt-1">
                          {p.variant}
                        </p>
                        <div
                          className="mt-3 text-sm text-slate-600 line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html:
                              p.description?.replace(/<\/?div>/g, "") ||
                              "Tidak ada deskripsi.",
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    selectedIndex === i ? "w-6 bg-emerald-900" : "bg-slate-300"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="flex justify-center mt-6">
              <Link href="/brand-kami">
                <button className="btn btn-primary hover:bg-secondary border-none transition px-8 py-6 font-bold text-base rounded-full">
                  Lihat Semua Produk
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
