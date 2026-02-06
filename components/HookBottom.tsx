import React from "react";
import ustd from "../public/images/ustd_attaki.png";
import milksplash from "../public/images/milksplash-curve.png";

export default function HookTop() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1731770207534-4411fd273c9e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <div className="text-center relative w-full px-4 md:px-0">
        {/* Kontainer Flex untuk Mobile, Grid untuk Desktop */}
        <div className="flex flex-col md:grid md:grid-cols-2 items-center gap-6 md:gap-0">
          {/* Card Kiri: Card Manfaat Kesehatan (Posisi Atas di Mobile) */}
          <div
            className="
              relative z-10 isolate overflow-hidden bg-neutral bg-linear-to-b from-neutral to-[#187863] 
              max-w-full md:max-w-[500px] w-full p-6 sm:p-8 md:p-10 
              rounded-xl md:rounded-tr-3xl md:rounded-bl-3xl
              md:absolute md:left-1/6
            "
            aria-label="Card manfaat kesehatan"
          >
            {/* Konten */}
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold leading-snug">
              Solusi Masalah Kesehatan <br className="hidden sm:block" />
              untuk semua orang
            </h2>

            <p className="text-white/95 mt-4 text-[13px] sm:text-sm md:text-base leading-relaxed">
              72% Pembeli merasakan perubahan <br className="hidden sm:block" />
              dalam tubuh mereka setelah 14 Hari{" "}
              <br className="hidden sm:block" />
              konsumsi rutin
            </p>

            <button
              type="button"
              className="
              mt-8 inline-flex items-center justify-center rounded-full border border-white/90 px-6 py-3 text-white font-semibold hover:bg-white/10 transition
              "
            >
              <span>Lihat Manfaat</span>
              <svg
                viewBox="0 0 24 24"
                className="size-4 md:size-5 ml-2" /* Tambahkan ml-2 untuk jarak */
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </button>

            {/* Gradasi halus */}
            <div className="pointer-events-none absolute inset-0 opacity-20 text-[#1E8A6E]" />

            {/* Splash susu */}
            <img
              src={milksplash.src}
              alt="milksplash"
              className="absolute -z-10 -bottom-32 rotate-6 -right-12 w-full max-w-xs"
            />
          </div>

          {/* Card Kanan: image + quote + badge (Posisi Bawah di Mobile) */}
          <div
            className="
              relative overflow-hidden 
              w-full md:max-w-1/2 
              h-[400px] sm:h-[460px] md:h-[600px] 
              rounded-xl md:rounded-tl-3xl md:rounded-bl-3xl shadow-lg
              md:absolute md:right-0
            "
          >
            {/* Gambar utama */}
            <img
              src={ustd.src}
              alt="Testimoni minum produk"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay lembut supaya teks terbaca di kanan-atas */}
            <div className="absolute inset-0 bg-linear-to-b via-transparent to-white/0" />

            {/* Kutipan di pojok kanan-atas */}
            <p className="absolute top-4 right-4 max-w-[70%] text-right text-white sm:text-primary text-xs sm:text-sm md:text-base leading-snug font-semibold drop-shadow-md">
              {/* Ubah warna teks menjadi putih untuk mobile agar lebih terbaca di atas gambar */}
              “Sejak kecil mengidap asma, dan selalu kambuh, tapi kini sembuh
              berkat Ternak Syams.”
            </p>

            {/* Badge nama di kanan-bawah */}
            <div className="absolute bottom-4 right-4 bg-neutral  text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full shadow-md">
              Ust Hanan Attaki
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
