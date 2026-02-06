"use client";

import React, { useState } from "react";
// Dependensi Asli Anda
import Link from "next/link";
import { useDispatch } from "react-redux";
import { login } from "@/redux/thunks/authThunk";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

// Dependensi UI (dipertahankan dari desain terbaru)
import { LogIn, UserPlus, Mail, Lock, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form (Logika Asli)
    if (!email || !password) {
      setError("Email dan Password tidak boleh kosong.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email tidak valid.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Logika dispatch Redux asli
      await dispatch(login({ email, password })).unwrap();
      setIsLoading(false);
      toast.success("Login berhasil!");
      router.push("/account");
    } catch (err) {
      setIsLoading(false);
      // Menangani error dengan tepat (Logika Asli)
      if (err instanceof Error) {
        setError(err.message);
        toast.error("Login gagal! Periksa kembali email atau password.");
      } else {
        setError("Login gagal! Periksa kembali email atau password.");
        toast.error("Login gagal! Periksa kembali email atau password.");
      }
    }
  };

  // Logika login by google mail (Logika Asli)
  const handleGoogleLogin = async () => {
    try {
      // get api
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
      );

      // redirect to url
      window.location.href = response.data.url;
    } catch (err) {
      // Menangani error dengan tepat
      if (err instanceof Error) {
        setError(err.message);
        toast.error("Gagal melakukan login dengan Google.");
      } else {
        setError("Gagal melakukan login dengan Google.");
        toast.error("Gagal melakukan login dengan Google.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-inter">
      {/* Container Utama */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-300">
        {/* Kolom Login (Kiri) */}
        <div className="w-full md:w-3/5 p-8 sm:p-12 order-2 md:order-1">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
              <LogIn className="w-8 h-8 mr-3 text-primary" /> Masuk Akun
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Selamat datang kembali! Silakan masukkan kredensial Anda untuk
              melanjutkan.
            </p>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-5 transition duration-300 shadow-sm">
                  {error}
                </div>
              )}

              {/* Input Email */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@domain.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#23B97F] focus:border-[#23B97F] transition duration-150 shadow-sm"
                  disabled={isLoading}
                />
              </div>

              {/* Input Password */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#23B97F] focus:border-[#23B97F] transition duration-150 shadow-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end items-center mb-6">
                {/* Menggunakan Link component sesuai struktur asli Anda */}
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-primary hover:text-[#12714D] transition duration-150"
                >
                  Lupa password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold text-lg rounded-xl hover:bg-[#12714D] transition duration-300 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <div className="relative flex items-center my-8">
              <div className="grow border-t border-gray-300"></div>
              <span className="shrink mx-4 text-gray-500 text-xs font-semibold uppercase">
                ATAU
              </span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            {/* Google Login Button */}
            <button
              className="w-full py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition duration-150 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md disabled:opacity-50"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg
                aria-label="Google logo"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              <span className="text-base">Masuk dengan Google</span>
            </button>
          </div>
        </div>

        {/* Kolom Pendaftaran/Promosi (Kanan) */}
        <div className="w-full md:w-2/5 bg-primary text-white p-8 sm:p-12 flex flex-col justify-center items-center text-center order-1 md:order-2">
          <UserPlus className="w-12 h-12 mb-4" />
          <h3 className="text-3xl font-bold mb-3">Bergabunglah dengan Kami</h3>
          <p className="text-sm font-light mb-8 opacity-90">
            Daftar sekarang untuk membuka fitur eksklusif, menyimpan progres
            Anda, dan menjadi bagian dari komunitas kami.
          </p>
          {/* Menggunakan Link component sesuai struktur asli Anda */}
          <Link
            href="/register"
            className="w-full py-3 px-6 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition duration-300 shadow-md hover:shadow-lg text-lg"
          >
            Daftar Akun
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
