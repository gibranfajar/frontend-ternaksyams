import React, { useState, useCallback, useEffect } from "react";
// PENTING: Untuk menjalankan kode ini, Anda harus menginstal paket Embla Carousel:
// npm install embla-carousel-react
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Konfigurasi Autoplay
const AUTOPLAY_DELAY = 3000;

// dummy data
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ"; // Ganti dengan ID video yang Anda inginkan

const testimonials = [
  {
    id: 1,
    name: "Irma Septiana",
    city: "Jakarta",
    age: 32,
    quote:
      "Lutut yang sebelumnya suka sakit saat naik tangga, sekarang berangsur membaik. Program ini sangat membantu mobilitas harian saya.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Budi Santoso",
    city: "Bandung",
    age: 45,
    quote:
      "Sakit pinggang akibat terlalu lama duduk di kantor sudah hilang total setelah mengikuti program ini. Saya bisa bekerja dengan nyaman lagi!",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Citra Dewi",
    city: "Surabaya",
    age: 28,
    quote:
      "Saya merasa lebih berenergi dan berhasil menurunkan berat badan 7 kg dalam 3 bulan! Sangat direkomendasikan dan mudah diikuti.",
    img: "https://images.unsplash.com/photo-1594744803329-e58b31de7852?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Ahmad Rizky",
    city: "Medan",
    age: 55,
    quote:
      "Kualitas tidur saya meningkat drastis. Saya tidak menyangka perubahan pola hidup sederhana bisa memberikan dampak sebesar ini. Terima kasih!",
    img: "https://images.unsplash.com/photo-1557862921-3708eb187474?q=80&w=256&auto=format&fit=crop",
  },
];

// ------------------------------------------------------------------

// --- Komponen Tombol Navigasi Carousel ---
interface ArrowButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  children,
  onClick,
  disabled,
  label,
}) => (
  <button
    aria-label={label}
    className={`
      text-[#1E8A6E] p-2 rounded-full transition-opacity
      ${disabled ? "opacity-30 cursor-default" : "hover:opacity-80"}
    `}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

// --- Komponen Testimonial Card ---
interface TestimonialCardProps {
  testimonial: (typeof testimonials)[0];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => (
  <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
    {/* Sudut kanan atas: lingkaran seperempat + ikon kutip */}
    <div className="pointer-events-none absolute right-0 top-0 h-[120px] w-[120px] bg-primary rounded-bl-[120px] flex items-start justify-end pr-3 pt-3">
      <img src={"/images/kutip.svg"} className="mb-3 ml-3 object-contain" />
    </div>

    {/* Isi kartu */}
    <div className="px-8 pt-10 pb-10 text-center">
      {/* Avatar */}
      <div className="mx-auto mb-4 h-16 w-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
        <img
          alt={testimonial.name}
          className="h-full w-full object-cover"
          src={testimonial.img}
          onError={(e) => {
            // Perbaikan: Lakukan casting e.target ke HTMLImageElement
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
      <p className="text-[#1E8A6E] text-sm">
        {testimonial.city}, {testimonial.age} Tahun
      </p>

      <p className="mt-8 text-slate-700 leading-relaxed italic text-lg">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
    </div>
  </div>
);

// --- Komponen Utama ---
export default function TestimonialSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 1. Inisialisasi Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
    },
    [Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })]
  );

  // 2. State dan Callback untuk Navigasi
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  // PERBAIKAN: Secara eksplisit menentukan tipe state sebagai array of numbers (number[])
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      // Menambahkan tipe number untuk index
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(
    (emblaApi: {
      selectedScrollSnap: () => React.SetStateAction<number>;
      canScrollPrev: () => any;
      canScrollNext: () => any;
    }) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    // PERBAIKAN: Mengganti emblaApi.scrollSnaps() dengan emblaApi.scrollSnapList()
    // Tipe state sekarang ditentukan sebagai number[], sehingga ini valid.
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="w-full bg-neutral bg-linear-to-b from-neutral to-[#187863] pb-20 md:pb-0">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] items-center gap-12">
          {/* Kolom kiri: Info Testimonial */}
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
          </div>

          {/* Kolom kanan: Embla Carousel (Testimoni) */}
          <div className="relative py-10 lg:py-24 pl-0 lg:pl-8 order-1 lg:order-2">
            {/* Navigasi Kiri/Kanan (Diposisikan di atas carousel) */}

            {/* Embla Viewport */}
            <div className="overflow-hidden w-full" ref={emblaRef}>
              <div className="flex touch-pan-y -ml-4">
                {testimonials.map((testimonial) => (
                  <div
                    className="shrink-0 grow-0 w-full pl-4"
                    key={testimonial.id}
                  >
                    {/* Embla Slide Content */}
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
    </section>
  );
}
