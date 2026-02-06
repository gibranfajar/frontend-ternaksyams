"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import axios from "axios";
import { useParams } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";

import TestimonialBrand from "@/components/TestimonialBrand";

// --- Konfigurasi API ---
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ts.crx.my.id/api/brand";
const API_IMAGE_URL =
  process.env.NEXT_PUBLIC_API_IMAGE_URL || "https://ts.crx.my.id/storage/";

// --- Tipe Data ---
interface Product {
  name: string;
  imageURL: string;
  badge?: "Best Seller" | string;
  type: string;
  priceFrom: string;
  reviews: string;
  linkText: string;
  linkURL: string;
  isGoataProduct: boolean;
}

interface BrandData {
  hero: {
    title: string;
    subtitle: string;
    ctaShop: string;
    ctaShopURL: string;
    ctaSubscribe: string;
    ctaSubscribeURL: string;
    heroImageURL: string;
    imageAlt: string;
  };
  testimonial: { quote: string };
  reviews: {
    count: string;
    text: string;
    linkText: string;
    linkURL: string;
    reviewBgColor: string;
  };
  features: string[];
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  productSectionTitle: string;
  accentTextColor?: string;
  productSidebar: {
    headline: string;
    description: string;
    ctaText: string;
    ctaURL: string;
  };
  products: Product[];
  sliders: string[];
  aboutSection: {
    title: string;
    description: string;
    ctaText: string;
    ctaURL: string;
    imageURL: string;
  };
  howItWorks: {
    tagline: string;
    headline: string[];
    steps: string[];
    ctaText: string;
    ctaURL: string;
    imageURL: string;
  };
}

