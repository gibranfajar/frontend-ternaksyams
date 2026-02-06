"use client";

import React, { useState } from "react";
// Dependensi Asli Anda
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Menggunakan useSearchParams untuk mengambil token
import { toast } from "react-toastify";
import axios from "axios";

// Dependensi UI
import { Key, Lock, Loader2, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook untuk mengambil parameter URL

  // Ambil token dari URL (Contoh: /reset-password?token=XYZ123)
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // 1. Validasi Token
    if (!token) {
      setError("Token reset password tidak ditemukan. Silakan coba lagi.");
      return;
    }

    // 2. Validasi Password
    if (!password || !confirmPassword) {
      setError("Semua kolom password harus diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      // Ganti logika ini dengan API untuk reset password
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
        // **DATA YANG SUDAH DISESUAIKAN UNTUK API**
        {
          token,
          password,
          password_confirmation: confirmPassword, // Tambahkan field konfirmasi
        }
      );

      setIsLoading(false);
      setMessage(
        "Password berhasil diubah! Anda akan dialihkan ke halaman Masuk."
      );
      toast.success("Password berhasil diatur ulang!");

      // Arahkan ke halaman login setelah 3 detik
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err) && err.response) {
        // Asumsi backend mengirim pesan error
        setError(
          err.response.data.message ||
            "Gagal mengatur ulang password. Token mungkin tidak valid atau kedaluwarsa."
        );
      } else {
        setError("Terjadi kesalahan jaringan. Coba beberapa saat lagi.");
      }
      toast.error("Gagal reset password!");
    }
  };

  // Jika token tidak ada saat dimuat pertama kali
  if (!token && !isLoading && !message) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-inter">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 text-center">
          <Lock className="w-10 h-10 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Akses Ditolak
          </h2>
          <p className="text-gray-600 mb-6">
            Tautan reset password tidak valid atau hilang. Silakan kembali ke
            halaman lupa password.
          </p>
          <Link href="/forgot-password">
            <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#12714D] transition duration-300 shadow-md">
              Lupa Password
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-inter">
      {/* Container Utama - Style yang sama */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-300">
        {/* Kolom Reset Password (Kiri) */}
        <div className="w-full md:w-3/5 p-8 sm:p-12 order-2 md:order-1">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
              {/* Ikon untuk Reset Password */}
              Atur Ulang Password
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Masukkan password baru Anda. Pastikan password Anda kuat dan unik.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Tampilkan Error atau Pesan Sukses */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-5 transition duration-300 shadow-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-sm mb-5 transition duration-300 shadow-sm flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" /> {message}
                </div>
              )}

              {/* Input Password Baru */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary" /> Password Baru
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password minimal 6 karakter"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#23B97F] focus:border-[#23B97F] transition duration-150 shadow-sm"
                  disabled={isLoading || !!message}
                />
              </div>

              {/* Input Konfirmasi Password */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary" /> Konfirmasi
                  Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password baru"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#23B97F] focus:border-[#23B97F] transition duration-150 shadow-sm"
                  disabled={isLoading || !!message}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold text-lg rounded-xl hover:bg-[#12714D] transition duration-300 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center"
                disabled={isLoading || !!message}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                    Mengubah...
                  </>
                ) : (
                  "Ubah Password"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Promosi (Kanan) - Style yang sama */}
        <div className="w-full md:w-2/5 bg-primary text-white p-8 sm:p-12 flex flex-col justify-center items-center text-center order-1 md:order-2">
          <Lock className="w-12 h-12 mb-4" />
          <h3 className="text-3xl font-bold mb-3">Keamanan Akun</h3>
          <p className="text-sm font-light mb-8 opacity-90">
            Jaga keamanan akun Anda dengan menggunakan password yang kuat,
            kombinasi huruf besar, kecil, angka, dan simbol.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
