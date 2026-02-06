"use client";

import React, { useState } from "react";
// Dependensi Asli Anda
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

// Dependensi UI
// Mengganti LogIn dengan ikon yang lebih sesuai seperti 'KeyRound' atau 'RotateCcw'
import { KeyRound, Mail, Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset pesan dan error
    setError("");
    setMessage("");

    // Validasi form
    if (!email) {
      setError("Email tidak boleh kosong.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email tidak valid.");
      return;
    }

    setIsLoading(true);

    try {
      // Ganti logika ini dengan API untuk meminta reset password
      // Contoh: mengirim email ke server
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
        { email }
      );

      setIsLoading(false);
      setMessage(
        "Tautan reset password telah dikirim ke email Anda. Silakan periksa kotak masuk Anda."
      );
      toast.success("Email terkirim!");

      // Opsional: Langsung mengarahkan ke halaman login setelah sukses
      // setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setIsLoading(false);
      // Menangani error dari server
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
            "Gagal mengirim permintaan reset password."
        );
      } else {
        setError("Terjadi kesalahan! Coba beberapa saat lagi.");
      }
      toast.error("Gagal mengirim email reset.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-inter">
      {/* Container Utama - Menggunakan style yang sama persis */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-300">
        {/* Kolom Forgot Password (Kiri) - Menggunakan style yang sama persis */}
        <div className="w-full md:w-3/5 p-8 sm:p-12 order-2 md:order-1">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
              {/* Menggunakan ikon KeyRound untuk Reset Password */}
              <KeyRound className="w-8 h-8 mr-3 text-primary" /> Lupa Password
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Masukkan alamat email yang terdaftar di akun Anda. Kami akan
              mengirimkan tautan untuk mengatur ulang password Anda.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Tampilkan Error atau Pesan Sukses */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-5 transition duration-300 shadow-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-sm mb-5 transition duration-300 shadow-sm">
                  {message}
                </div>
              )}

              {/* Input Email */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@domain.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#23B97F] focus:border-[#23B97F] transition duration-150 shadow-sm"
                  disabled={isLoading || !!message}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold text-lg rounded-xl hover:bg-[#12714D] transition duration-300 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center"
                disabled={isLoading || !!message} // Menonaktifkan tombol setelah sukses atau saat loading
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                    Mengirim...
                  </>
                ) : (
                  "Kirim Tautan Reset"
                )}
              </button>
            </form>

            {/* Bagian Kembali ke Login */}
            <div className="relative flex items-center my-8">
              <div className="grow border-t border-gray-300"></div>
              <span className="shrink mx-4 text-gray-500 text-xs font-semibold uppercase">
                ATAU
              </span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <Link
              href="/login"
              className="w-full py-3 bg-white text-primary font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition duration-150 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md text-base"
            >
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </div>

        {/* Kolom Promosi (Kanan) - Menggunakan style yang sama persis */}
        <div className="w-full md:w-2/5 bg-primary text-white p-8 sm:p-12 flex flex-col justify-center items-center text-center order-1 md:order-2">
          <KeyRound className="w-12 h-12 mb-4" />{" "}
          {/* Menggunakan ikon KeyRound di kolom kanan */}
          <h3 className="text-3xl font-bold mb-3">Butuh Bantuan?</h3>
          <p className="text-sm font-light mb-8 opacity-90">
            Jika Anda mengalami masalah, silakan ikuti petunjuk atau kembali ke
            halaman masuk untuk mencoba lagi.
          </p>
          {/* Mengarahkan ke halaman daftar atau bantuan lain */}
          <Link
            href="/register"
            className="w-full py-3 px-6 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition duration-300 shadow-md hover:shadow-lg text-lg"
          >
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