// Helper Components
const FiveStars: React.FC = () => (
  <div className="flex text-yellow-400">{"★".repeat(5)}</div>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="embla__slide relative min-w-[280px] md:min-w-[320px] lg:min-w-[300px] bg-white border border-gray-100 rounded-lg shadow-sm p-4 mr-4 shrink-0">
    {product.badge && (
      <span
        className={`absolute btn btn-circle top-0 right-0 m-2 p-8 text-xs ${
          product.badge === "Best Seller"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {product.badge}
      </span>
    )}
    <div className="bg-gray-50 rounded-md mb-3 h-80 flex justify-center items-center">
      <img
        src={product.imageURL}
        alt={product.name}
        className="max-h-full object-contain rounded-md"
      />
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
    <p className="text-sm text-gray-500 mb-2">{product.type}</p>
    <div className="flex items-center justify-between text-sm mb-4">
      <div className="flex items-center">
        <FiveStars />
        <span className="ml-2 text-gray-600">{product.reviews}</span>
      </div>
      <p className="font-bold text-green-600">{product.priceFrom}</p>
    </div>
    <Link
      href={product.linkURL}
      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-150"
    >
      {product.linkText} →
    </Link>
  </div>
);

const BrandProfile: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const [data, setData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carousel Hooks
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "keepSnaps",
  });
  const [emblaBannerRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const sectionPaddingClass = "px-4 md:px-6 lg:px-12";

  // Helpers
  const getImageUrl = (path: string | undefined): string => {
    if (!path || path.includes("http"))
      return path || "https://placehold.co/800x800.png";
    return `${API_IMAGE_URL}${path}`;
  };

  const cleanHtmlAndSplit = (
    htmlContent: string | undefined,
    delimiter: string = "<br>"
  ): string[] => {
    if (!htmlContent) return [];
    let cleanText = htmlContent.replace(/<\/?(div|p|ul|li|strong)[^>]*>/g, "");
    cleanText = cleanText.replace(/&#92;n|&amp;nbsp;/g, " ").trim();
    return cleanText
      .split(new RegExp(delimiter, "i"))
      .map((item) => item.replace(/<[^>]+>/g, "").trim())
      .filter((i) => i.length > 0);
  };

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/brand/${slug}`);
        const api = response.data.data;

        if (!api) throw new Error("Data brand tidak ditemukan.");

        setData({
          hero: {
            title: api.detail?.herotitle || api.brand || "Welcome",
            subtitle: api.detail?.herosubtitle || "",
            ctaShop: "Belanja Sekarang",
            ctaShopURL: `/${slug}/shop`,
            ctaSubscribe: "Lihat Manfaat",
            ctaSubscribeURL: `/${slug}/benefits`,
            heroImageURL: getImageUrl(api.detail?.banner || api.image),
            imageAlt: api.brand || "Hero Image",
          },
          testimonial: {
            quote: api.testimonial?.quotes?.replace(/"/g, "") || "",
          },
          reviews: {
            count: api.testimonial?.textreview || "0+ Reviews",
            text: "Five Star Reviews",
            linkText: api.testimonial?.textcta || "Lihat ulasan",
            linkURL: api.testimonial?.linkcta || "#",
            reviewBgColor: api.testimonial?.cardcolor || "#193cb8",
          },
          features: cleanHtmlAndSplit(api.feature?.features, "</div>|\\<br\\>"),
          marqueeBgColor: api.feature?.marquebgcolor,
          marqueeTextColor: api.feature?.marquetextcolor,
          productSectionTitle: `Varian Produk ${api.brand || ""}`,
          accentTextColor: api.testimonial?.textcolor || "#193cb8",
          productSidebar: {
            headline: api.productsidebar?.headline || "",
            description:
              api.productsidebar?.description
                ?.replace(/<[^>]*>?/gm, "")
                .trim() || "",
            ctaText: api.productsidebar?.ctatext || "Lihat Semua",
            ctaURL: api.productsidebar?.ctalink || "#",
          },
          products: (api.variants || []).map((v: any, i: number) => ({
            name: v.variant,
            imageURL: getImageUrl(v.image),
            badge: i === 0 ? "Best Seller" : undefined,
            type: "Susu Bubuk",
            priceFrom: "Cek Harga",
            reviews: "1K reviews",
            linkText: "Beli Sekarang",
            linkURL: `/${slug}/product/${v.id}`,
            isGoataProduct: true,
          })),
          sliders: (api.sliders || []).map((s: any) => getImageUrl(s.image)),
          aboutSection: {
            title: api.about?.title || "",
            description:
              api.about?.description?.replace(/<[^>]*>?/gm, "").trim() || "",
            ctaText: api.about?.ctatext || "Selengkapnya",
            ctaURL: api.about?.ctalink || "#",
            imageURL: getImageUrl(api.about?.image),
          },
          howItWorks: {
            tagline: api.howitwork?.tagline || "",
            headline: cleanHtmlAndSplit(api.howitwork?.headline, "<br>"),
            steps: cleanHtmlAndSplit(api.howitwork?.steps, "<br>"),
            ctaText: api.howitwork?.ctatext || "Pelajari",
            ctaURL: api.howitwork?.ctalink || "#",
            imageURL: getImageUrl(api.howitwork?.image),
          },
        });
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message || "Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading)
    return (
      <div className="text-center py-20 bg-white min-h-screen flex items-center justify-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  if (error || !data)
    return (
      <div className="text-center py-20 bg-white min-h-screen flex flex-col items-center justify-center gap-4">
        <div>⚠️ {error || "Data tidak tersedia"}</div>
        <Link href="/" className="btn btn-sm">
          Kembali
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <style>{`.embla { overflow: hidden; } .embla__container { display: flex; }`}</style>

      {/* 1. Hero Section */}
      <section
        className={`relative pt-10 pb-20 ${sectionPaddingClass} flex items-center`}
        style={{
          backgroundImage: `url('${data.hero.heroImageURL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
        }}
      >
        <div className="absolute inset-0 bg-white/30"></div>
        <div className="relative max-w-4xl mx-auto text-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4 font-bold">
            {data.hero.title}
          </h1>
          <p className="text-xl text-gray-700 mb-10">{data.hero.subtitle}</p>
          <div className="flex justify-center space-x-4">
            <Link
              href={data.hero.ctaShopURL}
              className="px-6 py-3 border border-gray-900 rounded-full bg-white hover:bg-gray-100 transition font-medium"
            >
              {" "}
              {data.hero.ctaShop} →{" "}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Testimonial Section */}
      <section className={`py-20 ${sectionPaddingClass}`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <blockquote className="md:w-3/5 text-xl md:text-2xl italic text-gray-700">
            "{data.testimonial.quote}"
          </blockquote>
          <div
            className="md:w-2/5 p-8 rounded-2xl text-white shadow-xl"
            style={{ backgroundColor: data.reviews.reviewBgColor }}
          >
            <p className="text-2xl font-bold mb-1">{data.reviews.count}</p>
            <p className="mb-2 opacity-90">{data.reviews.text}</p>
            <FiveStars />
            <Link
              href={data.reviews.linkURL}
              className="underline text-sm mt-4 inline-block hover:opacity-80 transition"
            >
              {data.reviews.linkText}
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Running Text Features */}
      <section
        className="border-y py-1"
        style={{
          backgroundColor: data.marqueeBgColor || "#eee",
          color: data.marqueeTextColor || "#000",
        }}
      >
        <Marquee speed={40} gradient={false} pauseOnHover>
          {data.features.map((f, i) => (
            <div
              key={i}
              className="px-10 font-bold uppercase flex items-center py-3"
            >
              <span className="mr-2 text-xl">✅</span> {f}
            </div>
          ))}
        </Marquee>
      </section>

      {/* 4. Banner Sliders (Embla) - Safe Access */}
      {(data?.sliders?.length ?? 0) > 0 && (
        <section className={`py-12 ${sectionPaddingClass} bg-gray-50`}>
          <div className="max-w-7xl mx-auto">
            <div
              className="embla rounded-3xl shadow-2xl overflow-hidden"
              ref={emblaBannerRef}
            >
              <div className="embla__container">
                {data.sliders.map((url, i) => (
                  <div
                    key={i}
                    className="embla__slide flex-[0_0_100%] h-[250px] md:h-[500px]"
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt={`Banner ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Products Section */}
      <section className="py-16 bg-white">
        <div className={`max-w-7xl mx-auto ${sectionPaddingClass}`}>
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: data.accentTextColor }}
          >
            {data.productSectionTitle}
          </h2>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 bg-blue-50 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">
                {data.productSidebar.headline}
              </h3>
              <p className="mb-8 text-gray-700">
                {data.productSidebar.description}
              </p>
              <Link
                href={data.productSidebar.ctaURL}
                className="px-6 py-3 bg-white border border-blue-900 text-blue-900 font-semibold rounded-full block text-center transition hover:bg-blue-900 hover:text-white"
              >
                {data.productSidebar.ctaText}
              </Link>
            </div>
            <div className="embla lg:w-2/3" ref={emblaRef}>
              <div className="embla__container">
                {data.products.map((p, i) => (
                  <ProductCard key={i} product={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. About Section */}
      <section className={`py-20 ${sectionPaddingClass} bg-gray-50`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <img
              src={data.aboutSection.imageURL}
              className="w-full rounded-3xl shadow-2xl"
              alt="About Brand"
            />
          </div>
          <div className="lg:w-1/2">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: data.accentTextColor }}
            >
              {data.aboutSection.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {data.aboutSection.description}
            </p>
            <Link
              href={data.aboutSection.ctaURL}
              className="inline-flex items-center px-8 py-3 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white transition"
            >
              {" "}
              {data.aboutSection.ctaText} <span className="ml-2">→</span>{" "}
            </Link>
          </div>
        </div>
      </section>

      {/* 7. How It Works Section */}
      <section className={`py-20 ${sectionPaddingClass} bg-white`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <p className="font-bold text-gray-400 uppercase tracking-widest mb-4">
              {data.howItWorks.tagline}
            </p>
            <h2
              className="text-4xl font-bold mb-8"
              style={{ color: data.accentTextColor }}
            >
              {data.howItWorks.headline.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </h2>
            <div className="space-y-6 mb-10">
              {data.howItWorks.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4 text-lg">
                  <span className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold shrink-0 mt-1">
                    {i + 1}
                  </span>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
            <Link
              href={data.howItWorks.ctaURL}
              className="inline-flex items-center px-8 py-3 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white transition"
            >
              {" "}
              {data.howItWorks.ctaText} <span className="ml-2">→</span>{" "}
            </Link>
          </div>
          <div className="lg:w-1/2">
            <img
              src={data.howItWorks.imageURL}
              className="w-full rounded-3xl shadow-xl"
              alt="Workflow"
            />
          </div>
        </div>
      </section>

      {/* 8. Global Testimonial Component */}
      <section id="testimoni">
        <TestimonialBrand />
      </section>

      {/* 9. Sticky/Bottom CTA */}
      <section className="py-24 text-center bg-white border-t">
        <Link
          href="/shop"
          className="inline-block px-16 md:px-24 py-5 bg-black text-white rounded-full text-xl font-bold hover:bg-gray-800 transition shadow-2xl transform hover:-translate-y-1"
        >
          Beli Sekarang
        </Link>
      </section>
    </div>
  );
};

export default BrandProfile;
