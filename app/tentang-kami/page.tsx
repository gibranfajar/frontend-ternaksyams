"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
// Pastikan Anda sudah menginstal 'lucide-react' (npm install lucide-react)
import { CircleCheckBig, Calendar } from "lucide-react";
import Image from "next/image"; // Import Image dari next/image untuk gambar statis
import LogoHalal from "@/public/images/logo_halal.png";
import LogoBpom from "@/public/images/BPOM.png";

// --- 1. INTERFACE/STRUKTUR DATA API (Untuk menerima data mentah) ---

interface ApiWhyUsFeature {
  id: number;
  about_id: number;
  text: string;
  created_at: string;
  updated_at: string;
}

interface ApiPartnerSection {
  id: number;
  about_id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface ApiProfileSection {
  id: number;
  about_id: number;
  founding_year: number;
  mission: string;
  image_embed_url: string;
  created_at: string;
  updated_at: string;
}

interface ApiAboutUsData {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  tagline: string;
  why_us_title: string;
  achievement_count: string;
  achievement_label: string;
  created_at: string;
  updated_at: string;
  partner_section: ApiPartnerSection;
  why_us_features: ApiWhyUsFeature[];
  profile_section: ApiProfileSection;
}

// --- 2. INTERFACE/STRUKTUR DATA KOMPONEN (camelCase) ---

interface Feature {
  id: number;
  text: string;
}

interface Partner {
  id: number;
  title: string;
  description: string;
  imageUrl: string; // dari image_url
}

interface Profile {
  foundingYear: number; // dari founding_year
  mission: string;
  imageEmbedUrl: string; // dari image_embed_url
}

interface AboutUsData {
  heroTitle: string; // dari hero_title
  heroSubtitle: string; // dari hero_subtitle
  heroImage: string; // dari hero_image
  tagline: string;
  partnerSection: Partner; // dari partner_section
  whyUsTitle: string; // dari why_us_title
  whyUsFeatures: Feature[]; // dari why_us_features
  achievementCount: string; // dari achievement_count
  achievementLabel: string; // dari achievement_label
  profileSection: Profile; // dari profile_section
}

// Data awal (null) sebelum diisi dari API
const initialAboutUsData: AboutUsData = {
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  tagline: "",
  partnerSection: { id: 0, title: "", description: "", imageUrl: "" },
  whyUsTitle: "",
  whyUsFeatures: [],
  achievementCount: "",
  achievementLabel: "",
  profileSection: { foundingYear: 0, mission: "", imageEmbedUrl: "" },
};

// Konstanta URL dari .env
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

// --- 3. KOMPONEN BANTUAN KECIL ---

// Komponen untuk fitur "Kenapa Ternak Syams?"
const WhyUsFeature: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start space-x-3">
    <CircleCheckBig className="shrink-0 text-green-600 mt-1 w-5 h-5" />
    <span className="text-gray-700">{text}</span>
  </li>
);

// Komponen untuk Achivement (Pelanggan Puas)
const AchievementCard: React.FC<{ count: string; label: string }> = ({
  count,
  label,
}) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white border border-green-200 rounded-xl shadow-lg w-full max-w-sm">
    <p className="text-5xl font-extrabold text-green-700">{count}</p>
    <p className="text-xl font-medium text-gray-600 mt-2">{label}</p>
    <div className="flex mt-4 space-x-4">
      {/* Menggunakan next/image untuk logo statis */}
      <Image src={LogoHalal} alt="Halal Logo" className="h-14 w-auto" />
      <Image src={LogoBpom} alt="BPOM Logo" className="h-14 w-auto" />
    </div>
  </div>
);

// --- 4. KOMPONEN UTAMA HALAMAN ---

