// NotFound.tsx (atau file 404.js/not-found.js Anda)

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
// Pastikan path import ini benar, tergantung konfigurasi Next.js Anda
import goat from "@/public/images/ilustration/sheep-sad.png";

const NotFound = () => {
  return (
    // Mengubah tata letak menjadi flex-col untuk susunan vertikal,
    // dan menambahkan 'text-center' untuk meratakan teks.
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center bg-white">
      {/* 404 Status Code yang Menonjol */}
      <div className="">
        <p className="text-7xl font-extrabold text-green-600 mb-4 opacity-70">
          404
        </p>

        {/* Judul */}
        <h1 className="text-xl md:text-2xl font-bold text-green-600 mb-3">
          Ops! Halaman Tidak Ditemukan
        </h1>

        {/* Deskripsi */}
        <p className="max-w-md text-sm text-gray-600 leading-relaxed text-center mx-auto">
          Kami mohon maaf, sepertinya Anda mencari sesuatu yang tidak ada.
          Halaman yang Anda minta mungkin telah dihapus atau URL salah.
        </p>

        <img
          src={goat.src}
          alt="Ilustrasi Kambing 404 - Tersesat"
          className="mx-auto object-contain max-h-52"
        />

        {/* Tombol Aksi */}

        {/* Menggunakan 'a' tag di dalam Link untuk aksesibilitas dan styling yang benar */}
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
        >
          <ChevronLeft className="w-5 h-5 mr-2" aria-hidden="true" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
