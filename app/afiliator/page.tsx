"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronRight, CheckCircle2, MessageCircle } from "lucide-react";

// --- Types ---
interface benefit {
  id: number;
  type: string;
  thumbnail: string;
  benefit: string;
  status: string;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category_id: number;
  target: "user" | "affiliate" | "reseller" | "all";
  status: string;
  category: { name: string };
}

// Tambahkan Interface Testimonial
interface Testimonial {
  id: number;
  name: string;
  social_media: string;
  city_age: string;
  message: string;
  image: string;
  target: string;
  status: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// URL dasar untuk gambar dari Laravel storage (sesuaikan jika berbeda)
const STORAGE_URL = "https://cms.ternaksyams.co.id/storage";

const Afiliator = () => {
  const [benefits, setBenefits] = useState<benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [loadingFaq, setLoadingFaq] = useState(true);

  // State baru untuk Testimonial
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTesti, setLoadingTesti] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBenefit, resFaq, resTesti] = await Promise.all([
          axios.get(`${API_URL}/benefit/affiliates`),
          axios.get(`${API_URL}/faqs`),
          axios.get(`${API_URL}/testimonials`), // Hit API Testimonials
        ]);

        setBenefits(resBenefit.data.data || []);

        setFaqData(
          resFaq.data.filter((item: FaqItem) => item.target === "affiliate"),
        );

        // Filter Testimonial dengan target affiliate
        setTestimonials(
          resTesti.data.filter(
            (item: Testimonial) => item.target === "affiliate" && item.status,
          ),
        );
      } catch (err) {
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
        setLoadingFaq(false);
        setLoadingTesti(false);
      }
    };
    fetchData();
  }, []);

  // --- Sub-Components ---
  const BenefitCard = ({ benefitData }: { benefitData: benefit }) => (
    <div className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className="w-16 h-16 mb-6 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
        <img
          src={benefitData.thumbnail}
          alt={benefitData.benefit}
          className="w-10 h-10 object-contain group-hover:brightness-0 group-hover:invert transition-all"
        />
      </div>
      <p className="text-gray-700 font-medium text-center leading-relaxed">
        {benefitData.benefit}
      </p>
    </div>
  );

  const TestimonialCard = ({
    text,
    name,
    handle,
    image,
  }: {
    text: string;
    name: string;
    handle: string;
    image: string;
  }) => (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 relative h-full flex flex-col">
      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100 rounded-bl-4xl flex items-center justify-center">
        <img src="/images/kutip.svg" className="w-6 h-6 invert" alt="quote" />
      </div>
      {/* Menggunakan dangerouslySetInnerHTML karena API mengirim string HTML */}
      <div
        className="text-gray-600 italic mb-8 mt-4 leading-relaxed grow"
        dangerouslySetInnerHTML={{ __html: `"${text}"` }}
      />
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-12 rounded-full ring ring-emerald-100">
            <img
              src={image.startsWith("http") ? image : `${STORAGE_URL}/${image}`}
              alt={name}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp";
              }}
            />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <span className="text-sm text-emerald-600">{handle}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAFAFA] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-neutral bg-linear-to-b from-neutral to-[#187863] text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-16 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6">
                Promosikan & Panen{" "}
                <span className="text-emerald-400">Komisi</span> Melimpah
              </h1>
              <p className="text-lg text-gray-100 mb-10 max-w-lg">
                Bergabunglah dengan ekosistem Ternak Syams. Daftar sekali,
                nikmati pendapatan pasif berkali-kali!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/daftar-afiliator"
                  className="btn btn-primary btn-lg rounded-full px-10 border-none hover:scale-105 transition-transform"
                >
                  Daftar Afiliator Sekarang
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full animate-pulse" />
              <img
                src="/images/women1.png"
                alt="Hero"
                className="relative w-full max-w-md drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 container mx-auto px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mudah & Menguntungkan
          </h2>
          <p className="text-gray-500">
            Nikmati berbagai fasilitas eksklusif yang kami sediakan untuk
            mendukung kesuksesan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center py-20">
              <span className="loading loading-ring loading-lg text-emerald-500"></span>
            </div>
          ) : (
            benefits.map((item) => (
              <BenefitCard key={item.id} benefitData={item} />
            ))
          )}
        </div>
      </section>

      {/* Tutorial Section */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 bg-emerald-500/5 rounded-[2.5rem] scale-95 group-hover:scale-100 transition-all" />
              <img
                src="/images/afiliate-capture.png"
                alt="Tutorial"
                className="relative rounded-4xl shadow-2xl border border-gray-100"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-5xl font-extrabold mb-8 leading-tight">
                Bagaimana Cara <br /> Promosinya?
              </h2>
              <ul className="space-y-6 mb-10">
                {[
                  "Share link affiliate ke rekan & sosmed",
                  "Buat konten kreatif Keranjang Kuning",
                  "Live streaming kapanpun Anda mau",
                ].map((step, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-lg text-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
              <Link
                href="/arsip"
                className="inline-flex items-center gap-2 text-emerald-600 font-bold text-xl hover:gap-4 transition-all"
              >
                Pelajari Tutorial Lengkap <ChevronRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#F2F4F7]">
        <div className="container mx-auto px-6 lg:px-16">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
            Kisah Sukses Affiliate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingTesti ? (
              <div className="col-span-full flex justify-center">
                <span className="loading loading-dots loading-lg text-emerald-500"></span>
              </div>
            ) : (
              testimonials.map((testi) => (
                <TestimonialCard
                  key={testi.id}
                  text={testi.message}
                  name={testi.name}
                  handle={testi.social_media}
                  image={testi.image}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-6 lg:px-16">
        <div className="bg-linear-to-r from-emerald-800 to-emerald-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Mulailah Perjalanan Cuanmu
          </h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
            Jangan lewatkan kesempatan menjadi bagian dari mitra sukses kami.
            Pendaftaran gratis dan pelatihan disediakan!
          </p>
          <Link
            href="/daftar-afiliator"
            className="btn btn-white btn-lg rounded-full px-12 bg-white text-emerald-600 border-none hover:bg-emerald-50 shadow-xl text-lg"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="text-emerald-500" />
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12">
            Pertanyaan Populer
          </h2>

          <div className="space-y-4">
            {loadingFaq ? (
              <div className="text-center py-10">
                <span className="loading loading-dots loading-lg text-emerald-500"></span>
              </div>
            ) : (
              faqData.map((faqItem) => (
                <div
                  key={faqItem.id}
                  className="collapse collapse-plus bg-white border border-gray-100 shadow-sm rounded-2xl"
                >
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title text-lg font-bold text-gray-800 peer-checked:text-emerald-600 transition-colors">
                    {faqItem.question}
                  </div>
                  <div className="collapse-content text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                    <div dangerouslySetInnerHTML={{ __html: faqItem.answer }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Afiliator;
