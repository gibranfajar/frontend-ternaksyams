import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// --- Konfigurasi API ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

const AUTOPLAY_DELAY = 3000;
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

// Interface menyesuaikan struktur API
interface TestimonialData {
  id: number;
  name: string;
  social_media: string;
  city_age: string;
  message: string;
  image: string;
  target: string;
  status: boolean;
}

// --- Komponen Modal Video ---
interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  if (!isOpen) return null;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-lg shadow-2xl transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute -top-3 -right-3 sm:-right-4 text-white bg-[#1E8A6E] rounded-full text-3xl font-bold px-3 py-1 leading-none hover:bg-opacity-80 transition-colors z-50"
          onClick={onClose}
          aria-label="Tutup modal"
        >
          &times;
        </button>
        <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Testimonial Card ---
interface TestimonialCardProps {
  testimonial: TestimonialData;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => (
  <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
    <div className="pointer-events-none absolute right-0 top-0 h-[120px] w-[120px] bg-primary rounded-bl-[120px] flex items-start justify-end pr-3 pt-3">
      <img
        src={"/images/kutip.svg"}
        className="mb-3 ml-3 object-contain"
        alt="quote"
      />
    </div>

    <div className="px-8 pt-10 min-h-80 pb-10 text-center">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
        <img
          alt={testimonial.name}
          className="h-full w-full object-cover"
          src={`${IMAGE_URL}${testimonial.image}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/64x64/E6FFF6/1E8A6E?text=${testimonial.name.charAt(
              0
            )}`;
          }}
        />
      </div>

      <h4 className="text-[#145C4C] font-extrabold text-[20px] tracking-tight">
        {testimonial.name}
      </h4>
      <p className="text-[#1E8A6E] text-sm">{testimonial.city_age}</p>

      {/* Menggunakan dangerouslySetInnerHTML karena data 'message' dari API mengandung tag HTML */}
      <div
        className="mt-8 text-slate-700 leading-relaxed italic text-lg"
        dangerouslySetInnerHTML={{ __html: testimonial.message }}
      />
    </div>
  </div>
);

// --- Komponen Utama ---
export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Data dari API
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${API_URL}/testimonials`);
        // Filter hanya target 'user'
        const filteredData = response.data.filter(
          (item: TestimonialData) => item.target === "user"
        );
        setTestimonials(filteredData);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    getData();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })]
  );

  return (
    <section className="w-full bg-neutral bg-linear-to-b from-neutral to-[#187863]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 pb-48 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] items-center gap-12">
          <div className="pr-0 lg:pr-8 order-2 lg:order-1">
            <h2 className="text-white/90 font-extrabold tracking-tight leading-none text-4xl sm:text-[48px] md:text-[60px]">
              Testimonial
            </h2>
            <div className="mt-4 h-1.5 w-[110px] bg-white/80 rounded-full" />
            <h3 className="mt-8 text-white font-extrabold leading-tight text-2xl sm:text-3xl md:text-[34px]">
              Dipercaya lebih dari <br /> 10.000 pelanggan
            </h3>
            <p className="mt-5 text-white/80 max-w-[460px] leading-relaxed">
              Jangan hanya percaya kami, lihat perjuangan dan kesuksesan mereka
              meraih kesehatan yang diimpikan.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                aria-label="Tonton video testimoni"
                onClick={openModal}
                className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/90 transition-all hover:scale-110 active:scale-95 bg-white/10"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5l12 7-12 7V5z" fill="white" />
                </svg>
              </button>
              <span className="text-white font-medium">
                Tonton video testimoni
              </span>
            </div>
          </div>

          <div className="relative py-10 lg:py-24 pl-0 lg:pl-8 order-1 lg:order-2">
            <div className="overflow-hidden w-full" ref={emblaRef}>
              <div className="flex touch-pan-y -ml-4">
                {testimonials.map((testimonial) => (
                  <div
                    className="shrink-0 grow-0 w-full pl-4"
                    key={testimonial.id}
                  >
                    <div className="max-w-[560px] mx-auto">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        videoId={YOUTUBE_VIDEO_ID}
      />
    </section>
  );
}
