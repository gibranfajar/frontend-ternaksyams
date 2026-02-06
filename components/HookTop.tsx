import React from "react";

// Catatan: Asumsikan Anda menggunakan Tailwind CSS (berdasarkan class seperti hero, btn, dll.)

// Komponen placeholder untuk meniru tampilan kotak video di gambar
const VideoPlayerPlaceholder = () => (
  <div className="">
    {/* Rasio 16:9 untuk video */}
    <iframe
      className="w-full h-full"
      src="https://www.youtube.com/embed/UYXMgqSJZww?si=NYa-mN8s9bIhEA7W"
      title="Ternak Syams Profile Video"
      style={{
        height: "300px", // Sesuaikan tinggi sesuai kebutuhan
        aspectRatio: "16 / 9", // Rasio aspek video standar
        maxWidth: "550px", // Batasi lebar maksimum agar terlihat di tengah
        margin: "24px auto",
      }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
    <div className="relative w-full max-w-lg mx-auto bg-gray-300 flex items-center justify-center"></div>
  </div>
);

export default function HookTop() {
  return (
    // Menggunakan warna latar belakang yang sangat terang/krem
    <div
      className="hero bg-linear-to-b from-[#ffffff] to-[#f5f4ed]"
      style={{ padding: "6rem 0" }}
    >
      <div className="hero-content text-center py-0">
        <div className="max-w-4xl px-4">
          {/* Judul Utama */}
          <h2
            className="text-4xl font-extrabold mb-4 leading-snug"
            style={{ color: "#254434" }} // Warna hijau gelap yang mirip
          >
            Solusi Masalah Kesehatan Untuk Semua Dari Kami, Untuk Kamu dan Semua
            Orang
          </h2>

          {/* Subteks Kecil */}
          <p className="text-sm text-gray-700 mb-2">
            72% Pembeli merasakan perubahan dalam tubuh mereka setelah
          </p>
          <p className="text-sm font-semibold text-gray-700 mb-8">
            14 Hari konsumsi rutin
          </p>

          {/* Video Placeholder */}
          <VideoPlayerPlaceholder />

          {/* Tombol */}
          <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 font-bold text-base rounded-full">
            Cari solusi bersama kami
          </button>

          {/* Teks Kecil di Bawah Tombol */}
          <p className="text-xs text-gray-600 mt-4">
            Telah teruji sebagai minuman aman dan halal
          </p>
        </div>
      </div>
    </div>
  );
}
