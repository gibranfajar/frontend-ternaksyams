import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";

// --- Tipe Data untuk Slider ---
interface SliderData {
  id: number;
  title: string;
  image: string;
  description: string;
  ctatext: string;
  ctalink: string;
}

// --- Konfigurasi Environment ---
const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ts.crx.my.id/api";
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_API_IMAGE_URL || "https://ts.crx.my.id/";

// --- Opsi Embla Carousel ---
const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: "start",
  slidesToScroll: 1,
};

// --- Komponen Dot Navigation (Opsional, dipertahankan dari versi sebelumnya) ---
interface DotButtonProps {
  selected: boolean;
  onClick: () => void;
}

const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => (
  <button
    className={`w-1 h-1 mx-1 rounded-full transition-all ${
      selected ? "bg-white ring-0" : "bg-gray-400 opacity-70"
    }`}
    type="button"
    onClick={onClick}
  />
);

interface DotButtonsProps {
  emblaApi: EmblaCarouselType;
}

const DotButtons: React.FC<DotButtonsProps> = ({ emblaApi }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
      {scrollSnaps.map((_, index) => (
        <DotButton
          key={index}
          selected={index === selectedIndex}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  );
};

// --- Komponen Slider Utama ---
const Slider: React.FC = () => {
  const [slides, setSlides] = useState<SliderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const fetchSliders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<SliderData[]>(`${BASE_API_URL}/sliders`);
      if (Array.isArray(response.data)) {
        // Hanya ambil data jika merupakan array
        setSlides(response.data);
      } else {
        // Jika API mengembalikan 200 OK tetapi data bukan array/format yang diharapkan
        console.warn("API returned invalid data format.");
        setSlides([]); // Set slides ke array kosong
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching sliders:", err);
      // Tetapkan error, tetapi juga pastikan slides kosong
      setError("Gagal memuat data slider. Silakan coba lagi.");
      setSlides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  // --- Penanganan State Tampilan (Diperbarui) ---

  if (loading)
    return (
      <div className="text-center py-8 text-gray-600 font-medium">
        <p className="loading loading-dots loading-lg"></p>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 bg-red-100 text-red-700 border border-red-300 rounded mx-4">
        {error}
      </div>
    );

  // LOGIKA UTAMA: Jika data kosong, **return null (jangan tampilkan apapun)**
  if (slides.length === 0) {
    return null;
  }

  // Render Utama
  return (
    <div className="relative">
      <div className="embla overflow-hidden shadow-xl" ref={emblaRef}>
        <div className="embla__container flex touch-pan-y">
          {slides.map((slide) => (
            <div
              className="embla__slide relative flex-none min-w-0"
              key={slide.id}
              style={{ flex: "0 0 100%" }}
            >
              <a
                href={slide.ctalink}
                title={slide.title}
                className="block w-full h-full group"
                aria-label={slide.ctatext}
              >
                <div
                  className={
                    "relative w-full h-screen " + // Menyesuaikan ketinggian
                    "bg-gray-200 overflow-hidden"
                  }
                >
                  <img
                    src={`${IMAGE_BASE_URL}${slide.image}`.replace(
                      /([^:]\/)\/+/g,
                      "$1"
                    )}
                    alt={slide.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay Konten */}
                  <div
                    className={
                      "absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent p-8 md:p-16 pb-20 text-white " +
                      // Mobile: Konten di bawah (justify-end)
                      "flex flex-col justify-end " +
                      // Desktop (md ke atas): Konten di tengah (justify-center)
                      "md:justify-center md:items-start"
                    }
                  >
                    <div className="md:w-1/2">
                      {" "}
                      {/* Batasi lebar konten di desktop */}
                      <h2 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg leading-snug">
                        {slide.title}
                      </h2>
                      <div
                        className="text-base md:text-xl mb-6 line-clamp-3 opacity-90"
                        dangerouslySetInnerHTML={{ __html: slide.description }}
                      />
                      <button className="bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-200 text-lg">
                        {slide.ctatext}
                      </button>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Tampilkan DotButtons hanya jika ada data */}
      {emblaApi && slides.length > 0 && <DotButtons emblaApi={emblaApi} />}
    </div>
  );
};

export default Slider;
