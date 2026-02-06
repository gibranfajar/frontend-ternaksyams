"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Import gambar statis
import LogoTs from "../public/images/logo_ternaksyams.png";
// Logo Halal dan BPOM sekarang akan dimuat dari API, jadi import statis di-komen/dihapus
// import LogoHalal from "../public/images/logo_halal.png";
// import LogoBpom from "../public/images/BPOM.png";
import Splash from "../public/images/milksplash.png";
import whatsappIcon from "@/public/images/wa.png";
import igIcon from "@/public/images/ig.png";
import fbIcon from "@/public/images/fb.png";
import ytIcon from "@/public/images/yt.png";
import ttIcon from "@/public/images/tt.png";

// --- DEFINISI TYPE DATA (INTERFACE) ---
// 1. Tipe untuk item link
interface LinkItem {
  id: number;
  footer_id: number;
  name: string;
  link: string;
  created_at: string;
  updated_at: string;
}

// 2. Tipe untuk objek utama Footer
interface FooterData {
  id: number;
  logo: string;
  // Properti ini menyimpan URL dari API
  logo_halal: string;
  logo_pom: string;
  whatsapp: string;
  link_instagram: string;
  link_facebook: string;
  link_youtube: string;
  link_tiktok: string;
  created_at: string;
  updated_at: string;
  informations: LinkItem[];
  etawas: LinkItem[];
}

// Nilai awal untuk state
const initialFooterData: FooterData = {
  id: 0,
  logo: "",
  // Inisialisasi properti logo dari API sebagai string kosong
  logo_halal: "",
  logo_pom: "",
  whatsapp: "0857-3232-1515", // Default WhatsApp number
  link_instagram: "#", // Default link
  link_facebook: "#",
  link_youtube: "#",
  link_tiktok: "#",
  informations: [], // HARUS diinisialisasi sebagai array kosong
  etawas: [], // HARUS diinisialisasi sebagai array kosong
  created_at: "",
  updated_at: "",
};
// ----------------------------------------

// Konstanta URL dari .env
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

