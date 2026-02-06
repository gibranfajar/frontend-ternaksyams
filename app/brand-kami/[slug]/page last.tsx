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

const FiveStars: React.FC = () => (
  <div className="flex text-yellow-400 items-center justify-center md:justify-start">
    {"★".repeat(5)}
  </div>
);

const EMBLA_OPTIONS = {
  align: "start",
  dragFree: true,
  containScroll: "keepSnaps",
} as const;

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
  const slug = params.slug as string;

  const [data, setData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emblaRef] = useEmblaCarousel(EMBLA_OPTIONS);
  const [emblaBannerRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const sectionPaddingClass = "px-4 md:px-6 lg:px-12";

  const getImageUrl = (path: string | undefined): string => {
    if (!path || path.includes("http"))
      return path || "https://placehold.co/800x800.png";
    return `${API_IMAGE_URL}${path}`;
  };

  const cleanHtmlAndSplit = (
    htmlContent: string,
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
      try {
        const response = await axios.get(`${API_URL}/brand/${slug}`);
        const apiResponse = response.data.data;

        setData({
          hero: {
            title: apiResponse.detail?.herotitle || apiResponse.brand,
            subtitle: apiResponse.detail?.herosubtitle || "",
            ctaShop: "Belanja Sekarang",
            ctaShopURL: `/${slug}/shop`,
            ctaSubscribe: "Lihat Manfaat", // Tetap ditampilkan meskipun kosong di API
            ctaSubscribeURL: `#testimoni`, // Default scroll ke bawah
            heroImageURL: getImageUrl(
              apiResponse.detail?.banner || apiResponse.image
            ),
            imageAlt: apiResponse.brand,
          },
          testimonial: {
            quote: apiResponse.testimonial?.quotes.replace(/"/g, "") || "",
          },
          reviews: {
            count: apiResponse.testimonial?.textreview || "0+ Reviews",
            text: "Five Star Reviews",
            linkText: apiResponse.testimonial?.textcta || "Lihat ulasan",
            linkURL: apiResponse.testimonial?.linkcta || "#",
            reviewBgColor: apiResponse.testimonial?.cardcolor || "#193cb8",
          },
          features: cleanHtmlAndSplit(
            apiResponse.feature?.features || "",
            "</div>|\\<br\\>"
          ),
          marqueeBgColor: apiResponse.feature?.marquebgcolor,
          marqueeTextColor: apiResponse.feature?.marquetextcolor,
          productSectionTitle: `Varian Produk ${apiResponse.brand}`,
          accentTextColor: apiResponse.testimonial?.textcolor || "#193cb8",
          productSidebar: {
            headline: apiResponse.productsidebar?.headline || "",
            description:
              apiResponse.productsidebar?.description
                .replace(/<[^>]*>?/gm, "")
                .trim() || "",
            ctaText: apiResponse.productsidebar?.ctatext || "Lihat Semua",
            ctaURL: apiResponse.productsidebar?.ctalink || "#",
          },
          products: (apiResponse.variants || []).map((v: any, i: number) => ({
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
          sliders: (apiResponse.sliders || []).map((s: any) =>
            getImageUrl(s.image)
          ),
          aboutSection: {
            title: apiResponse.about?.title || "",
            description:
              apiResponse.about?.description.replace(/<[^>]*>?/gm, "").trim() ||
              "",
            ctaText: apiResponse.about?.ctatext || "Selengkapnya",
            ctaURL: apiResponse.about?.ctalink || "#",
            imageURL: getImageUrl(apiResponse.about?.image),
          },
          howItWorks: {
            tagline: apiResponse.howitwork?.tagline || "",
            headline: cleanHtmlAndSplit(
              apiResponse.howitwork?.headline || "",
              "<br>"
            ),
            steps: cleanHtmlAndSplit(
              apiResponse.howitwork?.steps || "",
              "<br>"
            ),
            ctaText: apiResponse.howitwork?.ctatext || "Pelajari",
            ctaURL: apiResponse.howitwork?.ctalink || "#",
            imageURL: getImageUrl(apiResponse.howitwork?.image),
          },
        });
      } catch (err) {
        setError("Gagal memuat data.");
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
    return <div className="text-center py-20 bg-white">⚠️ {error}</div>;

  const FeatureItem: React.FC<{ feature: string; isLast: boolean }> = ({
    feature,
    isLast,
  }) => (
    <div className="flex items-center text-sm md:text-base px-6 md:px-8 py-3">
      <span className="mr-2 text-xl">✅</span>
      <span className="whitespace-nowrap font-medium">{feature}</span>
      {!isLast && (
        <span className="ml-3 h-4 w-px bg-white opacity-50 hidden md:block"></span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <style>{`.embla { overflow: hidden; } .embla__container { display: flex; }`}</style>

      {/* 1. Hero Section */}
      <section
        className={`relative pt-10 pb-20 ${sectionPaddingClass}`}
        style={{
          backgroundImage: `url('${data.hero.heroImageURL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
        }}
      >
        <div className="absolute inset-0 bg-white/30"></div>
        <div className="relative max-w-4xl mx-auto text-center py-16">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
            {data.hero.title}
          </h1>
          <p className="text-xl text-gray-700 mb-10">{data.hero.subtitle}</p>
          <div className="flex justify-center space-x-4">
            <Link
              href={data.hero.ctaShopURL}
              className="flex items-center justify-center px-6 py-3 border border-gray-900 text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
            >
              {data.hero.ctaShop} <span className="ml-2">→</span>
            </Link>
            {/* BUTTON LIHAT MANFAAT DIKEMBALIKAN DISINI */}
            <Link
              href={data.hero.ctaSubscribeURL}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
            >
              {data.hero.ctaSubscribe} <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Testimonial Section */}
      <section className={`py-20 ${sectionPaddingClass} bg-white`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/5 mb-8 md:mb-0 md:pr-10">
            <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-gray-700 italic">
              <p>"{data.testimonial.quote}"</p>
            </blockquote>
          </div>
          <div
            className="md:w-2/5 text-white p-6 rounded-lg shadow-xl text-center md:text-left"
            style={{ backgroundColor: data.reviews.reviewBgColor }}
          >
            <p className="text-xl md:text-2xl font-extrabold mb-1">
              {data.reviews.count}
            </p>
            <p className="text-base md:text-xl font-light mb-2">
              {data.reviews.text}
            </p>
            <FiveStars />
            <Link
              href={data.reviews.linkURL}
              className="text-sm underline mt-3 inline-block hover:text-blue-200 transition duration-300"
            >
              {data.reviews.linkText}
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Features Bar */}
      <section
        className="overflow-hidden border-t border-b"
        style={{
          backgroundColor: data.marqueeBgColor || "#F1F1F1",
          color: data.marqueeTextColor || "#0a0a0a",
        }}
      >
        <Marquee speed={30} gradient={false} pauseOnHover={true}>
          {data.features.map((feature, index) => (
            <FeatureItem
              key={index}
              feature={feature}
              isLast={index === data.features.length - 1}
            />
          ))}
        </Marquee>
      </section>

      {/* 5. Slider Banner (Embla) */}
      {(data?.sliders?.length ?? 0) > 0 && (
        <section className={`py-12 ${sectionPaddingClass} bg-white`}>
          <div className="max-w-7xl mx-auto">
            <div
              className="embla overflow-hidden rounded-lg shadow-sm"
              ref={emblaBannerRef}
            >
              <div className="embla__container">
                {data.sliders.map((url, index) => (
                  <div
                    key={index}
                    className="embla__slide flex-[0_0_100%] h-auto md:h-[500px]"
                  >
                    <img
                      src={url}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Product Section */}
      <section className="py-16 bg-white">
        <div className={`max-w-7xl mx-auto ${sectionPaddingClass}`}>
          <h2
            className="text-3xl md:text-4xl font-semibold text-center mb-12"
            style={{ color: data.accentTextColor }}
          >
            {data.productSectionTitle}
          </h2>
          <div className="flex flex-col lg:flex-row items-start">
            <div className="w-full lg:w-1/3 min-w-[300px] bg-blue-50 rounded-lg p-8 lg:mr-8 mb-8 lg:mb-0 h-full">
              <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                {data.productSidebar.headline}
              </h3>
              <p className="text-gray-700 mb-10">
                {data.productSidebar.description}
              </p>
              <Link
                href={data.productSidebar.ctaURL}
                className="flex items-center justify-center px-6 py-3 border border-blue-900 text-sm font-medium rounded-full shadow-sm text-blue-900 bg-white hover:bg-blue-100 transition duration-300"
              >
                {data.productSidebar.ctaText} <span className="ml-2">→</span>
              </Link>
            </div>
            <div className="embla w-full lg:w-2/3" ref={emblaRef}>
              <div className="embla__container">
                {data.products.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. About Section */}
      <section
        className={`py-20 ${sectionPaddingClass} bg-gray-50 border-t border-gray-100`}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10 flex justify-center">
            <img
              src={data.aboutSection.imageURL}
              alt="About"
              className="w-full max-w-lg rounded-lg shadow-xl object-cover h-auto"
            />
          </div>
          <div className="lg:w-1/2 lg:pl-10">
            <h2
              className="text-3xl md:text-4xl font-semibold mb-6"
              style={{ color: data.accentTextColor }}
            >
              {data.aboutSection.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {data.aboutSection.description}
            </p>
            <Link
              href={data.aboutSection.ctaURL}
              className="flex items-center px-6 py-3 border border-gray-900 text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
            >
              {data.aboutSection.ctaText} <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. How It Works Section */}
      <section
        className={`py-20 ${sectionPaddingClass} bg-white overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
              {data.howItWorks.tagline}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              {data.howItWorks.headline.map((line, index) => (
                <React.Fragment key={index}>
                  <span
                    style={{
                      color:
                        index === 0
                          ? data.accentTextColor
                          : data.accentTextColor + "A0",
                    }}
                  >
                    {line}
                  </span>
                  <br />
                </React.Fragment>
              ))}
            </h2>
            <div className="space-y-6 mb-8">
              {data.howItWorks.steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <span className="flex items-center justify-center w-10 h-10 mr-4 text-gray-700 bg-white border border-gray-300 rounded-full font-bold text-sm shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-lg text-gray-700 ">{step}</p>
                </div>
              ))}
            </div>
            <Link
              href={data.howItWorks.ctaURL}
              className="flex items-center px-6 py-3 border border-gray-900 text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
            >
              {data.howItWorks.ctaText} <span className="ml-2">→</span>
            </Link>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-start relative">
            <img
              src={data.howItWorks.imageURL}
              alt="Workflow"
              className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-none rounded-lg shadow-xl object-cover h-auto"
              style={{ maxWidth: "600px", transform: "scale(1.1)" }}
            />
          </div>
        </div>
      </section>

      <section id="testimoni">
        <TestimonialBrand />
      </section>

      {/* Footer CTA */}
      <section className="flex items-center justify-center py-20 bg-white">
        <Link href="/shop">
          <button className="px-20 py-4 rounded-full text-xl border-2 border-neutral text-white bg-neutral font-bold transition duration-300 hover:bg-white hover:text-neutral">
            Beli Sekarang
          </button>
        </Link>
      </section>
    </div>
  );
};

export default BrandProfile;
