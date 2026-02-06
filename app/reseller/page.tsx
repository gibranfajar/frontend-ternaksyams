"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import susu from "@/public/images/group_milk.png";
import Link from "next/link";
import axios from "axios";
import {
  MessageCircle,
  Search,
  MapPin,
  Phone,
  Globe,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  X,
} from "lucide-react";

// --- Interfaces ---
interface Benefit {
  id: number;
  type: string;
  thumbnail: string;
  benefit: string;
  status: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  target: "user" | "reseller" | "affiliate" | "all";
  status: string;
}

interface TestimonialItem {
  id: number;
  name: string;
  social_media: string;
  city_age: string;
  message: string;
  image: string;
  target: string;
  status: boolean;
}

interface PriceListItem {
  id: number;
  path: string;
  active: boolean;
}

// Interface untuk data yang sudah ditransformasi
interface ResellerLocation {
  id: number;
  name: string;
  address: string;
  phone: string;
  whatsappUrl: string;
}

interface District {
  name: string;
  resellers: ResellerLocation[];
}

interface City {
  name: string;
  districts: District[];
}

interface Province {
  name: string;
  cities: City[];
}

const Reseller = () => {
  // --- States ---
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [pricelists, setPricelists] = useState<PriceListItem[]>([]);
  const [resellers, setResellers] = useState<Province[]>([]);

  const [loadingFaq, setLoadingFaq] = useState(true);
  const [loadingTesti, setLoadingTesti] = useState(true);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [loadingReseller, setLoadingReseller] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk Accordion Reseller
  const [openProvince, setOpenProvince] = useState<string | null>(null);
  const [openCity, setOpenCity] = useState<string | null>(null);
  const [openDistrict, setOpenDistrict] = useState<string | null>(null);

  // --- API Constants ---
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

  // --- Logic: Transform API Data to Nested Structure ---
  const transformResellerData = (data: any[]): Province[] => {
    const provinces: Province[] = [];

    data.forEach((item) => {
      // 1. Find or Create Province
      let prov = provinces.find((p) => p.name === item.province_name);
      if (!prov) {
        prov = { name: item.province_name, cities: [] };
        provinces.push(prov);
      }

      // 2. Find or Create City
      let city = prov.cities.find((c) => c.name === item.city_name);
      if (!city) {
        city = { name: item.city_name, districts: [] };
        prov.cities.push(city);
      }

      // 3. Find or Create District
      let dist = city.districts.find((d) => d.name === item.district_name);
      if (!dist) {
        dist = { name: item.district_name, resellers: [] };
        city.districts.push(dist);
      }

      // 4. Add Reseller
      dist.resellers.push({
        id: item.id,
        name: item.name,
        address: item.address,
        phone: item.whatsapp,
        whatsappUrl: `https://wa.me/${item.whatsapp.replace(/^0/, "62")}`,
      });
    });

    return provinces;
  };

  // --- Fetching Data ---
  useEffect(() => {
    const fetchData = async () => {
      if (!API_URL) return;

      // 1. Fetch Benefits
      try {
        const res = await axios.get(`${API_URL}/benefit/resellers`);
        setBenefits(res.data.data || []);
      } catch (e) {
        console.error(e);
      }

      // 2. Fetch FAQ
      try {
        const res = await axios.get(`${API_URL}/faqs`);
        const filtered = (res.data || []).filter(
          (item: FAQItem) =>
            item.target === "reseller" && item.status === "show"
        );
        setFaqs(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingFaq(false);
      }

      // 3. Fetch Testimonials
      try {
        const res = await axios.get(`${API_URL}/testimonials`);
        const filtered = (res.data || []).filter(
          (item: TestimonialItem) => item.target === "reseller" && item.status
        );
        setTestimonials(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingTesti(false);
      }

      // 4. Fetch Price List
      try {
        const res = await axios.get(`${API_URL}/pricelist-resellers`);
        const active = (res.data.data || []).filter(
          (i: PriceListItem) => i.active
        );
        setPricelists(active);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPrice(false);
      }

      // 5. Fetch Resellers (IMPLEMENTASI UTAMA)
      try {
        const res = await axios.get(`${API_URL}/resellers`);
        if (res.data && res.data.data) {
          setResellers(transformResellerData(res.data.data));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingReseller(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // --- Filtering Reseller ---
  const filteredResellers = resellers.filter((prov) => {
    const query = searchQuery.toLowerCase();
    const hasMatchProv = prov.name.toLowerCase().includes(query);
    const hasMatchCity = prov.cities.some((c) =>
      c.name.toLowerCase().includes(query)
    );
    return hasMatchProv || hasMatchCity;
  });

  return (
    <div className="container mx-auto px-3 md:px-5 lg:px-10">
      {/* 1. SECTION HERO */}
      <section className="relative mb-20">
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <div className="hero min-h-screen bg-neutral bg-linear-to-b from-neutral to-[#187863] overflow-hidden">
            <div className="hero-content flex-col lg:flex-row-reverse z-10 max-w-6xl mx-auto">
              <Image
                src={susu}
                alt="Produk Etawa"
                width={500}
                height={500}
                className="my-10 p-3"
              />
              <div className="text-white lg:mr-10">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6">
                  Siap jadi reseller & punya penghasilan sendiri?
                </h1>
                <p className="py-6 text-green-100 text-lg">
                  Daftar sekali, cuan berkali-kali!
                </p>
                <Link href="/daftar-reseller">
                  <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 my-8 font-bold text-base rounded-full">
                    Daftar Reseller
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION BENEFITS */}
      <section className="my-20">
        <h3 className="text-3xl md:text-4xl font-extrabold text-center mt-2 mb-10 text-emerald-900">
          Keuntungan Reseller Kami
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {benefits.map((item) => (
            <div
              key={item.id}
              className="card w-auto bg-base-100 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="card-body items-center text-center p-4">
                <Image
                  src={item.thumbnail}
                  alt={item.benefit}
                  width={64}
                  height={64}
                  className="mb-3 w-16 h-16 object-contain"
                  unoptimized
                />
                <span className="text-sm font-medium text-gray-700">
                  {item.benefit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION PRICE LIST */}
      <section className="my-20">
        <h3 className="text-3xl md:text-4xl font-extrabold text-center mt-2 mb-10 text-emerald-900">
          Price List
        </h3>
        {loadingPrice ? (
          <div className="text-center py-10">Memuat Price List...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricelists.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={`${IMAGE_BASE_URL}${item.path}`}
                  alt={`Pricelist ${item.id}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- NEW SECTION: DAFTAR AGEN TERDEKAT (IMPLEMENTASI API) --- */}
      <section className="my-24 max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-900 flex items-center justify-center gap-2 italic">
            <span className="text-emerald-500">✦</span> Pilih Agen Terdekat di
            Kotamu
          </h3>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 group">
          <input
            type="text"
            placeholder="Ketik Nama Provinsi atau Kota..."
            className="w-full p-4 pr-32 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-2 top-2 bottom-2 bg-emerald-800 text-white px-6 rounded-lg flex items-center gap-2 font-bold text-sm">
            Cari <Search size={16} />
          </button>
        </div>

        {/* Nested Accordion from API */}
        <div className="space-y-4">
          {loadingReseller ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner text-emerald-600"></span>
            </div>
          ) : filteredResellers.length > 0 ? (
            filteredResellers.map((prov) => (
              <div
                key={prov.name}
                className="rounded-xl border border-gray-200 overflow-hidden shadow-xs"
              >
                {/* Level 1: Provinsi */}
                <button
                  onClick={() =>
                    setOpenProvince(
                      openProvince === prov.name ? null : prov.name
                    )
                  }
                  className={`w-full flex items-center justify-between p-5 font-bold transition-all ${
                    openProvince === prov.name
                      ? "bg-emerald-900 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {prov.name}
                  {openProvince === prov.name ? (
                    <X size={20} />
                  ) : (
                    <span className="text-xl">+</span>
                  )}
                </button>

                {openProvince === prov.name && (
                  <div className="p-4 bg-gray-50 space-y-4">
                    {prov.cities.map((city) => (
                      <div key={city.name} className="space-y-2">
                        {/* Level 2: Kota */}
                        <button
                          onClick={() =>
                            setOpenCity(
                              openCity === city.name ? null : city.name
                            )
                          }
                          className={`w-full flex items-center justify-between p-4 rounded-xl font-bold transition-all ${
                            openCity === city.name
                              ? "bg-emerald-700 text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          {city.name}
                          {openCity === city.name ? (
                            <X size={18} />
                          ) : (
                            <span className="rotate-45 block">
                              <X size={18} />
                            </span>
                          )}
                        </button>

                        {openCity === city.name && (
                          <div className="pl-4 space-y-2 mt-2">
                            {city.districts.map((dist) => (
                              <div key={dist.name}>
                                {/* Level 3: Kecamatan */}
                                <button
                                  onClick={() =>
                                    setOpenDistrict(
                                      openDistrict === dist.name
                                        ? null
                                        : dist.name
                                    )
                                  }
                                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold transition-all ${
                                    openDistrict === dist.name
                                      ? "bg-emerald-500 text-white"
                                      : "bg-white border border-gray-200"
                                  }`}
                                >
                                  {dist.name}
                                  {openDistrict === dist.name ? (
                                    <X size={16} />
                                  ) : (
                                    <span className="rotate-45 block">
                                      <X size={16} />
                                    </span>
                                  )}
                                </button>

                                {openDistrict === dist.name && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {dist.resellers.map((res) => (
                                      <div
                                        key={res.id}
                                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                                      >
                                        <div className="flex items-center gap-2 mb-4">
                                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center font-black text-emerald-800 text-xl">
                                            {res.name.charAt(0)}
                                          </div>
                                          <h4 className="font-extrabold text-gray-900 flex items-center gap-1 italic">
                                            {res.name}{" "}
                                            <CheckCircle2
                                              size={14}
                                              className="text-blue-500 fill-blue-500"
                                            />
                                          </h4>
                                        </div>
                                        <div className="space-y-3 text-sm text-gray-500 mb-6">
                                          <div className="flex gap-2">
                                            <MapPin
                                              size={16}
                                              className="text-emerald-600 shrink-0"
                                            />
                                            <p>{res.address}</p>
                                          </div>
                                          <div className="flex gap-2">
                                            <Phone
                                              size={16}
                                              className="text-emerald-600 shrink-0"
                                            />
                                            <p>{res.phone}</p>
                                          </div>
                                        </div>
                                        <a
                                          href={res.whatsappUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full flex items-center justify-center gap-2 font-bold text-sm transition-all"
                                        >
                                          <MessageCircle size={18} /> Hubungi
                                          via WhatsApp
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-10">
              Data reseller tidak ditemukan.
            </p>
          )}
        </div>
      </section>

      {/* 4. SECTION TESTIMONIALS */}
      <section className="my-20 py-24 bg-[#F2F4F7] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-semibold tracking-widest uppercase text-sm">
              Testimonials
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold mt-2 text-emerald-900">
              Apa Kata Reseller Kami?
            </h3>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {loadingTesti ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-emerald-700"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((testi) => (
                <div
                  key={testi.id}
                  className="group bg-white p-6 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-200/60 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Dekorasi Kutip Modern */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10">
                    {/* Isi Pesan */}
                    <div className="text-gray-600 leading-relaxed text-base italic mb-4 min-h-20 grid place-items-center">
                      <div
                        dangerouslySetInnerHTML={{ __html: testi.message }}
                        className="[&>p]:mb-4"
                      />
                    </div>
                  </div>

                  {/* Identitas User */}
                  <div className="flex items-center gap-4 pt-4 border-stone-100">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-emerald-50 transition-all duration-300 group-hover:ring-emerald-100">
                        <img
                          src={`${IMAGE_BASE_URL}${testi.image}`}
                          alt={testi.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors">
                        {testi.name}
                      </span>
                      <span className="text-xs font-medium text-emerald-600">
                        {testi.social_media}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5 tracking-wider uppercase font-semibold">
                        {testi.city_age}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. SECTION CTA BANNER */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto bg-linear-to-r from-emerald-800 to-emerald-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/30">
          <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
            <Image src={susu} alt="decor" width={400} height={400} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tunggu Apa Lagi?
              </h2>
              <p className="text-emerald-100 text-lg">
                Wujudkan kebebasan finansial Anda bersama kami sekarang.
              </p>
            </div>
            <Link href="/daftar-reseller">
              <button className="btn btn-lg bg-white hover:bg-slate-100 text-emerald-800 border-none px-12 rounded-full font-bold">
                Gabung Sekarang
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. SYARAT & KETENTUAN */}
      <section className="mb-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-8 shadow-sm">
            <div className="flex justify-center mb-6">
              <h2 className="bg-emerald-800 px-6 py-2 rounded-full text-white font-semibold">
                Syarat & Ketentuan
              </h2>
            </div>
            <ol className="list-decimal space-y-2 pl-6 text-gray-600">
              <li>Minimal pembelian 10kg setiap varian.</li>
              <li>Pembelian tidak dapat di mix.</li>
              <li>Harus mengikuti minimal pembelian untuk harga reseller.</li>
              <li>Dilarang menjual di bawah harga pusat.</li>
              <li>Harga belum termasuk ongkos kirim.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="my-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="text-emerald-500" />
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12">
            Pertanyaan Populer
          </h2>
          <div className="space-y-3">
            {loadingFaq ? (
              <div className="text-center p-5">Memuat FAQ...</div>
            ) : (
              faqs.map((item) => (
                <div
                  key={item.id}
                  className="collapse collapse-arrow bg-gray-200 rounded-xl shadow-sm"
                >
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title font-medium">
                    {item.question}
                  </div>
                  <div className="collapse-content text-sm text-gray-600">
                    <p dangerouslySetInnerHTML={{ __html: item.answer }} />
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

export default Reseller;
