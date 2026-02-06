"use client";

import React, { useEffect, useState } from "react";

// --- Types ---
interface HardsellingItem {
  id: number;
  content_image: string;
  button_image: string;
  button_link: string;
  position: "top" | "bottom";
  sort: number;
}

interface HardsellingCta {
  header: string;
  background: string;
  whatsapp: string;
  link_whatsapp: string;
  shopee: string;
  link_shopee: string;
  tiktok: string;
  link_tiktok: string;
  tokopedia: string;
  link_tokopedia: string;
  seller: string;
  link_seller: string;
}

interface HardsellingFooter {
  footer_text: string;
  background_color: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  facebook: string;
}

interface ApiResponse {
  data: {
    hardsellings: HardsellingItem[];
    hardsellingCta: HardsellingCta;
    hardsellingFooter: HardsellingFooter;
  };
}

const MobileLandingPage = () => {
  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/hardsellings`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching hardselling data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Filter & Sort Data
  const topContent = data.hardsellings
    .filter((item) => item.position === "top")
    .sort((a, b) => a.sort - b.sort);

  const bottomContent = data.hardsellings
    .filter((item) => item.position === "bottom")
    .sort((a, b) => a.sort - b.sort);

  const getFullImageUrl = (path: string) => `${IMAGE_BASE_URL}${path}`;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* 1. TOP CONTENT SECTION */}
      {topContent.map((item) => (
        <section key={item.id} className="w-full">
          <div className="relative w-full">
            <img
              src={getFullImageUrl(item.content_image)}
              alt="Content Top"
              className="w-full h-auto block"
            />
          </div>
          <a href={item.button_link} className="block w-full">
            <img
              src={getFullImageUrl(item.button_image)}
              alt="Button"
              className="w-full h-auto block"
            />
          </a>
        </section>
      ))}

      {/* 2. CTA SECTION (GREEN AREA) */}
      <section
        className="py-6 px-4 flex flex-col items-center"
        style={{ backgroundColor: data.hardsellingCta.background || "#008040" }}
      >
        <img
          src={getFullImageUrl(data.hardsellingCta.header)}
          alt="Beli Di Sini"
          className="w-48 mb-6 h-auto"
        />

        {/* Marketplace Grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-3">
          <a
            href={data.hardsellingCta.link_whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={getFullImageUrl(data.hardsellingCta.whatsapp)}
              alt="WA"
              className="w-full h-auto"
            />
          </a>
          <a
            href={data.hardsellingCta.link_shopee}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={getFullImageUrl(data.hardsellingCta.shopee)}
              alt="Shopee"
              className="w-full h-auto"
            />
          </a>
          <a
            href={data.hardsellingCta.link_tiktok}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={getFullImageUrl(data.hardsellingCta.tiktok)}
              alt="TikTok"
              className="w-full h-auto"
            />
          </a>
          <a
            href={data.hardsellingCta.link_tokopedia}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={getFullImageUrl(data.hardsellingCta.tokopedia)}
              alt="Tokopedia"
              className="w-full h-auto"
            />
          </a>
        </div>

        {/* Full Width Seller Button */}
        <div className="w-full max-w-sm">
          <a
            href={data.hardsellingCta.link_seller}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={getFullImageUrl(data.hardsellingCta.seller)}
              alt="Mitra Seller"
              className="w-full h-auto"
            />
          </a>
        </div>
      </section>

      {/* 3. BOTTOM CONTENT SECTION */}
      {bottomContent.map((item) => (
        <section key={item.id} className="w-full">
          <div className="relative w-full">
            <img
              src={getFullImageUrl(item.content_image)}
              alt="Content Bottom"
              className="w-full h-auto block"
            />
          </div>
          <a href={item.button_link} className="block w-full">
            <img
              src={getFullImageUrl(item.button_image)}
              alt="Button"
              className="w-full h-auto block"
            />
          </a>
        </section>
      ))}

      {/* 4. FOOTER */}
      <footer
        className="py-8 px-4 text-center text-white"
        style={{
          backgroundColor: data.hardsellingFooter.background_color || "#008040",
        }}
      >
        {/* Social Media Icons (Static icons with API links) */}
        <div className="flex justify-center gap-4 mb-4">
          <a
            href={data.hardsellingFooter.youtube}
            className="w-8 h-8 flex items-center justify-center border border-white rounded-full"
          >
            <span className="text-[10px]">YT</span>
          </a>
          <a
            href={data.hardsellingFooter.instagram}
            className="w-8 h-8 flex items-center justify-center border border-white rounded-full"
          >
            <span className="text-[10px]">IG</span>
          </a>
          <a
            href={data.hardsellingFooter.tiktok}
            className="w-8 h-8 flex items-center justify-center border border-white rounded-full"
          >
            <span className="text-[10px]">TK</span>
          </a>
          <a
            href={data.hardsellingFooter.facebook}
            className="w-8 h-8 flex items-center justify-center border border-white rounded-full"
          >
            <span className="text-[10px]">FB</span>
          </a>
        </div>

        <p className="text-xs opacity-90">FAQ</p>
        <p className="text-[10px] mt-2 opacity-80 uppercase tracking-wider">
          {data.hardsellingFooter.footer_text}
        </p>
      </footer>
    </div>
  );
};

export default MobileLandingPage;