const AboutUsPage: React.FC = () => {
  const [data, setData] = useState<AboutUsData>(initialAboutUsData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = `${API_URL}/abouts`;

        if (!API_URL) {
          throw new Error("NEXT_PUBLIC_API_URL is not defined in .env");
        }

        const response = await axios.get<ApiAboutUsData>(endpoint);
        const apiData = response.data;

        // --- Pemetaan Data dari API (snake_case) ke Komponen (camelCase) ---
        const mappedData: AboutUsData = {
          heroTitle: apiData.hero_title,
          heroSubtitle: apiData.hero_subtitle,
          heroImage: `${API_IMAGE_URL}${apiData.hero_image}`, // Gabungkan URL gambar
          tagline: apiData.tagline,
          whyUsTitle: apiData.why_us_title,
          achievementCount: apiData.achievement_count,
          achievementLabel: apiData.achievement_label,

          partnerSection: {
            id: apiData.partner_section.id,
            title: apiData.partner_section.title,
            description: apiData.partner_section.description,
            imageUrl: `${API_IMAGE_URL}${apiData.partner_section.image_url}`, // Gabungkan URL gambar
          },

          whyUsFeatures: apiData.why_us_features.map((feature) => ({
            id: feature.id,
            text: feature.text,
          })),

          profileSection: {
            foundingYear: apiData.profile_section.founding_year,
            mission: apiData.profile_section.mission,
            imageEmbedUrl: apiData.profile_section.image_embed_url,
          },
        };
        // --- Akhir Pemetaan Data ---

        setData(mappedData);
        setError(null);
      } catch (err) {
        console.error("Gagal mengambil data About Us:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tampilan Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-green-700">Memuat data...</p>
      </div>
    );
  }

  // Tampilan Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-xl font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  // Jika data sudah berhasil dimuat (data !== initialAboutUsData dan !loading)
  // Perhatikan penggunaan 'data' di JSX sudah menyesuaikan dengan 'AboutUsData' (camelCase)
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Bagian Hero */}
      <header className="bg-green-800 text-white pt-20 pb-24 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2">
            <h1 className="text-5xl lg:text-6xl font-black mb-4 tracking-tight">
              {data.heroTitle}
            </h1>
            <p className="text-xl lg:text-2xl font-light mb-6">
              {data.tagline}
            </p>
          </div>
          <div className="lg:w-2/5 mt-10 lg:mt-0 flex justify-center">
            {/* Menggunakan data.heroImage dari API */}
            <img
              src={data.heroImage}
              alt="Tumpukan Produk Susu Etawa Ternak Syams"
              className="w-full max-w-xs lg:max-w-sm rounded-xl transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </header>

      {/* Tagline sebagai 'Key Strength' */}
      <section className="bg-green-100 py-10 shadow-inner">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-green-700">
            {data.heroSubtitle}
          </h2>
        </div>
      </section>

      {/* 2. Kerjasama Peternak Lokal */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h3 className="text-4xl font-bold text-gray-800 mb-6 border-l-4 border-green-600 pl-4">
              {data.partnerSection.title}
            </h3>
            <p className="text-gray-600 text-xl leading-relaxed">
              {data.partnerSection.description}
            </p>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2 rounded-xl overflow-hidden shadow-2xl transform transition duration-500 hover:shadow-green-400/50">
            {/* Menggunakan data.partnerSection.imageUrl dari API */}
            <img
              src={data.partnerSection.imageUrl}
              alt="Peternak lokal sedang bersama kambing Etawa"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. Kenapa Ternak Syams? & Pencapaian */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Kenapa Kami? */}
          <div className="p-6 bg-white rounded-xl shadow-xl">
            <h3 className="text-3xl font-bold text-green-800 mb-8">
              {data.whyUsTitle}
            </h3>
            <ul className="space-y-5">
              {/* Mapping Why Us Features dari API */}
              {data.whyUsFeatures.map((feature) => (
                <WhyUsFeature key={feature.id} text={feature.text} />
              ))}
            </ul>
          </div>

          {/* Pencapaian */}
          <div className="flex justify-center">
            <AchievementCard
              count={data.achievementCount}
              label={data.achievementLabel}
            />
          </div>
        </div>
      </section>

      {/* 4. Profile Ternak Syams */}
      <section className="py-20 bg-green-700 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <h3 className="text-4xl font-extrabold mb-12 text-center">
            Profile Ternak Syams
          </h3>

          <div className="flex flex-col lg:flex-row items-start gap-16">
            <div className="lg:w-1/2">
              <p className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="inline mr-3 text-green-300 w-5 h-5" />
                Didirikan pada tahun {data.profileSection.foundingYear}
              </p>
              <p className="text-xl leading-relaxed mb-8">
                {data.profileSection.mission}
              </p>
              <a
                href="#mission"
                className="inline-block bg-white text-green-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-100 transition duration-300 transform hover:scale-105"
              >
                Pelajari Misi Kami
              </a>
            </div>
            {/* Embed Video/Media */}
            <div className="lg:w-1/2 w-full mt-8 lg:mt-0 rounded-xl overflow-hidden shadow-2xl">
              <div className="relative pt-[56.25%]">
                {/* Menggunakan data.profileSection.imageEmbedUrl dari API */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={data.profileSection.imageEmbedUrl}
                  title="Ternak Syams Profile Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 bg-primary text-white text-center font-medium">
                Ternak Syams Profile
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