export default function Footer() {
  // Tipe state didefinisikan dengan jelas
  const [footerData, setFooterData] = useState<FooterData>(initialFooterData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/footers`);

      // Ambil objek pertama, dan pastikan tipe datanya
      const apiData: FooterData[] = response.data;

      if (apiData && apiData.length > 0) {
        setFooterData(apiData[0]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data footer.");
      // Jika gagal, tetap gunakan initialFooterData yang memiliki array kosong
      setFooterData(initialFooterData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Destrukturisasi data dari state, termasuk logo_halal dan logo_pom.
  const {
    logo,
    logo_halal, // <--- Diperlukan untuk logo Halal
    logo_pom, // <--- Diperlukan untuk logo BPOM
    whatsapp,
    link_instagram,
    link_facebook,
    link_youtube,
    link_tiktok,
    informations, // TypeScript tahu ini adalah LinkItem[]
    etawas, // TypeScript tahu ini adalah LinkItem[]
  } = footerData;

  const whatsappLink = `https://wa.me/${whatsapp.replace(/[-\s]/g, "")}`;

  // Tampilkan loading/error jika diperlukan
  if (loading) {
    return (
      <div className="p-10 text-center text-white bg-neutral">
        Memuat Footer...
      </div>
    );
  }

  return (
    <>
      <footer
        className="text-white relative overflow-hidden bg-neutral bg-linear-to-b from-neutral to-[#187863]"
        // style={{
        //   background: "linear-gradient(to bottom, #19996B, #106144)",
        // }}
      >
        {/* Latar Belakang Milk Splash */}
        <div
          className="absolute right-0 -bottom-8 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(${Splash.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "right bottom",
            maxWidth: "700px",
            opacity: 0.9,
          }}
        />

        <div className="relative z-10 grid grid-cols-12 w-full gap-4 px-10 md:px-20 pt-10 pb-5">
          {/* Kolom 1: Logo dan Informasi Umum */}
          <aside className="flex flex-col col-span-12 md:col-span-4 gap-5">
            <img
              src={`${API_IMAGE_URL}/${logo}`}
              alt="TernakSyams Logo"
              width={180}
              height={30}
              className="w-40 h-auto mb-2"
            />
            <p className="max-w-xs text-sm">
              Susu kambing Etawa bernutrisi tinggi dengan rasa lezat, rendah
              gula, dan tanpa aroma prengus.
            </p>
            {/* Logo Halal & BPOM */}
            {/* Implementasi menggunakan URL dari API */}
            <div className="flex gap-4">
              {/* Logo Halal */}
              {logo_halal && ( // Pastikan URL ada sebelum ditampilkan
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
                  {/* Gunakan 'logo_halal' dari API sebagai src */}
                  <Image
                    src={`${API_IMAGE_URL}/${logo_halal}`}
                    alt="Halal Logo"
                    width={50}
                    height={50}
                    // Pastikan domain gambar ada di next.config.js jika gambar dari luar
                    unoptimized={true} // Boleh ditambahkan jika Anda mengalami masalah dengan Next Image Optimization pada domain eksternal
                    className="w-auto h-auto p-3 object-contain"
                  />
                </div>
              )}

              {/* Logo BPOM */}
              {logo_pom && ( // Pastikan URL ada sebelum ditampilkan
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
                  {/* Gunakan 'logo_pom' dari API sebagai src */}
                  <Image
                    src={`${API_IMAGE_URL}/${logo_pom}`}
                    alt="BPOM Logo"
                    width={50}
                    height={50}
                    // Pastikan domain gambar ada di next.config.js jika gambar dari luar
                    unoptimized={true} // Boleh ditambahkan jika Anda mengalami masalah dengan Next Image Optimization pada domain eksternal
                    className="w-auto h-auto p-3 object-contain"
                  />
                </div>
              )}
            </div>
            {/* Akhir Logo Halal & BPOM */}
          </aside>

          {/* Kolom 2: INFORMASI - Menggunakan .map() */}
          <nav className="flex flex-col col-span-6 md:col-span-2 gap-2 mt-5 md:mt-0">
            <h6 className="font-bold text-lg mb-2 tracking-wide">INFORMASI</h6>
            {informations.map((info) => (
              <a
                key={info.id}
                href={info.link}
                className="link link-hover text-sm"
              >
                {info.name}
              </a>
            ))}
          </nav>

          {/* Kolom 3: SUSU KAMBING - Menggunakan .map() */}
          <nav className="flex flex-col col-span-6 md:col-span-2 gap-2 mt-5 md:mt-0">
            <h6 className="font-bold text-lg mb-2 tracking-wide">
              SUSU KAMBING
            </h6>
            {etawas.map((etawa) => (
              <a
                key={etawa.id}
                href={etawa.link}
                className="link link-hover text-sm"
              >
                {etawa.name}
              </a>
            ))}
          </nav>

          {/* Kolom 4: KONSULTASI GRATIS & Media Sosial */}
          <div className="flex flex-col col-span-12 md:col-span-4 gap-4 mt-5 md:mt-0">
            {/* Box Konsultasi Gratis (WhatsApp dari API) */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary p-4 rounded-xl shadow-2xl flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0C4C35", minWidth: "300px" }}
            >
              <div className="flex items-center gap-3 w-full">
                <img
                  src={whatsappIcon.src}
                  alt="WhatsApp Icon"
                  className="w-10 h-10 md:w-12 md:h-12"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-wide text-yellow-300">
                    KONSULTASI GRATIS
                  </span>
                  <span className="text-2xl font-extrabold">{whatsapp}</span>
                </div>
              </div>
            </a>

            {/* Ikon Media Sosial (Link dari API) */}
            <div className="flex gap-3 justify-center md:justify-start">
              {/* Facebook */}
              <a
                href={link_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              >
                <img src={fbIcon.src} alt="Facebook Icon" />
              </a>
              {/* Instagram */}
              <a
                href={link_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              >
                <img src={igIcon.src} alt="Instagram Icon" />
              </a>
              {/* Youtube */}
              <a
                href={link_youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              >
                <img src={ytIcon.src} alt="YouTube Icon" />
              </a>
              {/* TikTok */}
              <a
                href={link_tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
              >
                <img src={ttIcon.src} alt="TikTok Icon" />
              </a>
            </div>
          </div>

          {/* Baris Hak Cipta */}
          <div className="col-span-12 w-full pt-5">
            <div className="border-t border-white border-opacity-30 pt-4">
              <p className="text-sm">
                TernakSyams © Copyright {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
