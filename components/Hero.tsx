import React from "react";
import Image from "next/image";
// Pastikan path ini mengarah ke gambar produk Anda yang ingin ditampilkan
import susu from "../public/images/original.png";

export default function Hero() {
  return (
    // Kontainer utama: Layout fleksibel min-h-screen, relatif untuk elemen dekoratif
    <div className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center pt-10 pb-20 lg:py-0">
      <div className="absolute top-0 right-0 w-full lg:w-2/5 h-full bg-transparent lg:bg-neutral lg:bg-linear-to-b lg:from-neutral lg:to-[#187863] rounded-bl-[150px] lg:rounded-bl-[350px] z-0"></div>

      {/* 📦 Konten Hero Utama 📦 */}
      {/* Kontainer dengan z-index di atas elemen dekoratif, menggunakan grid/flex untuk layout 2 kolom */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between min-h-[90vh] pt-20 lg:pt-0">
        {/* Bagian Kiri: Teks dan Tombol */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0 pt-0 lg:pt-10 pr-0 lg:pr-10">
          {/* Judul Utama (Etawa Goat Milk) - Warna hitam atau sangat gelap */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-2">
            Etawa Goat Milk
          </h1>
          {/* Sub Judul (Kekuatan disetiap tetes) - Warna hijau tua */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-secondary leading-snug mb-6">
            Kekuatan disetiap tetes
          </h2>
          {/* Deskripsi */}
          <p className="py-6 text-base lg:text-lg max-w-xl lg:max-w-none mx-auto lg:mx-0 text-gray-600">
            Susu kambing Etawa bernutrisi tinggi dengan rasa lezat, rendah gula,
            dan tanpa aroma prengus. Baik untuk membantu pemulihan asma dan
            radang sendi serta aman dan disukai anak-anak!
          </p>
          {/* Tombol Selengkapnya */}
          <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 my-8 font-bold text-base rounded-full">
            Selengkapnya
          </button>
        </div>

        <div className="w-full max-w-sm lg:w-2/5 flex justify-center lg:justify-start mt-10 lg:mt-0 relative">
          {/* Container untuk gambar dengan efek shadow, miring, dan posisi lebih ke tengah/kanan */}
          <div className="relative w-full max-w-xs lg:max-w-md">
            {/* Gambar produk */}
            <Image
              src={susu}
              alt="SyamsFarm Etawa Goat Milk Powder"
              width={500}
              height={500}
              priority
              // Efek: sedikit miring (rotate-2) dan bayangan yang subtle (shadow-2xl)
              className="w-full object-contain transform -rotate-2 transition-transform duration-500 hover:rotate-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
